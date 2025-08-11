import express from "express";

const router = express.Router();
const apiKey = "xyxyxyxyxy";
const gültigeGenres = ["28", "35", "18", "27", "10749", "878", "99", "53"];
const gültigeSprachen = ["de", "en", "fr", "it"];
const gültigePlattformen = ["8", "9", "337", "350", "531"];

router.get("/", async (req, res) => {
  try {
    const input = req.method === "POST" ? req.body : req.query;
    const genre = input.genre;
    const sprache = input.sprache;
    const plattform = input.plattform;
    const bewertung = input.bewertung;
    const kinder = input.kinder;

    const errors = [];

    if (!gültigeGenres.includes(genre)) errors.push("Ungültiges Genre ausgewählt.");
    if (!gültigeSprachen.includes(sprache)) errors.push("Ungültige Sprache ausgewählt.");
    if (!gültigePlattformen.includes(plattform)) errors.push("Ungültige Streamingplattform ausgewählt.");

    const bewertungValue = parseFloat(bewertung);
    if (isNaN(bewertungValue) || bewertungValue < 0 || bewertungValue > 10) {
      errors.push("Bewertung muss zwischen 0 und 10 liegen.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Eingabefehler", errors });
    }

    let geseheneIds = [];
    if (req.cookies?.gesehen) {
      try {
        const parsed = JSON.parse(req.cookies.gesehen);
        geseheneIds = Array.isArray(parsed) ? parsed.map(id => String(id)) : [];
      } catch (e) {
        console.warn("Cookie 'gesehen' konnte nicht gelesen werden:", e);
      }
    }

    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
    url += `&language=de-DE`;
    url += `&sort_by=popularity.desc`;
    url += `&vote_average.gte=${bewertungValue}`;
    url += `&include_adult=true`;
    url += `&with_genres=${genre}`;
    url += `&with_watch_providers=${plattform}&watch_region=DE`;

    if (kinder === "true") {
      url += `&certification_country=DE&certification.lte=6`;
    }

    const filteredMovies = [];

    for (let page = 1; page <= 10 && filteredMovies.length < 12; page++) {
      const response = await fetch(`${url}&page=${page}`);
      if (!response.ok) {
        throw new Error(`Discover-API fehlgeschlagen (Status ${response.status})`);
      }

      const data = await response.json();
      const movies = data.results || [];

      for (const movie of movies) {
        if (geseheneIds.includes(String(movie.id))) continue;

        try {
          const [translationsRes, providersRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/translations?api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${apiKey}`)
          ]);

          const translations = await translationsRes.json();
          const providers = await providersRes.json();

          const translationList = translations?.translations || [];
          const providerList = providers?.results?.DE?.flatrate || [];

          const hasTranslation = translationList.some(t => t.iso_639_1 === sprache);
          const hasProvider = providerList.some(p => String(p.provider_id) === plattform);

          if (hasTranslation && hasProvider) {
            filteredMovies.push({
              ...movie,
              poster_url: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : null
            });
          }

          if (filteredMovies.length >= 12) break;

        } catch (e) {
          console.error(`Fehler bei Film ${movie.id}:`, e.message);
        }
      }
    }

    res.status(200).json({
      success: true,
      count: filteredMovies.length,
      results: filteredMovies
    });

  } catch (error) {
    console.error("Serverfehler:", error);

    res.status(500).json({
      success: false,
      message: "Interner Serverfehler",
      detail: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

export default router;