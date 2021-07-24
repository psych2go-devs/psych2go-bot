import { Message, TextChannel } from "discord.js";
import { execSync } from "child_process";

interface MessageCommand {
  command: Array<string>;
  fn: (message: Message, argv: string[]) => any;
}

interface MessageCommands {
  userCommands: Array<MessageCommand>;
  devCommands: Array<MessageCommand>;
  adminCommands: Array<MessageCommand>;
}

const commandPrefix = "psi!"; // This shouldn't be hard-coded, but anyway

export const messageCommands: MessageCommands = {
  userCommands: [
    {
      command: ["hi psi", "hey psi", "hello psi"],
      fn: (message) => {
        message.reply("hey psych2goer!");
      }
    },
    {
      command: [commandPrefix + "version", commandPrefix + "ver"],
      fn: (message, argv) => {
        let currentCommitHash = execSync("git rev-parse --short HEAD")
          .toString()
          .trim();

        if (!argv.length)
          message.reply(`Currently on commit \`${currentCommitHash}\``);
      }
    },
    {
      command: [commandPrefix + "i love pink"],
      fn: (message) => {
        message.reply("I love pink!\n- Lexi");
      }
    }
  ],
  devCommands: [
    {
      command: [commandPrefix + "eval"],
      fn: (message, argv) => {
        if (!argv.length) {
          return message.reply(`Usage: ${commandPrefix}eval <code>`);
        }

        try {
          let evalOutput = JSON.stringify(eval(argv.join(" ").trim()));

          if (evalOutput) message.reply(evalOutput);
          else message.reply("*(no output)*");
        } catch (error) {
          message.reply(error.message);
        }
      }
    }
  ],
  adminCommands: [
    {
      command: [commandPrefix + "bomb"],
      fn: async (message, argv) => {
        let replyUsage = () => {
          message.reply(`Usage: ${commandPrefix}bomb <limit> [search]`);
        };

        if (argv.length) {
          let fetchLimit = parseInt(argv[0]);

          if (!isNaN(fetchLimit)) {
            let fetchedMessages = await message.channel.messages.fetch({
              before: message.id,
              limit: fetchLimit
            });

            if (argv.length > 1) {
              let searchString = argv.slice(1).join(" ").toLowerCase();
              let matchMessages = fetchedMessages.filter((fetchedMessage) =>
                fetchedMessage.content
                  .trim()
                  .toLowerCase()
                  .includes(searchString)
              );

              (message.channel as TextChannel).bulkDelete(matchMessages);
              message.reply(`Deleted ${matchMessages.size} message(s)`);
            } else {
              (message.channel as TextChannel).bulkDelete(fetchedMessages);
              message.reply(`Deleted ${fetchedMessages.size} message(s)`);
            }
          } else replyUsage();
        } else replyUsage();
      }
    }
  ]
};
