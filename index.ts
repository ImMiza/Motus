import { Message } from "discord.js";
import { getDiscordCommandByName } from "./commands";
import DiscordCommand from "./Model/DiscordCommand";
import { Prefix, prefixes } from "./prefix";

const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('messageCreate', (message: Message) => {
  if(message.author.bot || message.content.length <= 0) return;
  
  const prefix: Prefix = prefixes.find(p => message.content.startsWith(p.prefix));
  if(!prefix) return;

  const content: string = message.content.substring(prefix.prefix.length, message.content.length)
  const command: DiscordCommand = getDiscordCommandByName(content.split(' ')[0]);

  if(!command) return;

  command.executor ? command.executor(message) : message.reply('No executor function applied !');
});

client.login(process.env.TOKEN);