import { SlashCommandBuilder } from "@discordjs/builders";
import { TBotCommand } from "../command-holder";

export const PingCommand: TBotCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('responds with pong'),
    run: async function (interaction) {
        await interaction.reply('pong')
    }
}