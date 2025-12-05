import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export default function CreateGroupModal({ onClose, onGroupCreated }) {
    const [name, setName] = useState('');
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/groups', { name }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onGroupCreated();
            onClose();
        } catch (err) {
            alert('Failed to create group');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">Create New Group</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="w-full border p-2 rounded mb-4"
                        placeholder="Group Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
