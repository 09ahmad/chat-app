"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        try {
            //@ts-ignore
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === "join") {
                console.log(`User joined room: ${parsedMessage.payload.roomId}`);
                allSockets.push({
                    socket,
                    room: parsedMessage.payload.roomId,
                });
            }
            if (parsedMessage.type === "chat") {
                const currentUser = allSockets.find((user) => user.socket === socket);
                if (!currentUser)
                    return;
                allSockets
                    .filter((user) => user.room === currentUser.room)
                    .forEach((user) => user.socket.send(parsedMessage.payload.message));
            }
        }
        catch (error) {
            console.error("Invalid message format:", error);
        }
    });
    socket.on("close", () => {
        allSockets = allSockets.filter((user) => user.socket !== socket);
    });
});
