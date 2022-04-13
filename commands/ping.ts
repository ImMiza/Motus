import { Message } from "discord.js";
import DiscordCommand from "../Model/DiscordCommand";

function executor(message: Message): void {
    message.reply('pong !');
}

export default {
    command: {
        name: 'ping',
        description: 'A ping pong test'
    },
    executor: (message: Message) => executor(message)
} as DiscordCommand;