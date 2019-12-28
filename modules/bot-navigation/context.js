const settings = require("./../config"); // TODO: global settings in context

class Context {
  constructor(bot) {
    this.bot = bot;
    this.replies = {};
  }

  getUserId(botCtx) {
    return botCtx && botCtx.message && botCtx.message.from_id;
  }

  isAdmin(botCtx) {
    const admins = settings.get("shared.admins");
    return admins.includes(this.getUserId(botCtx).toString());
  }

  payloadButton(botCtx) {
    return (
      botCtx &&
      botCtx.message &&
      botCtx.message.payload &&
      JSON.parse(botCtx.message.payload).button
    );
  }

  findResponsibleItem(botCtx) {
    // console.log("Context#findResponsibleItem. botCtx:", botCtx);
    console.log(
      "Context#findResponsibleItem. payloadButton:",
      this.payloadButton(botCtx)
    );
    if (this.replies[this.payloadButton(botCtx)])
      console.log("Context#findResponsibleItem. item found");

    return this.replies[this.payloadButton(botCtx)];
  }

  // TODO: rename to registerMenuOption
  registerReply(menuOption) {
    let error;

    if (!menuOption.triggerButton) {
      error = `No triggerButton for menuOption: ${menuOption}`;
    } else if (!menuOption.reply) {
      error = `No reply for menuOption: ${menuOption}`;
    }

    if (error) {
      console.error("errored menuOption:", menuOption);
      throw new Error(error);
    }

    console.log(`Context#registerReply. registered:`, menuOption.triggerButton);
    this.replies[menuOption.triggerButton] = menuOption;
  }

  async sendMessageToAdmins(text) {
    const admins = settings.get("shared.admins");
    for (let index = 0; index < admins.length; index++) {
      const vkId = admins[index];
      await this.bot.sendMessage(vkId, text);
    }
  }
}

module.exports = Context;
