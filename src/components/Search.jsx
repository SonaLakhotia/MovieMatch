import React from 'react'

const Search = ({searchMovie, setSearchMovie}) => {
  return (
    <div className='search'>
      <div>
        <img src='./search.svg' alt='search icon'/>
        <input
          type='text'
          placeholder='Search for movies'
          value={searchMovie}
          onChange={(event) => setSearchMovie(event.target.value)}
        />
      </div>

    </div>
    
  )
}

export default Search