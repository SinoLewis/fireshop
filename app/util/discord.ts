import { Cart, Destination, user } from "../stores";
import type { Order } from "../stores";

export async function sendMessageToWebhook(type, message) {
  let webhook;
  if (type === "ERROR") webhook = import.meta.env.VITE_HOOK_SUPA;
  if (type === "AUTH") webhook = import.meta.env.VITE_HOOK_AUTH;
  if (type === "REVIEW") webhook = import.meta.env.VITE_HOOK_REVIEW;

  try {
    user.subscribe(async (user) => {
      const response = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // username: type === "MAGIC" ? "Magic Login" : undefined,
          // avatar_url: "https://i.imgur.com/4M34hi2.png",
          // content: type,
          embeds: [
            {
              author: {
                name: user ? user.email : "No USER",
                // url: "https://www.reddit.com/r/cats/",
                icon_url:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRc7YDpfe7-KRj1Y7JAP5R73L-RLKcLTWbEjWQ84B2&s",
              },
              title: type,
              // url: "https://google.com/",
              description: JSON.stringify(message),
              color: 32441,
              fields: [
                {
                  name: "AUTH",
                  value: user ? user.email : "No USER",
                  inline: true,
                },
                // {
                //   name: "Thanks!",
                //   value: "You're welcome :wink:",
                // },
              ],
              thumbnail: {
                url: "https://w7.pngwing.com/pngs/150/908/png-transparent-monkey-d-luffy-one-piece-roronoa-zoro-portgas-d-ace-animation-one-piece-manga-cartoon-one-piece.png",
              },
              // image: {
              //   url: "https://w7.pngwing.com/pngs/150/908/png-transparent-monkey-d-luffy-one-piece-roronoa-zoro-portgas-d-ace-animation-one-piece-manga-cartoon-one-piece.png",
              // },
              footer: {
                text: user ? `AUTH: ${user.aud}` : "No AUTH",
                // icon_url: "https://i.imgur.com/fKL31aD.jpg",
              },
            },
          ],
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      //  TEST
      // console.log("Successfully sent message to webhook of type: ", type);
    });
  } catch (err) {
    console.error(`Error sending message to webhook: ${err}`);
  }
}

export const sendOrderToWebhook = async (
  order: Order,
  cart: Cart,
  destination: Destination
) => {
  // TODO: update webook to PROD channel
  // const webhook = import.meta.env.VITE_HOOK_ORDER;
  const webhook = import.meta.env.VITE_HOOK_TESTIN;
  let items: any = Object.values(cart.cart_products).map((item) => {
    return {
      title: item.title,
      description: `PRICE: ${item.price}`,
      color: 32441,
      image: {
        url: item.image,
      },
      footer: {
        text: `QUANTITY: ${item.quantity}`,
      },
    };
  });
  let details = [
    {
      title: "Delivery Details",
      // description: `PRICE: Dummy Price`,
      color: 12586019,
      fields: [
        {
          name: "ADDRESS",
          value: `${destination?.label}`,
          inline: true,
        },
        {
          name: "PHONE",
          value: `${order.phone}`,
          inline: true,
        },
      ],
    },
  ];
  const data = details.concat(items);
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: order.name,
        // avatar_url: "https://i.imgur.com/4M34hi2.png",
        content: `${order.id}`,
        // content: `ORDER ID: **${order.id}** \n ADDRESS: **${order.address.display_name}** \nPHONE: **${order.phone}**`,
        embeds: data,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    //  TEST
    // console.log("Successfully sent message to webhook of type: ORDER");
  } catch (error) {
    console.error(`Error sending message to webhook: ${error}`);
  }
};
