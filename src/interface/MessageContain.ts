import { Message } from "discord.js";

export interface MessageContainFunctionCall {
  message: Message;
  matchedContain: string;
  fromBot: boolean;
  isStaff: boolean;
  isAdmin: boolean;
}

export interface MessageContain {
  contain: string[];
  fn(functionCall: MessageContainFunctionCall): any;
  allowBot?: boolean;
  isStaffContain?: boolean;
  isAdminContain?: boolean;
}
