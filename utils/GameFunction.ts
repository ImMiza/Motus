import { Message } from "discord.js";
import { Game, Letter, Player, Word } from "../Model/Game";

enum COLOR_BLOCK {
    YELLOW = '🟡',
    BLUE = '🟦',
    RED = '🟥',
    BLACK = '⬛',
    GREEN = ':green_square:',
    WHITE = ':white_large_square:'
};

const ASCII_ALPHABET = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

function showLine(word: Word, color?: COLOR_BLOCK): string {
    let result = '';
    word.letters.forEach(() => result += `${color ? color.repeat(2) : COLOR_BLOCK.BLACK.repeat(2)}`);
    result += color ? color.repeat(3) : COLOR_BLOCK.BLACK.repeat(3);
    return result;
}

function showMidLine(word: Word, color?: COLOR_BLOCK): string {
    let result = '';
    word.letters.forEach((letter) => result += `${color ? color : COLOR_BLOCK.BLACK}  ${letter.found ? letter.letter.toUpperCase() : '    '}  ` );
    result += color ? color : COLOR_BLOCK.BLACK;
    return result;
}

function showWord(word: Word): string {
    let result = '';

    result += `${showLine(word)}\n`;
    result += `${showMidLine(word)}\n`;
    result += `${showLine(word)}\n`;

    return result;
}

function showResultWord(word: Word): string {
    let result = '';

    word.letters.forEach(letter => {
        if(letter.found) {
            result += `${COLOR_BLOCK.RED}${COLOR_BLOCK.RED}${COLOR_BLOCK.RED}`;
        }
        else if(letter.misplaced) {
            result += `${COLOR_BLOCK.YELLOW}${COLOR_BLOCK.YELLOW}${COLOR_BLOCK.YELLOW}`;
        }
        else {
            result += `${COLOR_BLOCK.BLUE}${COLOR_BLOCK.BLUE}${COLOR_BLOCK.BLUE}`;
        }
    });
    result += '\n';

    word.letters.forEach(letter => {
        if(letter.found) {
            result += `${COLOR_BLOCK.RED}  ${letter.letter.toUpperCase()}  ${COLOR_BLOCK.RED}`;
        }
        else if(letter.misplaced) {
            result += `${COLOR_BLOCK.YELLOW}  ${letter.letter.toUpperCase()}  ${COLOR_BLOCK.YELLOW}`;
        }
        else {
            result += `${COLOR_BLOCK.BLUE}  ${letter.letter.toUpperCase()}  ${COLOR_BLOCK.BLUE}`;
        }
    });
    result += '\n';

    word.letters.forEach(letter => {
        if(letter.found) {
            result += `${COLOR_BLOCK.RED}${COLOR_BLOCK.RED}${COLOR_BLOCK.RED}`;
        }
        else if(letter.misplaced) {
            result += `${COLOR_BLOCK.YELLOW}${COLOR_BLOCK.YELLOW}${COLOR_BLOCK.YELLOW}`;
        }
        else {
            result += `${COLOR_BLOCK.BLUE}${COLOR_BLOCK.BLUE}${COLOR_BLOCK.BLUE}`;
        }
    });

    return result;
}

function showResultGame(game: Game, word: Word): string[] {
    let result = [];
    if(game.history) {
        game.history.forEach(w => {
            result.push(showResultWord(w));
        });
    }

    for(let i = 0; i < (game.limit - (game.history ? game.history.length : 0)); i++) {
        result.push(showWord(word));
    }

    return result;
}

function sendResultGame(message: Message, game: Game, word: Word): void {
    const results = showResultGame(game, word);
    results.forEach(async word => {
        await message.channel.send(word);
    });
}

function separator(length: number): string {
    return COLOR_BLOCK.WHITE.repeat((length * 3) - 1);
}

function getWord(word: string): Word {
    return {
        letters: word.split('').map((letter, index) => {
            return {
                index: index,
                letter: letter,
                found: false
            } as Letter;
        })
    } as Word;
}

function getLetterAmount(word: Word, letter: string): number {
    return word.letters.reduce((prev, current) => current.letter === letter ? prev + 1 : prev, 0);
}

function getAllUniqueLetter(word: Word): Letter[] {
    const letters: Letter[] = [];
    word.letters.forEach(letter => {
        const letterFind = letters.find(l => l.letter === letter.letter);
        if(!letterFind) {
            letters.push(letter);
        }
    });
    return letters;
}

function updateMisplaced(secretWord: Word, currentWord: Word, letter: Letter): Word {
    const letterSecretAmount = getLetterAmount(secretWord, letter.letter);
    let count = 0;

    const newWord = {
        letters: currentWord.letters.map(l => {
            let misplaced: boolean = l.misplaced ? l.misplaced : false;
            if(count < letterSecretAmount && l.letter === letter.letter) {
                misplaced = l.found ? false : true;
                count = count + 1;
            }
    
            return {
                index: l.index,
                letter: l.letter,
                found: l.found,
                misplaced: misplaced
            } as Letter;
        })
    } as Word;

    return newWord;
}

function getUpdateWord(secretWord: Word, currentWord: Word): Word {
    let newWord = {
        letters: currentWord.letters.map((letter, index) => {
            return {
                index: index,
                letter: letter.letter,
                found: secretWord.letters[index].letter === letter.letter,
            } as Letter;
        })
    } as Word;

    const letters: Letter[] = getAllUniqueLetter(currentWord);
    letters.forEach(letter => {
        newWord = updateMisplaced(secretWord, newWord, letter);
    })

    return newWord;
}

function isGameFinish(game: Game): boolean {
    const cGame = copyGame(game);
    let result = true;
    getWordWithAllFoundLetter(cGame).letters.forEach(l => result && ( result = l.found ? true : false ));
    return game.finished || !game.players.find(p => !p.played) || (game.history && game.history.length >= game.limit) || result;
}

function isGameWin(word: Word): boolean {
    return !word.letters.find(letter => !letter.found);
}

function getUnusedLetter(game: Game): string[] {
    let used = [];
    if(game.history) {
        game.history.forEach(word => word.letters.forEach(l => used.push(l.letter.toLowerCase())));
    }
    return ASCII_ALPHABET.filter(l => !used.includes(l)).map(l => l.toUpperCase());
}

function getWordWithAllFoundLetter(game: Game): Word {
    if(game.history) {
        const word = game.history[game.history.length - 1];
        game.history.forEach(w => {
            w.letters.forEach((l, index) => {
                if(l.found) {
                    word.letters[index] = l;
                }
            });
        });
        return word;
    }

    return { letters: [] } as Word;
}

function copyGame(game: Game): Game {
    return {
        date: (' ' + game.date).slice(1),
        currentPlayer: JSON.parse(JSON.stringify(game.currentPlayer)),
        finished: game.finished ? true : false,
        limit: parseInt(game.limit.toString()),
        players: JSON.parse(JSON.stringify(game.players)),
        word: JSON.parse(JSON.stringify(game.word)),
        history: game.history ? JSON.parse(JSON.stringify(game.history)) : []
    } as Game;
}

export {
    showWord,
    separator,
    getWord,
    getUpdateWord,
    showResultWord,
    isGameFinish,
    showResultGame,
    isGameWin,
    sendResultGame,
    getUnusedLetter,
    getWordWithAllFoundLetter,
    copyGame,
    COLOR_BLOCK
};
