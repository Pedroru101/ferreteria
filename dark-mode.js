// ============================================
// MODO OSCURO - TOGGLE Y PERSISTENCIA
// ============================================

// Función para cambiar el tema
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Cambiar el tema
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Guardar en localStorage
  localStorage.setItem('theme', newTheme);
  
  // Actualizar el texto del botón
  updateToggleButton(newTheme);
  
  // Animación suave
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

// Función para actualizar el botón
function updateToggleButton(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = toggleBtn.querySelector('.theme-toggle-icon');
  const text = toggleBtn.querySelector('.theme-toggle-text');
  
  if (theme === 'dark') {
    icon.textContent = '☀️';
    text.textContent = 'Modo Claro';
  } else {
    icon.textContent = '🌙';
    text.textContent = 'Modo Oscuro';
  }
}

// Cargar el tema guardado al iniciar
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateToggleButton(savedTheme);
    });
  } else {
    updateToggleButton(savedTheme);
  }
}

// Inicializar al cargar la página
loadTheme();

// Detectar preferencia del sistema (opcional)
function detectSystemTheme() {
  if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleButton(theme);
  }
}

// Detectar cambios en la preferencia del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    const theme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleButton(theme);
  }
});

// Ejecutar detección al cargar
detectSystemTheme();
