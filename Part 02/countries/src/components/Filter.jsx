const Filter = ({ filter, handler }) => {
  return (
    <form>
      <div>find countries<input value={filter} onChange={handler} /></div>
    </form>
  )
}

export default Filter