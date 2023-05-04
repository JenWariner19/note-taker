const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const { readFromFile } = require('./helpers/fsUtils')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add note`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err,data) => {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            } else {
              const parsedNotes = JSON.parse(data);
              parsedNotes.push(newNote);
        
              fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes), (writeErr) => {
              err
                ? console.error(writeErr)
                : console.log(`Note for ${newNote.title} has been written to JSON file`)
                return res.json('added task');
              }
            );
            }
    });
}
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);