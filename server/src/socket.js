const socketIo = require('socket.io');
const db = require('./database');
const fs = require('fs');
const path = require('path');

let io;
const onlineUsers = new Map(); // userId -> socketId

const initSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*", // Allow all for dev
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        socket.on('login', (userId) => {
            onlineUsers.set(userId, socket.id);
            io.emit('online_users', Array.from(onlineUsers.keys()));
        });

        socket.on('disconnect', () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit('online_users', Array.from(onlineUsers.keys()));
                    break;
                }
            }
        });

        socket.on('join_group', ({ groupId, userId }) => {
            socket.join(`group_${groupId}`);
        });

        socket.on('send_message', (data) => {
            // data: { senderId, receiverId, groupId, content, filePath }
            const { senderId, receiverId, groupId, content, filePath } = data;

            db.run(`INSERT INTO messages (sender_id, receiver_id, group_id, content, file_path) VALUES (?, ?, ?, ?, ?)`,
                [senderId, receiverId, groupId, content, filePath],
                function (err) {
                    if (err) return console.error(err);
                    const message = { id: this.lastID, ...data, timestamp: new Date() };

                    if (groupId) {
                        io.to(`group_${groupId}`).emit('receive_message', message);
                    } else if (receiverId) {
                        const receiverSocket = onlineUsers.get(receiverId);
                        if (receiverSocket) {
                            io.to(receiverSocket).emit('receive_message', message);
                        }
                        socket.emit('receive_message', message); // Send back to sender
                    }
                }
            );
        });

        // File upload notification (actual upload via REST API)
        socket.on('file_uploaded', (data) => {
            // Similar to send_message but content is file info
            // This can be handled within send_message logic if content is the filename
        });
    });
};

module.exports = { initSocket, getIo: () => io };
