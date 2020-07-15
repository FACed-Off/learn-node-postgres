const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const db = new pg.Pool();

module.exports = db;
