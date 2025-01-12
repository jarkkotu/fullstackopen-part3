const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('body', function getBody (req) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } 
    else {
        return ' '
    }
})

app.use(express.json())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const date = new Date()
    const html = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
    response.send(html)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if (!request.body) {
        return response.status(400).json({ error: 'content missing'})
    }
    if (!request.body.name) {
        return response.status(400).json({ error: 'name missing'})
    }
    if (!request.body.number) {
        return response.status(400).json({ error: 'number missing'})
    }
    if (persons.find(person => person.name === request.body.name)) {
        return response.status(400).json({ error: 'name must be unique'})
    }

    const person = {
        id: generateId(),
        name: request.body.name,
        number: request.body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})