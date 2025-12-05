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
app.post('/groups', authenticateToken, (req, res) => {
    const { name } = req.body;
    db.run('INSERT INTO groups (name, admin_id) VALUES (?, ?)', [name, req.user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        // Add creator as member
        db.run('INSERT INTO group_members (group_id, user_id, status) VALUES (?, ?, ?)', [this.lastID, req.user.id, 'approved'], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, name, admin_id: req.user.id });
        });
    });
});

initSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
