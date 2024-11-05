/* eslint-disable react/prop-types */

function Persons({ personsToShow, deletePerson }) {
    return (
        <div> {
            personsToShow.map(person =>
                <p key={person.name}>{person.name} - {person.phone} <button onClick={() => deletePerson(person.id)}>delete</button></p>
            )
        }</div>
    )
}

export default Persons