const Countries = ({ countries, showCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (countries.length === 1) {
    const country = countries[0]
    const languages = country.languages ? country.languages : {}
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital ? country.capital : 'unknown'}</p>
        <p>population {country.population ? country.population : 'unknown'}</p>
        <h2>languages</h2>
        <ul>
          {Object.keys(languages).map(language => <li key={language}>{languages[language]}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.name.common} width="100" />
      </div>
    )
  }
  return (
    <div>
      <ul>
        {countries.map(country => (
          <li key={country.name.common}>
            <span>{country.name.common}</span>
            <button onClick={() => showCountry(country.name.common)}>show</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Countries