import express from 'express';
import { db, initDB } from './db';

const app = express();
app.use(express.json());

initDB();


// ---------- ALTAS USUARIO ----------
app.post('/users', (req, res) => {

try{

const {name,email} = req.body;

if(!name || !email) throw "Datos incompletos";
if(name[0] !== name[0].toUpperCase())
throw "El nombre debe empezar por mayúscula";

db.run(
'INSERT INTO users(name,email) VALUES(?,?)',
[name,email],
function(err){
if(err) return res.status(500).send(err);
res.send({id:this.lastID});
});

}catch(e){
res.status(400).send(e);
}

});


// ---------- MODIFICAR USUARIO ----------
app.put('/users/:id',(req,res)=>{

try{

const {name,email}=req.body;

if(name[0]!==name[0].toUpperCase())
throw "Nombre debe empezar por mayúscula";

db.run(
'UPDATE users SET name=?,email=? WHERE id=?',
[name,email,req.params.id],
err=>{
if(err) return res.status(500).send(err);
res.sendStatus(200);
});

}catch(e){
res.status(400).send(e);
}

});


// ---------- CONSULTAR USUARIO ----------
app.get('/users/:id',(req,res)=>{
db.get(
'SELECT * FROM users WHERE id=?',
[req.params.id],
(e,r)=>res.send(r)
);
});


// ---------- ALTA LIBRO ----------
app.post('/books',(req,res)=>{

try{

const {title,genre}=req.body;

if(title.length<3)
throw "Titulo debe tener mas de 3 caracteres";

db.run(
'INSERT INTO books(title,genre,available) VALUES(?,?,1)',
[title,genre],
function(err){
if(err) return res.status(500).send(err);
res.send({id:this.lastID});
});

}catch(e){
res.status(400).send(e);
}

});


// ---------- LIBROS POR GENERO ----------
app.get('/books/genre/:g',(req,res)=>{
db.all(
'SELECT * FROM books WHERE genre=?',
[req.params.g],
(e,r)=>res.send(r)
);
});


// ---------- DISPONIBILIDAD ----------
app.get('/books/:id/availability',(req,res)=>{
db.get(
'SELECT available FROM books WHERE id=?',
[req.params.id],
(e,r)=>res.send(r)
);
});


// ---------- REGISTRO PRESTAMO ----------
app.post('/loans',(req,res)=>{

try{

const {userId,bookId,dueDate}=req.body;

db.get(
'SELECT available FROM books WHERE id=?',
[bookId],
(e,r:any)=>{

if(r.available===0)
return res.status(400).send("Libro no disponible");

db.run(
'INSERT INTO loans(userId,bookId,dueDate,returned) VALUES(?,?,?,0)',
[userId,bookId,dueDate],
function(err){

db.run(
'UPDATE books SET available=0 WHERE id=?',
[bookId]
);

res.send({id:this.lastID});

});

});

}catch(e){
res.status(400).send(e);
}

});


// ---------- NO DEVUELTOS ----------
app.get('/loans/notreturned',(req,res)=>{
db.all(
'SELECT * FROM loans WHERE returned=0',
[],
(e,r)=>res.send(r)
);
});


// ---------- HISTORICO POR SOCIO ----------
app.get('/loans/returned/:uid',(req,res)=>{
db.all(
'SELECT * FROM loans WHERE returned=1 AND userId=?',
[req.params.uid],
(e,r)=>res.send(r)
);
});


// ---------- VENCIDOS ----------
app.get('/loans/expired',(req,res)=>{
db.all(
"SELECT * FROM loans WHERE returned=0 AND date(dueDate)<date('now')",
[],
(e,r)=>res.send(r)
);
});


// ---------- NO VENCIDOS ----------
app.get('/loans/notexpired',(req,res)=>{
db.all(
"SELECT * FROM loans WHERE returned=0 AND date(dueDate)>=date('now')",
[],
(e,r)=>res.send(r)
);
});


// ---------- DEVOLUCION ----------
app.post('/returns/:id',(req,res)=>{

try{

db.get(
'SELECT bookId FROM loans WHERE id=?',
[req.params.id],
(e,r:any)=>{

db.run(
'UPDATE loans SET returned=1 WHERE id=?',
[req.params.id]
);

db.run(
'UPDATE books SET available=1 WHERE id=?',
[r.bookId]
);

res.sendStatus(200);

});

}catch(e){
res.status(400).send(e);
}

});


app.listen(3000,()=>console.log("Server running"));
