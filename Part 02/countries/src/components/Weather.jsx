const Weather = ({ weather }) => {
  if (Object.keys(weather).length === 0) {
    return null
  }

  return (
    <div>
      <h2>Weather in {weather.location.name}</h2>
      <p>temperature {weather.current.temp_c} Celcius</p>
      <img src={weather.current.condition.icon} alt={weather.current.condition.text} width="100" />
      <p>wind {Math.round((weather.current.wind_mph * 0.44704) * 100) / 100} m/s</p>
    </div>
  )
}

export default Weather