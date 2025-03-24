import { Events } from "discord.js";
import { createListener } from "@lib/listeners.ts";
import { commands } from "@lib/storage.ts";

export default createListener({
  event: Events.InteractionCreate,
  execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);
    if (!command) {
      interaction.reply({
        content: "Command not found",
        ephemeral: true,
      });
      return;
    }
    try {
      command.execute(interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
})