import { useState, useEffect } from "react";
const KEY = process.env.REACT_APP_KEY;

export const useMovie = (query) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    // handleCloseMovie();
    fetchMovies();
    // clean up function to prevent race condition
    return () => {
      controller.abort();
      setError("");
    };
  }, [query]);

  return { movies, isLoading, error };
};
