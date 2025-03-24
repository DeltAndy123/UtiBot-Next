import { Events } from "discord.js";
import { createListener } from "@lib/listeners.ts";
import { registerSlashCommands } from "../lib/commands.ts";
import { commands } from "@lib/storage.ts";

export default createListener({
  event: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);

    // Register slash commands
    await registerSlashCommands(client, Array.from(commands.values()));
  }
})