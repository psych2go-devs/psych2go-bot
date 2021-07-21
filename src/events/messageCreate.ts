import { GuildMember, Message } from "discord.js";
import { ADMIN_ROLE_ID } from "..";
import { messageCommands } from "../commands/messageCommands";
import { messageContains } from "../commands/messageContains";

export const handleMessageCreateEvent = (message: Message) => {
  if (!message.author.bot && message.guild) {
    let messageLower = message.content.toLowerCase();
    let userCommandExecuted = false;
    let adminCommandExecuted = false;

    for (let i = 0; i < messageCommands.userCommands.length; i++) {
      let messageCommand = messageCommands.userCommands[i];

      if (messageLower === messageCommand.command) {
        messageCommand.fn(message);
        userCommandExecuted = true;
        break;
      }
    }

    let adminFunction = null;

    for (let i = 0; i < messageCommands.adminCommands.length; i++) {
      let messageCommand = messageCommands.adminCommands[i];

      if (messageLower === messageCommand.command) {
        adminFunction = messageCommand.fn;
        break;
      }
    }

    if (!userCommandExecuted && adminFunction) {
      if (ADMIN_ROLE_ID) {
        if ((message.member as GuildMember).roles.cache.has(ADMIN_ROLE_ID)) {
          adminFunction(message);
        } else {
          message.reply("You do not have permission to use the command");
        }
      } else {
        message.reply("`ADMIN_ROLE_ID` environment variable is not defined");
      }
      adminCommandExecuted = true;
    }

    if (!userCommandExecuted && !adminCommandExecuted) {
      for (let i = 0; i < messageContains.length; i++) {
        let messageContain = messageContains[i];
        let containFunction = null;

        for (let j = 0; j < messageContain.contain.length; j++) {
          let containString = messageContain.contain[j];

          if (message.content.includes(containString)) {
            containFunction = messageContain.fn;
            break;
          }
        }

        if (containFunction) containFunction(message);
      }
    }
  }
};
