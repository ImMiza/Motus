import { Message } from "discord.js";
import DiscordCommand from "../Model/DiscordCommand";
import { Game, Word } from "../Model/Game";
import { loadGame, loadWords, saveGame } from "../utils/FileFunction";
import { normalizeText } from "../utils/Function";
import { COLOR_BLOCK, getUnusedLetter, getUpdateWord, getWord, getWordWithAllFoundLetter, isGameFinish, isGameWin, sendResultGame } from "../utils/GameFunction";

function finish(message: Message, game: Game, word: Word): void {
    sendResultGame(message, game, word);
    message.channel.send('The game finished !');
    message.channel.send(isGameWin(word) ? `You win this game ! ${COLOR_BLOCK.GREEN}` : `You lose this game ! ${COLOR_BLOCK.RED}`);
    message.channel.send(`The word: ${game.word.letters.map(l => l.letter).join('')}`);
}

function gameContinue(message: Message, game: Game, word: Word): void {
    sendResultGame(message, game, getWordWithAllFoundLetter(game));
    message.channel.send(`It's your turn <@${game.currentPlayer.id}>`);
    message.channel.send(`length word: ${game.word.letters.length}`);
    message.channel.send(`unused words: ${getUnusedLetter(game).sort().join(', ')}`)
    message.channel.send('$play <word>');
}

function isGameStart(): boolean {
    const game = loadGame();
    return !game.finished && game.date === new Date().toDateString();
}

function isYourTurn(message: Message, game: Game): boolean {
    return game.currentPlayer.id === message.author.id;
}

function isWordExisting(word: string): boolean {
    return loadWords().find(w => normalizeText(w) === normalizeText(word)) !== undefined;
}

function executor(message: Message): void {message.content.split(' ')
    const contents: string[] = message.content.split(' ');
    if(contents.length <= 1) {
        message.reply('$play <word>');
        return;
    }

    const game: Game = loadGame();

    if(!game) {
        message.reply('game null');
        return;
    }

    if(contents[1].length !== game.word.letters.length) {
        message.reply(`incorrect length: the word need ${game.word.letters.length} letters !`);
        return;
    }

    if(!isGameStart()) {
        message.reply('No game started !');
        return;
    }

    if(!isYourTurn(message, game)) {
        message.reply('It\'s not your turn !');
        return;
    }

    if(!isWordExisting(contents[1])) {
        message.reply('The word doesn\'t exist in my dictionnary');
        return;
    }

    const word = getWord(normalizeText(contents[1]));
    const updateWord = getUpdateWord(game.word, word);
    // const member = message.guild.members.cache.find(m => m.user.id === game.currentPlayer.id);
    // if(!member) {
    //     message.reply('error member');
    //     return;
    // }

    if(game.history) {
        game.history.push(updateWord);
    }
    else {
        game.history = [updateWord];
    }

    // game.players.forEach(player => {
    //     player.played = player.played ? true : (player.id === member.user.id ? true : false);
    // });

    game.finished = isGameFinish(game);

    if(game.finished) {
        saveGame(game);
        finish(message, game, updateWord);
        return;
    }

    const index = game.players.findIndex(p => p.id === game.currentPlayer.id);
    if(index === -1) {
        message.reply('player error undefined');
        return;
    }

    const newIndex = ((index + 1) % game.players.length);
    const player = game.players[newIndex];
    game.currentPlayer = player;
    saveGame(game);
    gameContinue(message, game, updateWord);
}

export default {
    command: {
        name: 'play',
        description: 'When a game started, allow to make a proposition'
    },
    executor: (message: Message) => executor(message)
} as DiscordCommand;