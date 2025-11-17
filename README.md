# 🏗️ Metales & Hierros Mar del Plata

Sitio web ultra moderno para ferretería especializada en metales, hierros y estructuras metálicas. Optimizado para SEO, conversiones y ventas masivas.

## 🎯 Características Principales

### ✨ Diseño y UX
- **Diseño Ultra Moderno**: Interfaz con gradientes, animaciones y efectos visuales de última generación
- **Totalmente Responsive**: Optimizado para todos los dispositivos (mobile, tablet, desktop)
- **Modo Oscuro/Claro**: Toggle entre temas con persistencia en localStorage
- **Animaciones AOS**: Efectos al hacer scroll para mejor experiencia
- **Galería con Lightbox**: Visor de imágenes interactivo con navegación por teclado

### 🚀 SEO y Performance
- **SEO Avanzado**: Metadatos completos, Open Graph, Twitter Cards
- **Structured Data (JSON-LD)**: Schema.org para mejor indexación
- **Sitemap.xml y robots.txt**: Optimizado para crawlers
- **Carga Rápida**: Optimización de rendimiento y lazy loading
- **Google Analytics Ready**: Fácil integración con GA4, GTM y Facebook Pixel

### 💬 Conversión y Contacto
- **Botón Flotante WhatsApp**: Contacto directo con animaciones llamativas
- **Formulario Inteligente**: Validación en tiempo real y múltiples métodos de contacto
- **Configuración Centralizada**: Archivo config.js para fácil personalización
- **Orientado a Conversión**: Múltiples CTAs y formularios optimizados

### 🔧 Desarrollo
- **Manejo de Errores**: Try-catch en funciones críticas
- **Código Modular**: Fácil mantenimiento y escalabilidad
- **Accesibilidad WCAG**: ARIA labels, navegación por teclado
- **Sin Dependencias**: Vanilla JavaScript, sin frameworks pesados

## 🛠️ Tecnologías Utilizadas

- HTML5 (Semántico y accesible)
- CSS3 (Flexbox, Grid, Variables CSS, Animaciones)
- JavaScript ES6+ (Vanilla JS, sin dependencias pesadas)
- Font Awesome 6 (Iconografía)
- Google Fonts (Inter & Orbitron)
- AOS Library (Animate On Scroll)

## 📋 Secciones del Sitio

1. **Hero Section**: Presentación impactante con estadísticas y CTAs
2. **Productos**: Catálogo completo de metales y hierros
   - Hierros y Perfiles
   - Tejidos y Alambrados
   - Chapas y Planchuelas
   - Caños y Tubos
   - Bulonería y Fijaciones
   - Pintura y Tratamientos

3. **Servicios**: Propuesta de valor
   - Asesoramiento Técnico
   - Corte a Medida
   - Entrega a Domicilio
   - Venta Mayorista

4. **Fabricación a Medida**: Servicios especializados
   - Tejidos Personalizados
   - Postes a Medida
   - Servicio de Colocación
   - Proceso de Fabricación

5. **Galería**: Showcase de proyectos realizados
6. **Contacto**: Múltiples canales de comunicación
7. **Footer**: Información completa y enlaces

## 🚀 Instalación y Uso

### Opción 1: Uso Directo (Recomendado)

1. Descarga todos los archivos
2. Abre `index.html` en tu navegador
3. ¡Listo! El sitio funciona sin necesidad de servidor

### Opción 2: Con Servidor Local

```bash
# Si tienes Python instalado
python -m http.server 8000

# Si tienes Node.js instalado
npx http-server

# Luego abre: http://localhost:8000
```

## ⚙️ Personalización

### 🔧 Configuración Centralizada (NUEVO)

Ahora toda la configuración está centralizada en `config.js`. **Edita este archivo primero antes de usar el sitio.**

