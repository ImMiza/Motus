import { Message, MessageEmbed } from "discord.js";
import { commands } from "../commands";
import DiscordCommand from "../Model/DiscordCommand";
require('dotenv').config();

function executor(message: Message): void {
    const embed = new MessageEmbed({
        title: "Help",
        description: "List of commands",
        fields: commands.sort((a,b) => a.command.name.localeCompare(b.command.name)).map(command => {
            return {
                name: command.command.name,
                value: command.command.description
            }
        }),
        author: {
            name: process.env.BOT_NAME
        }
    });

    message.reply({
        embeds: [embed]
    })
}

export default {
    command: {
        name: 'help',
        description: 'Help command'
    },
    executor: (message: Message) => executor(message)
} as DiscordCommand;