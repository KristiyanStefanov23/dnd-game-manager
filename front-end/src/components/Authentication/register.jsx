import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../utils/api';
import FormInput from './input/input';
import { AlertCircle } from 'react-feather';

function RegisterForm({ setAuth, isAuth }) {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		email: '',
	});
	useEffect(() => {
		if (isAuth) navigate('/');
	}, [isAuth, navigate]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await register(formData);
			const res = await login(formData);
			const expirationDate = new Date();
			expirationDate.setDate(expirationDate.getDate() + 1); // set the expiration date to tomorrow

			document.cookie = `token=${
				res.token
			}; expires=${expirationDate.toUTCString()}; path=/`;

			setAuth(true);
			navigate('/');
		} catch ({ response }) {
			setError(response.data.message);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<FormInput
				onChange={handleChange}
				placeholder={'Username'}
				name={'username'}
				required
				value={formData.username}
				type={'text'}
			/>
			<FormInput
				onChange={handleChange}
				name={'email'}
				placeholder={'Email'}
				required
				value={formData.email}
				type={'email'}
			/>
			<FormInput
				onChange={handleChange}
				placeholder={'Password'}
				name={'password'}
				required
				value={formData.password}
				type={'password'}
			/>
			{error && (
				<p>
					<AlertCircle strokeWidth={3} /> {error}
				</p>
			)}
			<button type='submit'>Register</button>
		</form>
	);
}

export default RegisterForm;
