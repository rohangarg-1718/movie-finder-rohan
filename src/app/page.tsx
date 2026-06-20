"use client";

import { useEffect, useMemo, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { FaHeart } from "react-icons/fa";

import Link from "next/link";

import Navbar from "@/components/Navbar";


const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const MOVIES_PER_PAGE = 12;

type Movie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
};

export default function Home() {
  const [query, setQuery] = useState("Batman");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { favorites, toggleFavorite } = useFavorites();

  const fetchMovies = async (searchText: string) => {
    if (!searchText.trim()) {
      setMovies([]);
      setError("Start typing to search movies.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCurrentPage(1);

      const requests = [1, 2, 3].map((page) =>
        fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchText}&type=movie&page=${page}`
        ).then((res) => res.json())
      );

      const results = await Promise.all(requests);

      const mergedMovies = results
        .flatMap((data) => data.Search || [])
        .filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.imdbID === movie.imdbID)
        );

      if (mergedMovies.length === 0) {
        setMovies([]);
        setError("No movies found. Try searching something else.");
        return;
      }

      setMovies(mergedMovies);
    } catch {
      setMovies([]);
      setError("Something went wrong while fetching movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const visibleMovies = useMemo(() => {
    const start = (currentPage - 1) * MOVIES_PER_PAGE;
    return movies.slice(start, start + MOVIES_PER_PAGE);
  }, [movies, currentPage]);

  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);

  return (
    <main className="relative min-h-screen px-6 pt-28 pb-8 text-white overflow-hidden">
      <Navbar />
      <div className="mx-auto max-w-7xl">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#7c3aed40,transparent_50%)]" />

        <section className="py-20 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-amber-400">
            DISCOVER • WATCH • EXPLORE
          </p>

          <h1 className="text-6xl md:text-7xl font-black leading-tight">
            Find Your Next
            <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              Movie Obsession
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
            Browse trending movies, discover hidden gems and save your favorites.
          </p>
        </section>

        <div className="mb-16 flex justify-center gap-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-purple-400">
              1000+
            </h3>
            <p className="text-zinc-500">
              Movies
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-bold text-amber-400">
              Fast
            </h3>
            <p className="text-zinc-500">
              Search
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-bold text-fuchsia-400">
              Favorites
            </h3>
            <p className="text-zinc-500">
              Saved
            </p>
          </div>
        </div>

        <div className="mx-auto mb-10 max-w-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-lg backdrop-blur-xl transition focus:border-amber-400 focus:bg-white/10 outline-none"
          />
        </div>

        {loading && (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-3xl bg-white/10"
              />
            ))}
          </section>
        )}
        {!loading && error && (
          <p className="py-20 text-center text-xl text-amber-300">
            🎬 No movies found. Try another search.
          </p>
        )}

        {!loading && !error && (
          <>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {visibleMovies.map((movie) => (
                <Link
                  href={`/movie/${movie.imdbID}`}
                  key={movie.imdbID}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(168,85,247,0.35)]"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(movie.imdbID);
                    }}
                    className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-3"
                  >
                    <FaHeart
                      className={
                        favorites.includes(movie.imdbID)
                          ? "text-red-500"
                          : "text-white"
                      }
                    />
                  </button>
                  <div className="absolute left-3 top-3 z-10 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-black">
                    IMDb
                  </div>
                  <img
                    src={
                      movie.Poster !== "N/A"
                        ? movie.Poster
                        : "https://placehold.co/400x600?text=No+Poster"
                    }
                    alt={movie.Title}
                    className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="p-5">
                    <h3 className="line-clamp-1 text-lg font-bold">
                      {movie.Title}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-400">
                      Released: {movie.Year}
                    </p>
                  </div>
                </Link>
              ))}
            </section>

            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="rounded-full border border-white/10 px-6 py-3 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-zinc-400">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}

        <footer className="mt-24 border-t border-white/10 pt-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="text-center md:text-left">
                <h3 className="bg-gradient-to-r from-purple-400 to-amber-300 bg-clip-text text-lg md:text-2xl font-bold text-transparent">
                  MovieFinder
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  Discover, explore and save your favorite movies.
                </p>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-zinc-500">
                  Built with Next.js, TypeScript & OMDb API
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-300">
                  Built for Jeevan — Rohan Garg
                </p>

                <p className="text-xs text-zinc-600 mt-3">
                  © 2026 MovieFinder. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}