export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300 bg-clip-text text-3xl font-black text-transparent">
            MovieFinder
          </h1>

          <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase">
            Discover • Watch • Explore
          </p>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
            Search Movies
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
            Favorites
          </div>
        </div>
      </div>
    </nav>
  );
}