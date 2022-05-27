import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType, Message, User, Guild, Role } from "../../node_modules/discord.js";
import { TBotCommand } from "../command-holder";
import { addGuildToMapWithSettings, TGuildSettings } from '../guild-manager';
import { guildSettings } from '../index'
import { RolesModule } from "../RolesModule";


const timeoutTime = 15000    // in miliseconds



/**
 * Gets the next reply in the `interaction`'s channel from `user`
 * @param interaction The interaction which has the channel to await messages
 * from
 * @param timeoutTime The amount of time to wait before erroring in miliseconds
 * @param user The user to wait for a reply from
 * @returns A promise which resolves when the user responds, or rejects if no
 * response occurs.
 */
async function getReplyFromUser(
    interaction: CommandInteraction<CacheType>, 
    timeoutTime: number, 
    user: User
) {

    // this filter function will filter any messages that aren't sent by the
    // `user` argument
    const filterFunc = (message: Message<boolean>) => {
        return message.author === user
    }

    // wait for 1 message by the `user`. If no message is sent, call the timeout
    // function
    return interaction.channel.awaitMessages({max: 1, time: timeoutTime, filter: filterFunc})

}

/**
 * A type which indicates whether to create a new role or use an existing one.
 * This can be used in a variety of situations
 */
type TRoleSetupSummary = 
    {
        createNewRole: false,
        role: Role
    } |
    {
        createNewRole: true,
        roleName: string
    }

/**
 * Performs a sequence of actions to get a promise that passes a TRoleSetupSummary.
 * This is what the sequence of actions looks like:
 *      1. reply `initialFollow` to the `interaction`
 *          ex: initialFollowup is "hi", so reply "hi" to the interaction passed
 *      2. get a reply from the user (see the function call for more details around
 *          the reply). **The reply should be a role name.**
 *      3. get the role corresponding to what they replied if it exists
 *      4. return a TRoleSetupSummary based on whether it is a new role or an
 *          existing role
 */
async function setUpRole(initialFollowup: string, interaction: CommandInteraction): Promise<TRoleSetupSummary> {

    return interaction.followUp(initialFollowup)

        // get a reply. This can throw if the user doesn't respond in time.
        .then(() => getReplyFromUser(interaction, timeoutTime, interaction.user))

        .then<TRoleSetupSummary>((message) => {
            const role = RolesModule.getRoleFromName(interaction.guild, message.first().content)
        
            // if the role they replied with exists, then we're not going to create
            // a new role
            if (role) {
                interaction.followUp(`Great! You are using an existing role.`)
                return {
                    createNewRole: false,
                    role: role
                }
            } else {
                interaction.followUp(`Great! You are going to create a new role!`)
                return {
                    createNewRole: true,
                    roleName: message.first().content
                }
            }

        // if there was an error somewhere, throw an error saying that there
        // was a timeout.
        }).catch(() => {
            throw new Error(`There was a timeout!`)
        })



}

/**
 * Creates a role in the guild if the TRoleSetupSummary says to create a new role,
 * and returns that role. If the TRoleSetupSummary says to use an existing role,
 * then return the role in the TRoleSetupSummary
 * @returns A Promise that resolves, passing the role that either was created
 * or stored in the TRoleSetupSummary
 */
const useRoleSetupSummaryToCreateAdminPerms = async (guild: Guild, roleSetup: TRoleSetupSummary) => {
    return new Promise<Role>((res) => {
        if (roleSetup.createNewRole === true) {
            RolesModule.createRoleInGuildUsingName(guild, roleSetup.roleName).then((roleThatWasCreated) => {
                res(roleThatWasCreated)
            })
        } else {
            res(roleSetup.role)
        }        
    })

}

/**
 * Make the bot interact with the user to get either the role to use, or the
 * name of the role to make that gives someone admin perms.
 * @param interaction The interaction for the bot to reply to initiate this process
 * @returns A Promise that resolves, passing a TRoleSetupSummary
 */
const setupAdminRole = async (interaction: CommandInteraction) => {
    return setUpRole(`Please reply with the name of the role that should have access to these commands.`, interaction)
}

/**
 * Make the bot interact with the user to get either the role to use, or the
 * name of the role to make that gives someone mute perms.
 * @param interaction The interaction for the bot to reply to initiate this process
 * @returns A Promise that resolves, passing a TRoleSetupSummary
 */
const setupMuteRole = async (interaction: CommandInteraction) => {
    return setUpRole(`Please reply with the name of the muted role`, interaction)
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
        .then(() => setupAdminRole(interaction))
        .then((adminData) => 
            setupMuteRole(interaction)
            .then((muteData) => {
                return { 
                    adminData: adminData,
                    muteData: muteData
                }
            })
        )
        .then(async (data) => {

            try {

                const adminRole = await useRoleSetupSummaryToCreateAdminPerms(interaction.guild, data.adminData)
                const mutedRole = await useRoleSetupSummaryToCreateAdminPerms(interaction.guild, data.muteData)

                const newSettings: TGuildSettings = {
                    adminRole: adminRole,
                    muteRole: mutedRole,
                    botIsSetUp: true
                }

                console.log(newSettings)
                addGuildToMapWithSettings(guildSettings, interaction.guild, newSettings)

                interaction.followUp('Done!')

            } catch {

                interaction.followUp('Something went wrong...')

            }

        })
        .catch((e) => {
            interaction.followUp(e)
        })



        
    }
}

