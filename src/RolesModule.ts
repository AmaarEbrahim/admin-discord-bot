import { CreateRoleOptions, Guild, Role } from "../node_modules/discord.js";

export module RolesModule {

    /**
     * Get the role with the given `roleName`, provided such a role exists
     * @param guild The guild to search roles in
     * @param roleName The name of the role to find
     * @returns A Roleor void
     */
    export function getRoleFromName(guild: Guild, roleName: string): Role | void {

        // if a role with the given `roleName` exists, get it
        const rolesWithTheSameName = guild.roles.cache.filter((role) =>
            role.name === roleName
        )

        if (rolesWithTheSameName.size === 0) {
            return null
        } else {
            return rolesWithTheSameName.first()
        }

    }

    /**
     * Creates a role in `guild` called `roleName`
     * @param guild The guild to put the role in
     * @param roleName The name of the role
     * @returns A promise that resolves when the role is created
     * @throws if a role with the name `roleName` already exists
     */
    export async function createRoleInGuildUsingName(guild: Guild, roleName: string) {

        const alreadyHasRoleWithGivenName = (getRoleFromName(guild, roleName) !== null)

        if (alreadyHasRoleWithGivenName) {
            throw new Error(`Role named ${roleName} already exists!`)
        }

        const newRoleOptions: CreateRoleOptions = {
            name: roleName
        }
        return guild.roles.create(newRoleOptions)
    }

}