import amqp from "amqplib";
import util, { isNullOrUndefined } from "util";

/**
 * Exchange type 列挙型
 */
export enum ExchangeType {
  fanout = "fanout",
  direct = "direct",
  topic = "topic",
}

/**
 * AMQP接続設定型
 */
export interface AmqpConnectConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  vhost: string;
}

/**
 * AMQP送信メッセージ（文字列）型
 */
export interface AmqpSendMsg {
  msg: string;
  bindKey: string;
}

/**
 * AMQP送信メッセージ（バイナリ）型
 */
export interface AmqpSendData {
  data: Buffer;
  bindKey: string;
}

/**
 * AMQP Channelクラス
 * ----------------------------------------------------------------------------
 * @author LIS
 */
export class RmAmqpChanel {
  //amqplibのchannel
  ch: amqp.Channel;
  //Exchange名
  exName: string;
  //Exchangeタイプ
  exType: ExchangeType;

  /**
   * コンストラクタ
   * @param ch:ampq.Chanell チャネル
   * @param exName Exchange名
   * @param exType Exchangeタイプ
   */
  constructor(ch: amqp.Channel, exName: string, exType: ExchangeType) {
    this.ch = ch;
    this.exName = exName;
    this.exType = exType;
    if (ch != null) {
      ch.assertExchange(exName, exType.toString(), { durable: true });
    }
  }

  /**
   * AMQPメッセージ送信（文字列メッセージ）
   * @param msg 送信メッセージ
   * @param bindKey バインドキー
   */
  publishSimpleMessage(msg: string, bindKey: string): void {
    const datas: AmqpSendData[] = [];
    const data: AmqpSendData = {
      data: Buffer.from(msg),
      bindKey: bindKey,
    };
    datas.push(data);

    this.publishBinarys(datas);
  }

  /**
   * AMQPメッセージ送信（文字列メッセージ）
   * @param msg 送信メッセージ
   */
  publishMessage(msg: AmqpSendMsg): void {
    const datas: AmqpSendData[] = [];
    const data: AmqpSendData = {
      data: Buffer.from(msg.msg),
      bindKey: msg.bindKey,
    };
    datas.push(data);

    this.publishBinarys(datas);
  }

  /**
   * AMQP複数メッセージ送信（文字列メッセージ）
   * @param msgs 送信メッセージ配列
   */
  publishMessages(msgs: AmqpSendMsg[]): void {
    const datas: AmqpSendData[] = [];
    msgs.forEach((msg) => {
      const data: AmqpSendData = {
        data: Buffer.from(msg.msg),
        bindKey: msg.bindKey,
      };
      datas.push(data);
    });

    this.publishBinarys(datas);
  }

  /**
   * AMQPデータ送信（バイナリメッセージ）
   * @param data 送信データ
   */
  publishBinary(data: AmqpSendData): void {
    const datas: AmqpSendData[] = [];
    datas.push(data);

    this.publishBinarys(datas);
  }

  /**
   * AMQP複数データ送信（バイナリメッセージ）
   * @param datas 送信データ配列
   */
  publishBinarys(datas: AmqpSendData[]): void {
    //Exchangeにバインドキーを指定たメッセージを送信させる
    for (const data of datas) {
      this.ch.publish(this.exName, data.bindKey, data.data);
    }
  }
}

/**
 * AMQP 基底クラス
 * AMQPへ接続するクラスの基底クラス
 * ----------------------------------------------------------------------------
 * @author LIS
 */
export class RmAmqpBase {
  uri = "";
  connected = false;
  conn: amqp.Connection = null;

  /**
   * コンストラクタ
   * @param conf 接続設定
   */
  constructor(conf: AmqpConnectConfig) {
    this.uri = `amqp://${conf.user}:${conf.password}@${conf.host}:${conf.port}`;
  }

  /**
   * 接続処理
   */
  async connect(): Promise<amqp.Connection> {
    if (this.connected == false) {
      const open = amqp.connect(this.uri);
      await open
        .then((conn) => {
          this.conn = conn;
        })
        .catch((err) => {
          throw "接続エラーが発生しました。:\n" + util.inspect(err);
        });
      this.connected = true;
    }
    return Promise.resolve(this.conn);
  }

  /**
   * 切断処理
   * ５秒後に切断する
   */
  async close(): Promise<boolean> {
    if (!this.connected) return Promise.resolve(false);
    await new Promise((resolve) => {
      setTimeout(
        (conn) => {
          console.log("close connect");
          conn.close();
          this.connected = false;
          resolve();
        },
        500,
        this.conn
      );
    });
    return Promise.resolve(this.connected);
  }
}

/**
 * AMQP Producerクラス
 * AMQPのProduserを生成し、メッセージ送信を可能とする。
 * ----------------------------------------------------------------------------
 * @author LIS
 */
export class RmAmqpProducer extends RmAmqpBase {
  /**
   * コンストラクタ
   * @param conf 接続設定
   */
  constructor(conf: AmqpConnectConfig) {
    super(conf);
  }

  /**
   * チャネル作成
   */
  async createChannel(
    exName: string,
    exType: ExchangeType
  ): Promise<RmAmqpChanel> {
    if (this.connected == false) {
      throw "接続されていないので、チャネルは作成できません。";
    }
    let ch: RmAmqpChanel = new RmAmqpChanel(null, exName, exType);
    const chP = this.conn.createChannel();
    await chP
      .then((channel) => {
        ch = new RmAmqpChanel(channel, exName, exType);
      })
      .catch((err) => {
        throw "チャネル作成でエラーが発生しました。:\n" + util.inspect(err);
      });
    return Promise.resolve(ch);
  }
}

/**
 * AMQP Consumerクラス
 * AMQPのConsumerを生成し、メッセージ送信を可能とする。
 * ----------------------------------------------------------------------------
 * @author LIS
 */
export class RmAmqpConsumer extends RmAmqpBase {
  /**
   * コンストラクタ
   * @param conf 接続設定
   */
  constructor(conf: AmqpConnectConfig) {
    super(conf);
  }

  /**
   * チャネル作成
   */
  async createChannel(): Promise<amqp.Channel> {
    const ch = await this.conn.createChannel();
    return Promise.resolve(ch);
  }

  /**
   * コンシューマ実行
   * @param exName Exchange名
   * @param exType Exchengeタイプ
   * @param queueName キュー名
   * @param bindKeys Exchange and Queueバインドキー
   * @param func メッセージ受信処理
   */
  async consume(
    ch: amqp.Channel,
    exName: string,
    exType: ExchangeType,
    queueName: string,
    bindKeys: string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    consumeFunc: (msg: amqp.ConsumeMessage) => any
  ): Promise<amqp.Channel> {
    //Exchange作成
    ch.assertExchange(exName, exType.toString(), { durable: true });
    //受信Queue作成
    const q = await ch.assertQueue(queueName, { exclusive: true });
    //ExchangeとQueueの関係を設定
    bindKeys.forEach((key) => ch.bindQueue(q.queue, exName, key));
    //consumeオプション生成
    const conOption: amqp.Options.Consume = {
      noAck: false,
    };
    //受信処理登録
    ch.consume(q.queue, consumeFunc, conOption);
    return Promise.resolve(ch);
  }
}
