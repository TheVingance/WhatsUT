const http = require('http');

function post(path, data, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function run() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginData = JSON.stringify({ username: 'testuser2', password: 'password' });
        const loginRes = await post('/login', loginData);

        if (loginRes.status !== 200) {
            console.error('Login failed:', loginRes.body);
            return;
        }
        console.log('Login successful.');
        const token = loginRes.body.token;

        // 2. Create Group
        console.log('Creating group...');
        const groupData = JSON.stringify({ name: 'Test Group ' + Date.now() });
        const groupRes = await post('/groups', groupData, token);

        if (groupRes.status !== 201) {
            console.error('Group creation failed:', groupRes.body);
        } else {
            console.log('Group created successfully:', groupRes.body);
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

run();
