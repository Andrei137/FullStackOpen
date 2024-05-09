const PersonInput = ({ text, value, handler }) => <div>{text}: <input value={value} onChange={handler} /></div>

export default PersonInput