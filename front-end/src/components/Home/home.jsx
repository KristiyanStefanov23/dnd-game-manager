import { Link, useNavigate } from 'react-router-dom/dist';
import style from './home.module.css';
import { useEffect } from 'react';
import { ThumbsDown, ThumbsUp } from 'react-feather';

function Home({ isAuth, logout }) {
	const navigate = useNavigate();
	useEffect(() => {
		if (!isAuth) navigate('/auth');
	}, [isAuth, navigate]);
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
						<Link to='/character'>Character</Link>
					</li>
					<li className={style.navBtnSec}>
						<button onClick={logout}>Log Out</button>
					</li>
				</ul>
			</nav>
			<div className={style.content}>
				<div className={style.panel}>
					<h2 className='title'>Gaming session</h2>
					<div className={style.timeList}>
						<div className={style.timeItem}>
							<span>
								{'Name: '}
								{'07/23/2023 08:00 pm'}
							</span>
							<span className={style.timeActions}>
								<ThumbsDown />
							</span>
						</div>
					</div>
				</div>
				<div className={style.panel}>
					<h2 className='title'>Games</h2>
					<div className={style.gameList}>
						<p>
							Test <Link to={'test'}>Join</Link>
						</p>
						<p>
							Test <Link to={'test'}>Join</Link>
						</p>
						<p>
							Test <Link to={'test'}>Join</Link>
						</p>
						<p>
							Test <Link to={'test'}>Join</Link>
						</p>
						<p>
							Test <Link to={'test'}>Join</Link>
						</p>
						<p>
							Test <Link to={'test'}>Join</Link>
						</p>
						<p>
							Test <Link to={'test'}>Join</Link>
						</p>
						<p>
							Test <Link to={'test'}>Join</Link>
						</p>
						<p>
							Test <Link to={'test'}>Join</Link>
						</p>
					</div>
					<div className={style.gameBtns}>
						<button>Create</button>
						<button>Join</button>
					</div>
				</div>
			</div>
		</main>
	);
}

export default Home;
