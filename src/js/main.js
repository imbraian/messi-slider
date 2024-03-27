const wrapper = document.querySelector('.wrapper');
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll("i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildrens = Array.from(carousel.children);

let isDragging = false;
let startX, startScrollLeft;
let timeOutId;

// Duplica los elementos del carrusel para el desplazamiento infinito
const cardPreview = Math.round(carousel.offsetWidth / firstCardWidth);
carouselChildrens.slice(-cardPreview).reverse().forEach((card) => {
  carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

carouselChildrens.slice(0, cardPreview).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Agrega eventos de clic a los botones de flecha
arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
  });
});

// Inicia el arrastre
const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

// Maneja el arrastre
const dragging = (e) => {
  if (!isDragging) return;
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

// Detiene el arrastre
const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

// Reproduce automáticamente el carrusel si el ancho de la ventana es suficientemente grande
const autoPlay = () => {
  if (window.innerWidth < 800) return;
  timeOutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
};

// Desplazamiento infinito del carrusel
const infiniteScroll = () => {
  if (carousel.scrollLeft === 0) {
    carousel.classList.add('no-transition');
    carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
    carousel.classList.remove('no-transition');
  } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
    carousel.classList.add('no-transition');
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove('no-transition');
  }
  clearTimeout(timeOutId);
  if (!wrapper.matches(':hover')) autoPlay();
};

// Agrega eventos de arrastre, desplazamiento y reproducción automática
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener('mouseenter', () => clearTimeout(timeOutId));
wrapper.addEventListener('mouseleave', autoPlay);

// Reproducir automáticamente el carrusel al cargar la página
autoPlay();
