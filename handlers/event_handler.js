const { Client } = require('../start/dependencies');
const fs = require('fs');

/**
   *
   * @param {Client} client
   */

module.exports = (client) => {
    try {
        fs.readdirSync("./eventos/").forEach((file) => {
            const events = fs.readdirSync("./eventos/").filter((file) =>
              file.endsWith(".js")
            );
            for (let file of events) {
              let pull = require(`../eventos/${file}`);
              if (pull.name) {
                client.events.set(pull.name, pull);
              }
            }
            console.log((`${file}  Events Loaded Successfullly`));
          });
    } catch (e) {
        console.log(e.message);
    }
}