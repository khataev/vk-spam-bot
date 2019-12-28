const MenuOption = require("./../menu-option");
const SendSpam = require("./send-spam");

class RootOption extends MenuOption {
  chatMessage(botCtx) {
    return "✌ Вы находитесь в главном меню.";
  }

  // TODO: do we need 2 params in ctor: (this.ctx, this)?
  menu(botCtx) {
    const menu = [];

    if (this.ctx.isAdmin(botCtx)) menu.push([new SendSpam(this.ctx, this)]);

    return menu;
  }

  get triggerButton() {
    return "root_button";
  }
}

module.exports = RootOption;
