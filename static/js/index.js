const form = document.querySelector("#film-filter-form");
const ausgabebereich = document.querySelector("#ausgabebereich");
const canvas = document.getElementById("filmReel");
const ctx = canvas.getContext("2d");

let animationId = null;
let rotation = 0;

function drawCamera() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(150, 100, 80, 0, Math.PI * 2);
  ctx.fillStyle = "#2c3e50";
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.fillRect(130, 80, 40, 30);
  ctx.beginPath();
  ctx.moveTo(170, 95);
  ctx.lineTo(190, 80);
  ctx.lineTo(190, 110);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.translate(150, 100);
  ctx.rotate(rotation);
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 4; i++) {
    const angle = i * Math.PI / 2;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * 50, Math.sin(angle) * 50, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  rotation += 0.03;
}

function startAnimation() {
  canvas.style.display = "block";
  (function animate() {
    drawCamera();
    animationId = requestAnimationFrame(animate);
  })();
}

function stopAnimation() {
  cancelAnimationFrame(animationId);
  canvas.style.display = "none";
  rotation = 0;
}

document.getElementById("genre").addEventListener("blur", function () {
  document.getElementById("genre-error").textContent = this.value === "" ? "Genre erforderlich" : "";
});

document.getElementById("sprache").addEventListener("blur", function () {
  document.getElementById("sprache-error").textContent = this.value === "" ? "Sprache erforderlich" : "";
});

document.getElementById("streamingplattform").addEventListener("blur", function () {
  document.getElementById("streaming-error").textContent = this.value === "" ? "Streamingplattform erforderlich" : "";
});

document.getElementById("mindestens-bewertung").addEventListener("blur", function () {
  let val = parseFloat(this.value);
  document.getElementById("bewertung-error").textContent = (isNaN(val) || val < 0 || val > 10)
    ? "Bitte Zahl zwischen 0 und 10"
    : "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let valid = true;

  const genre = document.getElementById("genre").value;
  if (genre === "") {
    document.getElementById("genre-error").textContent = "Genre erforderlich";
    valid = false;
  }

  const sprache = document.getElementById("sprache").value;
  if (sprache === "") {
    document.getElementById("sprache-error").textContent = "Sprache erforderlich";
    valid = false;
  }

  const streaming = document.getElementById("streamingplattform").value;
  if (streaming === "") {
    document.getElementById("streaming-error").textContent = "Streamingplattform erforderlich";
    valid = false;
  }

  const bewertung = parseFloat(document.getElementById("mindestens-bewertung").value);
  if (isNaN(bewertung) || bewertung < 0 || bewertung > 10) {
    document.getElementById("bewertung-error").textContent = "Bitte Zahl zwischen 0 und 10";
    valid = false;
  }

  if (!valid) return;

  ausgabebereich.innerHTML = "";
  const hinweisBox = document.getElementById("ausgabe-hinweis");
  if (hinweisBox) hinweisBox.style.display = "none";

  startAnimation();

  try {
    const kinder = document.getElementById("kinderfreundlich").checked ? "true" : "false";

    document.cookie = `genre=${genre}; path=/; max-age=${60 * 60 * 24 * 30}`;
    document.cookie = `sprache=${sprache}; path=/; max-age=${60 * 60 * 24 * 30}`;
    document.cookie = `streaming=${streaming}; path=/; max-age=${60 * 60 * 24 * 30}`;
    document.cookie = `bewertung=${bewertung}; path=/; max-age=${60 * 60 * 24 * 30}`;
    document.cookie = `kinder=${kinder}; path=/; max-age=${60 * 60 * 24 * 30}`;

    const params = new URLSearchParams({
      genre, sprache, plattform: streaming, bewertung, kinder
    });

    const response = await fetch(`/backend?${params}`, {
      headers: { "Accept": "application/json" },
      credentials: "same-origin"
    });



    const { success, results } = await response.json();

    ausgabebereich.innerHTML = success && results.length
      ? results.map(m => `
        <div class="movie-card">
          <img src="${m.poster_url || 'placeholder.jpg'}" alt="${m.title}" class="${!m.poster_url ? 'no-poster' : ''}">
          <button onclick="markAsSeen('${m.id}')" class="angeschaut-button">Angeschaut!</button>
          <div class="movie-content">
            <h3>${m.title}</h3>
            <div class="movie-meta">
              <p>⭐ ${m.vote_average?.toFixed(1) || "-"}/10</p>
              <p>📅 ${m.release_date?.substring(0, 4) || "Unbekannt"}</p>
            </div>
            ${m.overview ? `<div class="movie-description"><p>${m.overview}</p></div>` : '<p class="no-description">Keine Beschreibung verfügbar</p>'}
          </div>
        </div>
      `).join("")
      : `<div class="no-results">Keine Treffer gefunden. Versuche eine niedrigere Bewertung.</div>`;
  } catch (err) {
    ausgabebereich.innerHTML = `
      <div class="error">
        <p>Ein Fehler ist aufgetreten: ${err.message || "Unbekannter Fehler"}</p>
      </div>`;
  } finally {
    stopAnimation();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const felder = {
    genre: "genre",
    sprache: "sprache",
    streaming: "streamingplattform",
    bewertung: "mindestens-bewertung",
    kinder: "kinderfreundlich"
  };

  let alleGesetzt = true;

  for (const [cookieName, elementId] of Object.entries(felder)) {
    let cookieValue = "";
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let [key, value] = cookies[i].trim().split("=");
      if (key === cookieName) {
        cookieValue = decodeURIComponent(value);
      }
    }

    const el = document.getElementById(elementId);
    if (!el) continue;

    if (el.type === "checkbox") {
      el.checked = cookieValue === "true";
    } else if (cookieValue) {
      el.value = cookieValue;
    } else {
      alleGesetzt = false;
    }
  }

  if (alleGesetzt) {
    form.dispatchEvent(new Event("submit"));
  }
});

function markAsSeen(id) {
  let seen = document.cookie.split(";").map(c => c.trim()).find(c => c.startsWith("gesehen="));
  let ids = [];

  if (seen) {
    try {
      ids = JSON.parse(decodeURIComponent(seen.split("=")[1]));
    } catch { }
  }

  if (!ids.includes(id)) {
    ids.push(id);
    document.cookie = `gesehen=${encodeURIComponent(JSON.stringify(ids))}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }

  const button = document.querySelector(`button[onclick="markAsSeen('${id}')"]`);
  const card = button?.closest(".movie-card");
  if (card) card.remove();
}