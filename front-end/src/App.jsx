import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './canvas/canvas';
import Character from './character/character';

import { socket, SocketContext } from './context/socket';
import Form from './profile/form';

function App() {
    return (
        <SocketContext.Provider value={socket}>
            <Router>
                <Routes>
                    <Route exact path="/form" element={<Form />}></Route>
                    <Route exact path="/" element={<Game />}></Route>
                    <Route exact path="/char" element={<Character />}></Route>
                </Routes>
            </Router>
        </SocketContext.Provider>
    );
}

export default App;
