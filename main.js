const { Client, LocalAuth } = require("whatsapp-web.js");
const { watchFile } = require("node:fs");
const qrcode = require("qrcode-terminal");

const client = new Client({ authStrategy: new LocalAuth() });
client.initialize();
client.on("qr", (qr) => qrcode.generate(qr, { small: true }));
client.on("ready", () => console.log("Client is ready!"));

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
