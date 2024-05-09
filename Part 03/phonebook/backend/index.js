require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const cors = require('cors')

const morgan = require('morgan')
morgan.token('body', request => JSON.stringify(request.body))

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status - :response-time ms :body'))

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.get('/info', (_request, response, next) => {
  Person
    .find({})
    .then(persons => {
      const currentDate = new Date()
      const info =
        `<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${currentDate.toString()}</p>
         </div>`
      response.send(info)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (_request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const phoneRegex = /^\d{2,3}-\d+$/

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (!phoneRegex.test(body.number)) {
    return response.status(400).json({
      error: 'wrong format for phone number'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  console.log('Backend', typeof request.params.id)
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const phoneRegex = /^\d{2,3}-\d+$/

  if (!phoneRegex.test(number)) {
    return response.status(400).json({
      error: 'wrong format for phone number'
    })
  }

  Person
    .findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log('Backend', typeof request.params.id)
  Person
    .findByIdAndDelete(request.params.id)
    .then(_result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler)