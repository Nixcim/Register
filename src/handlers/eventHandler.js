const { client } = global;
const { readdir } = require("fs");

readdir("./src/events", (err, files) => {
  if (err) return console.error(err);
  files
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      let prop = require(`../events/${file}`);
      if (!prop.conf) return;
      client.on(prop.conf.event, prop);
      console.log(`Etkinlik - ${prop.conf.name} Yüklendi`);
    });
});