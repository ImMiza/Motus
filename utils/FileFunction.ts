import { close, openSync, readFileSync, unlink, unlinkSync, writeFileSync } from "fs";
import { Game } from "../Model/Game";

const FILE_GAME_PATH = 'data/Game.json';
const FILE_TXT_PATH = 'data/list_francais.txt';

function loadGame(): Game|null {
    try {
        const fileDescriptor = openSync(FILE_GAME_PATH, 'r');
        const content = readFileSync(fileDescriptor, { encoding: 'utf8' });
        close(fileDescriptor);
        return JSON.parse(content);
    } catch (error) {
        return null;
    }
}

function saveGame(game: Game): boolean {
    try {
        writeFileSync(FILE_GAME_PATH, JSON.stringify(game), { encoding: 'utf8' });
        return true;
    } catch (error) {
        return false;
    }
}

function deleteGame(): boolean {
    try {
        unlinkSync(FILE_GAME_PATH);
        return true;
    } catch (error) {
        return false;
    }
}

function loadWords(): string[] {
    try {
        return readFileSync(FILE_TXT_PATH, { encoding: 'utf8' }).split('\n');
    } catch (error) {
        return [];
    }
}

export {
    loadGame,
    saveGame,
    loadWords,
    deleteGame
};
