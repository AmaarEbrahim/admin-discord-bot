import { SlashCommandBuilder } from "@discordjs/builders"
import { CacheType, CommandInteraction } from '../node_modules/discord.js'
import { temp_mute } from "./commands/mute"
import { PingCommand } from "./commands/ping"
import { SetupCommand } from "./commands/setup"


// wackey do you see this

export type TBotCommand = {
    data: SlashCommandBuilder
    run: (interaction: CommandInteraction<CacheType>) => Promise<unknown>
} 



export const commands = [
	PingCommand,
    temp_mute,
    SetupCommand
] as const




export const commandIsSetupCommand = (command: CommandInteraction) => {
    return command.commandName === 'setup'
}
