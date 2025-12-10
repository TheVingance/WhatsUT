const express = require('express');
const http = require('http');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { register, login, authenticateToken } = require('./auth');
const { initSocket } = require('./socket');
const db = require('./database');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// File Upload Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!require('fs').existsSync(uploadDir)) {
            require('fs').mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Auth Routes
app.post('/register', register);
app.post('/login', login);

// User Routes
app.get('/users', authenticateToken, (req, res) => {
    db.all('SELECT id, username, is_admin FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Group Routes
app.get('/groups', authenticateToken, (req, res) => {
    db.all('SELECT id, name, admin_id FROM groups', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/groups', authenticateToken, (req, res) => {
    const { name } = req.body;
    db.run('INSERT INTO groups (name, admin_id) VALUES (?, ?)', [name, req.user.id], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Group name already taken' });
            return res.status(500).json({ error: err.message });
        }
        // Add creator as member
        db.run('INSERT INTO group_members (group_id, user_id, status) VALUES (?, ?, ?)', [this.lastID, req.user.id, 'approved'], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, name, admin_id: req.user.id });
        });
    });
});

// Message Routes
app.get('/messages', authenticateToken, (req, res) => {
    const { type, id } = req.query;
    if (!type || !id) return res.status(400).json({ error: 'Missing parameters' });

    let query = '';
    let params = [];

    if (type === 'group') {
        query = `SELECT m.*, u.username as senderName 
                 FROM messages m 
                 LEFT JOIN users u ON m.sender_id = u.id 
                 WHERE m.group_id = ? 
                 ORDER BY m.timestamp ASC`;
        params = [id];
    } else if (type === 'user') {
        const myId = req.user.id;
        const otherId = id;
        query = `SELECT * FROM messages 
                 WHERE (sender_id = ? AND receiver_id = ?) 
                    OR (sender_id = ? AND receiver_id = ?) 
                 ORDER BY timestamp ASC`;
        params = [myId, otherId, otherId, myId];
    } else {
        return res.status(400).json({ error: 'Invalid type' });
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

initSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
