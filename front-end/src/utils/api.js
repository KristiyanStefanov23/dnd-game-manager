import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const login = async (data) => {
	try {
		const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const register = async (data) => {
	try {
		await axios.post(`${API_BASE_URL}/auth/register`, data);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const getCharacterSheet = async (userId) => {
	try {
		const response = await axios.get(
			`${API_BASE_URL}/characters/${userId}`
		);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
