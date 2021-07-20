import { Message } from "discord.js";

export const handleMessageEvent = (message: Message) => {
  if (!message.author.bot) {
    switch (message.content.toLowerCase()) {
      case "hi psi":
        message.reply("hi");
        break;
    }
  }
};
