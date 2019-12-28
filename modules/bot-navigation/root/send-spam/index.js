const Markup = require("node-vk-bot-api/lib/markup");
const MenuOption = require("../../menu-option");
const BackMenuOption = require("./back-menu-option");

class SendSpam extends MenuOption {
  async chatMessage(botCtx) {
    return `
    Введите сообщение для рассылки
    `;
  }

  async beforeReply(botCtx) {
    botCtx.session.chattedContext = {
      chatAllowed: true,
      sendSpam: true
    };
  }

  get buttonMarkup() {
    return Markup.button("📨 Послать спам", "primary", {
      button: this.triggerButton
    });
  }

  menu(botCtx) {
    return [[new BackMenuOption(this.ctx, this)]];
  }

  get triggerButton() {
    return "send_spam_button";
  }
}

module.exports = SendSpam;
