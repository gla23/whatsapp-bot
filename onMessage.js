let i = 0;
const start = new Date();

exports.callback = async (message, client) => {
  if (message.fromMe) {
    if (message.body === "status")
      client.sendMessage(message.to, "Up since " + start);
    if (message.body === "ping") client.sendMessage(message.to, "pong " + i++);

    const chat = await message.getChat();
    if (message.body === "archive") setTimeout(() => chat.archive(), 2000);
    return console.log(message.body);
  }

  if (message.body === "ping") client.sendMessage(message.from, "pong");
  if (message.body === "bot")
    client.sendMessage(message.from, "Yes this is a bot");
  if (message.notifyName === "Amaris Andersen")
    client.sendMessage(
      message.from,
      message.body
        .split("")
        .map((l) => l + l)
        .join("")
    );
  if (message.notifyName === "City Football Thursdays") {
    const chat = await message.getChat();
    if (message.body.includes("George")) setTimeout(() => chat.archive(), 2000);
  }
  console.log(`${message.body} from ${message.notifyName}`);
};
