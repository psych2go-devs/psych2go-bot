import { DiscordAPIError, GuildMember } from "discord.js";
import readAssetFile from "../../lib/readAssetFile";

export async function handleGuildBoostEvent(member: GuildMember) {
  try {
    await member.send(readAssetFile("boost-dm.txt"));
  } catch (error) {
    if (error instanceof DiscordAPIError) {
      if (error.code === 50007) {
        // User has DM off
      }
    }
  }
}