```javascript
// config.js
const CONFIG = {
    contact: {
        whatsapp: {
            number: '5492235123456',  // ⚠️ CAMBIAR por tu número real
            displayNumber: '+54 223 512-3456',
            defaultMessage: '¡Hola! Me interesa conocer más sobre sus productos.'
        },
        phone: {
            number: '(0223) 512-3456',
            href: 'tel:+542235123456'
        },
        email: 'info@metalesmdp.com.ar',  // ⚠️ CAMBIAR
        address: {
            street: 'Av. Luro 1234',       // ⚠️ CAMBIAR
            city: 'Mar del Plata',
            // ... más campos
        }
    },
    business: {
        name: 'Metales & Hierros Mar del Plata',
        // ... más campos
    },
    social: {
        facebook: 'https://facebook.com/metalesmdp',  // ⚠️ CAMBIAR
        instagram: 'https://instagram.com/metalesmdp',
        // ... más redes
    },
    analytics: {
        googleAnalyticsId: '',  // Agregar tu ID de GA4: G-XXXXXXXXXX
        // ... más opciones
    }
};
```

### 1. Cambiar Número de WhatsApp

**Ahora solo necesitas cambiar el número en `config.js`:**
- Edita `config.contact.whatsapp.number`
- **Formato correcto**: `549` + código de área + número (sin 0 ni 15)
- **Ejemplo**: Para (0223) 456-7890 → `5492234567890`

El sitio se actualizará automáticamente en todos los lugares.

### 2. Cambiar Colores

En `styles.css`, modifica las variables CSS (líneas 13-17):

```css
:root {
    --primary: #ff6b35;        /* Color principal (naranja) */
    --primary-dark: #e55a2b;   /* Color principal oscuro */
    --secondary: #1a1a2e;      /* Color secundario (azul oscuro) */
    --accent: #0f3460;         /* Color de acento */
}
```

### 3. Cambiar Información de Contacto

En `index.html`, actualiza:
- Teléfonos: líneas 441, 579
- Email: línea 456, 588
- Dirección: líneas 469, 583
- Redes sociales: líneas 485-500

### 4. Modificar Horarios de Atención

Busca `.business-hours` en `index.html` (líneas 505-518)

### 5. Agregar Imágenes Reales

Reemplaza los `.gallery-placeholder` en `index.html` (líneas 364-389) con:

```html
<div class="gallery-item">
    <img src="ruta/a/tu/imagen.jpg" alt="Descripción">
</div>
```

### 6. Cambiar Nombre y Logo

- **Texto**: Busca "Metales Mar del Plata" y "METALES" en `index.html`
- **Icono**: Línea 66 (`<i class="fas fa-industry"></i>`) - cambia por otro de Font Awesome

### 7. Modificar SEO

En `index.html` (líneas 5-10), actualiza:
```html
<meta name="description" content="Tu descripción...">
<meta name="keywords" content="tus, palabras, clave">
```

## 📊 Funcionalidades JavaScript

### Formulario de Contacto
- Validación en tiempo real
- Envío directo a WhatsApp
- Mensajes de error personalizados
- Prevención de doble envío

### Navegación
- Scroll suave entre secciones
- Menú hamburguesa para móviles
- Indicador de sección activa
- Navbar sticky con efecto scroll

### WhatsApp Flotante
- Animación de flotación constante
- Efecto pulse para llamar atención
- Tooltip con mensaje al hover
- Enlace directo con mensaje pre-cargado

### Extras
- Preloader animado
- Botón scroll to top
- Contador animado de estadísticas
- Notificaciones toast
- Lazy loading de imágenes
- Performance monitoring
- **Modo oscuro/claro** con persistencia
- **Galería lightbox** con navegación por teclado

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Naranja Principal | `#ff6b35` | CTAs, acentos, links |
| Naranja Oscuro | `#e55a2b` | Hover states |
| Azul Oscuro | `#1a1a2e` | Texto principal, fondos |
| Azul Medio | `#0f3460` | Fondos secundarios |
| Gris | `#6c757d` | Texto secundario |
| Claro | `#f8f9fa` | Fondos claros |

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔧 Mejoras Recientes (Versión 2.0)

