const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');

const SECRET_KEY = 'supersecretkey'; // In production, use env var

const register = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Encryption error' });

        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Username taken' });
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ id: this.lastID, username });
        });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        if (user.is_banned) return res.status(403).json({ error: 'User is banned' });

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
                res.json({ token, user: { id: user.id, username: user.username, is_admin: user.is_admin } });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            console.log('Received token:', token);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

module.exports = { register, login, authenticateToken, SECRET_KEY };
