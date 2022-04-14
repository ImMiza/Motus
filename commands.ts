import createRole from "./commands/createRole";
import help from "./commands/help";
import passPlay from "./commands/passPlay";
import ping from "./commands/ping";
import play from "./commands/play";
import start from "./commands/start";
import DiscordCommand from "./Model/DiscordCommand";

const commands = [
    ping,
    help,
    createRole,
    passPlay,
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
