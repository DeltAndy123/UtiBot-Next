import "jsr:@std/dotenv/load";
import { Client, GatewayIntentBits } from "discord.js";
import { isListener } from "@lib/listeners.ts";
import { isSlashCommand } from "@lib/commands.ts";
import { commands } from "@lib/storage.ts";


const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent
  ]
});

async function initializeListeners(directory: string) {
  for (const dirEntry of Deno.readDirSync(directory)) {
    if (dirEntry.isDirectory) {
      await initializeListeners(`${directory}${dirEntry.name}/`);
    } else if (dirEntry.isFile && dirEntry.name.endsWith(".ts")) {
      const listenerModule: Record<string, unknown> = await import(`${directory}${dirEntry.name}`);
      const listener = listenerModule.default;
      if (isListener(listener) && listener.event && listener.execute) {
        if (listener.once) {
          client.once(listener.event, (...args) => listener.execute(...args));
        } else {
          client.on(listener.event, (...args) => listener.execute(...args));
        }
      }
    }
  }
}
console.log("Initializing listeners...");
await initializeListeners("./listeners/");
console.log("Listeners initialized.");

async function initializeCommands(directory: string) {
  for (const dirEntry of Deno.readDirSync(directory)) {
    if (dirEntry.isDirectory) {
      await initializeCommands(`${directory}${dirEntry.name}/`);
    } else if (dirEntry.isFile && dirEntry.name.endsWith(".ts")) {
      const commandModule: Record<string, unknown> = await import(`${directory}${dirEntry.name}`);
      const command = commandModule.default;
      if (isSlashCommand(command)) {
        commands.set(command.name, command);
      }
    }
  }
}
console.log("Initializing commands...");
await initializeCommands("./commands/");
console.log("Commands initialized.");


client.login(Deno.env.get("TOKEN"));