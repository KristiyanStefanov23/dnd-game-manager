import { useEffect, useState } from 'react';
import { createSheet, getSheets } from '../../utils/api';
import { Link } from 'react-router-dom';

function Sheets() {
    const [sheets, setSheets] = useState([]);
    async function getCharacters() {
        const data = await getSheets();
        console.log(data);
        setSheets(data);
    }
    useEffect(() => {
        getCharacters();
    }, []);
    return (
        <main>
            <ul>
                <li
                    onClick={() => {
                        createSheet();
                        getCharacters();
                    }}
                >
                    Create Character
                </li>
                {Object.keys(sheets).map((id) => (
                    <li key={id}>
                        <Link to={id}>{sheets[id]}</Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default Sheets;
