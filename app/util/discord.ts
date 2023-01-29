export async function sendMessageToWebhook(type, message) {
  const webhook =
    type === "ERROR"
      ? import.meta.env.VITE_HOOK_SUPA
      : import.meta.env.VITE_HOOK_REVIEW;
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Successfully sent message to webhook");
  } catch (err) {
    console.error(`Error sending message to webhook: ${err}`);
  }
}
