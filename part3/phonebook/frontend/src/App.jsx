import { useState } from 'react'
import Filter from '../src/components/Filter'
import PersonForm from '../src/components/PersonForm'
import Persons from '../src/components/Persons'
import personService from './services/personService'
import Notification from './components/Notification'
import { useEffect } from 'react'

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  console.log(persons);


  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: '' })
    }, 3000) // Notificación desaparece después de 3 segundos
  }

  const addPerson = (event) => {
    event.preventDefault()

    const personExists = persons.find(person =>
      person.name.toLowerCase() === newName.toLowerCase()
    )

    if (personExists) {
      if (personExists.phone !== newPhone) {
        if (window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )) {
          const updatedPerson = { ...personExists, phone: newPhone }

          personService
            .update(personExists.id, updatedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(person =>
                person.id !== personExists.id ? person : returnedPerson
              ))
              setNewName('')
              setNewPhone('')
              showNotification(`Updated ${newName}'s number`, 'success')
            })
            .catch(error => {
              console.error('Error updating person:', error)
              showNotification(
                `The person '${newName}' was already removed from the server`,
                'error'
              )
              setPersons(persons.filter(p => p.id !== personExists.id))
            })
        }
      } else {
        showNotification(`${newName} is already added to the phonebook with the same number`, 'error')
      }
    } else {
      const personObject = {
        name: newName,
        phone: newPhone
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewPhone('');
          showNotification(`Added ${newName}`, 'success');
        })
        .catch(error => {
          console.error('Error adding person:', error);
          // Mostrar mensaje de error del backend
          showNotification(error.response.data.error, 'error');
        });
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Do you really want to delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showNotification(`Deleted ${person.name}`, 'success')
        })
        .catch(error => {
          console.error('Error deleting person:', error)
          showNotification(`Error deleting ${person.name}`, 'error')
        })
    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new contact</h3>
      <PersonForm addPerson={addPerson} newName={newName} newPhone={newPhone} handlePersonChange={handlePersonChange} handlePhoneChange={handlePhoneChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
