import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../utils/api';
import FormInput from '../../components/Authentication/input/input';
import { AlertCircle } from 'react-feather';

function LoginForm({ setAuth, isAuth }) {
	//useAuth
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});
	useEffect(() => {
		if (isAuth) {
			navigate('/');
		}
	}, [isAuth, navigate]);

	const handleOnChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
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
				onChange={handleOnChange}
				placeholder={'Username'}
				name={'username'}
				required
				type={'text'}
				value={formData.username}
			/>
			<FormInput
				onChange={handleOnChange}
				placeholder={'Password'}
				name={'password'}
				required
				type={'password'}
				value={formData.password}
			/>
			{error && (
				<p>
					<AlertCircle strokeWidth={3} /> {error}
				</p>
			)}
			<button type='submit'>Log in</button>
			<Link to={'/forgotPassword'}>Forgot Password ?</Link>
		</form>
	);
}

export default LoginForm;
