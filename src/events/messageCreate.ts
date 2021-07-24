import { GuildMember, Message, Snowflake } from "discord.js";
import { ADMIN_ROLE_IDS, DEV_ROLE_IDS } from "..";
import { handlerMessages } from "../commands/allMessages";
import { messageCommands } from "../commands/messageCommands";
import { messageContains } from "../commands/messageContains";
import parseArgv from "../functions/parseArgv";

const permissionDeniedMessge = "You do not have permission to use the command";

export const handleMessageCreateEvent = (message: Message) => {
  if (!message.author.bot && message.guild) {
    let messageTrim = message.content.trim();
    let messageLower = messageTrim.toLowerCase();
    let userCommandExecuted = false;
    let devCommandExecuted = false;
    let adminCommandExecuted = false;

    handlerMessages(message);

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

    // Handle dev commands
    if (!userCommandExecuted) {
      for (let i = 0; i < messageCommands.devCommands.length; i++) {
        let messageCommand = messageCommands.devCommands[i];

        for (let j = 0; j < messageCommand.command.length; j++) {
          let commandString = messageCommand.command[j];

          if (messageLower.startsWith(commandString.toLowerCase())) {
            if (DEV_ROLE_IDS.length || ADMIN_ROLE_IDS.length) {
              let commandGranted = false;

              for (let k = 0; k < DEV_ROLE_IDS.length; k++) {
                let DEV_ROLE_ID = DEV_ROLE_IDS[k] as Snowflake;

                if (
                  (message.member as GuildMember).roles.cache.has(DEV_ROLE_ID)
                ) {
                  let msgArgv = parseArgv(
                    messageTrim.slice(commandString.length)
                  );
                  commandGranted = true;

                  messageCommand.fn(message, msgArgv);
                  break;
                }
              }

              if (!commandGranted) {
                for (let k = 0; k < ADMIN_ROLE_IDS.length; k++) {
                  let ADMIN_ROLE_ID = ADMIN_ROLE_IDS[k] as Snowflake;

                  if (
                    (message.member as GuildMember).roles.cache.has(
                      ADMIN_ROLE_ID
                    )
                  ) {
                    let msgArgv = parseArgv(
                      messageTrim.slice(commandString.length)
                    );
                    commandGranted = true;

                    messageCommand.fn(message, msgArgv);
                    break;
                  }
                }
              }

              if (!commandGranted) message.reply(permissionDeniedMessge);
            } else {
              message.reply(permissionDeniedMessge);
            }
            adminCommandExecuted = true;
          }
        }
      }
    }

    // Handle admin commands
    if (!userCommandExecuted && !devCommandExecuted) {
      for (let i = 0; i < messageCommands.adminCommands.length; i++) {
        let messageCommand = messageCommands.adminCommands[i];

        for (let j = 0; j < messageCommand.command.length; j++) {
          let commandString = messageCommand.command[j];

          if (messageLower.startsWith(commandString.toLowerCase())) {
            if (ADMIN_ROLE_IDS.length) {
              let commandGranted = false;

              for (let k = 0; k < ADMIN_ROLE_IDS.length; k++) {
                let ADMIN_ROLE_ID = ADMIN_ROLE_IDS[k] as Snowflake;

                if (
                  (message.member as GuildMember).roles.cache.has(ADMIN_ROLE_ID)
                ) {
                  let msgArgv = parseArgv(
                    messageTrim.slice(commandString.length)
                  );
                  commandGranted = true;

                  messageCommand.fn(message, msgArgv);
                  break;
                }
              }

              if (!commandGranted) message.reply(permissionDeniedMessge);
            } else {
              message.reply(permissionDeniedMessge);
            }
            adminCommandExecuted = true;
          }
        }

        if (adminCommandExecuted) break;
      }
    }

    // Handle message contains
    if (!userCommandExecuted && !adminCommandExecuted) {
      let messageLowerNoEmoji = messageLower.replace(
        /:[^:\s]*(?:::[^:\s]*)*:/g,
        ""
      ); // https://stackoverflow.com/a/49783944

      for (let i = 0; i < messageContains.length; i++) {
        let messageContain = messageContains[i];
        let containFunction = null;
        let containString = null;

        for (let j = 0; j < messageContain.contain.length; j++) {
          containString = messageContain.contain[j];

          if (messageLowerNoEmoji.includes(containString.toLowerCase())) {
            containFunction = messageContain.fn;
            break;
          }
        }

        if (containFunction) containFunction(message, containString as string);
      }
    }
  }
};
