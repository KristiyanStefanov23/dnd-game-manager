import { Link, useNavigate } from 'react-router-dom/dist';
import style from './home.module.css';
import { useEffect, useState } from 'react';
import PlannerPanel from './panel/plannerPannel';
import GamePanel from './panel/gamePanel';
import { LogOut, Settings, User } from 'react-feather';

function Home({ isAuth, logout }) {
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    useEffect(() => {
        if (!isAuth) navigate('/auth');
    }, [isAuth, navigate]);
    if (!isAuth) return;
    return (
        <main
            className={style.main}
            style={{
                backgroundImage: 'url("/media/home.jpg")',
            }}
        >
            <nav className={style.navBackground}>
                <ul className={style.navBar}>
                    <li className={style.navBtnPrim}>
                        <Link to="/sheets">Characters</Link>
                    </li>
                    <li
                        className={style.navBtnSec}
                        onClick={() => setShowProfile(!showProfile)}
                    >
                        <User strokeWidth={1.5} size={30} />
                    </li>
                </ul>
                <div className={style.profileOpt} hidden={!showProfile}>
                    <ul>
                        <li>
                            <User strokeWidth={1.5} size={30} />
                            Profile
                        </li>
                        <li>
                            <Settings />
                            Settings
                        </li>
                        <li onClick={logout}>
                            <LogOut />
                            Log out
                        </li>
                    </ul>
                </div>
            </nav>
            <div className={style.content}>
                <PlannerPanel />
                <GamePanel />
            </div>
        </main>
    );
}

export default Home;
