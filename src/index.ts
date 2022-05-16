import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, Guild, Intents, User } from 'discord.js'
import { commands } from './command-holder';

const { token } = require('./../config.json');

export const client = new Client({ intents: [
    'GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'
]})


const listOfGuilds = new Array<Guild>()

client.on('ready', (a) => {
    console.log('we are ready')
    a.guilds.cache.forEach(guild => listOfGuilds.push(guild))
})

client.on('messageCreate', (message) => {
    console.log('registered message')
    if (message.content === 'noob') {
        message.reply({
            content: ":(",
        })
    }
} )

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    // get all existing commands whose name field matches the commandName
    // field of the interaction that was created
    const matchingCommands = commands.filter((command) => {
        return command.data.name === interaction.commandName
    })

    // if we have found at least 1 command with the matching name, then execute
    // that command
    if (matchingCommands.length > 0) {
        const commandToExecute = matchingCommands[0]
        await commandToExecute.run(interaction)
    }


})


client.login(token)

