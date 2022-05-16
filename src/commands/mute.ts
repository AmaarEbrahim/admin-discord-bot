import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandPermissionData, Guild, GuildMember, User } from "discord.js";
import { ApplicationCommandPermissionTypes } from "discord.js/typings/enums";
import { TBotCommand } from "../command-holder";
import { client } from "../index"

const temporaryMuteCommand = new SlashCommandBuilder()
    .setName('temp_mute')
    .setDescription('Temporary mutes a user')
	.setDefaultPermission(false)
	
const p: ApplicationCommandPermissionData = {
	id: "",
	type: ApplicationCommandPermissionTypes.ROLE,
	permission: true
}

temporaryMuteCommand.addUserOption(user => 
    user.setName('target')
        .setDescription('the user to be muted')
        .setRequired(true)
)

temporaryMuteCommand.addIntegerOption(time =>
    time.setName('minutes')
        .setDescription('Minutes to mute someone')    
        .setRequired(true)
)

async function getMutedRole(guild: Guild) {
  // get the muted role, which is named 'muted'
  /** 
   * @todo don't use a string to get the name, use a variable. Strings
   * are annoying. 
   * @todo create the muted role when the bot is added to the server
  */
    const roles = guild.roles
    return roles.cache.find((role => role.name === 'muted'))
}

async function muteUser(guild: Guild, guildMember: GuildMember) {
	getMutedRole(guild).then((role) => {
      // put the guild member into the muted role
      guildMember.roles.add(role)		
	})
}


async function unmuteUser(guild: Guild, guildMember: GuildMember) {
	getMutedRole(guild).then((role) => {
		guildMember.roles.remove(role)
	})
}

/**
 * @weakness - if the bot goes down, the Promise that times when they should
 * be unmuted will be lost, so they will never be unmuted.
 * @weakness - can't unmute earlier
 */
export const temp_mute:TBotCommand = {
  data: temporaryMuteCommand,
  run: async (interaction)=> {

	// the command's 'target' option is the user to mute. Get it.
	const userToMute = interaction.options.getUser('target')

	// the comman's 'minutes' option is the number of minutes to mute. Get it.
	const minsToMuteFor = interaction.options.getInteger('minutes')

	// get the GuildMember instance that corresponds to the userToMute using
	// the id of the userToMute
	const guildMemberCorrespondingToUser = interaction.guild.members.cache.get(userToMute.id)

	// mute the user
	muteUser(interaction.guild, guildMemberCorrespondingToUser)

	// wait for minsToMuteFor minutes, then unmute the user
	const timer = new Promise<void>((res, rej) => {
		setTimeout(() => {
			unmuteUser(interaction.guild, guildMemberCorrespondingToUser)
		}, minsToMuteFor * 60 * 1000)
	})

	// reply to the user to acknowledge the mute command
	await interaction.reply({
		content: 'Will mute!',
		ephemeral: false
    })
  }
}

// let x = 

// function muteUser(user: User, time: number) {
//     return new Promise<void>(function(resolve, reject) {
//         addRoleToUser(user, "muted")
//         setTimeout(()=>, 60000*time)
//         removeMutedRoleFromUser(user)
//         resolve()
//         console.log(user.toString() + " has been unmuted")
//   })    
// }

// function removeMutedRoleFromUser(user:User){

// }

// function addRoleToUser(user: User, role: String){
//   let roleToAdd = user.guild.roles.cache.find(role => role.name === role);
//   user.
//   user.roles.add(roleToAdd);
//   user
// }

