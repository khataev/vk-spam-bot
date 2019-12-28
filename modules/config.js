const convict = require("convict");

// Define a schema
const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  shared: {
    admins: {
      doc: "List of admins vk ids",
      format: Array,
      default: [],
      env: "SHARED_ADMINS"
    }
  },
  credentials: {
    bot: {
      access_token: {
        doc: "Access token for bot",
        format: String,
        default: "",
        env: "CREDENTIALS_BOT_ACCESS_TOKEN"
      },
      use_webhooks: {
        doc: "Webhooks or Long polling (default)",
        format: Boolean,
        default: false,
        env: "CREDENTIALS_BOT_USE_WEBHOOKS"
      }
    },
    vk: {
      group_id: {
        doc: "Id of a Group bot is bound to",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_GROUP_ID"
      },
      secret: {
        doc: "Secret key",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_SECRET"
      },
      confirmation: {
        doc: "Confirmation",
        format: String,
        default: "",
        env: "CREDENTIALS_VK_CONFIRMATION"
      },
      utils_short_link_url: {
        doc: "Short link url api",
        format: "url",
        default: "",
        env: "CREDENTIALS_VK_UTILS_SHORT_LINK_URL"
      }
    }
  },
  debug: {
    log_level: {
      doc: "Log level",
      format: function check(val) {
        regexp = /debug|info|warn|error|fatal/i;
        if (!regexp.test(val)) {
          throw new Error(`Unpermitted log level: ${val}`);
        }
      },
      default: "info",
      env: "DEBUG_LOG_LEVEL"
    },
    url: {
      doc: "Debug url",
      format: "url",
      default: "http://localhost:9001",
      env: "DEBUG_URL"
    }
  }
});

// Load environment dependent configuration
let env = config.get("env");
config.loadFile("./config/" + env + ".json");

// Perform validation
config.validate({ allowed: "strict" });

// custom functions
config.isProductionEnv = function() {
  return this.get("env") === "production";
};

config.isDevelopmentEnv = function() {
  return this.get("env") === "development";
};

module.exports = config;
