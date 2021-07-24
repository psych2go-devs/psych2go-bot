import { GuildEmoji, Message } from "discord.js";

interface MessageContain {
  contain: Array<string>;
  fn: (message: Message, match: string) => any;
}
interface MessageContains extends Array<MessageContain> {}

export const messageContains: MessageContains = [
  {
    contain: ["cookie"],
    fn: (message) => {
      message.react("🍪");
    }
  },
  {
    contain: ["psi"],
    fn: (message) => {
      let matchedPsiEmojis = message.client.emojis.cache.filter(
        (emoji) => (emoji.name as string).toLowerCase() === "psi"
      );

      if (matchedPsiEmojis.size) {
        let psiEmoji = matchedPsiEmojis.first() as GuildEmoji;

        message.react(psiEmoji);
      }
    }
  }
];
