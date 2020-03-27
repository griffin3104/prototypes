import * as AMQP from "./rm-amqp";

async function main(): Promise<void> {
  const producer = new AMQP.RmAmqpProducer({
    host: "192.168.56.108",
    port: 5672,
    user: "lis",
    password: "lis0101",
    vhost: "/",
  });

  try {
    await producer.connect();
    const ch = await producer.createChannel(
      "exName_hoge",
      AMQP.ExchangeType.direct
    );
    const msg = JSON.stringify({ hoge: "hogehoge" });
    ch.publishSimpleMessage(msg, "v1");
  } catch (err) {
    console.log(err);
  }

  const ret = await producer.close();
  console.log("process end.", producer.connected, ret);
  process.exit(0);

  return;
}

main();
console.log("main end.");
