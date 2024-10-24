import { useState } from "react";
import { NavBar, Search, Logo, NumResults } from "./NavBar";
import { MovieList } from "./MovieList";
import Box from "./Box";
import { WatchedSummary, WatchedMovieList } from "./WatchedBox";
import { MovieDetails, Loader, ErrorMessage } from "./MovieDetails";
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // custom hooks
  const { movies, error, isLoading } = useMovie(query);
  // name anything for array
  const [watched, setWatched] = useLocalStorageState([], "watched");

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
