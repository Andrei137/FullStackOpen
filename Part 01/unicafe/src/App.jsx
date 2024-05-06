import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticsLine = ({ text, value }) => {
  value = Math.round(value * 10) / 10
  if (text === 'positive') {
    value += ' %'
  }
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr> 
  );
}

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  const getAverage = () => {
    return (good - bad) / total
  }
  const getPositivePercentage = () => {
    return (good / total) * 100
  }

  if (total === 0) {
    return <p>No feedback given</p>
  }

  return (
    <>
    <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticsLine text='good' value={good} />
          <StatisticsLine text='neutral' value={neutral} />
          <StatisticsLine text='bad' value={bad} />
          <StatisticsLine text='all' value={total} />
          <StatisticsLine text='average' value={getAverage()} />
          <StatisticsLine text='positive' value={getPositivePercentage()} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => {
    setGood(good + 1)
  }

  const incrementNeutral = () => {
    setNeutral(neutral + 1)
  }

  const incrementBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Header text='give feedback' />
      <Button handleClick={incrementGood} text='good' />
      <Button handleClick={incrementNeutral} text='neutral' />
      <Button handleClick={incrementBad} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
