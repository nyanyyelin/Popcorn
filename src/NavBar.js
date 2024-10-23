import { useEffect, useRef } from "react";

const NavBar = ({ children }) => {
  return <nav className="nav-bar">{children}</nav>;
};

const Search = ({ query, onSetQuery }) => {
  const inputEl = useRef(null);

  useEffect(() => {
    const callBack = (e) => {
      if (document.activeElement === inputEl.current) return;
      if (e.code === "Enter") {
        inputEl.current.focus();
        onSetQuery("");
      }
    };
    document.addEventListener("keydown", callBack);
    return () => document.removeEventListener("keydown", callBack);
  }, [onSetQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
      ref={inputEl}
    />
  );
};

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const NumResults = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};

export { NavBar, Search, Logo, NumResults };
