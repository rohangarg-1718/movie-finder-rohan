import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export default async function MovieDetails({ params }: Props) {
  const { id } = await params;

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`,
    { cache: "no-store" }
  );

  const movie = await res.json();

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#7c3aed55,transparent_35%)]" />

      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-block rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-300 transition hover:border-amber-400 hover:text-amber-300"
        >
          Back to search
        </Link>

        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:grid-cols-2 md:p-10">
          <img
            src={
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://placehold.co/500x750?text=No+Poster"
            }
            alt={movie.Title}
            className="h-[620px] w-full rounded-3xl object-cover shadow-2xl transition duration-700 hover:scale-[1.02]"
          />

          <div className="flex flex-col justify-center">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-400">
              Movie Details
            </p>

            <h1 className="mb-5 text-5xl font-black leading-tight md:text-6xl">
              {movie.Title}
            </h1>

            <div className="mb-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/10 px-4 py-2">
                {movie.Year}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2">
                {movie.Runtime}
              </span>
              <span className="rounded-full bg-amber-400 px-4 py-2 font-bold text-black">
                IMDb {movie.imdbRating}
              </span>
            </div>

            <p className="mb-6 leading-8 text-zinc-300">
              {movie.Plot}
            </p>

            <div className="grid gap-4 text-sm text-zinc-400 sm:grid-cols-2">
              <p>
                <span className="text-white">Genre:</span> {movie.Genre}
              </p>
              <p>
                <span className="text-white">Director:</span> {movie.Director}
              </p>
              <p>
                <span className="text-white">Actors:</span> {movie.Actors}
              </p>
              <p>
                <span className="text-white">Language:</span> {movie.Language}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}