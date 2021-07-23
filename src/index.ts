import { config as dotenvConfig } from "dotenv";
import { Client, ClientUser, Intents } from "discord.js";
import { handleMessageCreateEvent } from "./events/messageCreate";
import { handleGuildMemberAddEvent } from "./events/guildMemberAdd";
import { handleGuildMemberRemoveEvent } from "./events/guildMemberRemove";

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
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES
  ]
});

// Handle events

client.on("ready", () => {
  console.log(`Logged in as "${(client.user as ClientUser).tag}"`);
});

client.on("error", (error: Error) => {
  console.warn(`An error occurred: ${error.message}`);
});

client.on("messageCreate", handleMessageCreateEvent);
client.on("guildMemberAdd", handleGuildMemberAddEvent);
client.on("guildMemberRemove", handleGuildMemberRemoveEvent);

// Handle environment variables

if (!process.env.BOT_TOKEN)
  // check if `BOT_TOKEN` environment variable is defined
  destroyClientAndExit();

export const DEV_ROLE_IDS = (
  process.env.DEV_ROLE_ID ? process.env.DEV_ROLE_ID : ""
)
  .split(",")
  .filter((v) => v)
  .map((v) => v.trim());
export const ADMIN_ROLE_IDS = (
  process.env.ADMIN_ROLE_ID ? process.env.ADMIN_ROLE_ID : ""
)
  .split(",")
  .filter((v) => v)
  .map((v) => v.trim());

// Login

client.login(process.env.BOT_TOKEN).catch((error: Error) => {
  console.error(`Error: ${error.message}`); // output an error if there's a problem when logging in
});

// Handle exit signal

process.on("SIGINT", () => {
  console.log("SIGINT received, destroying client...");
  destroyClientAndExit();
});
