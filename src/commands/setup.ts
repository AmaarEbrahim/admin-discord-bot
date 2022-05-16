import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType, AwaitMessagesOptions } from "discord.js";
import { TBotCommand } from "../command-holder";
import { TGuildSettings } from '../guild-manager';
import { guildSettings } from '../index'


function setupRole(interaction: CommandInteraction<CacheType>, roleName: string){
    let guild = interaction.guild
    let settings = guildSettings.get(guild.id)

    interaction.reply("(1) Do you want to set up your own " + roleName + " or (2) have the bot create you the role? (1 or 2)").then(() => {
        interaction.channel.awaitMessages({max: 1, time: 10000})
            .then((reply) => {
                if ('1' === reply.first().content){
                    interaction.reply("What is the name of the existing " + roleName + " role?")
                    .then(() => {
                        interaction.channel.awaitMessages({max: 1, time: 10000})
                        .then((reply1)=>{
                            
                        })
                    })
                }
                else if ('2' === reply.first().content) {

                }
                else{
                    return false
                }
            })
    })
}

function setupMuteRole(interaction: CommandInteraction<CacheType>) {

}

function setupAdminRole(interaction: CommandInteraction<CacheType>) {

}

export const SetupCommand: TBotCommand = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the bot'),
    run: async function (interaction: CommandInteraction<CacheType>): Promise<unknown> {
        return interaction.reply({
            content: 'please reply to this',
            fetchReply: true
        })
            .then((a) => {
                interaction.channel.awaitMessages({max: 1, time: 3000})
                    .then((collection) => {
                        interaction.followUp({
                            content: collection.first().content
                        })
                        setupAdminRole(interaction)
                    })
                    .catch(() => {
                        interaction.followUp({
                            content: 'There was a timeout'
                        })
                    })
            })

        
        
    }
}