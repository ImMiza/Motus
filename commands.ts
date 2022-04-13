import createRole from "./commands/createRole";
import help from "./commands/help";
import ping from "./commands/ping";
import play from "./commands/play";
import start from "./commands/start";
import DiscordCommand from "./Model/DiscordCommand";

const commands = [
    ping,
    help,
    createRole,
    start,
    play
] as DiscordCommand[];

function getDiscordCommandByName(name: string): DiscordCommand|undefined {
    return commands.filter(c => c.command.name === name).shift();
}

export {
    commands,
    getDiscordCommandByName
};
