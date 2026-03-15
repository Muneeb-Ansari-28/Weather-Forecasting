// ── WMO CODE → CONDITION ──────────────────────────────────────────────────────
const WMO = {
  0:  { label: 'Clear Sky',        icon: 'sunny',       bg: 'sunny' },
  1:  { label: 'Mostly Clear',     icon: 'sunny',       bg: 'sunny' },
  2:  { label: 'Partly Cloudy',    icon: 'partly',      bg: 'partly' },
  3:  { label: 'Overcast',         icon: 'cloudy',      bg: 'cloudy' },
  45: { label: 'Foggy',            icon: 'fog',         bg: 'fog' },
  48: { label: 'Icy Fog',          icon: 'fog',         bg: 'fog' },
  51: { label: 'Light Drizzle',    icon: 'rainy',       bg: 'rain' },
  53: { label: 'Drizzle',          icon: 'rainy',       bg: 'rain' },
  55: { label: 'Heavy Drizzle',    icon: 'rainy',       bg: 'rain' },
  61: { label: 'Light Rain',       icon: 'rainy',       bg: 'rain' },
  63: { label: 'Rain',             icon: 'rainy',       bg: 'rain' },
  65: { label: 'Heavy Rain',       icon: 'rainy',       bg: 'rain' },
  71: { label: 'Light Snow',       icon: 'snowy',       bg: 'snow' },
  73: { label: 'Snow',             icon: 'snowy',       bg: 'snow' },
  75: { label: 'Heavy Snow',       icon: 'snowy',       bg: 'snow' },
  77: { label: 'Snow Grains',      icon: 'snowy',       bg: 'snow' },
  80: { label: 'Light Showers',    icon: 'rainy',       bg: 'rain' },
  81: { label: 'Showers',          icon: 'rainy',       bg: 'rain' },
  82: { label: 'Heavy Showers',    icon: 'rainy',       bg: 'rain' },
  85: { label: 'Snow Showers',     icon: 'snowy',       bg: 'snow' },
  86: { label: 'Heavy Snow Showers',icon:'snowy',       bg: 'snow' },
  95: { label: 'Thunderstorm',     icon: 'thunder',     bg: 'thunder' },
  96: { label: 'Thunderstorm + Hail',icon:'thunder',    bg: 'thunder' },
  99: { label: 'Severe Thunderstorm',icon:'thunder',    bg: 'thunder' },
};

function wmo(code) {
  return WMO[code] || { label: 'Unknown', icon: 'cloudy', bg: 'cloudy' };
}

// ── STATE ─────────────────────────────────────────────────────────────────────
let unitC = true;
let weatherData = null;

// ── SKY CANVAS ────────────────────────────────────────────────────────────────
const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
let animFrame;
let skyType = 'clear-night';

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.7,
    r: Math.random() * 1.2 + 0.2,
    alpha: Math.random(),
    speed: Math.random() * 0.008 + 0.003,
  }));
}

