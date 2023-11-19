import { useEffect, useState } from 'react';
import { verifyToken } from './api';

function useAuth(requireAuth = true) {
	const [isAuthenticated, setAuthenticated] = useState(false);

	return {};
}

export default useAuth;
