const { Client, LocalAuth } = require("whatsapp-web.js");
const { watchFile } = require("fs");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    // headless: false,
    args: ["--no-sandbox"],
  },
});
client.initialize();
client.on("qr", (qr) => qrcode.generate(qr, { small: true }));
client.on("ready", () => console.log("Client is ready!"));

setTimeout(() => {
  console.log(!!client.pupPage);
  client.pupPage.on("response", async (response) => {
    const stuff = [response.url(), response.status(), await response.text()];
    console.log(
      ...stuff.map((thing) =>
        thing.length > 300 ? `${thing.slice(0, 30)}...` : thing
      )
    );
  });
}, 2000);

let currentFn = undefined;

const loadFile = (current, previous) => {
  if (currentFn) client.removeListener("message_create", currentFn);
  delete require.cache[require.resolve(`./onMessage.js`)];
  if (currentFn) console.log("Reloaded file");
  currentFn = (message) => require(`./onMessage.js`).callback(message, client);
  client.on("message_create", currentFn);
};
watchFile("onMessage.js", loadFile);
loadFile();
