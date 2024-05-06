import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Anecdote = ({ title, anecdote }) => {
  return (
    <>
      <h2>{title}</h2>
      <p>{anecdote}</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))

  const findBestIndex = () => {
    let bestIndex = 0
    for (let i = 1; i < points.length; i++) {
      if (points[i] > points[bestIndex]) {
        bestIndex = i
      }
      else if (points[i] === points[bestIndex] && anecdotes[i].length > anecdotes[bestIndex].length) {
        bestIndex = i
      }
    }
    return bestIndex
  }

  const getRandomAnecdote = (length) => () => setSelected(Math.floor(Math.random() * length))
  const vote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  return (
    <div>
      <Anecdote title='Anecdote of the day' anecdote={anecdotes[selected]} />
      <p>has {points[selected]} votes</p>
      <Button handleClick={vote} text='vote'/>
      <Button handleClick={getRandomAnecdote(anecdotes.length)} text='next anecdote' />
      <Anecdote title='Anecdote with most votes' anecdote={anecdotes[findBestIndex()]} />
    </div>
  )
}

export default App