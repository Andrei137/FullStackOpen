const Total = ({ parts }) => <p><b>Number of {parts.reduce((acc, part) => acc + part.exercises, 0)} exercises</b></p>

export default Total 