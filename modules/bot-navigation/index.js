const RootOption = require("./root/index");
const Context = require("./context");
const settings = require("./../config");
const api = require("node-vk-bot-api/lib/api");

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
          let response;
          try {
            response = await bot.execute("groups.getMembers", {
              group_id: "vkcoinqitix",
              count: 10
            });
            console.log(response);
          } catch (e) {
            console.log(e);
          }

          // response = await bot.execute("users.get", {
          //   user_ids: 35549534
          // });

          // console.log(response);

          // response = await api("users.get", {
          //   user_ids: 35549534,
          //   access_token: settings.get("credentials.bot.access_token")
          // });

          // let bot = new VkBot({
          //   token: settings.get("credentials.bot.access_token"),
          //   group_id: settings.get("credentials.vk.group_id"),
          //   secret: settings.get("credentials.vk.secret"),
          //   confirmation: settings.get("credentials.vk.confirmation")
          // });
          // let resp = await bot.execute("users.get", {
          //   user_ids: 35549534
          // });
          // response = await api("users.get", {
          //   user_ids: 35549534,
          //   access_token: settings.get("credentials.bot.access_token"),
          //   v: "5.103"
          // });

          // (async () => {
          //   const VkBot = require("node-vk-bot-api");
          //   const settings = require("./modules/config");
          //   try {
          //     let bot = new VkBot({
          //       token: settings.get("credentials.bot.access_token"),
          //       group_id: settings.get("credentials.vk.group_id")
          //     });
          //     await bot.startPolling(() => {
          //       console.log("Bot started.");
          //     });
          //   } catch (e) {
          //     console.log(e);
          //   }
          // })();

          // (async () => {
          //   const settings = require("./modules/config");
          //   const api = require("node-vk-bot-api/lib/api");
          //   try {
          //     // let response = await api("users.get", {
          //     //   user_ids: 35549534,
          //     //   access_token: settings.get("credentials.bot.access_token"),
          //     //   v: "5.92"
          //     // });
          //     let response = await api("groups.getMembers", {
          //       access_token: settings.get("credentials.bot.access_token"),
          //       group_id: "vkcoinqitix",
          //       count: 10
          //     });

          //     console.log(response.response);
          //   } catch (e) {
          //     console.log(e);
          //   }
          // })();

          bot.sendMessage(vkId, text);
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

  async function getResult() {
    const settings = require("./modules/config");
    const api = require("node-vk-bot-api/lib/api");
    try {
      // let response = await api("users.get", {
      //   user_ids: 35549534,
      //   access_token: settings.get("credentials.bot.access_token"),
      //   v: "5.92"
      // });
      let response = await api("groups.getMembers", {
        access_token: settings.get("credentials.bot.access_token"),
        group_id: 190290420,
        count: 10
      });

      console.log(response.response);
    } catch (e) {
      console.log(e);
    }
  }
};

module.exports = BotNavigation;
