import { GuildMember, Message } from "discord.js";
import { ADMIN_ROLE_ID } from "..";
import { messageCommands } from "../commands/messageCommands";
import { messageContains } from "../commands/messageContains";
import parseArgv from "../functions/parseArgv";

export const handleMessageCreateEvent = (message: Message) => {
  if (!message.author.bot && message.guild) {
    let messageTrim = message.content.trim();
    let messageLower = messageTrim.toLowerCase();
    let userCommandExecuted = false;
    let adminCommandExecuted = false;

    // Handle user commands
    for (let i = 0; i < messageCommands.userCommands.length; i++) {
      let messageCommand = messageCommands.userCommands[i];

      for (let j = 0; j < messageCommand.command.length; j++) {
        let commandString = messageCommand.command[j];

        if (messageLower.startsWith(commandString.toLowerCase())) {
          let msgArgv = parseArgv(messageTrim.slice(commandString.length));

          messageCommand.fn(message, msgArgv);
          userCommandExecuted = true;
          break;
        }
      }

      if (userCommandExecuted) break;
    }

    // Handle admin commands
    for (let i = 0; i < messageCommands.adminCommands.length; i++) {
      let messageCommand = messageCommands.adminCommands[i];

      for (let j = 0; j < messageCommand.command.length; j++) {
        let commandString = messageCommand.command[j];

        if (messageLower.startsWith(commandString.toLowerCase())) {
          if (!userCommandExecuted) {
            if (ADMIN_ROLE_ID) {
              if (
                (message.member as GuildMember).roles.cache.has(ADMIN_ROLE_ID)
              ) {
                let msgArgv = parseArgv(
                  messageTrim.slice(commandString.length)
                );

                messageCommand.fn(message, msgArgv);
              } else {
                message.reply("You do not have permission to use the command");
              }
            } else {
              message.reply(
                "`ADMIN_ROLE_ID` environment variable is not defined"
              );
            }
            adminCommandExecuted = true;
          }
        }
      }

      if (adminCommandExecuted) break;
    }

    // Handle message contains
    if (!userCommandExecuted && !adminCommandExecuted) {
      for (let i = 0; i < messageContains.length; i++) {
        let messageContain = messageContains[i];
        let containFunction = null;
        let containString = null;

        for (let j = 0; j < messageContain.contain.length; j++) {
          containString = messageContain.contain[j];

          if (messageLower.includes(containString.toLowerCase())) {
            containFunction = messageContain.fn;
            break;
          }
        }

        if (containFunction) containFunction(message, containString as string);
      }
    }
  }
};
