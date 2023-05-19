import { AlertCircle, CheckCircle } from 'react-feather';
import style from './message.module.css';

function FormMessage({ text, isError }) {
	const Icon = isError ? AlertCircle : CheckCircle;
	return (
		<p className={isError ? style.err : style.succ}>
			<Icon strokeWidth={3} /> {text}
		</p>
	);
}

export default FormMessage;
