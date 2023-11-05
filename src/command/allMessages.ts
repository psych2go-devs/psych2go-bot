import type { Message } from "discord.js";
import { stickyMessages } from "../lib/stickyMessages";

export default async (message: Message) => {
  // Code triggers on every messages
  let stickyMessage = stickyMessages.get(message.channelId);
  if (
    stickyMessage !== undefined &&
    (!message.author.bot ||
      (message.author.id === message.client.user.id &&
        message.content !== stickyMessage.getMessage()))
  ) {
    stickyMessage.send(message.client);
  }
};
