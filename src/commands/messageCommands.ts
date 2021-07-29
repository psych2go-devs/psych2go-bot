import hotlines from "../assets/files/hotlines.json";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { execSync } from "child_process";
import _ from "lodash";

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

let currentCommitHash = execSync("git rev-parse --short HEAD")
  .toString()
  .trim();
let currentCommitSubject = execSync('git log --format="%s" -n 1')
  .toString()
  .trim();
let currentCommitBody = execSync('git log --format="%b" -n 1')
  .toString()
  .trim();
let currentCommitAuthorName = execSync('git log --format="%an" -n 1')
  .toString()
  .trim();

export const messageCommands: MessageCommands = {
  userCommands: [
    {
      command: [commandPrefix + "help"],
      fn: (message) => {
        message.reply({
          embeds: [
            {
              color: 0xffffff,
              fields: [
                {
                  name: "Community Psi Bot",
                  value: "List of commands"
                },
                {
                  name: "User Commands",
                  value: `\`\`\`${commandPrefix}help\n${commandPrefix}[version|ver]\`\`\``,
                  inline: true
                },
                {
                  name: "Dev commands",
                  value: `\`\`\`[DISABLED] ${commandPrefix}eval\`\`\``,
                  inline: true
                },
                {
                  name: "Admin commands",
                  value: `\`\`\`${commandPrefix}bomb\`\`\``,
                  inline: true
                }
              ],
              footer: {
                text: `Currently on commit ${currentCommitHash}`
              }
            }
          ]
        });
      }
    },
    {
      command: ["hi psi", "hey psi", "hello psi"],
      fn: (message) => {
        message.reply("hey psych2goer!");
      }
    },
    {
      command: [commandPrefix + "version", commandPrefix + "ver"],
      fn: (message, argv) => {
        if (!argv.length)
          message.reply({
            embeds: [
              {
                color: 0xffffff,
                description: `**Currently on commit \`${currentCommitHash}\`**\n${currentCommitSubject} - ${currentCommitAuthorName}`
              }
            ]
          });
      }
    },
    {
      command: [commandPrefix + "i love pink"],
      fn: (message) => {
        message.reply("I love pink!\n- Lexi");
      }
    },
    {
      command: ["hotlines"],
      fn: (message, argv) => {
        let countryFound = false;

        // Hotlines search goes here

        if (!countryFound) {
          let chunkedHotlines = _.chunk(hotlines, 10);
          let chunkedHotline = chunkedHotlines[0];
          let countriesEmbedMessage = new MessageEmbed({
            color: 0xffffff,
            description: `**List of countries [1/${chunkedHotlines.length}]**\n`
          });

          if (argv.length == 1) {
            let page = parseInt(argv[0]);

            if (!isNaN(page)) {
              let minPage = Math.min(page, chunkedHotlines.length);
              let selectedChunkedHotline = chunkedHotlines[minPage - 1];

              if (selectedChunkedHotline) {
                chunkedHotline = selectedChunkedHotline;
                countriesEmbedMessage.description = `**List of countries [${minPage}/${chunkedHotlines.length}]**\n`;
              }
            }
          }

          countriesEmbedMessage.description += chunkedHotline
            .map((hotline) => `${hotline.name} :flag_${hotline.flag}:`)
            .join("\n");

          countriesEmbedMessage.description +=
            "\n\nUse `hotlines [country]` to find hotlines for a specific country\nUse `hotlines [page]` to see other pages";

          message.reply({
            embeds: [countriesEmbedMessage]
          });
        }
      }
    }
  ],
  devCommands: [
    {
      command: [commandPrefix + "eval"],
      fn: (message, argv) => {
        message.reply("This command is temporary disabled");
        // if (!argv.length) {
        //   return message.reply(`Usage: ${commandPrefix}eval <code>`);
        // }
        // try {
        //   let evalOutput = JSON.stringify(eval(argv.join(" ").trim()));
        //   if (evalOutput) await message.reply(evalOutput);
        //   else message.reply("*(no output)*");
        // } catch (error) {
        //   message.reply(error.message);
        // }
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
