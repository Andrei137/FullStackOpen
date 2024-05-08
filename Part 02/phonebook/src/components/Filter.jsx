const Filter = ({ filter, handler }) => {
  return (
    <form>
      <div>filter shown with<input value={filter} onChange={handler} /></div>
    </form>
  )
}

export default Filter