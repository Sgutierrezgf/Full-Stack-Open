require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PhoneBook = require('./models/phonebook');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get('/api/persons', (request, response, next) => {
    PhoneBook.find({})
        .then(phones => response.json(phones))
        .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    if (!body.name || !body.phone) {
        return response.status(400).json({ error: 'Name or number is missing' });
    }

    const newPerson = new PhoneBook({
        name: body.name,
        phone: body.phone,
    });

    newPerson.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
    const { id } = request.params;
    const { phone } = request.body;

    console.log('Updating person with ID:', id);
    console.log('New phone number:', phone);

    if (!phone) {
        return response.status(400).json({ error: 'Phone number is missing' });
    }

    PhoneBook.findByIdAndUpdate(
        id,
        { phone },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson);
            } else {
                response.status(404).json({ error: 'Person not found' });
            }
        })
        .catch(error => next(error));
});
app.get('/api/persons/:id', (request, response, next) => {
    PhoneBook.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).send({ error: 'Person not found' });
            }
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
    PhoneBook.findByIdAndDelete(request.params.id)
        .then(result => {
            if (result) {
                response.status(204).end();
            } else {
                response.status(404).send({ error: 'Person not found' });
            }
        })
        .catch(error => next(error));
});


app.use((error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted ID' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
});

app.use((error, request, response, next) => {
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    next(error);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
