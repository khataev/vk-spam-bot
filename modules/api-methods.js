class ApiMethods {
  static async getGroupMembers(groupId, count) {
    const settings = require("./config");
    const api = require("node-vk-bot-api/lib/api");
    try {
      let response = await api("groups.getMembers", {
        access_token: settings.get("credentials.vk.client_access_token"),
        group_id: groupId,
        count: count
      });

      return response.response;
    } catch (e) {
      console.log(e);
    }
  }

  static sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}

// (async () => {
//   const apiMethods = require("./modules/api-methods");
//   const members = await apiMethods.getGroupMembers("vkcoinqitix", 5);
//   console.log(members.items);
// })();

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

module.exports = ApiMethods;
