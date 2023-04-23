const { readFileSync, writeFileSync } = require('fs');

function mapSocket(io) {
    const sockets = {};
    const gameData = {};
    const mapSocket = (f) => Object.keys(sockets).map(f);
    io.on('connect', (socket) => {
        socket.on('login', (user, pass) => {
            user = user.toLowerCase();
            const auth = JSON.parse(
                readFileSync(__dirname + '\\..\\..\\data\\auth.json')
            );
            if (!(user in auth))
                return socket.emit('login:error', 'Username not found');
            if (auth[user].pass !== pass)
                return socket.emit('login:error', 'Wrong password');
            socket.emit('login:success', user, auth[user].id);
        });
        socket.on('character:req', (data) => {
            const profile = JSON.parse(
                readFileSync(
                    __dirname + `\\..\\..\\data\\profiles\\${data.id}.json`
                )
            );
            socket.emit('character:data', profile);
        });
        socket.on('character:update', (data, profile) => {
            if (profile === null || profile === undefined)
                return socket.emit('saveStatus', [
                    'Save Error!',
                    'red',
                    'cyan',
                ]);
            writeFileSync(
                __dirname + `\\..\\..\\data\\profiles\\${profile}.json`,
                JSON.stringify(data)
            );
            socket.emit('saveStatus', [
                'Saved successfully!',
                'green',
                'magenta',
            ]);
        });
        //---------------------------- Game ----------------------------\\
        socket.on('game:join', (id) => {
            socket.id = id;
            sockets[id] = socket;
            console.log(socket.id);
            console.log(Object.keys(sockets));
            socket.on('position', (newPos) => {
                sockets[socket.id].position = newPos;
            });
        });
        setInterval(() => {
            if (Object.keys(sockets).length <= 0) return;
            const positions = {};
            mapSocket((id) => (positions[id] = sockets[id].position));
            mapSocket((id) => sockets[id].emit('newPositions', positions));
        }, 500);
        socket.on('disconnect', () => {
            delete sockets[socket.id];
            console.log(
                socket.id + ' has disconnected \n',
                Object.keys(sockets)
            );
            mapSocket((id) => sockets[id].emit('game:disconnect', socket.name));
        });
    });
}

module.exports = mapSocket;
