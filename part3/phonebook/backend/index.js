require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const app = express()
const PhoneBook = require('./models/phonebook')

app.use(express.json());
app.use(cors())
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    PhoneBook.find({}).then(phones => {
        response.json(phones)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.phone) {
        return response.status(400).json({ error: 'Name or number is missing' });
    }

    const newPerson = new PhoneBook({
        name: body.name,
        phone: body.phone,
    });

    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson);
        })
        .catch(error => response.status(500).json({ error: 'An error occurred' }));
});

// app.get('/info', (request, response) => {
//     const personCount = persons.length;
//     const currentTime = new Date();

//     response.send(`
//         <p>PhoneBook has info for ${personCount} people</p>
//         <p>${currentTime}</p>
//     `);
// });

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    PhoneBook.findById(id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).send({ error: 'Person not found' });
            }
        })
        .catch(error => next(error)); // Envía el error al manejador de errores
});

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    PhoneBook.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                response.status(204).end();
            } else {
                response.status(404).send({ error: 'Person not found' });
            }
        })
        .catch(error => next(error)); // Envía el error al manejador de errores
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port  ${PORT}`);

})
