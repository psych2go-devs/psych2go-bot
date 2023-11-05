import type { Client, TextChannel } from "discord.js";
import { ChannelType } from "discord.js";
import { stickyMessages } from "../lib/stickyMessages";

export default async (client: Client) => {
  // Send a new sticky message if one is not found in last 5 messages on a channel
  for (let channelId of stickyMessages.keys()) {
    let channel = client.channels.cache.get(channelId);

    if (channel === undefined) continue;

    if (channel.type !== ChannelType.GuildText) continue;

    // Get last 5 messages
    let channelMessages = await (channel as TextChannel).messages.fetch({ limit: 5 });
    let stickyMessage = stickyMessages.get(channelId);

    if (stickyMessage === undefined) continue;

    let stickyMessageContent = stickyMessage.getMessage();

    for (let channelMessage of channelMessages.values()) {
      if (
        channelMessage.author.id === client.user?.id &&
        channelMessage.content === stickyMessageContent
      ) {
        stickyMessage.setSentId(channelMessage.id);
        break;
      }
    }

    let foundSentId = stickyMessage.getSentId();

    if (foundSentId === undefined) {
      // No sticky message found
      let sentStickyMessage = await channel.send(stickyMessageContent);
      stickyMessage.setSentId(sentStickyMessage.id);
    } else if (foundSentId !== channelMessages.first()?.id) {
      // Found sticky message, but is not the last message on the channel
      channel.messages.delete(foundSentId);
      let sentStickyMessage = await channel.send(stickyMessageContent);
      stickyMessage.setSentId(sentStickyMessage.id);
    }
  }
};
