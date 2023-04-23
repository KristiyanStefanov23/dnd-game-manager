import {
    DnDCharacterProfileSheet,
    DnDCharacterSpellSheet,
    DnDCharacterStatsSheet,
} from 'dnd-character-sheets';
import 'dnd-character-sheets/dist/index.css';
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
const $ = (e) => {
    const el = document.querySelectorAll(e);
    return el.length === 1 ? el[0] : [...el];
};
const backgroundValue = (mode) => (mode === 'dark' ? 90 : 0);
function Character() {
    const socket = useContext(SocketContext);
    const [mode, setMode] = useState('light');
    const [character, setCharacter] = useState({});
    const [saveStatus, setSaveStatus] = useState([
        "Don't forget to save!",
        '#0000ff',
    ]);
    useEffect(() => {
        socket.emit('character:req', JSON.parse(localStorage.prof));
        socket.on('saveStatus', setSaveStatus);
        socket.on('character:data', setCharacter);
        setMode(localStorage.darkmode);
        onbeforeunload = (e) => {
            socket.emit('test');
            e.preventDefault();
        };
        return () => {
            socket.emit('test');
            socket.off('saveStatus');
            socket.off('character:data');
            document.querySelector('html').style.filter = '';
        };
    }, []);
    useEffect(darkModePercent, [mode]);
    function handleChange(newChar) {
        $('.d-and-d-image').onclick = () => console.log('2x');
        setSaveStatus(["Don't forget to save!", '#0000ff']);
        setCharacter({ ...character, ...newChar });
    }
    function darkModePercent() {
        const value = backgroundValue(mode);
        $('html').style.filter = `invert(${value}%)`;
        $('.d-and-d-image').map(
            (x) => (x.style.filter = `invert(${value + 10}%)`)
        );
        localStorage.darkmode = mode;
    }
    function saveSheet() {
        const profile = JSON.parse(localStorage.prof).id;
        if (typeof profile !== 'number') return <Navigate to='/form' />;
        socket.emit('character:update', character, profile);
    }
    function exportSheet() {
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(character));
        const download = document.createElement('a');
        download.setAttribute('href', dataStr);
        download.setAttribute('download', character.name + '.json');
        document.body.appendChild(download); // required for firefox
        download.click();
        download.remove();
    }
    function importSheet(e) {
        const file = e.target;
        if (file.files.length === 0) return;
        if (file.files[0].type !== 'application/json')
            return alert('File needs to be .json');
        const reader = new FileReader();
        reader.onload = (file) => setCharacter(JSON.parse(file.target.result));
        reader.readAsText(file.files[0]);
    }
    if (!('prof' in localStorage)) return <Navigate to='/form' />;
    document.onkeydown = function (e) {
        if (e.ctrlKey) {
            if (e.key === 's') {
                saveSheet();
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };
    return (
        <main style={{ fontWeight: 'bold' }}>
            <div className='character-nav'>
                <Link style={{ color: '#000' }} to={'/'}>
                    Back to game
                </Link>
                <input
                    className='options-character'
                    type='button'
                    onClick={saveSheet}
                    value='Save to Cloud'
                />
                <input
                    className='options-character'
                    type='button'
                    onClick={exportSheet}
                    value='Export'
                />
                <label className='options-character' htmlFor='upload'>
                    Import
                </label>
                <input
                    className='options-character'
                    type='file'
                    onChange={importSheet}
                    id={'upload'}
                    hidden
                />
                <input
                    className='options-character'
                    type='button'
                    onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                    value='Toggle color mode'
                />
                <label
                    style={{
                        color: saveStatus[
                            localStorage.darkmode === 'light' ? 1 : 2
                        ],
                    }}
                >
                    {saveStatus[0]}
                </label>
            </div>
            <DnDCharacterStatsSheet
                character={character}
                onCharacterChanged={handleChange}
            />
            <DnDCharacterProfileSheet
                character={character}
                onCharacterChanged={handleChange}
            />
            <DnDCharacterSpellSheet
                character={character}
                onCharacterChanged={handleChange}
            />
        </main>
    );
}

export default Character;
