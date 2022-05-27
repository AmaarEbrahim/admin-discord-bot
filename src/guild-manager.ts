import { Guild, Role } from '../node_modules/discord.js';

/**
 * Add the guild to the guildmap when the bot is added to a new server. Set the value to a default
 * value to show that the bot has not been set up yet.
 */
export function addGuildToMap(guildMap: Map<string, TGuildSettings>, guild: Guild) {
    guildMap.set(guild.id, {
        botIsSetUp: false,
        adminRole: undefined,
        muteRole: undefined
    })
}

/**
 * Sees if a guild is set up by checking the `guildMap`. If the guild's ID is not
 * in the guildMap then the bot is not set up.
 * @param guildMap A map that correlates each guild's ID to an object with the
 * guild data
 * @param guild The guild to check
 * @returns Whether the bot is set up
 */
export function isBotSetupInGuild(guildMap: Map<string, TGuildSettings>, guild: Guild) {
    const guildMapHasGuild = guildMap.has(guild.id)

    if (guildMapHasGuild) {
        return guildMap.get(guild.id).botIsSetUp
    }

    return false
}

export function addGuildToMapWithSettings(guildMap: Map<string, TGuildSettings>, guild: Guild, newSettings: TGuildSettings) {
    guildMap.set(guild.id, newSettings)
}


/**
 * An type to represent objects that store guild settings. When the bot is set
 * up, the muteRole and adminRole are Role objects. When the bot is not set up,
 * they are undefined.
 */
export type TGuildSettings = 
    {
        botIsSetUp: true,
        muteRole: Role,
        adminRole: Role
    } | 
    {
        botIsSetUp: false,
        muteRole: undefined,
        adminRole: undefined
    }