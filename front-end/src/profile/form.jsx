import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';

function Form(props) {
    const socket = useContext(SocketContext);
    const [logged, setLogged] = useState(false);
    const [user, userChange] = useState('');
    const [pass, passChange] = useState('');
    const [msgBox, changeMsgBox] = useState('');
    useEffect(() => {
        socket.on('login:error', changeMsgBox);
        socket.on('login:success', (name, id) => {
            localStorage.prof = JSON.stringify({ name, id });
            setLogged(!logged);
            console.log('in');
        });
        return () => {
            socket.off('login:error');
            socket.off('login:success');
        };
    }, []);
    async function login(e) {
        e.preventDefault();
        socket.emit('login', user, pass);
    }
    if ('prof' in localStorage) return <Navigate to="/" />;
    return logged ? (
        <Navigate to="/" />
    ) : (
        <main className="login">
            <div className="glassmorphism-background">
                <div className="shape"></div>
                <div className="shape"></div>
            </div>
            <form className="glassmorphism" onSubmit={login}>
                <h3>Login to Access</h3>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    required
                    onChange={(e) => userChange(e.target.value)}
                    id="username"
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    required
                    onChange={(e) => passChange(e.target.value)}
                    id="password"
                />
                <button>Log In</button>
                <p>{msgBox}</p>
            </form>
        </main>
    );
}

export default Form;
