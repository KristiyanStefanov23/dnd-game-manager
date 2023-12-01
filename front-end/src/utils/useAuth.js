import { useEffect, useState } from 'react';
import { verifyToken } from './api';

function useAuth() {
	const [isAuthenticated, setAuthenticated] = useState(false);
	useEffect(() => {
		if (!document.cookie) return console.log('No token');
		const resp = verifyToken(document.cookie);
	}, []);
	return {};
}

export default useAuth;
