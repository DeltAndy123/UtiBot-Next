import {
  Awaitable,
  ChatInputCommandInteraction,
  Client,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder,
} from "discord.js";

export interface SlashCommand {
  name: string;
  description: string;
  guildId?: string;
  execute: (interaction: ChatInputCommandInteraction) => Awaitable<void>;
}

export function createSlashCommand(command: SlashCommand) {
  return command;
}

export function isSlashCommand(
  obj: unknown,
): obj is SlashCommand {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "description" in obj &&
    "execute" in obj &&
    (typeof obj.name === "string") &&
    (typeof obj.description === "string") &&
    (typeof obj.execute === "function")
  );
}


function processSlashCommands(
  commands: SlashCommand[],
): Map<string, RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
  const commandMap = new Map<
    string,
    RESTPostAPIChatInputApplicationCommandsJSONBody[]
  >();

  for (const command of commands) {
    const commandData = new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description)
      .toJSON();

    if (command.guildId) {
      commandMap.set(command.guildId, [
        ...(commandMap.get(command.guildId) || []),
        commandData,
      ]);
    } else {
      commandMap.set("global", [
        ...(commandMap.get("global") || []),
        commandData,
      ]);
    }
  }

  return commandMap;
}

export async function registerSlashCommands(
  client: Client<true>,
  commands: SlashCommand[],
) {
  const rest = new REST().setToken(client.token);

  try {
    console.log("Registering slash commands...");
    const commandMap = processSlashCommands(commands);
    for (const [guildId, commandData] of commandMap.entries()) {
      if (guildId === "global") {
        await rest.put(
          Routes.applicationCommands(client.user.id),
          { body: commandData },
        );
      } else {
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, guildId),
          { body: commandData },
        );
      }
    }
    console.log("Slash commands registered successfully.");
  } catch (e) {
    console.error("Error registering slash commands:", e);
  }
}
