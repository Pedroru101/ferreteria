# 🏗️ Metales & Hierros Mar del Plata

Sitio web ultra moderno para ferretería especializada en metales, hierros y estructuras metálicas. Optimizado para SEO, conversiones y ventas masivas.

## 🎯 Características Principales

- ✨ **Diseño Ultra Moderno**: Interfaz con gradientes, animaciones y efectos visuales de última generación
- 📱 **Totalmente Responsive**: Optimizado para todos los dispositivos (mobile, tablet, desktop)
- 🚀 **SEO Optimizado**: Metadatos, estructura semántica y optimización para buscadores
- 💬 **Botón Flotante WhatsApp**: Contacto directo con animaciones llamativas
- 📊 **Orientado a Conversión**: Múltiples CTAs y formularios optimizados
- ⚡ **Carga Rápida**: Optimización de rendimiento y lazy loading
- 🎨 **Animaciones AOS**: Efectos al hacer scroll para mejor experiencia
- 📧 **Formulario Inteligente**: Validación en tiempo real y múltiples métodos de contacto

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

### 1. Cambiar Número de WhatsApp

Busca y reemplaza `5492235000000` con tu número real en:
- `index.html` (líneas 33, 441, 579)
- `script.js` (línea 117)

**Formato correcto**: `549` + código de área + número (sin 0 ni 15)
**Ejemplo**: Para (0223) 456-7890 → `5492234567890`

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

## 🔧 Próximas Mejoras Sugeridas

- [ ] Integrar Google Analytics
- [ ] Agregar sistema de carrito de compras
- [ ] Implementar galería lightbox
- [ ] Conectar con sistema de inventario
- [ ] Agregar chat en vivo
- [ ] Implementar sistema de cotización automática
- [ ] Agregar mapa de Google Maps
- [ ] Integrar pasarela de pago (Mercado Pago)
- [ ] Sistema de reviews/testimonios
- [ ] Blog de noticias y novedades

## 📞 Canales de Contacto Configurados

- ✅ WhatsApp flotante con mensaje personalizado
- ✅ Formulario de contacto web
- ✅ Teléfono directo
- ✅ Email
- ✅ Redes sociales (Facebook, Instagram, LinkedIn, YouTube)

## 🎯 Optimizaciones SEO Incluidas

- Meta tags optimizados
- Open Graph para redes sociales
- Estructura semántica HTML5
- URLs amigables con anclas
- Alt text en imágenes
- Schema markup ready
- Sitemap.xml compatible
- Robots.txt compatible
- Performance optimizado
- Mobile-first approach

## 📄 Estructura de Archivos

```
ferreteria/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript
└── README.md          # Este archivo
```

## 💡 Tips de Uso

1. **Actualiza el número de WhatsApp** antes de publicar
2. **Agrega imágenes reales** de tus productos para mejor impacto
3. **Configura Google Analytics** para medir tráfico
4. **Personaliza los colores** según tu marca
5. **Completa todos los datos** de contacto reales
6. **Prueba en móviles** antes de lanzar
7. **Optimiza imágenes** (usa WebP, comprime JPG/PNG)
8. **Configura un dominio propio** para mejor profesionalismo

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
