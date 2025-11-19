// ========================================
// CONFIGURATION CHECK
// ========================================
if (typeof CONFIG === 'undefined') {
    console.error('⚠️ CONFIG no está definido. Asegúrate de incluir config.js antes de script.js');
}

// ========================================
// DARK MODE TOGGLE
// ========================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

themeToggle.addEventListener('click', () => {
    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');

    // Switch theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Update document
    document.documentElement.setAttribute('data-theme', newTheme);

    // Save to localStorage
    localStorage.setItem('theme', newTheme);

    // Update icon
    updateThemeIcon(newTheme);

    // Show notification
    const message = newTheme === 'dark'
        ? '🌙 Modo oscuro activado'
        : '☀️ Modo claro activado';
    showNotification(message, 'success');
});

// ========================================
// PRELOADER
// ========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, CONFIG?.animations?.preloaderDelay || 1000);
});

// ========================================
// NAVIGATION
// ========================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky Navigation
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navOffset = 100;

function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - navOffset;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Trigger updateActiveNav on page load to set initial active link
document.addEventListener('DOMContentLoaded', updateActiveNav);

// ========================================
// SMOOTH SCROLLING
// ========================================
const scrollOffset = 80;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - scrollOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link after scroll
                setTimeout(updateActiveNav, 100);
            }
        }
    });
});

// ========================================
// AOS (Animate On Scroll) INITIALIZATION
// ========================================
try {
    const aosConfig = CONFIG?.animations?.aos || {};
    AOS.init({
        duration: aosConfig.duration || 800,
        easing: aosConfig.easing || 'ease-in-out',
        once: aosConfig.once !== undefined ? aosConfig.once : true,
        offset: aosConfig.offset || 100,
        delay: 100,
    });
} catch (error) {
    console.error('Error inicializando AOS:', error);
}

// ========================================
// CONTACT FORM HANDLING
// ========================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    try {
        // Get form values
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();
        const servicio = document.getElementById('servicio').value;
        const mensaje = document.getElementById('mensaje').value.trim();

        // Validate required fields
        const requiredFields = CONFIG?.form?.requiredFields || ['nombre', 'email', 'mensaje'];
        const missingFields = requiredFields.filter(field => {
            const element = document.getElementById(field);
            return !element || !element.value.trim();
        });

        if (missingFields.length > 0) {
            showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Create WhatsApp message
        const businessName = CONFIG?.business?.name || 'Metales Mar del Plata';
        const whatsappMessage = `*Nueva Consulta - ${businessName}*%0A%0A` +
            `*Nombre:* ${encodeURIComponent(nombre)}%0A` +
            `*Teléfono:* ${encodeURIComponent(telefono)}%0A` +
            `*Email:* ${encodeURIComponent(email)}%0A` +
            `*Servicio:* ${encodeURIComponent(servicio)}%0A` +
            `*Mensaje:* ${encodeURIComponent(mensaje)}`;

        // Get WhatsApp number from config
        const whatsappNumber = CONFIG?.contact?.whatsapp?.number || '5492235123456';
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        // Show success message
        showNotification('¡Gracias por tu consulta! Te estamos redirigiendo a WhatsApp...', 'success');

        // Redirect to WhatsApp after a short delay
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            contactForm.reset();
        }, 1500);
    } catch (error) {
        console.error('Error en formulario de contacto:', error);
        showNotification('Ocurrió un error al enviar el formulario. Por favor intenta nuevamente.', 'error');
    }
});

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;

    // Add to document
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ========================================
// WHATSAPP BUTTON ENHANCEMENT
// ========================================
const whatsappFloat = document.querySelector('.whatsapp-float');

// Add pulse animation on load
window.addEventListener('load', () => {
    setTimeout(() => {
        whatsappFloat.style.animation = 'float 3s ease-in-out infinite, pulse 2s infinite';
    }, 2000);
});

