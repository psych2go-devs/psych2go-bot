import { Message } from "discord.js";

interface MessageCommand {
  command: string;
  fn: (message: Message, argv: string[]) => any;
}

interface MessageCommands {
  userCommands: Array<MessageCommand>;
  adminCommands: Array<MessageCommand>;
}

export const messageCommands: MessageCommands = {
  userCommands: [
    {
      command: "hi psi",
      fn: (message, argv) => {
        if (!argv.length) message.reply("hey psych2goer!");
      }
    }
  ],
  adminCommands: [
    {
      command: "test admin",
      fn: (message, argv) => {
        message.reply("Test passed, you are an admin!");
      }
    }
  ]
};
