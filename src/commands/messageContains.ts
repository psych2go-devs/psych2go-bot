import { Message } from "discord.js";

interface MessageContain {
  contain: Array<string>;
  fn: (message: Message) => void | boolean;
}
interface MessageContains extends Array<MessageContain> {}

// all contain messages should have lower case

export const messageContains: MessageContains = [
  {
    contain: ["cookie", "testcookie"],
    fn: (message: Message) => {
      message.channel.send("Someone say cookie? here's some cookie :cookie:");
    }
  }
];
