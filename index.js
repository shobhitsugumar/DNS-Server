const dgram = require("node:dgram");
const dsnPacket = require("dns-packet");

const server = dgram.createSocket("udp4");

//consider this as a db
const db = {
  "piyushgarg.dev": "1.2.3.4",
  "blog.piyushgarg.dev": "4.5.6.7",
};

server.on("message", (msg, rinfo) => {
  const incomingReq = dsnPacket.decode(msg);

  const ipFromDb = db[incomingReq.questions[0].name];

  //creating a answer
  const answer = dsnPacket.encode({
    type: "response",
    id: incomingReq.id,
    flags: dsnPacket.AUTHORITATIVE_ANSWER,
    questions: incomingReq.questions,
    answers: [
      {
        type: "A",
        class: "IN",
        name: incomingReq.questions[0].name,
        data: ipFromDb,
      },
    ],
  });
  server.send(answer, rinfo.port, rinfo.address);
  console.log({
    msg: incomingReq.questions,
    rinfo,
  });
});
server.bind(53, () => console.log("my dns server is running on port 53"));
