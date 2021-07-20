import { GuildMember, PartialGuildMember, User } from "discord.js";

export const handleGuildMemberRemoveEvent = async (
  member: GuildMember | PartialGuildMember
) => {
  // https://stackoverflow.com/questions/62577866/discord-js-listening-for-kicks
  let kickLog = (
    await member.guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_KICK"
    })
  ).entries.first();
  let banLog = (
    await member.guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_BAN_ADD"
    })
  ).entries.first();
  if (
    kickLog &&
    member.joinedAt &&
    (kickLog.target as User).id === member.id &&
    kickLog.createdAt > member.joinedAt
  ) {
    // User is kicked
    member.guild.systemChannel?.send(
      `<@${member.id}> has been kicked by <@${kickLog.executor?.id}>`
    );
  } else if (
    banLog &&
    member.joinedAt &&
    (banLog.target as User).id === member.id &&
    banLog.createdAt > member.joinedAt
  ) {
    // User is banned
    member.guild.systemChannel?.send(
      `<@${member.id}> has been banned by <@${banLog.executor?.id}>`
    );
  } else {
    // User left
    member.guild.systemChannel?.send(`<@${member.id}> left the server`);
  }
};
