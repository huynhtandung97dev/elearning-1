const socketio = require("socket.io");
const Group = require("../model/group");

let io;

function createSock(ws) {
    io = new socketio.Server(ws, {
        wsEngine: "ws",
        cors: {
            origin: ["https://elearning.gdvietnam.com", "http://localhost:3031"],
        },
    });

    // "https://e-learning-gd.netlify.app", "http://localhost:3031"

    io.on("connection", (socket) => {
        console.log("a socket connected", socket.id);

        socket.on("join-room", (roomId) => {
            console.log("Join room event: ", socket.id, roomId);
            socket.join(roomId);
        });

        socket.on("leave-room", (roomId) => {
            socket.leave(roomId);
        });

        socket.on("on-stream", async (roomId) => {
            try {
                const group = await Group.findByIdAndUpdate(
                    roomId,
                    {
                        $set: {
                            isStream: true,
                        },
                    },
                    {
                        new: true,
                    }
                );
                if (!group) {
                    socket.emit("error", "Nhóm không tồn tại");
                }

                if (group.isStream) {
                    io.to(group._id.toString()).emit("on-stream", group);
                }
            } catch (err) {
                console.log(err);
                socket.emit("error", "Có lỗi xảy ra");
            }
        });

        socket.on("off-stream", async (roomId) => {
            try {
                const group = await Group.findByIdAndUpdate(
                    roomId,
                    {
                        $set: {
                            isStream: false,
                        },
                    },
                    {
                        new: true,
                    }
                );
                if (!group) {
                    socket.emit("error", "Nhóm không tồn tại");
                }

                if (!group.isStream) {
                    io.to(group._id.toString()).emit("off-stream", group);
                }
            } catch (err) {
                console.log(err);
                socket.emit("error", "Có lỗi xảy ra");
            }
        });

        socket.on("disconnect", () => {
            console.log("a socket disconnected", socket.id);
        });
    });

    console.log("Socket is starting!!!");

    const course = io.of("/course");
    course.on("connection", (socket) => {
        console.log("con namespace /course", socket.id);

        socket.on("join", (id) => {
            console.log("join namespace /course", id);
            socket.join(id);
        });

        socket.on("disconnect", () => {
            console.log("dis namespace /course", socket.id);
        });
    });

    const stream = io.of("/stream");

    let members = []; // danh sách members trong room

    stream.on("connection", (socket) => {
        console.log("namespace /stream", socket.id);

        socket.on("join room", async (roomID, name) => {
            console.log("Fix bug cua khua Luan");
            //  Lấy roomID và username
            socket.data.username = name;

            // tạo peers với socket trong room
            const peers = await stream.in(roomID).fetchSockets();
            if (peers.length === 41) {
                socket.emit("room full");
                return;
            } // đặt giới hạn room

            members = peers.map((p) => [p.id, p.data.username]);
            console.log("log::: ", members);

            // await peers.forEach((peer) => {
            //   members.push([peer.id, peer.data.username]);
            // });

            socket.join(roomID);

            socket.emit("getMembers", members);

            socket.on("offer", (data) => {
                socket.to(data.receiver).emit("user-joined", {
                    signal: data.signal,
                    sender: data.sender,
                    senderName: data.senderName,
                });
            });

            socket.on("answer", (data) => {
                socket.to(data.sender).emit("reconnect", {
                    signal: data.signal,
                    receiver: socket.id,
                });
            });

            socket.on("leave room", async () => {
                const room = socket.rooms;
                const roomID = [...room.keys()];

                if (roomID.length === 1) {
                    return;
                }
                socket.to(roomID[1]).emit("user-left", socket.id);
            });
        });

        socket.on("disconnect", () => {
            console.log("/stream socket disconnected", socket.id);
            members = members.filter((m) => m[0] !== socket.id);
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
}

module.exports = {
    getIO,
    createSock,
};
