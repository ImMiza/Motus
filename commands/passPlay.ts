import { Message } from "discord.js";
import DiscordCommand from "../Model/DiscordCommand";
import { Game } from "../Model/Game";
import { loadGame, saveGame } from "../utils/FileFunction";
import { getUnusedLetter } from "../utils/GameFunction";

function isGameStart(): boolean {
    const game = loadGame();
    return !game.finished && game.date === new Date().toDateString();
}

function isYourTurn(message: Message, game: Game): boolean {
    return game.currentPlayer.id === message.author.id;
}

function executor(message: Message): void {
    const game: Game = loadGame();

    if(!game) {
        message.reply('game null');
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

    const index = game.players.findIndex(p => p.id === game.currentPlayer.id);
    const newIndex = ((index + 1) % game.players.length);
    const player = game.players[newIndex];
    game.currentPlayer = player;
    saveGame(game);

    message.channel.send(`It's your turn <@${game.currentPlayer.id}>`);
    message.channel.send(`length word: ${game.word.letters.length}`);
    message.channel.send(`unused words: ${getUnusedLetter(game).sort().join(', ')}`)
    message.channel.send('$play <word>');
}

export default {
    command: {
        name: 'pass',
        description: 'Pass your turn while playing a game'
    },
    executor: (message: Message) => executor(message)
} as DiscordCommand;