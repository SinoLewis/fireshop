import fs from "node:fs";
import path from "node:path";
import { Client, GatewayIntentBits, Events } from "discord.js";
// import { updateOrder, cancelOrder, getOrderIds } from "./utils/supabase";
// import { token } from "./config.json";
// const fs = require("node:fs");
// const path = require("node:path");
// const { Client, GatewayIntentBits, Events } = require("discord.js");
const { token } = require("./config.json");
const {
  updateOrder,
  cancelOrder,
  getOrderIds,
} = require("./utils/supabase.ts");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file: any) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args: any) => event.execute(...args));
  } else {
    client.on(event.name, (...args: any) => event.execute(...args));
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "hello") {
    let name = interaction.options.getString("name");
    await interaction.reply({
      content: `Sundress from zenith: ${name} \n Delivery Testin`,
      ephemeral: true,
    });
  }

  if (interaction.commandName === "delivery") {
    let id = interaction.options.getString("order-id");
    let price = interaction.options.getNumber("delivery-price");
    let data = await updateOrder(id, price);
    await interaction.reply({
      content: `Delivery PRICE: ${data.delivery_price} \n Delivery APPROVED: ${data.approved} \n User Name: ${data.name} \n User Phone: ${data.phone} `,
      ephemeral: true,
    });
  }
  if (interaction.commandName === "cancel") {
    let id = interaction.options.getString("order-id");
    let data = await cancelOrder(id);
    await interaction.reply({
      content: `Delivery CANCELLED  for ORDER: ${id} \nDelivery APPROVED: ${data.approved} \n User Name: ${data.name} \n User Phone: ${data.phone} `,
      ephemeral: true,
    });
  }
});

client.on("messageCreate", async (message: any) => {
  // Check if the message is from a specific channel or user if needed
  // For example:
  // if (message.channel.id !== 'YOUR_CHANNEL_ID') return;
  // if (message.author.bot) return;
  const ids = await getOrderIds();
  const found = ids.find((data: any) => message.content.includes(data.id));
  // Check the content of the message
  if (found) {
    // At least one ID exists in the message content
    if (message.content.includes(found.id)) {
      const channel = message.channel;
      const messages = await channel.messages.fetch({ limit: 100 });
      let index = 1;
      messages.forEach((msg: any) => {
        // Check if previous messages have the specified string
        console.log(`MSG ${index++}: `, msg.id);
        if (msg.content.includes(found.id) && msg.id !== message.id) {
          // Delete the previous messages
          msg.delete().catch(console.error);
        }
      });
    }

    console.log("Found matching ID in message content", found);
  } else {
    // No IDs found in the message content
    console.log("No matching ID found in message content", found);
  }
  console.log("Message detected");
});

client.on("error", (err: any) => {
  console.log(err.message);
});

client.login(token);
