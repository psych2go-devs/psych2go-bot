import type { Client, TextChannel } from "discord.js";
import { ChannelType } from "discord.js";
import { stickyMessages } from "../lib/stickyMessages";

export default async (client: Client) => {
  // Send a new sticky message if one is not found in last 10 messages on a channel
  for (let channelId of stickyMessages.keys()) {
    let channel = client.channels.cache.get(channelId);

    if (channel === undefined || channel.type !== ChannelType.GuildText) continue;

    // Get last 10 messages
    let channelMessages = await (channel as TextChannel).messages.fetch({ limit: 10 });
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

    if (foundSentId === undefined || foundSentId !== channelMessages.first()?.id) {
      // No sticky message found or the sticky message is not the last message on the channel
      stickyMessage.send(client);
    }
  }
};
