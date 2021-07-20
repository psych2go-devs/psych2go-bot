import {Message} from "discord.js";

export const handleMessageEvent = (message: Message) => {
  if (!message.author.bot) {
    if (message.content.toLowerCase() === "hi psi") {
      message.reply("hi");
    }
  }
};
