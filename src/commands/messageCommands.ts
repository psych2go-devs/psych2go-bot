import { Message } from "discord.js";

interface MessageCommand {
  command: string;
  fn: (message: Message) => any;
}

interface MessageCommands {
  userCommands: Array<MessageCommand>;
  adminCommands: Array<MessageCommand>;
}

// all commands should have lower case

export const messageCommands: MessageCommands = {
  userCommands: [
    {
      command: "hi psi",
      fn: (message: Message) => {
        message.reply("hey psych2goer!");
      }
    }
  ],
  adminCommands: [
    {
      command: "test admin",
      fn: (message: Message) => {
        message.reply("Test passed, you are an admin!");
      }
    }
  ]
};
