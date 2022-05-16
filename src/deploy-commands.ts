import { SlashCommandBuilder } from "@discordjs/builders"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { ApplicationCommandData, CacheType, CommandInteraction, Interaction } from "discord.js";
import { client } from ".";
import { commands } from "./command-holder";
const { token, client_id, dev_server_id } = require('./../config.json');




client.on('ready', () => {
    const guild = client.guilds.cache.get(dev_server_id)
    commands.forEach((botCommand) => {
        guild.commands.create(botCommand.data.toJSON())
        console.log('Created command: ' + botCommand.data.name)
    })
    
})


