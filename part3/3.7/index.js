const express = require('express')
const morgan = require('morgan');
const app = express()

app.use(express.json());
app.use(morgan('tiny'));

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
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Name or number is missing' });
    }


    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ error: 'Name must be unique' });
    }

    const newPerson = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number,
    };


    persons = persons.concat(newPerson);
    response.json(newPerson);
});

app.get('/info', (request, response) => {
    const personCount = persons.length;
    const currentTime = new Date();

    response.send(`
        <p>PhoneBook has info for ${personCount} people</p>
        <p>${currentTime}</p>
    `);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).send({ error: 'Person not found' });
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port  ${PORT}`);

})
