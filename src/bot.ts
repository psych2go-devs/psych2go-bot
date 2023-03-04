import { Client, ClientUser, Intents } from "discord.js";
import messageCreate from "./event/messageCreate";
import guildMemberAdd from "./event/guildMemberAdd";
import guildMemberRemove from "./event/guildMemberRemove";
import guildMemberUpdate from "./event/guildMemberUpdate";
import handlePresence from "./background/handlePresence";
import handleNewVidEvent from "./background/handleNewVidEvent";

// DiscordJS documentations can be found here
// https://discord.js.org/#/docs/main/main/general/welcome

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

  // Handle client presence
  handlePresence(client);

  // Handle new videos
  if (!process.env.DISABLE_CONTENT_FEED) handleNewVidEvent(client);
});

client.on("error", (error: Error) => {
  console.warn(`An error occurred: ${error.message}`);
});

client.on("messageCreate", messageCreate);
client.on("guildMemberAdd", guildMemberAdd);
client.on("guildMemberRemove", guildMemberRemove);
client.on("guildMemberUpdate", guildMemberUpdate);

// Login

client.login(process.env.BOT_TOKEN);
