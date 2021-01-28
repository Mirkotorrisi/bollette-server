const redis = require("redis");
const config = require("config");
const client = redis.createClient({
  url: config.get("redis_url"),
});

client.on("error", function (error) {
  console.error(error);
});

module.exports = client;
