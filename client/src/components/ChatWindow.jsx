import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { useSocket } from '../SocketContext';
import axios from 'axios';

export default function ChatWindow({ chat }) {
    const { user, token } = useAuth();
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages([]); // Clear on chat switch
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/messages`, {
                    params: { type: chat.type, id: chat.id },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to load messages", err);
            }
        };
        fetchMessages();
    }, [chat, token]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg) => {
            // Filter messages for current chat
            if (chat.type === 'group' && msg.groupId === chat.id) {
                setMessages(prev => [...prev, msg]);
            } else if (chat.type === 'user' && (msg.senderId === chat.id || (msg.senderId === user.id && msg.receiverId === chat.id))) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socket.on('receive_message', handleMessage);

        return () => socket.off('receive_message', handleMessage);
    }, [socket, chat, user.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const messageData = {
            senderId: user.id,
            content: input,
            timestamp: new Date(),
            senderName: user.username
        };

        if (chat.type === 'group') {
            messageData.groupId = chat.id;
        } else {
            messageData.receiverId = chat.id;
        }

        socket.emit('send_message', messageData);
        setInput('');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            const messageData = {
                senderId: user.id,
                content: `Sent a file: ${res.data.fileName}`,
                filePath: res.data.filePath,
                timestamp: new Date(),
                senderName: user.username
            };

            if (chat.type === 'group') {
                messageData.groupId = chat.id;
            } else {
                messageData.receiverId = chat.id;
            }

            socket.emit('send_message', messageData);

        } catch (err) {
            alert('File upload failed');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-white shadow-sm flex justify-between items-center">
                <h2 className="font-bold text-lg">{chat.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === user.id;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${isMe ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
                                {!isMe && chat.type === 'group' && <p className="text-xs font-bold mb-1">{msg.senderName || 'User ' + msg.senderId}</p>}
                                <p>{msg.content}</p>
                                {msg.filePath && (
                                    <a href={`http://localhost:3000${msg.filePath}`} target="_blank" rel="noopener noreferrer" className="text-xs underline mt-1 block text-blue-200">
                                        Download File
                                    </a>
                                )}
                                <span className="text-xs opacity-75 block text-right mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t flex gap-2 items-center">
                <label className="cursor-pointer text-gray-500 hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                    </svg>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
                <input
                    type="text"
                    className="flex-1 border p-2 rounded-full focus:outline-none focus:border-blue-500"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
