import { createSlashCommand } from "@lib/commands.ts";

export default createSlashCommand({
  name: "ping",
  description: "Test the bot's latency",
  async execute(interaction) {
    const initialTime = performance.now();
    await interaction.reply(`Pong! (calculating round trip time...)`);
    const finalTime = performance.now();
    const roundTripTime = finalTime - initialTime;
    await interaction.editReply(`Pong! (${Math.round(roundTripTime)}ms)`);
  },
});