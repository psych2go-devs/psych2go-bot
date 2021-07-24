import { GuildEmoji, Message } from "discord.js";

export const handlerMessages = (message: Message) => {
  let msgLower = message.content.trim().toLowerCase();

  if (
    msgLower.includes("p") &&
    msgLower.includes("s") &&
    msgLower.includes("i")
  ) {
    let matchedPsiEmojis = message.client.emojis.cache.filter(
      (emoji) => (emoji.name as string).toLowerCase() === "psi"
    );

    if (matchedPsiEmojis.size) {
      let psiEmoji = matchedPsiEmojis.first() as GuildEmoji;

      message.react(psiEmoji);
    }
  }
};