- [x] ✅ Integrar Google Analytics (GA4, GTM, Facebook Pixel)
- [x] ✅ Implementar galería lightbox con navegación
- [x] ✅ Modo oscuro/claro con toggle
- [x] ✅ Configuración centralizada (config.js)
- [x] ✅ Structured Data (JSON-LD) para SEO
- [x] ✅ Sitemap.xml y robots.txt
- [x] ✅ Meta tags mejorados (Open Graph, Twitter Cards)
- [x] ✅ Mejor manejo de errores
- [x] ✅ Documentación de deployment

## 🔧 Próximas Mejoras Sugeridas

- [ ] Agregar sistema de carrito de compras
- [ ] Conectar con sistema de inventario
- [ ] Agregar chat en vivo (Tawk.to, Tidio)
- [ ] Implementar sistema de cotización automática
- [ ] Agregar mapa de Google Maps con ubicación
- [ ] Integrar pasarela de pago (Mercado Pago)
- [ ] Sistema de reviews/testimonios
- [ ] Blog de noticias y novedades
- [ ] PWA (Progressive Web App)

## 📞 Canales de Contacto Configurados

- ✅ WhatsApp flotante con mensaje personalizado
- ✅ Formulario de contacto web
- ✅ Teléfono directo
- ✅ Email
- ✅ Redes sociales (Facebook, Instagram, LinkedIn, YouTube)

## 🎯 Optimizaciones SEO Incluidas

- ✅ Meta tags optimizados (description, keywords, robots)
- ✅ Open Graph completo (Facebook, Twitter Cards)
- ✅ Estructura semántica HTML5
- ✅ URLs amigables con anclas
- ✅ Alt text en imágenes
- ✅ **Structured Data (JSON-LD)**: HardwareStore + LocalBusiness
- ✅ **Sitemap.xml** generado y listo para usar
- ✅ **Robots.txt** configurado para crawlers
- ✅ Performance optimizado (lazy loading, async scripts)
- ✅ Mobile-first approach
- ✅ Canonical URLs
- ✅ Theme-color para navegadores móviles

## 📄 Estructura de Archivos

```
ferreteria/
├── index.html          # Página principal (HTML5 semántico)
├── styles.css          # Estilos CSS (con variables y dark mode)
├── script.js           # JavaScript (ES6+, modular)
├── config.js           # 🆕 Configuración centralizada
├── sitemap.xml         # 🆕 Sitemap para SEO
├── robots.txt          # 🆕 Configuración de crawlers
├── README.md           # Documentación principal
└── DEPLOYMENT.md       # 🆕 Guía completa de deployment
```

## 💡 Tips de Uso

1. **⚠️ PRIMERO: Edita `config.js`** con tu información real (WhatsApp, contacto, redes)
2. **Configura Google Analytics** agregando tu ID en `config.js`
3. **Actualiza `sitemap.xml`** con tu dominio real
4. **Agrega imágenes reales** de tus productos para mejor impacto
5. **Personaliza los colores** según tu marca en `styles.css`
6. **Prueba en móviles** antes de lanzar
7. **Optimiza imágenes** (usa WebP, comprime JPG/PNG con TinyPNG)
8. **Configura un dominio propio** para mejor profesionalismo
9. **Lee `DEPLOYMENT.md`** antes de desplegar
10. **Prueba el modo oscuro** para asegurar que todo se vea bien

## 🚀 Despliegue

### Hosting Gratuito Recomendado:
- **Netlify** (drag & drop, SSL gratis)
- **Vercel** (GitHub integration)
- **GitHub Pages** (desde repositorio)
- **Cloudflare Pages** (rápido y global)

### Hosting Pago Argentino:
- **DonWeb**
- **Hostinger**
- **Banahosting**

## 📝 Licencia

Este proyecto fue creado para uso comercial. Puedes modificarlo libremente según tus necesidades.

## 🤝 Soporte

Para dudas o consultas sobre personalización:
1. Revisa este README completo
2. Inspecciona el código (está comentado)
3. Prueba en tu navegador con DevTools

---

**Desarrollado con ❤️ para Metales & Hierros Mar del Plata**

*¡Éxito con tu ferretería online! 🏗️*
