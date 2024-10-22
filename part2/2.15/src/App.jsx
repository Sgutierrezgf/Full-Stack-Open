import { useState } from 'react'
import Filter from '../src/components/Filter'
import PersonForm from '../src/components/PersonForm'
import Persons from '../src/components/Persons'
import personService from './services/personService'
import { useEffect } from 'react'

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()


    const personExists = persons.find(person =>
      person.name.toLowerCase() === newName.toLowerCase()
    )

    if (personExists) {

      if (personExists.number !== newPhone) {

        if (window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )) {

          const updatedPerson = { ...personExists, number: newPhone }

          personService
            .update(personExists.id, updatedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(person =>
                person.id !== personExists.id ? person : returnedPerson
              ))
              setNewName('')
              setNewPhone('')
            })
            .catch(error => {
              console.error('Error updating person:', error)
              alert(`The person '${newName}' was already removed from the server`)
              setPersons(persons.filter(p => p.id !== personExists.id))
            })
        }
      } else {

        alert(`${newName} is already added to the phonebook with the same number`)
      }
    } else {

      const personObject = {
        name: newName,
        number: newPhone
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewPhone('')
        })
        .catch(error => {
          console.error('Error adding person:', error)
        })
    }
  }

  const deletePerson = (id) => {
    if (window.confirm("Do you really want to delete this contact?")) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error('Error deleting person:', error)
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
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new contact</h3>
      <PersonForm addPerson={addPerson} newName={newName} newPhone={newPhone} handlePersonChange={handlePersonChange} handlePhoneChange={handlePhoneChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
