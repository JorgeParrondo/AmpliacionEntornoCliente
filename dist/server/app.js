"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, db_1.initDB)();
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db_1.db.run('INSERT INTO users(name,email) VALUES(?,?)', [name, email], function (err) {
        if (err)
            return res.status(500).send(err);
        res.send({ id: this.lastID });
    });
});
app.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    db_1.db.run('UPDATE users SET name=?,email=? WHERE id=?', [name, email, req.params.id], err => {
        if (err)
            return res.status(500).send(err);
        res.sendStatus(200);
    });
});
app.get('/users/:id', (req, res) => {
    db_1.db.get('SELECT * FROM users WHERE id=?', [req.params.id], (e, r) => res.send(r));
});
app.post('/books', (req, res) => {
    const { title, genre } = req.body;
    db_1.db.run('INSERT INTO books(title,genre,available) VALUES(?,?,1)', [title, genre], function (err) {
        if (err)
            return res.status(500).send(err);
        res.send({ id: this.lastID });
    });
});
app.get('/books/genre/:g', (req, res) => {
    db_1.db.all('SELECT * FROM books WHERE genre=?', [req.params.g], (e, r) => res.send(r));
});
app.get('/books/:id/availability', (req, res) => {
    db_1.db.get('SELECT available FROM books WHERE id=?', [req.params.id], (e, r) => res.send(r));
});
app.post('/loans', (req, res) => {
    const { userId, bookId, dueDate } = req.body;
    db_1.db.run('INSERT INTO loans(userId,bookId,dueDate,returned) VALUES(?,?,?,0)', [userId, bookId, dueDate], function (err) {
        if (err)
            return res.status(500).send(err);
        db_1.db.run('UPDATE books SET available=0 WHERE id=?', [bookId]);
        res.send({ id: this.lastID });
    });
});
app.post('/returns/:id', (req, res) => {
    db_1.db.run('UPDATE loans SET returned=1 WHERE id=?', [req.params.id], err => {
        if (err)
            return res.status(500).send(err);
        res.sendStatus(200);
    });
});
app.get('/loans/notreturned', (req, res) => {
    db_1.db.all('SELECT * FROM loans WHERE returned=0', [], (e, r) => res.send(r));
});
app.get('/loans/returned/:uid', (req, res) => {
    db_1.db.all('SELECT * FROM loans WHERE returned=1 AND userId=?', [req.params.uid], (e, r) => res.send(r));
});
app.get('/loans/expired', (req, res) => {
    db_1.db.all("SELECT * FROM loans WHERE returned=0 AND date(dueDate)<date('now')", [], (e, r) => res.send(r));
});
app.get('/loans/notexpired', (req, res) => {
    db_1.db.all("SELECT * FROM loans WHERE returned=0 AND date(dueDate)>=date('now')", [], (e, r) => res.send(r));
});
app.listen(3000, () => console.log('Server running'));
