import * as AMQP from "./rm-amqp";

async function main(): Promise<void> {
  const consumer = new AMQP.RmAmqpConsumer({
    host: "192.168.56.108",
    port: 5672,
    user: "lis",
    password: "lis0101",
    vhost: "/",
  });
  try {
    await consumer.connect();
    const ch = await consumer.createChannel();

    await consumer.consume(
      ch,
      "exName_hoge",
      AMQP.ExchangeType.direct,
      "amqpTestQueue",
      ["v1"],
      (msg) => {
        console.log("Get AMQP Message:", msg.content.toString());
        ch.ack(msg, msg);
      }
    );
  } catch (err) {
    console.log(err);
  }
}

main();
