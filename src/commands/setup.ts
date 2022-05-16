import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType, AwaitMessagesOptions } from "discord.js";
import { TBotCommand } from "../command-holder";

export const SetupCommand: TBotCommand = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the bot'),
    run: async function (interaction: CommandInteraction<CacheType>): Promise<unknown> {
        return interaction.reply({
            content: 'please reply to this',
            fetchReply: true
        })
            .then(() => {
                interaction.channel.awaitMessages({max: 1, time: 3000})
                    .then((collection) => {
                        interaction.followUp({
                            content: collection.first().content
                        })
                    })
                    .catch(() => {
                        interaction.followUp({
                            content: 'There was a timeout'
                        })
                    })
            })

        
        
    }
}