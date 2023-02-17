import { user } from "../stores";
import type { Merchant } from "../stores";
import { merchant } from "../stores";

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
      console.log("Successfully sent message to webhook of type: ", type);
    });
  } catch (err) {
    console.error(`Error sending message to webhook: ${err}`);
  }
}

export const sendOrderToWebhook = async (merchant: Merchant) => {
  const webhook = import.meta.env.VITE_HOOK_ORDER;
  let items = Object.values(merchant.cart_products).map((item) => {
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

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: merchant.name,
        // avatar_url: "https://i.imgur.com/4M34hi2.png",
        content: `ADDRESS: ${merchant.address.display_name} \nPHONE: ${merchant.phone}`,
        embeds: items,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Successfully sent message to webhook of type: ORDER");
  } catch (error) {
    console.error(`Error sending message to webhook: ${error}`);
  }
};

// export const sendOrderToWebhook = async (merchant: Merchant) => {
//   const webhook = import.meta.env.VITE_HOOK_ORDER;

//   console.log(
//     "DISCORD IMAGE: ",
//     await getImage("/img/categories/shoals/perfume-oil.jpg")
//   );
//   let items = Object.values(merchant.cart_products).map((item) => {
//     return {
//       title: item.title,
//       description: `PRICE: ${item.price}`,
//       color: 32441,
//       image: async () => await getImage(item.image),
//       footer: {
//         text: `QUANTITY: ${item.quantity}`,
//       },
//     };
//   });
//   let customer = {
//     username: merchant.name,
//     // avatar_url: "https://i.imgur.com/4M34hi2.png",
//     content: `ADDRESS: ${merchant.address.display_name} \nPHONE: ${merchant.phone}`,
//     embeds: JSON.stringify(items),
//   };
//   const formData = new FormData();
//   Object.entries(customer).forEach((value) => {
//     formData.append(value[0], value[1]);
//   });

//   try {
//     const response = await fetch(webhook, {
//       method: "POST",
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       body: formData,
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     console.log("Successfully sent message to webhook of type: ORDER");
//   } catch (error) {
//     console.error(`Error sending message to webhook: ${error}`);
//   }
// };
