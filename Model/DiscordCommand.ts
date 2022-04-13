interface ICommand {
    name: string,
    description?: string
}

interface DiscordCommand {
    command: ICommand
    executor: Function|null
}

export default DiscordCommand;