// Add pulse keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4); }
        50% { box-shadow: 0 8px 24px rgba(37, 211, 102, 0.8), 0 0 0 15px rgba(37, 211, 102, 0.1); }
    }

    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        opacity: 0.8;
        transition: opacity 0.2s;
    }

    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// ========================================
// GALLERY LIGHTBOX
// ========================================
const galleryItems = document.querySelectorAll('.gallery-item');

// Create lightbox element
function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10001;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Cerrar lightbox" style="
            position: absolute;
            top: 20px;
            right: 30px;
            background: none;
            border: none;
            color: white;
            font-size: 40px;
            cursor: pointer;
            z-index: 10002;
            transition: transform 0.2s;
        ">
            <i class="fas fa-times"></i>
        </button>
        <div class="lightbox-content" style="
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        ">
            <img src="" alt="" style="
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 8px;
            ">
            <p class="lightbox-caption" style="
                color: white;
                font-size: 1.2rem;
                text-align: center;
                max-width: 600px;
            "></p>
        </div>
        <button class="lightbox-prev" aria-label="Anterior" style="
            position: absolute;
            left: 30px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            font-size: 30px;
            padding: 1rem 1.5rem;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s;
        ">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="lightbox-next" aria-label="Siguiente" style="
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            font-size: 30px;
            padding: 1rem 1.5rem;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s;
        ">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    document.body.appendChild(lightbox);
    return lightbox;
}

const lightbox = createLightbox();
const lightboxImg = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');

let currentImageIndex = 0;
const galleryItemsArray = Array.from(galleryItems);

function openLightbox(index) {
    currentImageIndex = index;
    const item = galleryItemsArray[index];
    const placeholderText = item.querySelector('span').textContent;

    // Si hay una imagen real, la mostramos; si no, mostramos un placeholder
    const imgSrc = item.dataset.src || 'https://via.placeholder.com/800x600/1a1a2e/ff6b35?text=' + encodeURIComponent(placeholderText);

    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = placeholderText;

    lightbox.style.display = 'flex';
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);

    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryItemsArray.length;
    openLightbox(currentImageIndex);
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryItemsArray.length) % galleryItemsArray.length;
    openLightbox(currentImageIndex);
}

// Event listeners para la galería
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (CONFIG?.gallery?.enableLightbox !== false) {
            openLightbox(index);
        } else {
            const placeholderText = item.querySelector('span').textContent;
            showNotification(`Función de galería para "${placeholderText}" - Agrega tus imágenes aquí`, 'success');
        }
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevImage);
lightboxNext.addEventListener('click', nextImage);

// Cerrar con click fuera de la imagen
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    }
});

// Hover effects para botones del lightbox
[lightboxClose, lightboxPrev, lightboxNext].forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255,255,255,0.2)';
        btn.style.transform = btn === lightboxClose ? 'scale(1.1)' :
                             btn === lightboxPrev ? 'translateY(-50%) scale(1.1)' :
                             'translateY(-50%) scale(1.1)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.background = btn === lightboxClose ? 'none' : 'rgba(255,255,255,0.1)';
        btn.style.transform = btn === lightboxClose ? 'scale(1)' : 'translateY(-50%) scale(1)';
    });
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Lazy loading for images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// FORM VALIDATION ENHANCEMENT
// ========================================
const formInputs = contactForm.querySelectorAll('input, select, textarea');

formInputs.forEach(input => {
    // Add real-time validation
    input.addEventListener('blur', () => {
        validateInput(input);
    });

    // Remove error on input
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            input.classList.remove('error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        }
    });
});

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    } else if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        }
    } else if (input.type === 'tel' && value) {
        const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido';
        }
    }

    if (!isValid) {
        input.classList.add('error');
        input.style.borderColor = '#ef4444';

        // Remove existing error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 0.25rem;';
        errorDiv.textContent = errorMessage;
        input.parentElement.appendChild(errorDiv);
    } else {
        input.classList.remove('error');
        input.style.borderColor = '';
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }

    return isValid;
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-to-top';
scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 110px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--gradient-primary);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(255,107,53,0.3);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'scale(1.1)';
    scrollTopBtn.style.boxShadow = '0 6px 20px rgba(255,107,53,0.4)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'scale(1)';
    scrollTopBtn.style.boxShadow = '0 4px 15px rgba(255,107,53,0.3)';
});

