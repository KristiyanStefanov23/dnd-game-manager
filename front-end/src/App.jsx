import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CharacterSheet } from './components/CharacterSheet';
import { Home } from './components/Home';
import { Game } from './components/Game';
import { Authenticate } from './components/Authentication';

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		console.log();
		if (document.cookie) setIsAuthenticated(true);
		else setIsAuthenticated(false);
	}, []);

	const setAuth = (token) => setIsAuthenticated(token);

	const logout = () => {
		document.cookie =
			'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		setIsAuthenticated(false);
	};
	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={<Home isAuth={isAuthenticated} logout={logout} />}
				/>
				<Route
					path='/auth'
					element={
						<Authenticate
							setAuth={setAuth}
							isAuth={isAuthenticated}
						/>
					}
				/>
				<Route
					path='/game'
					element={<Game isAuthenticated={isAuthenticated} />}
				/>
				<Route
					path='/character'
					element={
						<CharacterSheet isAuthenticated={isAuthenticated} />
					}
				/>
				<Route path='*' element={<h1>404 Not Found</h1>} />
			</Routes>
		</Router>
	);
}

export default App;
// function PwaBanner() {
// 	const [isVisible, setIsVisible] = useState(false);

// 	useEffect(() => {
// 		// Check if the app is installed
// 		const isInstalled =
// 			window.matchMedia('(display-mode: standalone)').matches ||
// 			window.navigator.standalone;

// 		// Check if the browser supports the BeforeInstallPrompt event
// 		const canPrompt =
// 			!!window.addEventListener &&
// 			!!window.navigator &&
// 			!!window.navigator['serviceWorker'] &&
// 			!!window.navigator['serviceWorker'].register;

// 		if (!isInstalled && canPrompt) {
// 			const handleBeforeInstallPrompt = (e) => {
// 				// Show the banner when the event is triggered
// 				e.preventDefault();
// 				setIsVisible(true);
// 			};

// 			window.addEventListener(
// 				'beforeinstallprompt',
// 				handleBeforeInstallPrompt
// 			);

// 			return () => {
// 				window.removeEventListener(
// 					'beforeinstallprompt',
// 					handleBeforeInstallPrompt
// 				);
// 			};
// 		}
// 	}, []);

// 	const handleInstall = async () => {
// 		// Get the deferred prompt object
// 		const deferredPrompt = await window.navigator[
// 			'getInstalledRelatedApps'
// 		]();

// 		// Show the prompt
// 		deferredPrompt.prompt();

// 		// Wait for the user to respond
// 		const { outcome } = await deferredPrompt.userChoice;

// 		// Log the outcome
// 		console.log(outcome);

// 		// Hide the banner
// 		setIsVisible(false);
// 	};

// 	return (
// 		isVisible && (
// 			<div className='pwa-banner'>
// 				<p>Install this app on your device?</p>
// 				<button onClick={handleInstall}>Install</button>
// 				<button onClick={() => setIsVisible(false)}>Dismiss</button>
// 			</div>
// 		)
// 	);
// }
