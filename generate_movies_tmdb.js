const fs = require('fs');
const axios = require('axios');

const API_KEY = 'f2e0b64dea8cf608b44fae0f15d68c2b';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const GENRES = [
  { id: 28,  name: 'Action'    },
  { id: 18,  name: 'Drama'     },
  { id: 27,  name: 'Horror'    },
  { id: 53,  name: 'Thriller'  },
  { id: 35,  name: 'Comedy'    },
  { id: 12,  name: 'Adventure' }
];

const PAGES_PER_GENRE = 10; // 20 movies per page × 10 pages = 200 per genre

// ─── helpers ────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function tmdbParams(extra = {}) {
  return { api_key: API_KEY, ...extra };
}

// ─── fetch trailer for one movie ────────────────────────────

async function getTrailer(movieId) {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: tmdbParams()
    });
    const trailer = res.data.results.find(
      v => v.type === 'Trailer' && v.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch {
    return null;
  }
}

// ─── fetch backdrops for one movie ──────────────────────────

async function getBackdrops(movieId) {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/images`, {
      params: tmdbParams()
    });
    return res.data.backdrops
      .slice(0, 5)
      .map(b => `${IMAGE_BASE}/w1280${b.file_path}`);
  } catch {
    return [];
  }
}

// ─── fetch one page of movies for a genre ───────────────────

async function fetchPage(genreId, page) {
  const res = await axios.get(`${BASE_URL}/discover/movie`, {
    params: tmdbParams({
      with_genres:       genreId,
      page,
      sort_by:           'popularity.desc',
      'vote_count.gte':  100,
      include_adult:     false
    })
  });
  return res.data.results;
}

// ─── main ────────────────────────────────────────────────────

async function main() {
  if (API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
    console.error('\n❌  Please replace YOUR_TMDB_API_KEY_HERE with your real TMDB API key.\n');
    process.exit(1);
  }

  console.log('���  Starting TMDB movie fetch...\n');

  const allMovies = [];
  const seen      = new Set();
  let   total     = 0;

  for (const genre of GENRES) {
    console.log(`\n���  Genre: ${genre.name} (id ${genre.id})`);

    for (let page = 1; page <= PAGES_PER_GENRE; page++) {
      let results = [];

      try {
        results = await fetchPage(genre.id, page);
        process.stdout.write(`  page ${page}/${PAGES_PER_GENRE} — ${results.length} movies`);
      } catch (err) {
        console.error(`\n  ❌  page ${page} failed: ${err.message}`);
        await sleep(1000);
        continue;
      }

      for (const movie of results) {
        if (seen.has(movie.id)) continue;
        seen.add(movie.id);

        const shortTitle = movie.title.substring(0, 35).padEnd(35);
        process.stdout.write(`\r  Enriching: ${shortTitle}  (total so far: ${total + 1})`);

        const [trailer, backdrops] = await Promise.all([
          getTrailer(movie.id),
          getBackdrops(movie.id)
        ]);

        await sleep(300); // stay within TMDB rate limit

        allMovies.push({
          tmdbId:      movie.id,
          title:       movie.title,
          overview:    movie.overview,
          releaseDate: movie.release_date,
          genre:       genre.name,
          genreId:     genre.id,
          rating:      movie.vote_average,
          voteCount:   movie.vote_count,
          popularity:  movie.popularity,
          language:    movie.original_language,
          poster:      movie.poster_path
                         ? `${IMAGE_BASE}/w500${movie.poster_path}`
                         : null,
          backdrop:    movie.backdrop_path
                         ? `${IMAGE_BASE}/w1280${movie.backdrop_path}`
                         : null,
          backdrops,               // up to 5 real backdrops for THIS movie
          trailerLink: trailer,    // real matched trailer for THIS movie
          reviewIds:   []
        });

        total++;
      }

      await sleep(250); // small pause between pages
    }

    console.log(`\n  ✅  ${genre.name} done.`);
  }

  const outputFile = 'movies_tmdb.json';
  fs.writeFileSync(outputFile, JSON.stringify(allMovies, null, 2));

  console.log(`\n���  Finished! ${allMovies.length} unique movies saved to ${outputFile}\n`);
}

main().catch(err => {
  console.error('\n���  Fatal error:', err.message);
  process.exit(1);
});
