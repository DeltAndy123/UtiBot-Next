import { Collection } from "discord.js";
import { SlashCommand } from "@lib/commands.ts";

export const commands = new Collection<string, SlashCommand>();