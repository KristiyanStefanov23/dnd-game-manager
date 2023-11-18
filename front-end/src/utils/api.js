import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const cookies = () =>
    Object.fromEntries(
        document.cookie.split('; ').map((c) => {
            const [key, value] = c.split('=');
            return [key, decodeURIComponent(value)];
        })
    );

export const verifyToken = async () => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/ping`,
            {},
            {
                headers: { 'X-DnD-SessionId': cookies().token },
            }
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

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
        const response = await axios.post(
            `${API_BASE_URL}/auth/register`,
            data
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await axios
            .post(
                `${API_BASE_URL}/auth/logout`,
                {},
                {
                    headers: { 'X-DnD-SessionId': cookies().token },
                }
            )
            .finally(
                () =>
                    (document.cookie =
                        'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;')
            );
    } catch (error) {}
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

export const createGame = async () => {
    try {
        await axios.post(`${API_BASE_URL}/`);
    } catch (error) {}
};

export const createSheet = async () => {
    try {
        await axios.post(
            `${API_BASE_URL}/character`,
            {},
            {
                headers: { 'X-DnD-SessionId': cookies().token },
            }
        );
    } catch (error) {}
};

export const getSheets = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/character`, {
            headers: { 'X-DnD-SessionId': cookies().token },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getSheet = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/character/${id}`, {
            headers: { 'X-DnD-SessionId': cookies().token },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const uploadSheet = async (id, data) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/character/${id}`,
            { data: data },
            {
                headers: { 'X-DnD-SessionId': cookies().token },
            }
        );
        return response.status;
    } catch (error) {
        console.log(error);
    }
};
