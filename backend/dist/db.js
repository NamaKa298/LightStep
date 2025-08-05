"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "LightStepdb",
    password: "erreg5grfsgUIGHIYfg!",
    port: 5432,
});
console.log("Trying to connect with:", {
    user: "postgres",
    host: "localhost",
    database: "LightStepdb",
});
