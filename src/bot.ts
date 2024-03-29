import { Client, ClientUser, GatewayIntentBits } from "discord.js";
import messageCreate from "./event/messageCreate";
import guildMemberAdd from "./event/guildMemberAdd";
import guildMemberRemove from "./event/guildMemberRemove";
import guildMemberUpdate from "./event/guildMemberUpdate";
import handlePresence from "./background/handlePresence";
import handleNewVidEvent from "./background/handleNewVidEvent";
import onStart from "./event/onStart";

// DiscordJS documentations can be found here
// https://discord.js.org/#/docs/main/main/general/welcome

// Initialize new client

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent
  ]
});

// Handle events

client.on("ready", () => {
  console.log(`Logged in as "${(client.user as ClientUser).tag}"`);

  // Call onStart function
  onStart(client);

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
