import { useEffect, useState } from "react";
import { NavBar, Search, Logo, NumResults } from "./NavBar";
import { MovieList } from "./MovieList";
import Box from "./Box";
import { WatchedSummary, WatchedMovieList } from "./WatchedBox";
import { MovieDetails, Loader, ErrorMessage } from "./MovieDetails";
const KEY = process.env.REACT_APP_KEY;

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  /* 
    
  // loading watched with inital data from localStorage
  // function in the useState() needs to a pure function, which means no argument
  // this will only be look at by React when component first mounts
  */
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(() => {
    const storeValue = localStorage.getItem("watched");
    return JSON.parse(storeValue);
  });

  const handleSelectMovie = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };
  const handleCloseMovie = () => {
    setSelectedId(null);
  };
  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  // Updating localStorage
  // updates the localStorage when movie gets deleted too
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  // component composition to avoid prop drilling
  // useEffect() syncronize UI with the outside world

  useEffect(() => {
    // browser api to prevent race condition
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        // setError(""); // reset the error
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          setIsLoading(false);
          throw new Error("Something wrong with fetching movies.");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        setMovies(data.Search);
        setError("");
      } catch (err) {
        // fetch will throw "AbortError" when req is aborted
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    // close movie when starting a new search
    handleCloseMovie();
    fetchMovies();
    // clean up function to prevent race condition
    return () => {
      controller.abort();
      setError("");
    };
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} onSetQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {error && <ErrorMessage message={error} />}
          {!error && !isLoading && (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectMovie}
              watched={watched}
            />
          )}
          {!error && isLoading && <Loader />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};
