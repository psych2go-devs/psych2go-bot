import { Message } from "discord.js";

interface MessageContain {
  contain: Array<string>;
  fn: (message: Message, match: string) => void | boolean;
}
interface MessageContains extends Array<MessageContain> {}

// all contain messages should have lower case

export const messageContains: MessageContains = [
  {
    contain: ["cookie"],
    fn: (message: Message, match: string) => {
      message.channel.send("Someone say cookie? here's some cookie :cookie:");
    }
  }
];
