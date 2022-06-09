function createConfig() {
  return {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || "8080",
    NODE_ENV: process.env.NODE_ENV || "development",
    SECRET_KEY: process.env.SECRET_KEY || "secret",
    OUTLOOK_EMAIL: process.env.OUTLOOK_EMAIL,
    OUTLOOK_PASSWORD: process.env.OUTLOOK_PASSWORD,
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