// ========================================
// STATISTICS COUNTER ANIMATION
// ========================================
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(element) {
    const target = element.textContent;
    const isNumeric = /^\d+$/.test(target);

    if (!isNumeric) return;

    const duration = 2000;
    const increment = parseInt(target) / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= parseInt(target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCounter(entry.target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// ========================================
// PRODUCT CARDS INTERACTION
// ========================================
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.3s ease';
    });

    const productLink = card.querySelector('.product-link');
    if (productLink) {
        productLink.addEventListener('click', (e) => {
            e.preventDefault();
            const productTitle = card.querySelector('.product-title').textContent;

            // Scroll to contact section
            document.querySelector('#contacto').scrollIntoView({ behavior: 'smooth' });

            // Pre-fill the service field
            setTimeout(() => {
                const servicioSelect = document.getElementById('servicio');
                const mensajeTextarea = document.getElementById('mensaje');

                // Try to match the product to a service
                if (productTitle.toLowerCase().includes('tejido') || productTitle.toLowerCase().includes('alambrado')) {
                    servicioSelect.value = 'tejidos';
                } else if (productTitle.toLowerCase().includes('hierro') || productTitle.toLowerCase().includes('perfil')) {
                    servicioSelect.value = 'hierros';
                } else if (productTitle.toLowerCase().includes('chapa') || productTitle.toLowerCase().includes('planchuela')) {
                    servicioSelect.value = 'chapas';
                }

                // Pre-fill message
                mensajeTextarea.value = `Hola, me interesa consultar sobre: ${productTitle}`;

                // Show notification
                showNotification('Formulario preparado con tu consulta', 'success');
            }, 500);
        });
    }
});

// ========================================
// CONSOLE MESSAGE
// ========================================
console.log('%c🏗️ Metales Mar del Plata', 'font-size: 24px; font-weight: bold; color: #ff6b35;');
console.log('%c¡Bienvenido a nuestra ferretería especializada!', 'font-size: 14px; color: #1a1a2e;');
console.log('%cSitio desarrollado con ❤️ para ofrecer la mejor experiencia', 'font-size: 12px; color: #6c757d;');

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Keyboard navigation for mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Focus trap for mobile menu
const focusableElements = navMenu.querySelectorAll('a, button');
const firstFocusable = focusableElements[0];
const lastFocusable = focusableElements[focusableElements.length - 1];

navMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
});

// ========================================
// DYNAMIC YEAR IN FOOTER
// ========================================
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.textContent = footerYear.textContent.replace('2024', currentYear);
}

// ========================================
// PREVENT FORM DOUBLE SUBMISSION
// ========================================
let formSubmitting = false;

contactForm.addEventListener('submit', (e) => {
    if (formSubmitting) {
        e.preventDefault();
        return false;
    }
    formSubmitting = true;

    setTimeout(() => {
        formSubmitting = false;
    }, 3000);
});

// ========================================
// PERFORMANCE MONITORING
// ========================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Página cargada en ${pageLoadTime}ms`);
        }, 0);
    });
}

// ========================================
// LAZY LOADING INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lazyLoader !== 'undefined') {
        console.log('✅ Lazy Loader inicializado - Módulos se cargarán bajo demanda');
    } else {
        console.warn('⚠️ Lazy Loader no disponible');
    }
});

// ========================================
// DATA CLEANUP INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initDataCleanup === 'function') {
        const cleanupManager = initDataCleanup();
        if (cleanupManager) {
            console.log('✅ Sistema de limpieza automática de datos inicializado');
        }
    } else {
        console.warn('⚠️ DataCleanupManager no disponible');
    }
});
