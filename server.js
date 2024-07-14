import { instrument } from "@socket.io/admin-ui";

const io = require("socket.io")(5000, {
  cors: {
    // origin: ["https://legion-code.vercel.app"],
    origin: "*",
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id; //coming from client
  socket.join(id);

  socket.on("send-message", ({ receipients, text }) => {
    receipients.forEach((receipient) => {
      const newReceipients = receipients.filter((r) => r !== receipient); //removing current receipient from receipient's list of receipients
      newReceipients.push(id); //it is the id of sending the message
      socket.broadcast.to(receipient).emit("receive-message", {
        receipients: newReceipients,
        sender: id,
        text,
      });
    });
  });
});
instrument(io, { auth: false });
