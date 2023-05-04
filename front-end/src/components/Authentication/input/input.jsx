import style from './input.module.css';

function FormInput(props) {
	return <input className={style.inp} {...props} />;
}

export default FormInput;
