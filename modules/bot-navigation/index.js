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
          let response = await apiMethods.getGroupMembers(170260355, 1000);
          // const members = [
          //   35549534,
          //   506750342,
          //   468240791,
          //   341313305,
          //   202701313,
          //   546930532,
          //   489528558,
          //   403539329,
          //   449385818,
          //   328068939,
          //   518759500,
          //   470179868,
          //   558203823
          // ];
          let members = [162187337, 294932462];
          console.log("Found members:", members);

          // let members = response.items.slice(0, 100);
          // await bot.sendMessage(members, text);

          // members = response.items.slice(100);
          // await bot.sendMessage(members, text);

          for (let i = 0; i < members.length; i++) {
            let memberVkId = members[i];
            console.log(`Sending message (${text}) to ${memberVkId}`);
            try {
              await bot.sendMessage(memberVkId, text);
              // await apiMethods.sleep(100);
            } catch (e) {
              console.log("hmmm:", e.message);
            }
          }
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
