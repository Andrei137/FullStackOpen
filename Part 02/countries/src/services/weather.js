import axios from 'axios'

const baseUrl = 'http://api.weatherapi.com/v1'
const api_key = import.meta.env.VITE_SOME_KEY

const getWeather = (query) => {
  const request = axios.get(`${baseUrl}/current.json?key=${api_key}&q=${query}`)
  return request.then(response => response.data)
}

export default { getWeather } 