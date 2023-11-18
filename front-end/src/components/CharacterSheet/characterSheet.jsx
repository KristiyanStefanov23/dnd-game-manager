import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import style from './characterSheet.module.css';
import Sheet from './dndSheet';
import { getSheet, uploadSheet } from '../../utils/api';

function CharacterSheet() {
    const { id } = useParams();
    const [character, setCharacter] = useState({});
    const [page, setPage] = useState(0);
    async function getSheetData() {
        const data = await getSheet(id);
        setCharacter(data);
    }
    useEffect(() => {
        getSheetData();
    }, []);
    function handleChange(newChar) {
        setCharacter({ ...character, ...newChar });
    }
    async function saveSheet() {
        const resp = await uploadSheet(id, character);
        console.log(resp);
    }
    function exportSheet() {
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(character));
        const download = document.createElement('a');
        download.setAttribute('href', dataStr);
        download.setAttribute('download', character.name + '.json');
        document.body.appendChild(download);
        download.click();
        download.remove();
    }
    function importSheet() {
        const fileInp = document.createElement('input');
        fileInp.type = 'file';
        fileInp.onchange = (e) => {
            const file = e.target;
            if (file.files.length === 0) return;
            if (file.files[0].type !== 'application/json')
                return alert('File needs to be .json');
            const reader = new FileReader();
            reader.onload = (file) =>
                setCharacter(JSON.parse(file.target.result));
            reader.readAsText(file.files[0]);
        };
        fileInp.click();
    }
    return (
        <main className={style.main}>
            <nav>
                <ul className={style.navigation}>
                    <li className={style.pushRight}>
                        <Link to={'/sheets'}>Back</Link>
                    </li>
                    <li onClick={() => setPage(0)}>Character</li>
                    <li onClick={() => setPage(1)}>Profile</li>
                    <li onClick={() => setPage(2)}>Spell</li>
                    <li onClick={() => setPage(-1)}>All</li>
                    <li className={style.pushLeft}>
                        <input type="radio" name="" id="" />
                    </li>
                    <li>More</li>
                    <div className={style.optPanel}>
                        <ul>
                            <li onClick={saveSheet}>Save</li>
                            <li onClick={importSheet}>Import</li>
                            <li onClick={exportSheet}>Export</li>
                        </ul>
                    </div>
                </ul>
            </nav>
            <Sheet char={character} onChange={handleChange} type={page} />
        </main>
    );
}

export default CharacterSheet;
