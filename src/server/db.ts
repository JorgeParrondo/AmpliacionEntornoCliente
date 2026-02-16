import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('library.db');

export function initDB(){

db.serialize(()=>{

db.run(`CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY,
name TEXT,
email TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS books(
id INTEGER PRIMARY KEY,
title TEXT,
genre TEXT,
available INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS loans(
id INTEGER PRIMARY KEY,
userId INTEGER,
bookId INTEGER,
dueDate TEXT,
returned INTEGER
)`);

});
}
