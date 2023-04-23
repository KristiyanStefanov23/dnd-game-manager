import { useEffect } from 'react';
import Character from './assets/character';

function Game({ socket }) {
    let players = [];
    let character;

    useEffect(() => {
        players = [];
        character = JSON.parse(localStorage.prof).id;
        socket.emit('game:join', character);
        socket.on('game:connect', (playersData) => {
            Object.keys(playersData).map((id) => {
                if (id === character) return 1;
                console.log('player', players[playersData[id]]);
                return 1;
            });
        });
        socket.on('game:positions', (positions) => {
            Object.keys(positions)
                .filter((n) => n !== character)
                .map((id) => {
                    const [x, y] = positions[id];
                    if (id in players) {
                        players[id].position.x = x;
                        players[id].position.y = y;
                    }
                });
        });
        socket.on('game:disconnect', (id) => {
            const player = players[id];
            console.log(player);
        });
        oncontextmenu = (e) => e.preventDefault(); //prevent right-clicking
    }, []);
    return Object.keys(players).map((player) => (
        <Character
            name={players[player].name}
            position={players[player].position}
        />
    ));
}

export default Game;
