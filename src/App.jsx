import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { countSearch, getTrendingMovies } from './appwrite'

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchMovie, setSearchMovie] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [movies, setMovies] = useState([])
  const [debounceSearch, setDebounceSearch] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([])

  // using the optimized search
  useDebounce(() => setDebounceSearch(searchMovie), 500, [searchMovie])

  const fetchMovies = async (query) => {
    setIsLoading(true)
    setError('')
    try{
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)
      if(!response.ok){
        throw new Error("There is an error fetching the movies")
      }
      
      const data = await response.json()
      if(data === null){
        setError("Error fetching movies")
        setMovies([])
        return
      }

      setMovies(data.results || [])

      if(query && data.results.length > 0){
        await countSearch(query, data.results[0])
      }
  
    }catch(error){
      console.log(`Error fetching the movie data ${error}`)
      setError(`There is an error fetching movie data ${error}`)
    }finally{
      setIsLoading(false)
    }
  }

  const fetchTrendingMovies = async () => {
    try{
      const result = await getTrendingMovies();
      setTrendingMovies(result)
    }catch(error){
      console.log("There is an error fetching the trending movies");
    }
  }

  useEffect(() =>{
    fetchMovies(debounceSearch);
  }, [debounceSearch])

  useEffect(() => {
    fetchTrendingMovies();
  }, [])

  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Header Banner'/>
          <h1><span className='text-gradient'>Great Movies </span></h1>
          <Search searchMovie={searchMovie} setSearchMovie={setSearchMovie}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index +1}</p>
                  <img src={movie.poster_url} alt='poster url'/>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>
          {isLoading ? 
            <Spinner/>
           : error ? (<p className='text-red-500'>{error}</p>) 
            :(<ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App