import { GuildMember, PartialGuildMember } from "discord.js";
import { handleGuildBoostEvent } from "./guildBoost/guildBoost";

export function handleGuildMemberUpdateEvent(
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
) {
  // Check if a user just boosted the guild/server
  if (!oldMember.premiumSince && newMember.premiumSince) {
    handleGuildBoostEvent(newMember);
  }
}
