import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useSocket } from '../SocketContext';
import ChatWindow from './ChatWindow';
import CreateGroupModal from './CreateGroupModal';

export default function Dashboard() {
    const { user, token, logout } = useAuth();
    const socket = useSocket();
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null); // { type: 'user' | 'group', id: ..., name: ... }
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('online_users', (users) => {
            setOnlineUsers(users); // List of userIds
        });

        return () => socket.off('online_users');
    }, [socket]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3000/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.filter(u => u.id !== user.id));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchGroups = async () => {
        try {
            const res = await axios.get('http://localhost:3000/groups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGroups(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const joinGroup = async (groupId) => {
        try {
            await axios.post(`http://localhost:3000/groups/${groupId}/join`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Join request sent');
        } catch (err) {
            alert('Failed to join');
        }
    };

    const handleBan = async (userId) => {
        if (!confirm('Are you sure you want to ban this user?')) return;
        try {
            await axios.post('http://localhost:3000/admin/ban', { userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('User banned');
            fetchUsers();
        } catch (err) {
            alert('Failed to ban user');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r flex flex-col">
                <div className="p-4 border-b bg-blue-600 text-white flex justify-between items-center">
                    <h1 className="font-bold text-xl">WhatsUT</h1>
                    <button onClick={logout} className="text-sm bg-blue-800 px-2 py-1 rounded">Logout</button>
                </div>

                <div className="p-4 overflow-y-auto flex-1">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-bold text-gray-700">Groups</h2>
                            <button onClick={() => setShowCreateGroup(true)} className="text-blue-600 text-sm">+ New</button>
                        </div>
                        <ul>
                            {groups.map(group => (
                                <li key={group.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                    onClick={() => {
                                        setSelectedChat({ type: 'group', id: group.id, name: group.name });
                                        socket.emit('join_group', { groupId: group.id, userId: user.id });
                                    }}>
                                    <span># {group.name}</span>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Leave group?')) {
                                            axios.post(`http://localhost:3000/groups/${group.id}/leave`, {}, { headers: { Authorization: `Bearer ${token}` } })
                                                .then(() => fetchGroups());
                                        }
                                    }} className="text-xs text-red-500 hover:underline ml-2">Leave</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold text-gray-700 mb-2">Users</h2>
                        <ul>
                            {users.map(u => (
                                <li key={u.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                    onClick={() => setSelectedChat({ type: 'user', id: u.id, name: u.username })}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${onlineUsers.includes(u.id) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <span>{u.username}</span>
                                    </div>
                                    {user.is_admin === 1 && (
                                        <button onClick={(e) => { e.stopPropagation(); handleBan(u.id); }} className="text-xs text-red-500 hover:underline">Ban</button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <ChatWindow chat={selectedChat} />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a chat to start messaging
                    </div>
                )}
            </div>

            {showCreateGroup && (
                <CreateGroupModal onClose={() => setShowCreateGroup(false)} onGroupCreated={fetchGroups} />
            )}
        </div>
    );
}