function drawSky() {
  cancelAnimationFrame(animFrame);
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const isLightTheme = document.documentElement.classList.contains('light');

  if (isLightTheme) {
    // Light theme: Very subtle sky gradient or transparent
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#f8fbff');
    grad.addColorStop(1, '#e8f0ff');
    ctx.fillStyle = grad; 
    ctx.fillRect(0, 0, w, h);
  } else {
    // Original Dark theme logic
    if (skyType === 'sunny') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0a1f5e');
      grad.addColorStop(0.4, '#1a3a8a');
      grad.addColorStop(1, '#2a5fb0');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      // Big atmospheric sun glow
      const sg = ctx.createRadialGradient(w * 0.75, h * 0.2, 0, w * 0.75, h * 0.2, h * 0.7);
      sg.addColorStop(0, 'rgba(255,220,80,0.18)');
      sg.addColorStop(0.4, 'rgba(255,180,40,0.06)');
      sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h);
    } else if (skyType === 'partly') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0d1e4a');
      grad.addColorStop(1, '#1a3060');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    } else if (skyType === 'cloudy') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0e1520');
      grad.addColorStop(1, '#1a2030');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    } else if (skyType === 'rain' || skyType === 'thunder') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#06080f');
      grad.addColorStop(1, '#0c1220');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      if (skyType === 'thunder') {
        const lg = ctx.createRadialGradient(w * 0.5, 0, 0, w * 0.5, 0, h * 0.8);
        lg.addColorStop(0, 'rgba(60,40,120,0.18)');
        lg.addColorStop(1, 'transparent');
        ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h);
      }
    } else if (skyType === 'snow') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0c1628');
      grad.addColorStop(1, '#162030');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    } else if (skyType === 'fog') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#12161e');
      grad.addColorStop(1, '#1a2030');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    } else {
      // clear night
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#030812');
      grad.addColorStop(1, '#0a0f20');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    }
  }

  // Stars (show only when dark sky or partly cloudy night)
  const shouldShowStars = !isLightTheme && (
    ['clear-night','cloudy','fog','snow'].includes(skyType) ||
    skyType === 'partly' || skyType === 'thunder'
  );

  if (shouldShowStars) {
    const opacity = skyType === 'sunny' ? 0 : skyType === 'partly' ? 0.4 : 0.9;
    stars.forEach(s => {
      s.alpha += Math.sin(Date.now() * s.speed * 0.04) * 0.01;
      s.alpha = Math.max(0.1, Math.min(0.9, s.alpha));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.alpha * opacity})`;
      ctx.fill();
    });
  }

  animFrame = requestAnimationFrame(drawSky);
}

// ── PARTICLES ─────────────────────────────────────────────────────────────────
function clearParticles() {
  document.getElementById('rain-layer').innerHTML = '';
  document.getElementById('rain-layer').classList.remove('active');
  document.getElementById('snow-layer').innerHTML = '';
  document.getElementById('snow-layer').classList.remove('active');
  document.getElementById('fog-layer').innerHTML = '';
  document.getElementById('fog-layer').classList.remove('active');
}

function spawnRain(heavy) {
  const layer = document.getElementById('rain-layer');
  layer.classList.add('active');
  const count = heavy ? 80 : 45;
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div');
    d.className = 'raindrop';
    const left = Math.random() * 110 - 5;
    const dur = (Math.random() * 0.4 + (heavy ? 0.5 : 0.7)).toFixed(2);
    const h = (Math.random() * 15 + 10).toFixed(0);
    const delay = (Math.random() * 2).toFixed(2);
    d.style.cssText = `left:${left}%;height:${h}px;animation-duration:${dur}s;animation-delay:${delay}s;opacity:${Math.random()*0.4+0.3}`;
    layer.appendChild(d);
  }
}

function spawnSnow() {
  const layer = document.getElementById('snow-layer');
  layer.classList.add('active');
  for (let i = 0; i < 60; i++) {
    const d = document.createElement('div');
    d.className = 'snowflake';
    const sz = (Math.random() * 4 + 2).toFixed(1);
    const left = Math.random() * 100;
    const dur = (Math.random() * 5 + 5).toFixed(1);
    const delay = (Math.random() * 5).toFixed(1);
    d.style.cssText = `width:${sz}px;height:${sz}px;left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s;`;
    layer.appendChild(d);
  }
}

function spawnFog() {
  const layer = document.getElementById('fog-layer');
  layer.classList.add('active');
  for (let i = 0; i < 5; i++) {
    const d = document.createElement('div');
    d.className = 'fog-strip';
    const top = 20 + i * 14;
    const dur = (22 + i * 6).toFixed(0);
    d.style.cssText = `top:${top}%;animation-duration:${dur}s;animation-delay:${(i * 3)}s;`;
    layer.appendChild(d);
  }
}

// ── WEATHER ICONS (SVG inline) ────────────────────────────────────────────────
function buildIcon(type, size = 80) {
  const s = size;
  const h = Math.round(s * 0.75);
  const wrap = document.createElement('div');

  if (type === 'sunny') {
    wrap.innerHTML = `
      <div style="position:relative;width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center;">
        <div class="sun-rays" style="position:absolute;inset:0;">
          ${Array.from({length:12},(_,i)=>`<div class="sun-ray" style="transform:rotate(${i*30}deg) translateY(-38px);"></div>`).join('')}
        </div>
        <div class="sun-core"></div>
      </div>`;
  } else if (type === 'partly') {
    wrap.innerHTML = `
      <div class="partly-wrap" style="width:${s}px;height:${h}px;">
        <div class="partly-sun"></div>
        <div class="partly-cloud cloud-body">
          <svg class="cloud-svg" width="${s*0.72}" height="${h*0.65}" viewBox="0 0 72 46" fill="none">
            <path d="M58 38H14A11 11 0 0114 16a14 14 0 0127.6-3.2A10 10 0 0158 22v16z" fill="rgba(200,215,240,0.85)"/>
          </svg>
        </div>
      </div>`;
  } else if (type === 'cloudy') {
    wrap.innerHTML = `
      <div class="cloud-body">
        <svg class="cloud-svg" width="${s}" height="${h}" viewBox="0 0 96 72" fill="none">
          <path d="M76 60H20A16 16 0 0120 28a20 20 0 0139-6A14 14 0 0176 36v24z" fill="rgba(160,175,200,0.75)"/>
          <path d="M60 60H8A13 13 0 018 34a16 16 0 0131.5-4.8A11 11 0 0160 42v18z" fill="rgba(180,195,220,0.55)" transform="translate(2,4)"/>
        </svg>
      </div>`;
  } else if (type === 'rainy') {
    wrap.innerHTML = `
      <div class="cloud-body" style="position:relative;">
        <svg class="cloud-svg" width="${s}" height="${h}" viewBox="0 0 96 80" fill="none">
          <path d="M72 48H24A14 14 0 0124 20a18 18 0 0135-4A12 12 0 0172 28v20z" fill="rgba(120,150,200,0.7)"/>
          <g stroke="rgba(140,190,255,0.8)" stroke-width="2" stroke-linecap="round">
            <line x1="30" y1="56" x2="26" y2="70"><animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/></line>
            <line x1="44" y1="60" x2="40" y2="74"><animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="0.3s" repeatCount="indefinite"/></line>
            <line x1="58" y1="56" x2="54" y2="70"><animate attributeName="opacity" values="1;0;1" dur="1.2s" begin="0.6s" repeatCount="indefinite"/></line>
          </g>
        </svg>
      </div>`;
  } else if (type === 'snowy') {
    wrap.innerHTML = `
      <div class="cloud-body" style="position:relative;">
        <svg class="cloud-svg" width="${s}" height="${h}" viewBox="0 0 96 80" fill="none">
          <path d="M72 48H24A14 14 0 0124 20a18 18 0 0135-4A12 12 0 0172 28v20z" fill="rgba(180,200,230,0.65)"/>
          <g fill="rgba(210,230,255,0.9)">
            <circle cx="32" cy="62" r="3"><animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/></circle>
            <circle cx="48" cy="68" r="3"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite"/></circle>
            <circle cx="62" cy="62" r="3"><animate attributeName="opacity" values="1;0.3;1" dur="1.8s" begin="0.5s" repeatCount="indefinite"/></circle>
          </g>
        </svg>
      </div>`;
  } else if (type === 'thunder') {
    wrap.innerHTML = `
      <div style="position:relative;">
        <div class="cloud-body">
          <svg class="cloud-svg" width="${s}" height="${h}" viewBox="0 0 96 72" fill="none">
            <path d="M72 52H24A14 14 0 0124 24a18 18 0 0135-4A12 12 0 0172 32v20z" fill="rgba(80,90,120,0.85)"/>
          </svg>
        </div>
        <div class="lightning-bolt">⚡</div>
      </div>`;
  } else if (type === 'fog') {
    wrap.innerHTML = `
      <svg width="${s}" height="${h}" viewBox="0 0 96 60" fill="none">
        <rect x="8" y="10" width="80" height="6" rx="3" fill="rgba(160,175,200,0.5)"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite"/></rect>
        <rect x="16" y="26" width="64" height="6" rx="3" fill="rgba(140,155,180,0.4)"><animate attributeName="opacity" values="0.9;0.4;0.9" dur="3s" repeatCount="indefinite"/></rect>
        <rect x="4"  y="42" width="88" height="6" rx="3" fill="rgba(120,135,165,0.3)"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite"/></rect>
      </svg>`;
  } else {
    // moon
    wrap.innerHTML = `<div class="moon-core"></div>`;
  }
  return wrap;
}

// Small forecast icon
function forecastIconSVG(type) {
  if (type === 'sunny') {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="7" fill="#f8d050" opacity="0.9"/>
      ${Array.from({length:8},(_,i)=>{
        const a=(i*45)*Math.PI/180, x1=16+10.5*Math.cos(a), y1=16+10.5*Math.sin(a), x2=16+13*Math.cos(a), y2=16+13*Math.sin(a);
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#f8d050" stroke-width="1.5" stroke-linecap="round"/>`;
      }).join('')}
    </svg>`;
  } else if (type === 'partly') {
    return `<svg width="32" height="28" viewBox="0 0 32 28" fill="none">
      <circle cx="12" cy="10" r="6" fill="#f8d050" opacity="0.85"/>
      <path d="M24 22H8A6 6 0 018 10a8 8 0 0116 2A5 5 0 0124 16v6z" fill="rgba(180,200,230,0.8)"/>
    </svg>`;
  } else if (type === 'cloudy') {
    return `<svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <path d="M26 20H6A5 5 0 016 10a7 7 0 0114-1.5A4.5 4.5 0 0126 13v7z" fill="rgba(160,175,200,0.75)"/>
    </svg>`;
  } else if (type === 'rainy') {
    return `<svg width="32" height="30" viewBox="0 0 32 30" fill="none">
      <path d="M24 18H8A5 5 0 018 8a7 7 0 0114-1A4 4 0 0124 11v7z" fill="rgba(100,130,185,0.75)"/>
      <g stroke="rgba(140,190,255,0.9)" stroke-width="1.5" stroke-linecap="round">
        <line x1="10" y1="22" x2="8" y2="28"/><line x1="16" y1="22" x2="14" y2="28"/><line x1="22" y1="22" x2="20" y2="28"/>
      </g>
    </svg>`;
  } else if (type === 'snowy') {
    return `<svg width="32" height="30" viewBox="0 0 32 30" fill="none">
      <path d="M24 18H8A5 5 0 018 8a7 7 0 0114-1A4 4 0 0124 11v7z" fill="rgba(170,190,225,0.7)"/>
      <circle cx="10" cy="25" r="2" fill="rgba(200,225,255,0.9)"/>
      <circle cx="16" cy="27" r="2" fill="rgba(200,225,255,0.9)"/>
      <circle cx="22" cy="25" r="2" fill="rgba(200,225,255,0.9)"/>
    </svg>`;
  } else if (type === 'thunder') {
    return `<svg width="32" height="30" viewBox="0 0 32 30" fill="none">
      <path d="M26 18H6A6 6 0 016 6a8 8 0 0116 0A5 5 0 0126 10v8z" fill="rgba(70,80,115,0.85)"/>
      <text x="12" y="30" font-size="12" fill="#f8e050">⚡</text>
    </svg>`;
  } else if (type === 'fog') {
    return `<svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <rect x="2" y="4"  width="28" height="3" rx="1.5" fill="rgba(160,175,200,0.55)"/>
      <rect x="5" y="11" width="22" height="3" rx="1.5" fill="rgba(140,155,180,0.45)"/>
      <rect x="1" y="18" width="30" height="3" rx="1.5" fill="rgba(120,135,165,0.35)"/>
    </svg>`;
  }
  // moon
  return `<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 2a12 12 0 100 24A8 8 0 0114 2z" fill="rgba(200,215,240,0.8)"/>
  </svg>`;
}

// ── TEMPERATURE HELPERS ───────────────────────────────────────────────────────
function toDisplay(c) { return unitC ? Math.round(c) : Math.round(c * 9/5 + 32); }
function unitLabel()   { return unitC ? '°' : '°F'; }

function setUnit(u) {
  unitC = (u === 'C');
  document.getElementById('btn-c').classList.toggle('active', unitC);
  document.getElementById('btn-f').classList.toggle('active', !unitC);
  if (weatherData) renderData(weatherData);
}

// ── REVERSE GEOCODE ───────────────────────────────────────────────────────────
async function getCity(lat, lon) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const d = await r.json();
    const city = d.address.city || d.address.town || d.address.village || d.address.county || 'Your Location';
    const country = d.address.country_code?.toUpperCase() || '';
    return { city, country };
  } catch { return { city: 'Your Location', country: '' }; }
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function renderData(data) {
  const { current, daily, city, country } = data;
  const cond = wmo(current.weathercode);
  const isNight = current.is_day === 0;
  const iconType = isNight && cond.icon === 'sunny' ? 'moon' : cond.icon;

  // Background
  skyType = isNight && cond.bg === 'sunny' ? 'clear-night' : cond.bg;
  clearParticles();
  if (cond.bg === 'rain' || cond.bg === 'thunder') spawnRain(cond.bg === 'thunder');
  if (cond.bg === 'snow') spawnSnow();
  if (cond.bg === 'fog') spawnFog();

  // Header
  document.getElementById('city-name').textContent = city;
  document.getElementById('region-line').textContent = country;
  const now = new Date();
  document.getElementById('date-line').textContent = now.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' });
  document.getElementById('header').classList.add('show');

  // Hero icon
  const iconWrap = document.getElementById('main-icon');
  iconWrap.innerHTML = '';
  iconWrap.appendChild(buildIcon(iconType));

  // Temp
  document.getElementById('temp-display').textContent = toDisplay(current.temperature_2m) + unitLabel();
  document.getElementById('condition-label').textContent = cond.label + (isNight ? ' · Night' : '');
  document.getElementById('hero').classList.add('show');

  // Metrics
  document.getElementById('feels-like').textContent = toDisplay(current.apparent_temperature) + unitLabel();
  document.getElementById('humidity').innerHTML = current.relative_humidity_2m + '<span class="metric-unit">%</span>';
  document.getElementById('wind-speed').innerHTML = Math.round(current.wind_speed_10m) + '<span class="metric-unit">km/h</span>';
  document.getElementById('cards-row').classList.add('show');

  // Forecast
  const grid = document.getElementById('forecast-grid');
  grid.innerHTML = '';
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  daily.time.forEach((dateStr, i) => {
    const d = new Date(dateStr + 'T12:00:00');
    const dow = i === 0 ? 'Today' : days[d.getDay()];
    const fcCond = wmo(daily.weathercode[i]);
    const hi = toDisplay(daily.temperature_2m_max[i]);
    const lo = toDisplay(daily.temperature_2m_min[i]);
    const el = document.createElement('div');
    el.className = 'forecast-day' + (i === 0 ? ' today' : '');
    el.innerHTML = `
      <div class="forecast-dow">${dow}</div>
      <div class="forecast-icon">${forecastIconSVG(fcCond.icon)}</div>
      <div class="forecast-temp">${hi}${unitLabel()}</div>
      <div class="forecast-low">${lo}${unitLabel()}</div>`;
    grid.appendChild(el);
  });
  document.getElementById('forecast-card').classList.add('show');

  // Footer
  document.getElementById('update-time').textContent = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
  document.getElementById('footer').classList.add('show');

  // Unit toggle
  document.getElementById('unit-toggle').classList.add('show');
  document.getElementById('loading').style.display = 'none';
}

// ── FETCH WEATHER ─────────────────────────────────────────────────────────────
async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode,is_day` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
    `&timezone=auto&forecast_days=7`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Weather API error');
  return r.json();
}

