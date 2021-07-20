import { GuildMember } from "discord.js";

export const handleGuildMemberAddEvent = (member: GuildMember) => {
  member.guild.systemChannel?.send(`Welcome <@${member.id}> to the server!`);
};
