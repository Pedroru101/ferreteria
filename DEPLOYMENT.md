# 🚀 Guía de Deployment - Metales & Hierros Mar del Plata

Esta guía te ayudará a configurar y desplegar tu sitio web en diferentes plataformas.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Deployment en Netlify](#deployment-en-netlify)
3. [Deployment en Vercel](#deployment-en-vercel)
4. [Deployment en GitHub Pages](#deployment-en-github-pages)
5. [Deployment en Hosting Tradicional](#deployment-en-hosting-tradicional)
6. [Configuración Post-Deployment](#configuración-post-deployment)
7. [SEO y Analytics](#seo-y-analytics)

---

## 🔧 Configuración Inicial

Antes de desplegar, **DEBES** configurar el archivo `config.js`:

### 1. Edita `config.js`

```javascript
// 1. INFORMACIÓN DE CONTACTO (OBLIGATORIO)
contact: {
    whatsapp: {
        number: '5492235123456',      // ⚠️ CAMBIAR: Tu número real
        displayNumber: '+54 223 512-3456',
        defaultMessage: '¡Hola! Me interesa conocer más sobre sus productos.'
    },
    phone: {
        number: '(0223) 512-3456',     // ⚠️ CAMBIAR
        href: 'tel:+542235123456'
    },
    email: 'info@metalesmdp.com.ar',   // ⚠️ CAMBIAR
    address: {
        street: 'Av. Luro 1234',       // ⚠️ CAMBIAR
        city: 'Mar del Plata',
        // ... resto de la dirección
    }
},

// 2. REDES SOCIALES (OBLIGATORIO)
social: {
    facebook: 'https://facebook.com/metalesmdp',   // ⚠️ CAMBIAR
    instagram: 'https://instagram.com/metalesmdp', // ⚠️ CAMBIAR
    // ... etc
},

// 3. URL DEL SITIO (OBLIGATORIO)
site: {
    url: 'https://www.metalesmdp.com.ar',  // ⚠️ CAMBIAR a tu dominio
    // ... resto
},

// 4. GOOGLE ANALYTICS (OPCIONAL pero recomendado)
analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX',  // ⚠️ Agregar tu ID de GA4
    googleTagManagerId: '',              // Opcional
    facebookPixelId: ''                  // Opcional
}
```

### 2. Actualiza `sitemap.xml`

Reemplaza `https://www.metalesmdp.com.ar` con tu dominio real en todas las URLs.

### 3. Verifica los meta tags en `index.html`

Busca y actualiza (si es necesario):
- Open Graph images: `og-image.jpg` y `twitter-image.jpg`
- URLs canónicas
- Información de contacto en el JSON-LD

---

## 🌐 Deployment en Netlify

### Opción 1: Desde GitHub (Recomendado)

1. **Push tu código a GitHub**
   ```bash
   git add .
   git commit -m "Configuración inicial del sitio"
   git push origin main
   ```

2. **Conecta con Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Click en "Add new site" → "Import an existing project"
   - Conecta tu repositorio de GitHub
   - Configuración de build:
     - Build command: (dejar vacío)
     - Publish directory: `/` (raíz)

3. **Deploy**
   - Click en "Deploy site"
   - Netlify te dará una URL temporal como `https://random-name-123.netlify.app`

4. **Configurar dominio personalizado** (opcional)
   - En Netlify: Site settings → Domain management
   - Agrega tu dominio personalizado
   - Configura los DNS según las instrucciones

### Opción 2: Netlify Drop (Más simple)

1. Arrastra la carpeta del proyecto directamente a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Netlify lo publicará automáticamente

---

## ▲ Deployment en Vercel

1. **Instala Vercel CLI** (opcional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   **Opción A: Desde GitHub**
   - Ve a [vercel.com](https://vercel.com)
   - "Add New Project" → Importa tu repositorio
   - Framework Preset: "Other"
   - Root Directory: `./`
   - Deploy

   **Opción B: Desde línea de comandos**
   ```bash
   cd tu-proyecto
   vercel
   ```

3. **Configurar dominio**
   - Project Settings → Domains
   - Agrega tu dominio personalizado

---

## 📄 Deployment en GitHub Pages

1. **Configura el repositorio**
   ```bash
   git add .
   git commit -m "Preparar para GitHub Pages"
   git push origin main
   ```

2. **Activa GitHub Pages**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Save

3. **Espera el deployment**
   - Tu sitio estará disponible en: `https://tuusuario.github.io/nombre-repo/`

4. **Dominio personalizado** (opcional)
   - En Settings → Pages → Custom domain
   - Agrega tu dominio
   - Configura un registro `CNAME` en tu proveedor DNS apuntando a `tuusuario.github.io`

---

## 🖥️ Deployment en Hosting Tradicional (cPanel, FTP)

1. **Archivos necesarios para subir**:
   ```
   /
   ├── index.html
   ├── styles.css
   ├── script.js
   ├── config.js
   ├── sitemap.xml
   ├── robots.txt
   └── (cualquier imagen que agregues)
   ```

2. **Sube los archivos**:
   - **Vía FTP**: Usa FileZilla, Cyberduck o similar
   - **Vía cPanel**: File Manager → Upload
   - Sube todos los archivos a la carpeta `public_html` o `www`

3. **Permisos**:
   - Archivos: `644`
   - Carpetas: `755`

4. **Verifica**:
   - Accede a tu dominio
   - Verifica que todo funcione correctamente

---

## ⚙️ Configuración Post-Deployment

### 1. Configura Google Analytics (Recomendado)

1. **Crea una propiedad en Google Analytics**
   - Ve a [analytics.google.com](https://analytics.google.com)
   - Admin → Crear propiedad
   - Selecciona "GA4"
   - Obtendrás un ID como `G-XXXXXXXXXX`

2. **Agrega el ID en `config.js`**
   ```javascript
   analytics: {
       googleAnalyticsId: 'G-XXXXXXXXXX'  // Tu ID real
   }
   ```

3. **Verifica la instalación**
   - Visita tu sitio
   - En GA4: Informes → Tiempo real
   - Deberías verte como usuario activo

### 2. Configura Google Search Console

1. **Verifica la propiedad**
   - Ve a [search.google.com/search-console](https://search.google.com/search-console)
   - Agrega tu sitio web
   - Verifica con tag HTML o archivo

2. **Envía el sitemap**
   - En Search Console: Sitemaps
   - Agrega: `https://tudominio.com/sitemap.xml`

### 3. Configura redes sociales

1. **Facebook/Instagram Business**
   - Crea página de empresa
   - Actualiza los enlaces en `config.js`

2. **Verifica Open Graph**
   - Usa [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - Ingresa tu URL para verificar las previews

### 4. Optimiza imágenes (si agregas)

**Herramientas recomendadas**:
- [TinyPNG](https://tinypng.com) - Compresión
- [Squoosh](https://squoosh.app) - Optimización avanzada
- [Cloudinary](https://cloudinary.com) - CDN gratuito para imágenes

**Tamaños recomendados**:
- Open Graph image: 1200x630px
- Twitter Card: 1200x600px
- Logo: 500x500px
- Productos/Galería: 800x600px

---

## 🎨 Personalización Adicional

### Agrega tu logo

1. Crea un archivo `logo.png` (500x500px recomendado)
2. Sube a la carpeta raíz
3. Edita `index.html`:
   ```html
   <div class="logo">
       <img src="logo.png" alt="Logo">
       <span class="logo-text">...</span>
   </div>
   ```

### Agrega imágenes a la galería

1. Crea carpeta `images/gallery/`
2. Agrega tus imágenes (nombre: `proyecto-1.jpg`, `proyecto-2.jpg`, etc.)
3. Edita `index.html` en la sección de galería:
   ```html
   <div class="gallery-item" data-src="images/gallery/proyecto-1.jpg">
       <!-- contenido -->
   </div>
   ```

---

## 🔍 SEO y Analytics

### Checklist Post-Deploy

- [ ] Verificar que el sitio carga correctamente
- [ ] Verificar que el sitemap.xml es accesible: `tudominio.com/sitemap.xml`
- [ ] Verificar robots.txt: `tudominio.com/robots.txt`
- [ ] Verificar meta tags con [Meta Tags](https://metatags.io)
- [ ] Verificar structured data con [Schema Markup Validator](https://validator.schema.org/)
- [ ] Configurar Google Analytics
- [ ] Enviar sitemap a Google Search Console
- [ ] Verificar velocidad con [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Verificar mobile-friendly con [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] Probar WhatsApp integration
- [ ] Probar formulario de contacto
- [ ] Verificar modo oscuro funciona correctamente

### Monitoreo

**Herramientas recomendadas**:
- [Google Analytics](https://analytics.google.com) - Tráfico y comportamiento
- [Google Search Console](https://search.google.com/search-console) - SEO
- [Hotjar](https://hotjar.com) - Mapas de calor (opcional)
- [Uptime Robot](https://uptimerobot.com) - Monitor de disponibilidad (gratis)

---

## 🆘 Solución de Problemas Comunes

### El sitio no carga

1. Verifica que subiste todos los archivos
2. Verifica permisos (archivos: 644, carpetas: 755)
3. Revisa la consola del navegador (F12) para errores

### WhatsApp no funciona

1. Verifica el número en `config.js` (formato: `5492235123456`)
2. No debe tener espacios, guiones, ni paréntesis
3. Debe incluir código de país (54 para Argentina)

### Google Analytics no registra visitas

1. Verifica que agregaste el ID correcto en `config.js`
2. Espera 24-48 horas para los primeros datos
3. Usa "Tiempo real" en GA4 para verificar inmediatamente

### Imágenes de Open Graph no aparecen

1. Sube las imágenes `og-image.jpg` y `twitter-image.jpg`
2. Actualiza las URLs en el HTML
3. Usa [Facebook Debugger](https://developers.facebook.com/tools/debug/) para limpiar caché

### Modo oscuro no se guarda

1. Verifica que el navegador permite localStorage
2. No funciona en modo incógnito/privado

---

## 📞 Soporte

Si tienes problemas con el deployment, verifica:

1. **Documentación de la plataforma**:
   - [Netlify Docs](https://docs.netlify.com)
   - [Vercel Docs](https://vercel.com/docs)
   - [GitHub Pages Docs](https://docs.github.com/pages)

2. **Problemas específicos del código**:
   - Abre un issue en el repositorio
   - Revisa los logs de error en la consola del navegador (F12)

---

## ✅ Checklist Final

Antes de considerar el proyecto "en producción":

- [ ] Configuración de `config.js` completada
- [ ] Sitio desplegado y accesible
- [ ] Dominio personalizado configurado (si aplica)
- [ ] Google Analytics funcionando
- [ ] Search Console configurado
- [ ] Sitemap enviado
- [ ] Redes sociales actualizadas
- [ ] WhatsApp probado
- [ ] Formulario de contacto probado
- [ ] Mobile responsive verificado
- [ ] SEO básico verificado
- [ ] Velocidad optimizada
- [ ] SSL/HTTPS activo

---

**¡Felicitaciones! 🎉 Tu sitio web está listo para recibir clientes.**

Para actualizaciones futuras, simplemente edita los archivos y vuelve a deployar usando el mismo método que elegiste.