// ── THEME TOGGLE ─────────────────────────────────────────────────────────────
async function toggleTheme() {
  const overlay = document.getElementById('theme-transition-overlay');
  const isLight = document.documentElement.classList.contains('light');
  
  // Trigger overlay expansion
  overlay.classList.add('active');
  
  // Wait for the overlay to cover most of the screen
  setTimeout(() => {
    if (isLight) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, 600); // Middle of the 1.2s transition
  
  // Reset overlay after animation finishes
  setTimeout(() => {
    overlay.classList.remove('active');
  }, 1200);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => { initCanvas(); });
initCanvas();
drawSky();

navigator.geolocation.getCurrentPosition(async pos => {
  try {
    const { latitude: lat, longitude: lon } = pos.coords;
    const [wData, geoData] = await Promise.all([fetchWeather(lat, lon), getCity(lat, lon)]);
    weatherData = {
      current: wData.current,
      daily:   wData.daily,
      city:    geoData.city,
      country: geoData.country,
    };
    renderData(weatherData);
  } catch(e) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error-msg').style.display = 'block';
    document.getElementById('error-msg').textContent = 'Failed to load weather data. Please try again.';
  }
}, () => {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error-msg').style.display = 'block';
  document.getElementById('error-msg').textContent = 'Location access denied. Please allow location and refresh.';
}, { timeout: 10000 });
