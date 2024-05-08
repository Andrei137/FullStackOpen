const Persons = ({ persons, remove }) => {
  return (
    <div>
      {persons.map(person => {
        return (
          <div key={person.id}>
            <p>{person.name} | {person.number}</p>
            <button onClick={() => remove(person.id)}>delete</button>
          </div>
        )}
      )}
    </div>
  )
}

export default Persons