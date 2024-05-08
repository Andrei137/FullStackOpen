import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import Weather from './components/Weather'
import countryService from './services/countries'
import weatherService from './services/weather'

function App() {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [weather, setWeather] = useState({})

  const handleFilterChange = (event) => setNewFilter(event.target.value)

  const countryHook = () => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }

  const weatherHook = (query) => {
    weatherService
      .getWeather(query)
      .then(weather => {
        setWeather(weather)
      })
      .catch(_ => {
        setWeather({})
      })
  }

  useEffect(countryHook, [])

  const showCountry = (countryName) => setNewFilter(countryName)

  let countriesToShow = newFilter === ''
    ? []
    : countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))

  if (countriesToShow.some(country => country.name.common.toLowerCase() === newFilter.toLowerCase())) {
    countriesToShow = countriesToShow.filter(country => country.name.common.toLowerCase() === newFilter.toLowerCase())
  }

  useEffect(() => {
    if (countriesToShow.length === 1) {
      const country = countriesToShow[0]
      const query = country.capital ? country.capital : country.name.common
      weatherHook(query)
    }
    else if (Object.keys(weather).length !== 0) {
      setWeather({})
    }
  }, [newFilter])

  // if (countriesToShow.length === 1) {
  //   const country = countriesToShow[0]
  //   const query = country.capital ? country.capital : country.name.common
  //   weatherService
  //     .getWeather(query)
  //     .then(weather => {
  //       setWeather(weather)
  //     })
  //     .catch(_ => {
  //       setWeather({})
  //     })
  // }
  // else if (Object.keys(weather).length !== 0) {
  //   setWeather({})
  // }

  return (
    <div>
      <Filter filter={newFilter} handler={handleFilterChange} />
      <Countries countries={countriesToShow} showCountry={showCountry} />
      <Weather weather={weather} />
    </div>
  )
}

export default App
