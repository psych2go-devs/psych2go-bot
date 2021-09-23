import { ClientUser, Guild, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import type { MessageCommand } from "../interface/MessageCommand";
import createCommandString from "../lib/createCommandString";
import defaultPrefix from "../lib/defaultMessageCommandPrefix";
import { formatPluralKitMessage } from "../lib/templateMessages";
import hotlines from "../asset/hotlines.json";
import rules from "../asset/rules.json";
import _ from "lodash";
import { execSync } from "child_process";
import searchChannel from "../lib/searchChannel";

const currentCommitHash = execSync("git rev-parse --short HEAD").toString().trim();
const currentCommitSubject = execSync('git log --format="%s" -n 1').toString().trim();
const currentCommitBody = execSync('git log --format="%b" -n 1').toString().trim();
const currentCommitAuthorName = execSync('git log --format="%an" -n 1').toString().trim();

const messageCommands: MessageCommand[] = [
  {
    command: [createCommandString("help")],
    fn(functionCall) {
      functionCall.message.reply({
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
                value: `\`\`\`${defaultPrefix}hotline(s) [country|page]\n${defaultPrefix}rule [search query]\n${defaultPrefix}search <query>\n${defaultPrefix}did [user...]\n${defaultPrefix}help\n${defaultPrefix}[version|ver]\n${defaultPrefix}credit(s)\`\`\``,
                inline: true
              },
              {
                name: "Dev commands",
                value: `\`\`\`[DISABLED] ${defaultPrefix}eval\n${defaultPrefix}testboost\`\`\``,
                inline: true
              },
              {
                name: "Admin commands",
                value: `\`\`\`${defaultPrefix}bomb\`\`\``,
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
    ignoreCase: true,
    fn(functionCall) {
      functionCall.message.reply("hey psych2goer!");
    }
  },
  {
    command: [createCommandString("version"), createCommandString("ver")],
    fn(functionCall) {
      if (!functionCall.args.length)
        functionCall.message.reply({
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
    command: [createCommandString("i love pink")],
    fn(functionCall) {
      functionCall.message.reply("I love pink!\n- Lexi");
    }
  },
  {
    command: [createCommandString("hotline"), createCommandString("hotlines")],
    fn(functionCall) {
      let countryFound = false;

      if (functionCall.args.length) {
        let searchString = functionCall.args.join(" ").trim().toLowerCase();

        hotlines.map((hotline) => {
          if (
            hotline.name.toLowerCase() === searchString ||
            hotline.alias.map((al) => al.toLowerCase()).includes(searchString)
          ) {
            let embedMessage = new MessageEmbed({
              color: 0xffffff,
              description: `**${hotline.name} :flag_${hotline.flag}:**\n\n${hotline.lines
                .map((line) => "- " + line)
                .join("\n")}`
            });

            if (hotline.description) embedMessage.description += `\n\n${hotline.description}`;

            functionCall.message.reply({ embeds: [embedMessage] });
            countryFound = true;
          }
        });
      }

      if (!countryFound) {
        if (
          (functionCall.args.length && !isNaN(parseInt(functionCall.args[0]))) ||
          !functionCall.args.length
        ) {
          let chunkedHotlines = _.chunk(hotlines, 10);
          let chunkedHotline = chunkedHotlines[0];
          let countriesEmbedMessage = new MessageEmbed({
            color: 0xffffff,
            description: `**List of countries [1/${chunkedHotlines.length}]**\n\n`
          });

          if (functionCall.args.length == 1) {
            let page = parseInt(functionCall.args[0]);

            if (!isNaN(page)) {
              let cappedPage = Math.min(Math.max(1, page), chunkedHotlines.length);
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

          countriesEmbedMessage.description += `\n\nUse \`${defaultPrefix}hotline(s) [country]\` to find hotlines for a specific country\nUse \`${defaultPrefix}hotline(s) [page]\` to see other pages`;

          functionCall.message.reply({
            embeds: [countriesEmbedMessage]
          });
        } else {
          functionCall.message.reply({
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
    command: [createCommandString("rule")],
    fn(functionCall) {
      let replyUsage = () => {
        functionCall.message.reply({
          embeds: [
            {
              color: 0xffffff,
              description: `Usage: ${defaultPrefix}rule [search query]`
            }
          ]
        });
      };

      if (functionCall.args.length) {
        let searchQuery = functionCall.args.join(" ");

        for (let i = 0; i < rules.length; i++) {
          let rule = rules[i];

          if (rule.toLowerCase().includes(searchQuery.toLowerCase())) {
            functionCall.message.channel.send({
              embeds: [
                {
                  color: 0xffffff,
                  description: `\`\`\`markdown\n${rule}\n\`\`\``
                }
              ]
            });

            return;
          }
        }

        functionCall.message.reply({
          embeds: [
            {
              color: 0xffffff,
              description: "Cannot find rule"
            }
          ]
        });
      } else replyUsage();
    }
  },
  {
    command: [createCommandString("did")],
    fn(functionCall) {
      functionCall.message.channel.send(formatPluralKitMessage(functionCall.args));
    }
  },
  {
    command: [createCommandString("credit"), createCommandString("credits")],
    fn(functionCall) {
      functionCall.message.channel.send({
        embeds: [
          {
            color: 0xffffff,
            title: "Psych2Go Community Bot Credits",
            thumbnail: {
              url: (functionCall.message.client.user as ClientUser).displayAvatarURL() as string
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
  },
  {
    command: [createCommandString("search")],
    async fn(functionCall) {
      let replyUsage = () => {
        functionCall.message.reply({
          embeds: [
            {
              color: 0xffffff,
              description: `Usage: ${defaultPrefix}search <query>`
            }
          ]
        });
      };

      if (functionCall.args.length) {
        let query = functionCall.args.join(" ");
        let searchResult = await searchChannel(query);

        if (searchResult) {
          if (searchResult.pageInfo.totalResults) {
            functionCall.message.channel.send(
              `https://youtu.be/${searchResult.items[0].id.videoId}`
            );
          } else {
            functionCall.message.reply({
              embeds: [
                {
                  color: 0xffffff,
                  title: "No result"
                }
              ]
            });
          }
        } else {
          functionCall.message.reply({
            embeds: [
              {
                color: 0xffffff,
                title: "This feature is not available"
              }
            ]
          });
        }
      } else replyUsage();
    }
  },
  {
    command: [createCommandString("eval")],
    isDevCommand: true,
    fn(functionCall) {
      functionCall.message.reply("This command is temporary disabled");
      // if (!functionCall.args.length) {
      //   return functionCall.message.reply(`Usage: ${defaultPrefix}eval <code>`);
      // }
      // try {
      //   let evalOutput = JSON.stringify(eval(functionCall.args.join(" ").trim()));
      //   if (evalOutput) await functionCall.message.reply(evalOutput);
      //   else functionCall.message.reply("*(no output)*");
      // } catch (error) {
      //   functionCall.message.reply(error.message);
      // }
    }
  },
  {
    command: [createCommandString("testboost")],
    isDevCommand: true,
    fn(functionCall) {
      let now = new Date().toISOString();
      let oldMember = new GuildMember(
        functionCall.message.client,
        {
          user: functionCall.message.author,
          roles: [],
          joined_at: now,
          deaf: false,
          mute: false
        },
        functionCall.message.guild as Guild
      );
      let newMember = new GuildMember(
        functionCall.message.client,
        {
          user: functionCall.message.author,
          roles: [],
          joined_at: now,
          deaf: false,
          mute: false,
          premium_since: new Date().toISOString()
        },
        functionCall.message.guild as Guild
      );
      functionCall.message.client.emit("guildMemberUpdate", oldMember, newMember);
      functionCall.message.reply("Test boost event emitted");
    }
  },
  {
    command: [createCommandString("bomb")],
    isAdminCommand: true,
    async fn(functionCall) {
      let replyUsage = () => {
        functionCall.message.reply({
          embeds: [
            {
              color: 0xffffff,
              description: `Usage: ${defaultPrefix}bomb <limit> [search]`
            }
          ]
        });
      };

      if (functionCall.args.length) {
        let fetchLimit = parseInt(functionCall.args[0]);

        if (!isNaN(fetchLimit)) {
          let fetchedMessages = await functionCall.message.channel.messages.fetch({
            before: functionCall.message.id,
            limit: fetchLimit
          });

          if (functionCall.args.length > 1) {
            let searchString = functionCall.args.slice(1).join(" ").toLowerCase();
            let matchMessages = fetchedMessages.filter((fetchedMessage) =>
              fetchedMessage.content.trim().toLowerCase().includes(searchString)
            );

            (functionCall.message.channel as TextChannel).bulkDelete(matchMessages);
            functionCall.message.reply(`Deleted ${matchMessages.size} message(s)`);
          } else {
            (functionCall.message.channel as TextChannel).bulkDelete(fetchedMessages);
            functionCall.message.reply(`Deleted ${fetchedMessages.size} message(s)`);
          }
        } else replyUsage();
      } else replyUsage();
    }
  }
];

export default messageCommands;
