function createConfig() {
  return {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || "8080",
    NODE_ENV: process.env.NODE_ENV || "development",
  };
}

const config = createConfig();

function getConfig(key) {
  if (!key) {
    return config;
  } else {
    const value = config[key];
    if (!value) {
      throw new Error(`Config key ${key} not found`);
    } else {
      return value;
    }
  }
}

module.exports = {
  getConfig,
};
