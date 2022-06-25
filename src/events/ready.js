const { Event } = require("sheweny");

module.exports = class ReadyEvent extends Event {
  constructor(client) {
    super(client, "ready", {
      description: "Client is logged in",
      once: true,
      emitter: client,
    });
  }

  execute() {
    console.log(`${this.client.user.tag} is logged in`)

    this.client.channels.cache.get("894204482580279309").send("Connexion réussi");
  }
};
