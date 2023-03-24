import { GuildEmoji } from "discord.js";
import { MessageContain } from "../interface/MessageContain";
import splitEnvStringToArray from "../lib/splitEnvStringToArray";
import { decideCookieReaction } from "../lib/transformersClient";

const messageContains: MessageContain[] = [
  {
    contain: ["cookie"],
    async fn({ message }) {
      if (process.env.TRANSFORMERS_SERVER_ADDRESS) {
        let decision = await decideCookieReaction(message.content);

        if (decision.id) message.react("🍪");
      } else message.react("🍪");
    }
  },
  {
    contain: ["candy", "candies"],
    fn({ message }) {
      if (process.env.CANDY_REACTION) message.react("🍬");
    }
  },
  {
    contain: ["psi"],
    fn({ message }) {
      if (
        !splitEnvStringToArray(process.env.EXCLUDED_PSI_REACTION_CHANNEL_IDS).includes(
          message.channelId
        )
      ) {
        let matchedPsiEmojis = message.client.emojis.cache.filter(
          (emoji) => (emoji.name as string).toLowerCase() === "psi"
        );

        if (matchedPsiEmojis.size) {
          let psiEmoji = matchedPsiEmojis.first() as GuildEmoji;

          message.react(psiEmoji);
        }
      }
    }
  },
  {
    contain: ["i love psi", "i love you psi"],
    fn({ message }) {
      message.react("❤");
    }
  }
];

export default messageContains;
