const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export const searchMovies = async (
  query: string,
  page: number = 1
) => {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`
  );

  return response.json();
};