import { ClientUser, Guild, GuildMember, TextChannel, APIEmbed, MessageFlags } from "discord.js";
import type { MessageCommand } from "../interface/MessageCommand";
import createCommandString from "../lib/createCommandString";
import defaultPrefix from "../lib/defaultMessageCommandPrefix";
import { formatPluralKitMessage } from "../lib/templateMessages";
import hotlines from "../asset/hotlines.json";
import rules from "../asset/rules.json";
import _ from "lodash";
import { execSync } from "child_process";
import searchChannel from "../lib/searchChannel";
import getInspirationalQuotes from "../lib/getInspirationalQuotes";
import { getAdviceSlip } from "../lib/getAdviceSlip";
import { latestAssistStore } from "../lib/assistCache";
import moment from "moment";

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
                value: `\`\`\`${defaultPrefix}inspire\n${defaultPrefix}adviceslip\n${defaultPrefix}hotline(s) [country|page]\n${defaultPrefix}rule <search query>\n${defaultPrefix}search <query>\n${defaultPrefix}did [user...]\n${defaultPrefix}help\n${defaultPrefix}[version|ver]\n${defaultPrefix}credit(s)\`\`\``,
                inline: true
              },
              {
                name: "Staff commands",
                value: `\`\`\`${defaultPrefix}say <message>\n[DISABLED] ${defaultPrefix}eval\n${defaultPrefix}testboost\`\`\``,
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
            let embedMessage: APIEmbed = {
              color: 0xffffff,
              description: `**${hotline.name} :flag_${hotline.flag}:**\n\n${hotline.lines
                .map((line) => "- " + line)
                .join("\n")}`
            };

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
          let countriesEmbedMessage: APIEmbed = {
            color: 0xffffff,
            description: `**List of countries [1/${chunkedHotlines.length}]**\n\n`
          };

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
              description: `Usage: ${defaultPrefix}rule <search query>`
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
                name: ":globe_with_meridians: Server maintenance/provider",
                value: "- Noxturnix"
              },
              {
                name: ":white_heart: Special thanks",
                value: "- Psych2Go community staff\n- Project contributors"
              },
              {
                name: ":tools: Source code",
                value: "[GitHub](https://github.com/psych2go-devs/psych2go-bot)"
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
    command: [createCommandString("inspire")],
    async fn(functionCall) {
      let inspirationalQuotes = await getInspirationalQuotes();

      functionCall.message.channel.send({
        embeds: [
          {
            color: 0xffffff,
            title: "Some random inspirational quote for you",
            description: inspirationalQuotes.content,
            footer: {
              text: `- ${inspirationalQuotes.author}`
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
    command: [createCommandString("adviceslip")],
    async fn(functionCall) {
      let slipMessage = functionCall.message.channel.send({
        embeds: [
          {
            color: 0xffffff,
            title: "PRINTING SLIP..."
          }
        ]
      });

      let adviceSlip = await getAdviceSlip();

      (await slipMessage).edit({
        embeds: [
          {
            color: 0xffffff,
            title: "ADVICE SLIP",
            description: adviceSlip.advice.toUpperCase(),
            footer: {
              text: moment.utc().format("MMMM Do YYYY h:mm:ss A z").toUpperCase()
            }
          }
        ]
      });
    }
  },
  {
    command: [createCommandString("assist"), createCommandString("aid")],
    async fn(functionCall) {
      let authorId = functionCall.message.author.id;
      let cooldownExpireTime = moment.utc();
      let onCooldown = false;

      if (process.env.ENABLE_ASSIST_COMMAND) {
        if (latestAssistStore.has(authorId)) {
          let latestAssist = moment.utc(latestAssistStore.get(authorId));

          cooldownExpireTime = latestAssist.add(30, "m"); // Hardcoded cooldown to 30 minutes.

          if (cooldownExpireTime.isAfter(moment.utc())) onCooldown = true;
        }

        if (!onCooldown) {
          let generalChannel = functionCall.message.client.channels.cache.get(
            process.env.GENERAL_CHANNEL_ID as string
          );

          if (!(generalChannel === undefined)) {
            latestAssistStore.set(authorId, moment.utc().valueOf());

            (generalChannel as TextChannel).send({
              embeds: [
                {
                  color: 0xffffff,
                  description: `<@${functionCall.message.author.id}> needs comfort in peer support, would you like to check in?`
                }
              ]
            });

            setTimeout(
              () =>
                functionCall.message.reply(
                  "Hi! If you are looking for someone to listen or wish to vent in dms, please use `!!support` command to ping peer supporters instead."
                ),
              1e3 * 60 * 5 // 5 minutes
            );
          } else {
            functionCall.message.reply({
              embeds: [
                {
                  color: 0xffffff,
                  description:
                    "An error ocurred: Cannot find general channel. Please report this issue to staff team."
                }
              ]
            });
          }
        } else {
          functionCall.message.reply({
            embeds: [
              {
                color: 0xffffff,
                description: `Sorry, you are on cooldown! Please wait ${cooldownExpireTime.toNow(
                  true
                )} before using the command again.`
              }
            ]
          });
        }
      } else {
        functionCall.message.reply({
          embeds: [
            {
              color: 0xffffff,
              description: "Sorry! This function is not enabled at this moment."
            }
          ]
        });
      }
    }
  },
  {
    command: [createCommandString("say")],
    isStaffCommand: true,
    fn(functionCall) {
      let replyUsage = () => {
        functionCall.message.reply({
          embeds: [
            {
              color: 0xffffff,
              description: `Usage: ${defaultPrefix}say <message>`
            }
          ]
        });
      };

      if (functionCall.args.length) {
        functionCall.message.channel.send(functionCall.args.join(" "));
      } else replyUsage();
    }
  },
  {
    command: [createCommandString("eval")],
    isStaffCommand: true,
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
    isStaffCommand: true,
    fn(functionCall) {
      let now = new Date().toISOString();
      let oldMember = Reflect.construct(GuildMember, [
        functionCall.message.client,
        {
          user: functionCall.message.author,
          roles: [],
          joined_at: now,
          deaf: false,
          mute: false
        },
        functionCall.message.guild as Guild
      ]) as GuildMember;
      let newMember = Reflect.construct(GuildMember, [
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
      ]) as GuildMember;
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
