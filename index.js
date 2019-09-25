
var express = require('express');
var cors = require('cors');
var app = express();
app.use(express.json());
app.use(cors())

var PouchDB = require('pouchdb');
var db = new PouchDB('alumnos');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/alumnos', function (req, res) {
    db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
        if (!err && docs.total_rows > 0) {
            res.status(200).json(docs.rows.map(function (element) {
                return {
                    _id: element.doc._id,
                    nombre: element.doc.nombre,
                    apellido: element.doc.apellido,
                    correo: element.doc.correo,
                };
            }));
        } else {
            res.status(404).json({});
        }
    });
});

app.post('/alumnos', function (req, res) {
    var alumno = {
        _id: new Date().getTime().toString(),
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo
    };
    db.put(alumno, function(err, result) {
        if (!err) {
            res.status(201).json(alumno);
        } else {
            res.status(400).json({});
        }
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});