import React, { useState } from 'react';
import style from './form.module.css';
import Login from '../../components/Authentication/login';
import Register from '../../components/Authentication/register';

function AuthPage({ setAuth, isAuth }) {
	const windows = [Login, Register];
	const [curr, setCurr] = useState(0);
	const Window = windows[curr];
	return (
		<main
			className={style.main}
			style={{
				backgroundImage: 'url("/media/sign.png")',
			}}
		>
			<div className={style.holder}>
				<div className={style.panel}>
					<h1 className={style.header}>
						<span
							onClick={() => setCurr(0)}
							className={curr === 0 ? style.selected : ''}
						>
							Log in
						</span>
						<span
							onClick={() => setCurr(1)}
							className={curr === 1 ? style.selected : ''}
						>
							Register
						</span>
					</h1>
					<Window isAuth={isAuth} setAuth={setAuth} />
				</div>
			</div>
		</main>
	);
}

export default AuthPage;
