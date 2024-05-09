import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({
    name: '', number: ''
  })
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationColor, setNotificationColor] = useState('green')

  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newPerson.name)) {
      const result = window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)

      if (result) {
        const person = persons.find(person => person.name === newPerson.name)
        const changedPerson = {...person, number: newPerson.number}


        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setNewPerson({ name: '', number: '' })
            setNotification(`Updated ${returnedPerson.name}`)
            setTimeout(() => {          
              setNotification(null)        
            }, 5000)
            setNotificationColor('green')
          })
          .catch(error => {
            setNotification(error.response.data.error)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setNotificationColor('red')
          })
      }
    }
    else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewPerson({ name: '', number: '' })
          setNotification(`Added ${returnedPerson.name}`)
          setTimeout(() => {          
            setNotification(null)        
          }, 5000)
          setNotificationColor('green')
        })
        .catch(error => {
          setNotification(error.response.data.error)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setNotificationColor('red')
        })
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    personService
      .remove(id)
      .then(_ => {
        setPersons(persons.filter(p => p.id !== id))
        setNotification('Deleted ' + person.name)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setNotificationColor('green')
      })
      .catch(error => {
        setNotification(error.response.data.error)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setNotificationColor('red')
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  const handleNameChange = (event) => setNewPerson({ ...newPerson, name: event.target.value })
  const handlePhoneChange = (event) => setNewPerson({ ...newPerson, number: event.target.value })
  const handleFilterChange = (event) => setNewFilter(event.target.value)

  const personsToShow = newFilter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const handlers = {
    name: handleNameChange,
    number: handlePhoneChange
  }

  return (
    <div>
      <Notification message={notification} color={notificationColor} />

      <h2>Phonebook</h2>
      <Filter filter={newFilter} handler={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm person={newPerson} submit={addPerson} handlers={handlers} />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} remove={deletePerson} />
    </div>
  )
}

export default App