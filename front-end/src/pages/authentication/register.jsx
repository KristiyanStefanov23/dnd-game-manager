import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../utils/api';
import FormInput from '../../components/Authentication/input/input';
import FormMessage from '../../components/Authentication/message';

function RegisterForm({ setAuth, isAuth }) {
	const navigate = useNavigate();
	const [message, setMessage] = useState('');
	const [error, setError] = useState(false);
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
			setError(false);
			const res = await register(formData);
			setMessage(res.data.message);
		} catch ({ response }) {
			setError(true);
			setMessage(response.data.message);
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
			{message && <FormMessage text={message} isError={error} />}
			<button type='submit'>Register</button>
		</form>
	);
}

export default RegisterForm;
