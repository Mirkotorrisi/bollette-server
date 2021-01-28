const redis = require("redis");
const config = require("config");
const client = redis.createClient({
  url: config.get("redis_url"),
  retry_strategy: function (options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  },
});
client.on("connect", function () {
  console.log("Redis Connected");
});

client.on("error", function (err) {
  console.log(err);
});

module.exports = client;
