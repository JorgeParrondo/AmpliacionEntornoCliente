"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDB = initDB;
const sqlite3_1 = __importDefault(require("sqlite3"));
exports.db = new sqlite3_1.default.Database('library.db');
function initDB() {
    exports.db.serialize(() => {
        exports.db.run(`CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY,
name TEXT,
email TEXT
)`);
        exports.db.run(`CREATE TABLE IF NOT EXISTS books(
id INTEGER PRIMARY KEY,
title TEXT,
genre TEXT,
available INTEGER
)`);
        exports.db.run(`CREATE TABLE IF NOT EXISTS loans(
id INTEGER PRIMARY KEY,
userId INTEGER,
bookId INTEGER,
dueDate TEXT,
returned INTEGER
)`);
    });
}
