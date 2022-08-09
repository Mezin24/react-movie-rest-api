import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [showMovies, setShowMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setError] = useState(false);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await fetch(
        'https://react-http-65b90-default-rtdb.firebaseio.com/movies.json'
      );

      if (!res.ok) {
        throw new Error(res.status);
      }

      const data = await res.json();

      const loadedMovies = [];

      for (let [key, value] of Object.entries(data)) {
        loadedMovies.push({
          id: key,
          title: value.title,
          releaseDate: value.releaseDate,
          openingText: value.openingText,
        });
      }

      setShowMovies(loadedMovies);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setError(true);
    }
  }, []);

  async function addMovieHandler(movie) {
    const res = await fetch(
      'https://react-http-65b90-default-rtdb.firebaseio.com/movies.json',
      {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-type': 'applicetion/json',
        },
      }
    );

    const data = await res.json();
    console.log(data);
  }

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const loading = isLoading ? <p>Loading...</p> : null;
  const errorMessage = err ? <p>Sorry, something went wrong...</p> : null;
  const content = !(isLoading || errorMessage) ? (
    <MoviesList movies={showMovies} />
  ) : null;
  const banner = !(showMovies.length !== 0 || isLoading || err) ? (
    <p>Fetch some movies</p>
  ) : null;

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
        {banner}
        {loading}
        {errorMessage}
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
