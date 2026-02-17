const DISCORD_EPOCH = 1420070400000n;

module.exports.timestampToSnowflake = function timestampToSnowflake(date) {
  return ((BigInt(date.getTime()) - DISCORD_EPOCH) << 22n).toString();
}