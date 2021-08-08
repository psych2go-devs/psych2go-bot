import { DiscordAPIError, GuildMember } from "discord.js";
import { readFileSync } from "fs";
import { resolve } from "path";

export const handleGuildBoostEvent = async (member: GuildMember) => {
  try {
    await member.send(
      readFileSync(
        resolve(__dirname, "..", "..", "assets", "boost-dm.txt")
      ).toString()
    );
  } catch (error) {
    if (error instanceof DiscordAPIError) {
      if (error.code === 50007) {
        // User has DM off
      }
    }
  }
};
