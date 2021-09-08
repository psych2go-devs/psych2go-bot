import { GuildEmoji } from "discord.js";
import { MessageContain } from "../interface/MessageContain";

const messageContains: MessageContain[] = [
  {
    contain: ["cookie"],
    fn(functionCall) {
      functionCall.message.react("🍪");
    }
  },
  {
    contain: ["psi"],
    fn(functionCall) {
      let matchedPsiEmojis = functionCall.message.client.emojis.cache.filter(
        (emoji) => (emoji.name as string).toLowerCase() === "psi"
      );

      if (matchedPsiEmojis.size) {
        let psiEmoji = matchedPsiEmojis.first() as GuildEmoji;

        functionCall.message.react(psiEmoji);
      }
    }
  },
  {
    contain: ["i love psi", "i love you psi"],
    fn(functionCall) {
      functionCall.message.react("❤");
    }
  }
];

export default messageContains;
