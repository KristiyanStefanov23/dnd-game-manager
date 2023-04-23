import { Stage } from '@pixi/react';
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import Game from './game/game';

function Canvas() {
    const socket = useContext(SocketContext);
    const [update, setUpdate] = useState(false);
    if (!('prof' in localStorage)) return <Navigate to="/form" />;
    return (
        <main className="game">
            {/* <nav>
                <ul className="navigation">
                    <li>
                        <Link style={{ color: '#fff' }} to="/char">
                            Character
                        </Link>
                    </li>
                    <li
                        onClick={() => {
                            delete localStorage.prof;
                            setUpdate(!update);
                        }}
                    >
                        Log out
                    </li>
                </ul>
            </nav> */}
            <Stage
                width={955}
                height={550}
                options={{
                    backgroundColor: 0x2c2c2d,
                    autoDensity: true,
                }}
            >
                <Game socket={socket} />
            </Stage>
        </main>
    );
}

export default Canvas;
