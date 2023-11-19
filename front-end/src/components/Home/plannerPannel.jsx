import style from './panel.module.css';

function PlannerPanel() {
	return (
		<div className={style.panel}>
			<h2 className='title'>Gaming session</h2>
			<div className={style.timeList}>
				<div className={style.timeItem}>
					<span>
						Name: {'Game Name'}
						{'07/23/2023 08:00 pm'}
					</span>
					<span className={style.timeActions}></span>
				</div>
			</div>
		</div>
	);
}

export default PlannerPanel;
