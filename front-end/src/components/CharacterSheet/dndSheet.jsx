import {
	DnDCharacterStatsSheet as charSheet,
	DnDCharacterProfileSheet as profSheet,
	DnDCharacterSpellSheet as spellSheet,
} from 'dnd-character-sheets';
import 'dnd-character-sheets/dist/index.css';

function Sheet({ char, onChange, type }) {
	const sheets = [charSheet, profSheet, spellSheet];
	if (type === -1)
		return (
			<>
				{sheets.map((Sheet) => (
					<Sheet character={char} onCharacterChanged={onChange} />
				))}
			</>
		);
	let Sheet = sheets[type];
	return <Sheet character={char} onCharacterChanged={onChange} />;
}

export default Sheet;
