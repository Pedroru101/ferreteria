document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('.hero-carousel-image');
  let currentIndex = 0;

  function rotateImage() {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
  }

  setInterval(rotateImage, 4000);
});
