**README.md**
This is a discord bot created by Josh Conklin and Amaar Ebrahim


**ISSUES**
The correct version of discord.js can only be imported by using its path in
node_modules (e.g. import {...} from "../../node_modules/discord.js";). Doing 
something like import {...} from "discord.js" will not work, presumably because
node tries to resolve discord.js from the node_modules folder of the jest-discord-mocks
node module. Jest-discord-mocks's version of discord.js is outdated, so many of
don't exist.