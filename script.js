// ---------------------------------------------
// 1. Configura aquí la fecha de inicio de vuestra relación
// ---------------------------------------------
const START_DATE = new Date('2026-08-13T24:00:00');

// ---------------------------------------------
// 2. Configura aquí la próxima fecha en la que os veréis
//    Si aún no la sabes, déjalo en null y la sección se oculta sola
// ---------------------------------------------
const NEXT_VISIT_DATE = null; // ejemplo: new Date('2026-10-10T00:00:00')

// ---------------------------------------------
// 3. TUS FOTOS
//    Pon tus imágenes en la carpeta /images/ con estos mismos nombres
//    (1.png, 2.png, 3.png...) o cambia "file" por el nombre que uses.
//    Para añadir más fotos, simplemente añade más líneas siguiendo el patrón.
//    "caption" es el texto que aparece debajo de cada polaroid y en el visor.
// ---------------------------------------------
const PHOTOS = [
  { file: '1.jpeg',  caption: '' },
  { file: '2.jpeg',   caption: '' },
  { file: '3.jpeg',   caption: '' },
  { file: '4.jpeg',   caption: '' },
  { file: '5.jpeg',   caption: '' },
  { file: '6.jpeg',   caption: '' },
  { file: '7.jpeg',   caption: '' },
  { file: '8.jpeg',   caption: '' },
  { file: '9.jpeg',  caption: '' },
  { file: '10.jpeg',  caption: '' },
  { file: '11.jpeg',  caption: '' },
  { file: '12.jpeg',  caption: '' },
  { file: '13.jpg',  caption: '' },
];

// ---------------------------------------------
// Contador en vivo
// ---------------------------------------------
const numDias = document.getElementById('numDias');
const numHoras = document.getElementById('numHoras');
const numMin = document.getElementById('numMin');

function updateCounter() {
  const now = new Date();
  const diff = Math.max(0, now - START_DATE);
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);

  numDias.textContent = String(dias).padStart(2, '0');
  numHoras.textContent = String(horas).padStart(2, '0');
  numMin.textContent = String(minutos).padStart(2, '0');
}

updateCounter();
setInterval(updateCounter, 1000 * 30);

const startDateLabel = document.getElementById('startDateLabel');
if (startDateLabel) {
  const formatted = START_DATE.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  startDateLabel.textContent = `Desde el ${formatted}`;
}

// ---------------------------------------------
// Cuenta atrás
// ---------------------------------------------
const countdownSection = document.getElementById('cuenta-atras');
const countdownNum = document.getElementById('countdownNum');
const countdownSuffix = document.getElementById('countdownSuffix');

if (NEXT_VISIT_DATE && countdownSection) {
  const diffMs = NEXT_VISIT_DATE - new Date();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    countdownNum.textContent = diffDays;
    countdownSuffix.textContent = diffDays === 1 ? 'día para volver a vernos' : 'días para volver a vernos';
  } else {
    countdownNum.textContent = '♥';
    countdownSuffix.textContent = 'ya estáis juntos';
  }
} else if (countdownSection) {
  countdownSection.style.display = 'none';
}

// ---------------------------------------------
// Galería — se genera a partir de PHOTOS
// ---------------------------------------------
const polaroidsGrid = document.getElementById('polaroidsGrid');

// pequeño ciclo de inclinaciones para que no se vea todo perfectamente recto
const ROTATIONS = [-3, 2, -1.5, 3, -2.5, 1.5, -2, 2.5];

if (polaroidsGrid) {
  PHOTOS.forEach((photo, index) => {
    const btn = document.createElement('button');
    btn.className = 'polaroid';
    btn.dataset.index = index;
    btn.style.transform = `rotate(${ROTATIONS[index % ROTATIONS.length]}deg)`;

    const img = document.createElement('img');
    img.src = `images/${photo.file}`;
    img.alt = photo.caption;
    img.loading = 'lazy';

    const cap = document.createElement('span');
    cap.className = 'polaroid-cap';
    cap.textContent = photo.caption;

    btn.appendChild(img);
    btn.appendChild(cap);
    polaroidsGrid.appendChild(btn);
  });
}

// ---------------------------------------------
// Lightbox con navegación anterior / siguiente
// ---------------------------------------------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;

function showPhoto(index) {
  currentIndex = (index + PHOTOS.length) % PHOTOS.length;
  const photo = PHOTOS[currentIndex];
  lightboxImg.src = `images/${photo.file}`;
  lightboxImg.alt = photo.caption;
  lightboxCaption.textContent = photo.caption;
}

function openLightbox(index) {
  showPhoto(index);
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (polaroidsGrid) {
  polaroidsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.polaroid');
    if (btn) openLightbox(Number(btn.dataset.index));
  });
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showPhoto(currentIndex - 1));
lightboxNext.addEventListener('click', () => showPhoto(currentIndex + 1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
  if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
});

// ---------------------------------------------
// Botón volver arriba
// ---------------------------------------------
const topBtn = document.getElementById('topBtn');
if (topBtn) {
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---------------------------------------------
// Fondo de estrellas (canvas ligero, respeta reduced-motion)
// ---------------------------------------------
const canvas = document.getElementById('stars');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.015 + 0.003,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#E8A33D';
    stars.forEach((s) => {
      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time * s.speed + s.phase));
      ctx.globalAlpha = twinkle * 0.7;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}
