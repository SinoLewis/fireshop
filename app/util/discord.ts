import { user } from "../stores";

export async function sendMessageToWebhook(type, message) {
  const webhook =
    type === "ERROR"
      ? import.meta.env.VITE_HOOK_SUPA
      : import.meta.env.VITE_HOOK_REVIEW;
  // const webhook = import.meta.env.VITE_HOOK_REVIEW;
  try {
    user.subscribe(async (user) => {
      const response = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: type === "MAGIC" ? "Magic Login" : undefined,
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
              description: message,
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
      console.log("START DISCORD WEBHOOK: ", webhook);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Successfully sent message to webhook of type: ", type);
    });
  } catch (err) {
    console.error(`Error sending message to webhook: ${err}`);
  }
}
