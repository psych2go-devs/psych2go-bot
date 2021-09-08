import { Message } from "discord.js";

export interface MessageContainFunctionCall {
  message: Message;
  matchedContain: string;
  fromBot: boolean;
  isDev: boolean;
  isAdmin: boolean;
}

export interface MessageContain {
  contain: string[];
  fn(functionCall: MessageContainFunctionCall): any;
  allowBot?: boolean;
  isDevContain?: boolean;
  isAdminContain?: boolean;
}
