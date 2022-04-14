import { Message } from "discord.js";
import DefaultRole from "../data/DefaultRole";
import DiscordCommand from "../Model/DiscordCommand";
import { Game, Player } from "../Model/Game";
import { deleteGame, loadGame, loadWords, saveGame } from "../utils/FileFunction";
import { normalizeText, shuffleArray } from "../utils/Function";
import { getWord, sendResultGame } from "../utils/GameFunction";


async function start(message: Message): Promise<void> {
    let selectedWord: string|null;

    const words: string[] = loadWords();
    if(words.length <= 0) {
        message.reply('no words in the list');
        return;
    }

    const amount: number = words.length;
    const randomNumber: number = Math.floor(Math.random() * (amount - 1))
    selectedWord = words[randomNumber];

    if(!selectedWord) {
        message.reply('error selected word');
        return;
    }

    let players = await message.guild.members.list({cache: true, limit: 1000}).then(members => {
        return [...members.values()].filter(m => m.roles.cache.find(r => r.name === DefaultRole.name) && !m.user.bot).map(p => { return { id: p.user.id, played: false } as Player } );
    });

    if(players.length <= 0) {
        message.reply('No user found');
        return;
    }

    players = shuffleArray(players);
    const word = getWord(normalizeText(selectedWord));
    
    if(word.letters.length > 0) {
        word.letters[0].found = true;
    }

    const game = {
        word: word,
        players: players,
        currentPlayer: players[0],
        finished: false,
        limit: 6,
        date: new Date().toDateString()
    } as Game;

    saveGame(game) 
          
    sendResultGame(message, game, game.word);

    message.channel.send('Game start !');
    message.channel.send(`First Player : <@${game.currentPlayer.id}>`);
    message.channel.send(`length word: ${game.word.letters.length}`);
    message.channel.send('$play <word>');
}

function executor(message: Message): void {
    const contents = message.content.split(' ');

    if(contents.length >= 2 && contents[1].toLowerCase() === 'force') {
        deleteGame();
    }
    
    let game: Game;
    try {
        game = loadGame();
    } catch (error) {
        game = null;
    }

    if(game && game.date === new Date().toDateString()) {
        message.reply('Game already played today, see you tomorrow !');
        return;
    }

    start(message);
}

export default {
    command: {
        name: 'start',
        description: 'Start the daily game'
    },
    executor: (message: Message) => executor(message)
} as DiscordCommand;