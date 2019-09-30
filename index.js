var express = require('express');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.json());

var PouchDB = require('pouchdb');
var db = new PouchDB('alumnos');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/alumnos', function (req, res) {
    db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
        if (!err) {
            res.status(200).json(doc.rows.map(function (element) {
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
app.get('/alumnos/:id', function (req, res) {
    db.get(req.params.id, function (err, doc) {
        if (!err) {
            res.status(200).json({
                _id: doc._id,
                nombre: doc.nombre,
                apellido: doc.apellido,
                correo: doc.correo,
            });

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
    db.put(alumno, function callback(err, result) {
        if (!err) {
            res.status(201).json(alumno);
        } else {
            res.status(400).json({});
        }
    });
});
app.put('/alumnos/:id', function (req, res) {
    db.get(req.params.id, function (err, doc) {
        if (!err) {
            doc.nombre = req.body.nombre;
            doc.apellido = req.body.apellido;
            doc.correo = req.body.correo;
            db.put(doc, function callback(err, result) {
                if (!err) {
                    res.status(202).json({
                        _id: doc._id,
                        nombre: doc.nombre,
                        apellido: doc.apellido,
                        correo: doc.correo,
                    });
                } else {
                    res.status(400).json({});
                }
            });


        } else {
            res.status(404).json({});
        }
    });
});
app.delete('/alumnos/:id', function (req, res) {
    db.get(req.params.id, function (err, doc) {
        if (!err) {
            db.remove(doc, function callback(err, result) {
                if (!err) {
                    res.status(202).json({});
                } else {
                    res.status(400).json({});
                }
            });
        } else {
            res.status(404).json({});
        }
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});