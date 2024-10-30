/* eslint-disable react/prop-types */

function PersonForm({ newName, newPhone, handlePersonChange, handlePhoneChange, addPerson }) {
    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input value={newName} onChange={handlePersonChange} />
            </div>
            <div>
                phone: <input value={newPhone} onChange={handlePhoneChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm