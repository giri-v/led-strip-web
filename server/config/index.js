//require('dotenv').config();

const config = {
  server: {
    hostname: "192.168.0.13", //process.env.SERVER_HOSTNAME,
    port: 3000 //process.env.SERVER_PORT,
  },
  jwt: {
    secret: "privatekey" //process.env.JWTSECRET,
  },
  database: {
    url: "" //process.env.DATABASE_URL,
  }
};

module.exports = config;
