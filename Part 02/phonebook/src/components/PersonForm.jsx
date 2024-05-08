import PersonInput from './PersonInput'

const PersonForm = ({ person, submit, handlers }) => {
  return (
    <form onSubmit={submit}>
      <PersonInput text='name' value={person.name} handler={handlers.name}/>
      <PersonInput text='number' value={person.number} handler={handlers.number}/>
      <div><button type="submit">add</button></div>
    </form>
  );
}

export default PersonForm