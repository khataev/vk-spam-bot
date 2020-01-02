const RootOption = require("./root/index");
const Context = require("./context");
const settings = require("./../config");
const apiMethods = require("./../api-methods");

const BotNavigation = function(bot) {
  let context = new Context(bot);
  let rootOption = new RootOption(context);

  bot.command("начать", async ctx => {
    ctx.reply(...(await rootOption.reply(ctx)));
    await context.findOrCreateAccount(ctx);
    rootOption.registerReplies(ctx);
  });

  // TODO: refactor
  const adminId = settings.get("shared.admins")[0] || 0;
  rootOption.registerReplies({
    message: { from_id: adminId }
  });

  // TODO: refactor
  bot.on(async ctx => {
    // HINT: beforeReply FIRST (maybe could improve?)
    // in order to cancel chat (back button)
    const menuItem = context.findResponsibleItem(ctx);
    let transitionAllowed;
    if (menuItem) {
      transitionAllowed = await menuItem.transitionAllowed(ctx);
      if (transitionAllowed) await menuItem.beforeProcess(ctx);
    }

    const vkId = context.getUserId(ctx);

    const chattedContext = ctx.session.chattedContext || {};
    if (chattedContext.chatAllowed) {
      if (chattedContext.sendSpam) {
        const text = ctx && ctx.message && ctx.message.text;
        if (text) {
          let response = await apiMethods.getGroupMembers("vkcoinqitix", 1);
          const members = response.items;
          members.forEach(memberVkId => bot.sendMessage(memberVkId, text));
        }
      }
      return;
    }

    // menu navigation response
    // const menuItem = context.findResponsibleItem(ctx);
    if (!menuItem) return;

    // const transitionAllowed = await menuItem.transitionAllowed(ctx);
    if (transitionAllowed) {
      await menuItem.beforeReply(ctx);
      ctx.reply(...(await menuItem.reply(ctx)));
    } else {
      // HINT: negative scenario could be played via negative reply?
      bot.sendMessage(vkId, menuItem.forbiddenTransitionChatMessage(ctx));
    }
  });
};

module.exports = BotNavigation;
