import { config as dotenvConfig } from "dotenv";
import { Client, ClientUser, Intents, Snowflake } from "discord.js";
import { handleMessageEvent } from "./events/messageCreate";
import { handleGuildMemberAddEvent } from "./events/guildMemberAdd";

dotenvConfig(); // read environment variables from .env file

// DiscordJS documentations can be found here
// https://discord.js.org/#/docs/main/master/general/welcome

// Define functions

export const destroyClientAndExit = (exitCode: number = 0) => {
  client.destroy();
  process.exit(exitCode);
};

// Initialize new client

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

// Handle events

client.on("ready", () => {
  console.log(`Logged in as "${(client.user as ClientUser).tag}"`);
});

client.on("error", (error: Error) => {
  console.warn(`An error occurred: ${error.message}`);
});

client.on("messageCreate", handleMessageEvent);
client.on("guildMemberAdd", handleGuildMemberAddEvent);

// Handle environment variables

if (!process.env.BOT_TOKEN)
  // check if `BOT_TOKEN` environment variable is defined
  destroyClientAndExit();

export const ADMIN_ROLE_ID = (
  process.env.ADMIN_ROLE_ID ? process.env.ADMIN_ROLE_ID : ""
) as Snowflake;

// Login

client.login(process.env.BOT_TOKEN).catch((error: Error) => {
  console.error(`Error: ${error.message}`); // output an error if there's a problem when logging in
});

// Handle exit signal

process.on("SIGINT", () => {
  console.log("SIGINT received, destroying client...");
  destroyClientAndExit();
});
