import { Message } from "discord.js";

export interface MessageCommandFunctionCall {
  message: Message;
  args: string[];
  matchedCommand: string;
  fromBot: boolean;
  isStaff: boolean;
  isAdmin: boolean;
}

export interface MessageCommand {
  command: string[];
  fn(functionCall: MessageCommandFunctionCall): any;
  allowBot?: boolean;
  ignoreCase?: boolean;
  isStaffCommand?: boolean;
  isAdminCommand?: boolean;
}
