import {config as dotenvConfig} from "dotenv";
import {Client, ClientUser, Intents} from "discord.js";

dotenvConfig(); // read environment variables from .env file

// DiscordJS documentations can be found here
// https://discord.js.org/#/docs/main/stable/general/welcome

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as "${(client.user as ClientUser).tag}"`);
});

client.on("error", (error: Error) => {
  console.warn(`An error occurred: ${error.message}`);
});

if (process.env.BOT_TOKEN)
  // check if `BOT_TOKEN` environment variable is defined
  client.login(process.env.BOT_TOKEN).catch((error: Error) => {
    console.error(`Error: ${error.message}`); // output an error if there's a problem when logging in
  });
else {
  console.error("Environment variable `BOT_TOKEN` is not defined");
  client.destroy();
}

process.on("SIGINT", () => {
  console.log("SIGINT received, destroying client...");
  client.destroy();
  process.exit(0);
});
