import { ColorResolvable, Message } from "discord.js";
import DefaultRole from "../data/DefaultRole";
import DiscordCommand from "../Model/DiscordCommand";

function executor(message: Message): void {
    const role: Role = DefaultRole;

    message.guild.roles.create({
        name: role.name,
        color: role.color as ColorResolvable,
        mentionable: true,
        reason: 'role for motus player'
    })
    .then(() => message.reply('role create !'))
    .then(console.error);
}

export default {
    command: {
        name: 'createrole',
        description: 'Create the modus role in the server'
    },
    executor: (message: Message) => executor(message)
} as DiscordCommand;