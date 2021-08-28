import hotlines from "../assets/hotlines.json";
import {
  ClientUser,
  Guild,
  GuildMember,
  Message,
  MessageEmbed,
  TextChannel
} from "discord.js";
import { execSync } from "child_process";
import _ from "lodash";
import { formatPluralKitMessage } from "../functions/templateMessages";

interface MessageCommand {
  command: Array<string>;
  fn(message: Message, argv: string[]): any;
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
      fn(message) {
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
                  value: `\`\`\`${commandPrefix}hotlines [country|page]\n${commandPrefix}did [user...]\n${commandPrefix}help\n${commandPrefix}[version|ver]\n${commandPrefix}[credit|credits]\`\`\``,
                  inline: true
                },
                {
                  name: "Dev commands",
                  value: `\`\`\`[DISABLED] ${commandPrefix}eval\n${commandPrefix}testboost\`\`\``,
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
      fn(message) {
        message.reply("hey psych2goer!");
      }
    },
    {
      command: [commandPrefix + "version", commandPrefix + "ver"],
      fn(message, argv) {
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
      fn(message) {
        message.reply("I love pink!\n- Lexi");
      }
    },
    {
      command: [commandPrefix + "hotlines"],
      fn(message, argv) {
        let countryFound = false;

        if (argv.length) {
          let searchString = argv.join(" ").trim().toLowerCase();

          hotlines.map((hotline) => {
            if (
              hotline.name.toLowerCase() === searchString ||
              hotline.alias.map((al) => al.toLowerCase()).includes(searchString)
            ) {
              let embedMessage = new MessageEmbed({
                color: 0xffffff,
                description: `**${hotline.name} :flag_${
                  hotline.flag
                }:**\n\n${hotline.lines.map((line) => "- " + line).join("\n")}`
              });

              if (hotline.description)
                embedMessage.description += `\n\n${hotline.description}`;

              message.reply({ embeds: [embedMessage] });
              countryFound = true;
            }
          });
        }

        if (!countryFound) {
          if ((argv.length && !isNaN(parseInt(argv[0]))) || !argv.length) {
            let chunkedHotlines = _.chunk(hotlines, 10);
            let chunkedHotline = chunkedHotlines[0];
            let countriesEmbedMessage = new MessageEmbed({
              color: 0xffffff,
              description: `**List of countries [1/${chunkedHotlines.length}]**\n\n`
            });

            if (argv.length == 1) {
              let page = parseInt(argv[0]);

              if (!isNaN(page)) {
                let cappedPage = Math.min(
                  Math.max(1, page),
                  chunkedHotlines.length
                );
                let selectedChunkedHotline = chunkedHotlines[cappedPage - 1];

                if (selectedChunkedHotline) {
                  chunkedHotline = selectedChunkedHotline;
                  countriesEmbedMessage.description = `**List of countries [${cappedPage}/${chunkedHotlines.length}]**\n\n`;
                }
              }
            }

            countriesEmbedMessage.description += chunkedHotline
              .map((hotline) => `${hotline.name} :flag_${hotline.flag}:`)
              .join("\n");

            countriesEmbedMessage.description += `\n\nUse \`${commandPrefix}hotlines [country]\` to find hotlines for a specific country\nUse \`${commandPrefix}hotlines [page]\` to see other pages`;

            message.reply({
              embeds: [countriesEmbedMessage]
            });
          } else {
            message.reply({
              embeds: [
                {
                  color: 0xffffff,
                  title: "Uh oh",
                  description:
                    "Cannot find the specified country. Please use country code or another keyword"
                }
              ]
            });
          }
        }
      }
    },
    {
      command: [commandPrefix + "did"],
      fn(message, args) {
        message.channel.send(formatPluralKitMessage(args));
      }
    },
    {
      command: [commandPrefix + "credit", commandPrefix + "credits"],
      fn(message) {
        message.channel.send({
          embeds: [
            {
              color: 0xffffff,
              title: "Psych2Go Community Bot Credits",
              thumbnail: {
                url: (
                  message.client.user as ClientUser
                ).displayAvatarURL() as string
              },
              fields: [
                {
                  name: ":art: Profile picture artwork",
                  value: "by [AnoirX](https://linktr.ee/AnoirX)"
                },
                {
                  name: ":clipboard: Bot team leaders",
                  value: "- Zehzinhuh\n- Kraid"
                },
                {
                  name: ":desktop: Bot team members",
                  value: "- Noxturnix\n- KingOworld\n- Jassie\n- DAZ"
                },
                {
                  name: ":globe_with_meridians: Server maintenance/provider",
                  value: "- Noxturnix"
                }
              ],
              footer: {
                icon_url: "https://avatars.githubusercontent.com/u/87629718",
                text: "Psych2Go Bot Team"
              }
            }
          ]
        });
      }
    }
  ],
  devCommands: [
    {
      command: [commandPrefix + "eval"],
      fn(message, argv) {
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
    },
    {
      command: [commandPrefix + "testboost"],
      fn(message) {
        let now = new Date().toISOString();
        let oldMember = new GuildMember(
          message.client,
          {
            user: message.author,
            roles: [],
            joined_at: now,
            deaf: false,
            mute: false
          },
          message.guild as Guild
        );
        let newMember = new GuildMember(
          message.client,
          {
            user: message.author,
            roles: [],
            joined_at: now,
            deaf: false,
            mute: false,
            premium_since: new Date().toISOString()
          },
          message.guild as Guild
        );
        message.client.emit("guildMemberUpdate", oldMember, newMember);
        message.reply("Test boost event emitted");
      }
    }
  ],
  adminCommands: [
    {
      command: [commandPrefix + "bomb"],
      async fn(message, argv) {
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
