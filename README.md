# 🏗️ Metales & Hierros Mar del Plata

Sitio web ultra moderno para ferretería especializada en metales, hierros y estructuras metálicas. Optimizado para SEO, conversiones y ventas masivas.

## 🎯 Características Principales

### ✨ Diseño y UX
- **Diseño Ultra Moderno**: Interfaz con gradientes, animaciones y efectos visuales de última generación
- **Totalmente Responsive**: Optimizado para todos los dispositivos (mobile, tablet, desktop)
- **Modo Oscuro/Claro**: Toggle entre temas con persistencia en localStorage
- **Animaciones AOS**: Efectos al hacer scroll para mejor experiencia
- **Galería con Lightbox**: Visor de imágenes interactivo con navegación por teclado
- **Paleta Verde Profesional**: Colores con alto contraste WCAG AA para accesibilidad

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

### 🆕 Sistema Integral de Alambrados (v3.0)
- **Calculadora de Materiales**: Cálculo automático de postes, alambre y tejido romboidal
- **Sistema de Cotizaciones**: Generación de cotizaciones con PDF y envío por WhatsApp
- **Catálogo Interactivo**: Modal de productos con especificaciones técnicas
- **Carrito de Cotización**: Selección de productos con persistencia en localStorage
- **Sistema de Pedidos**: Conversión de cotizaciones a órdenes de trabajo
- **Comparador de Soluciones**: Comparación de tipos de postes con scoring inteligente
- **Panel de Administración**: Gestión de pedidos, cotizaciones, precios y configuración
- **Seguimiento de Pedidos**: Consulta de estado de órdenes por número

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

5. **Calculadora de Presupuesto**: Cálculo automático de materiales
   - Ingreso de dimensiones (largo, ancho, perímetro)
   - Selección de tipo de poste (hormigón, quebracho, eucalipto, olimpo)
   - Cálculo de alambre vs tejido romboidal
   - Desglose detallado de materiales
   - Generación de cotización

6. **Comparador de Soluciones**: Comparación de opciones de cercado
   - Selección de hasta 3 tipos de postes
   - Tabla comparativa con especificaciones
   - Sistema de scoring por prioridades
   - Recomendaciones contextuales
   - Integración con calculadora

7. **Galería**: Showcase de proyectos realizados
8. **Contacto**: Múltiples canales de comunicación
9. **Footer**: Información completa y enlaces

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

## 🆕 Configuración del Sistema Integral de Alambrados

### Calculadora de Materiales

La calculadora se configura automáticamente desde `config.js`:

```javascript
CONFIG.calculator = {
    defaultPostSpacing: 2.5,      // Separación entre postes (metros)
    cornerPosts: 4,               // Cantidad de postes esquineros
    meshRollLength: 10            // Largo estándar de rollo (metros)
};
```

**Uso**: Los usuarios acceden desde la sección "Calculadora de Presupuesto" en el sitio.

### Sistema de Cotizaciones

Configuración de cotizaciones en `config.js`:

```javascript
CONFIG.quotation = {
    validityDays: 30,             // Días de validez de cotización
    pdfEnabled: true,             // Habilitar descarga de PDF
    whatsappEnabled: true         // Habilitar envío por WhatsApp
};

CONFIG.pricing = {
    installationPricePerMeter: 500,  // Precio por metro de instalación
    marginPercentage: 20,            // Margen de ganancia
    currency: 'ARS',                 // Moneda
    currencySymbol: '$'              // Símbolo de moneda
};
```

**Características**:
- Generación automática de ID único (COT-timestamp-random)
- Descarga en PDF con jsPDF
- Envío por WhatsApp con mensaje pre-formateado
- Guardado en localStorage con validez configurable
- Visualización con diseño del sitio

### Catálogo Interactivo

El catálogo carga productos de dos fuentes (en orden de prioridad):

1. **Google Sheets** (si está configurado en `config.js`)
2. **Datos hardcodeados** en `js/products-data.js` (fallback)

Para usar Google Sheets:

```javascript
CONFIG.products = {
    enableGoogleSheets: true,
    sheetId: 'TU_SHEET_ID',
    apiKey: 'TU_API_KEY'
};
```

**Características del modal de producto**:
- Especificaciones técnicas según tipo
- Precio y disponibilidad
- Botón "Agregar a Cotización"
- Integración con carrito flotante

### Carrito de Cotización Flotante

El carrito se muestra automáticamente cuando el usuario agrega productos:

- Contador de productos seleccionados
- Dropdown con lista de productos
- Botón "Generar Cotización"
- Persistencia en localStorage

### Sistema de Pedidos

Configuración de estados de pedidos:

```javascript
CONFIG.orders = {
    statusOptions: [
        { value: 'pending', label: 'Pendiente', color: '#f57c00' },
        { value: 'confirmed', label: 'Confirmado', color: '#4caf50' },
        { value: 'in_progress', label: 'En Proceso', color: '#0288d1' },
        { value: 'completed', label: 'Completado', color: '#2d7a3e' },
        { value: 'cancelled', label: 'Cancelado', color: '#d32f2f' }
    ]
};
```

**Flujo de pedido**:
1. Usuario acepta cotización
2. Completa formulario con datos personales
3. Sistema genera número de orden (ORD-YYYYMMDD-XXXX)
4. Envía por WhatsApp al administrador
5. Cliente puede consultar estado

### Comparador de Soluciones

El comparador permite seleccionar hasta 3 tipos de postes:

- **Hormigón**: Máxima durabilidad, sin mantenimiento
- **Quebracho**: Extrema dureza natural, estética premium
- **Eucalipto**: Económico, renovable, requiere tratamiento
- **Olimpo**: Hormigón + púas, máxima seguridad

**Sistema de scoring**: Los usuarios pueden ajustar prioridades (precio, durabilidad, estética) y el sistema calcula un score automático.

### Panel de Administración

Acceso: `admin.html`

**Autenticación**:
```javascript
CONFIG.admin = {
    defaultPassword: 'admin123'   // ⚠️ CAMBIAR en producción
};
```

**Funcionalidades**:
- Dashboard con estadísticas (cotizaciones, pedidos, ingresos)
- Gestión de pedidos (filtros, actualización de estado)
- Visualización de cotizaciones
- Gestión de productos y precios
- Configuración de parámetros
- Exportación a CSV
- Recarga de cache de Google Sheets

**Datos guardados en localStorage**:
- `ferreteria_orders`: Pedidos
- `ferreteria_quotations`: Cotizaciones
- `ferreteria_cart`: Carrito actual
- `ferreteria_config`: Configuración personalizada
- `ferreteria_products`: Productos (si no usa Google Sheets)

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

## 🔧 Funcionalidades Completadas (v3.0)

- [x] ✅ Calculadora de materiales para alambrados
- [x] ✅ Sistema de cotizaciones con PDF
- [x] ✅ Catálogo interactivo con modales
- [x] ✅ Carrito de cotización flotante
- [x] ✅ Sistema de pedidos y órdenes
- [x] ✅ Comparador de soluciones
- [x] ✅ Panel de administración
- [x] ✅ Seguimiento de pedidos
- [x] ✅ Integración con Google Sheets (opcional)
- [x] ✅ Exportación de datos a CSV
- [x] ✅ Paleta de colores verde profesional
- [x] ✅ Accesibilidad WCAG 2.1 AA

## 🔧 Próximas Mejoras Sugeridas

- [ ] Agregar chat en vivo (Tawk.to, Tidio)
- [ ] Agregar mapa de Google Maps con ubicación
- [ ] Integrar pasarela de pago (Mercado Pago)
- [ ] Sistema de reviews/testimonios
- [ ] Blog de noticias y novedades
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones por email
- [ ] Integración con sistemas de inventario
- [ ] Dashboard de analytics avanzado

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
├── index.html                    # Página principal (HTML5 semántico)
├── admin.html                    # 🆕 Panel de administración
├── styles.css                    # Estilos CSS (con variables y dark mode)
├── script.js                     # JavaScript (ES6+, modular)
├── config.js                     # Configuración centralizada
├── products-loader.js            # Cargador de Google Sheets
├── sitemap.xml                   # Sitemap para SEO
├── robots.txt                    # Configuración de crawlers
├── README.md                     # Documentación principal
├── DEPLOYMENT.md                 # Guía completa de deployment
├── js/
│   ├── calculator.js             # 🆕 Calculadora de materiales
│   ├── calculator-ui.js          # 🆕 UI de calculadora
│   ├── quotation.js              # 🆕 Sistema de cotizaciones
│   ├── quotation-modal.js        # 🆕 Modal de cotización
│   ├── quotation-display.js      # 🆕 Visualización de cotización
│   ├── orders.js                 # 🆕 Sistema de pedidos
│   ├── order-tracking.js         # 🆕 Seguimiento de pedidos
│   ├── catalog.js                # 🆕 Catálogo interactivo
│   ├── comparator.js             # 🆕 Comparador de soluciones
│   ├── admin.js                  # 🆕 Panel de administración
│   ├── products-data.js          # 🆕 Datos de productos (fallback)
│   ├── progress-manager.js       # Guardado automático de progreso
│   ├── progress-stepper.js       # Indicador de progreso
│   ├── lazy-loader.js            # Carga diferida de módulos
│   ├── loaders.js                # Spinners y preloaders
│   ├── data-cleanup.js           # Limpieza automática de datos
│   ├── accessibility.js          # Funciones de accesibilidad
│   └── utils.js                  # Utilidades generales
├── css/
│   ├── calculator.css            # 🆕 Estilos calculadora
│   ├── quotation.css             # 🆕 Estilos cotizaciones
│   ├── orders.css                # 🆕 Estilos pedidos
│   ├── comparator.css            # 🆕 Estilos comparador
│   ├── admin.css                 # 🆕 Estilos panel admin
│   ├── progress-stepper.css      # Estilos indicador progreso
│   ├── loaders.css               # Estilos spinners
│   └── accessibility.css         # Estilos accesibilidad
└── [Documentación de módulos]    # Guías de cada funcionalidad
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
11. **Cambia la contraseña de admin** en `config.js` antes de desplegar
12. **Prueba la calculadora** con diferentes dimensiones
13. **Verifica el envío por WhatsApp** desde cotizaciones y pedidos
14. **Configura Google Sheets** si deseas gestionar productos dinámicamente

## 🆕 Troubleshooting - Sistema Integral de Alambrados

### Calculadora no calcula correctamente

**Problema**: Los resultados de la calculadora no son precisos.

**Solución**:
1. Verifica que `config.calculator.defaultPostSpacing` sea correcto (default: 2.5m)
2. Asegúrate de que los inputs sean números válidos
3. Abre la consola (F12) y busca errores de JavaScript
4. Recarga la página (Ctrl+F5)

### Cotizaciones no se guardan

**Problema**: Las cotizaciones generadas no persisten en localStorage.

**Solución**:
1. Verifica que localStorage esté habilitado en el navegador
2. Comprueba que no haya alcanzado el límite de almacenamiento (5MB)
3. Abre DevTools → Application → Local Storage y busca `ferreteria_quotations`
4. Si está lleno, ejecuta la limpieza automática: `cleanupOldData()`

### WhatsApp no abre

**Problema**: El botón de WhatsApp no abre la aplicación o navegador.

**Solución**:
1. Verifica que el número en `config.js` sea correcto (formato: 549XXXXXXXXX)
2. Asegúrate de que el número tenga el código de país (54 para Argentina)
3. Prueba en un navegador diferente
4. En móvil, asegúrate de tener WhatsApp instalado

### Panel de administración no abre

**Problema**: No puedo acceder a `admin.html`.

**Solución**:
1. Verifica que `admin.html` esté en la carpeta raíz de `ferreteria/`
2. Intenta acceder directamente: `file:///ruta/a/ferreteria/admin.html`
3. Comprueba la contraseña en `config.js` (default: admin123)
4. Limpia el cache del navegador (Ctrl+Shift+Del)

### Google Sheets no carga productos

**Problema**: Los productos no se cargan desde Google Sheets.

**Solución**:
1. Verifica que `CONFIG.products.enableGoogleSheets` sea `true`
2. Comprueba que el `sheetId` y `apiKey` sean correctos
3. Asegúrate de que la hoja esté compartida públicamente
4. Abre la consola (F12) y busca errores de CORS
5. Si falla, el sistema usa automáticamente `products-data.js` como fallback

### Modo oscuro no funciona

**Problema**: El modo oscuro no se aplica correctamente.

**Solución**:
1. Verifica que `styles.css` tenga las variables CSS para `[data-theme="dark"]`
2. Comprueba que localStorage tenga la clave `theme` guardada
3. Abre DevTools → Application → Local Storage y busca `theme`
4. Recarga la página después de cambiar el tema

### Pedidos no se envían por WhatsApp

**Problema**: El mensaje de pedido no se envía correctamente.

**Solución**:
1. Verifica que el número de WhatsApp en `config.js` sea correcto
2. Asegúrate de que todos los campos del formulario estén completos
3. Comprueba que el navegador permita abrir nuevas pestañas
4. Prueba con un número de teléfono diferente

### localStorage lleno

**Problema**: Recibo error "QuotaExceededError" al guardar datos.

**Solución**:
1. Ejecuta la limpieza automática: `cleanupOldData()`
2. Exporta los datos importantes a CSV desde el panel de admin
3. Limpia manualmente: `localStorage.clear()` (⚠️ borra todo)
4. Considera usar una base de datos en lugar de localStorage

### Accesibilidad - Navegación por teclado no funciona

**Problema**: No puedo navegar con Tab en los modales.

**Solución**:
1. Verifica que los elementos tengan `tabindex` correcto
2. Asegúrate de que los modales tengan focus trap implementado
3. Abre la consola y verifica que no haya errores de JavaScript
4. Prueba en un navegador diferente

### Performance lento

**Problema**: El sitio carga lentamente o se congela.

**Solución**:
1. Abre DevTools → Performance y graba un perfil
2. Verifica que no haya memory leaks (Application → Memory)
3. Comprueba el tamaño de localStorage (máximo 5MB)
4. Optimiza imágenes (usa WebP, comprime con TinyPNG)
5. Desactiva Google Sheets si no lo necesitas
6. Limpia datos antiguos: `cleanupOldData()`

### Estilos CSS no se aplican

**Problema**: Los estilos de los nuevos módulos no se ven.

**Solución**:
1. Verifica que los archivos CSS estén en `css/` (calculator.css, quotation.css, etc.)
2. Comprueba que estén importados en `styles.css`: `@import url('css/calculator.css');`
3. Abre DevTools → Network y verifica que los CSS se carguen (status 200)
4. Recarga con Ctrl+F5 para limpiar cache
5. Verifica que no haya conflictos de especificidad CSS

### JavaScript no se ejecuta

**Problema**: Los módulos JavaScript no funcionan.

**Solución**:
1. Verifica que los archivos JS estén en `js/` (calculator.js, quotation.js, etc.)
2. Comprueba que estén incluidos en `index.html` antes de `script.js`
3. Abre DevTools → Console y busca errores
4. Verifica que no haya errores de sintaxis: `node -c archivo.js`
5. Asegúrate de que los nombres de funciones sean correctos

## 📊 Roadmap Actualizado

### Versión 3.0 - Sistema Integral de Alambrados (COMPLETADO)

**Fase 1: Fundamentos** ✅
- Paleta de colores verde profesional
- Estructura de directorios y archivos base
- Configuración centralizada (config.js)
- Clases de utilidades base

**Fase 2: Calculadora** ✅
- Estructura HTML y CSS
- Clase MaterialCalculator
- UI interactiva con recálculo automático
- Múltiples segmentos
- Integración con cotizaciones

**Fase 3: Cotizaciones** ✅
- Clase Quotation
- Modal de cotización
- Generación de PDF con jsPDF
- Envío por WhatsApp
- Guardado en localStorage
- Visualización de cotización guardada

**Fase 4: Catálogo Interactivo** ✅
- Clase CatalogManager
- Modal de producto detallado
- Carrito flotante de cotización
- Funcionalidad "Agregar a Cotización"
- Resumen de productos seleccionados

**Fase 5: Pedidos** ✅
- Clase Order
- Formulario de pedido
- Conversión de cotización a pedido
- Envío por WhatsApp
- Pantalla de confirmación
- Consulta de estado de pedido
- Visualización de estado

**Fase 6: Comparador** ✅
- Datos de comparación
- Estructura HTML
- Estilos CSS
- Selección de productos
- Tabla comparativa
- Sistema de scoring
- Recomendaciones contextuales
- Botón "Usar esta solución"

**Fase 7: Administración** ✅
- Autenticación simple
- Dashboard con estadísticas
- Gestión de pedidos
- Visualización de cotizaciones
- Gestión de productos y precios
- Configuración de parámetros
- Exportación a CSV
- Recarga de cache de Google Sheets

**Fase 8: Integración y Pulido** ✅
- Actualización de navegación
- Guardado automático de progreso
- Indicadores de progreso
- Loaders y spinners
- Lazy loading
- Limpieza automática de datos
- Meta tags y SEO
- Accesibilidad completa

**Fase 9: Testing y Validación** ✅
- Testing de calculadora
- Testing de cotizaciones
- Testing de catálogo
- Testing de pedidos
- Testing de comparador
- Testing de admin
- Testing de accesibilidad
- Testing de responsive design
- Testing de modo oscuro
- Testing de performance

**Fase 10: Documentación** ✅
- Documentación de usuario
- Documentación de administrador
- Actualización de README
- Archivo de configuración de ejemplo
- Preparación para deployment
- Testing en producción
- Backup de datos de ejemplo
- Configuración de analytics

### Versión 4.0 - Mejoras Futuras (Planeado)

- [ ] Chat en vivo (Tawk.to, Tidio)
- [ ] Mapa de Google Maps
- [ ] Pasarela de pago (Mercado Pago)
- [ ] Sistema de reviews/testimonios
- [ ] Blog de noticias
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones por email
- [ ] Integración con sistemas de inventario
- [ ] Dashboard de analytics avanzado
- [ ] API REST para integraciones

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

## 📚 Documentación de Módulos

Cada módulo del sistema integral tiene su propia documentación:

### Calculadora de Materiales
- **Archivo**: `CALCULATOR_USER_GUIDE.md` y `CALCULATOR_TESTING_README.md`
- **Módulos JS**: `calculator.js`, `calculator-ui.js`
- **Estilos**: `css/calculator.css`

### Sistema de Cotizaciones
- **Archivo**: `QUOTATION_USER_GUIDE.md` y `QUOTATION_TESTING_README.md`
- **Módulos JS**: `quotation.js`, `quotation-modal.js`, `quotation-display.js`
- **Estilos**: `css/quotation.css`

### Catálogo Interactivo
- **Archivo**: `CATALOG_TESTING_README.md`
- **Módulos JS**: `catalog.js`
- **Estilos**: Integrado en `styles.css`

### Sistema de Pedidos
- **Archivo**: `ORDERS_SYSTEM_README.md`, `ORDERS_TESTING_README.md`
- **Módulos JS**: `orders.js`, `order-tracking.js`
- **Estilos**: `css/orders.css`

### Comparador de Soluciones
- **Archivo**: `COMPARATOR_USER_GUIDE.md`, `COMPARATOR_TESTING_README.md`
- **Módulos JS**: `comparator.js`
- **Estilos**: `css/comparator.css`

### Panel de Administración
- **Archivo**: `ADMIN_USER_GUIDE.md`, `ADMIN_TESTING_README.md`
- **Módulos JS**: `admin.js`
- **Estilos**: `css/admin.css`
- **HTML**: `admin.html`

### Funcionalidades Transversales
- **Progreso**: `progress-manager.js`, `progress-stepper.js`
- **Loaders**: `loaders.js`, `lazy-loader.js`
- **Limpieza**: `data-cleanup.js`
- **Accesibilidad**: `accessibility.js`
- **Utilidades**: `utils.js`

## 🎨 Paleta de Colores Verde (v3.0)

### Modo Claro
```css
--primary: #2d7a3e;           /* Verde bosque profesional */
--primary-hover: #236030;     /* Verde bosque oscuro */
--secondary: #1a4d2e;         /* Verde pino oscuro */
--accent: #4caf50;            /* Verde vibrante */
--accent-light: #81c784;      /* Verde menta */
--bg-primary: #f8faf9;        /* Blanco verdoso */
--bg-secondary: #e8f5e9;      /* Verde muy claro */
--text-primary: #1a1a1a;      /* Negro suave */
--text-secondary: #4a5f4a;    /* Gris verdoso */
--border: #c8e6c9;            /* Verde pastel */
```

### Modo Oscuro
```css
--primary: #4caf50;           /* Verde vibrante */
--primary-hover: #66bb6a;     /* Verde claro */
--secondary: #2d7a3e;         /* Verde bosque */
--accent: #81c784;            /* Verde menta */
--accent-dark: #1b5e20;       /* Verde oscuro profundo */
--bg-primary: #0d1f0d;        /* Negro verdoso */
--bg-secondary: #1a2e1a;      /* Verde muy oscuro */
--bg-tertiary: #243324;       /* Verde oscuro medio */
--text-primary: #e8f5e9;      /* Verde muy claro */
--text-secondary: #a5d6a7;    /* Verde claro */
--border: #2d4a2d;            /* Verde oscuro */
```

**Contraste WCAG AA**: Todos los colores cumplen con ratio mínimo de 4.5:1 para texto normal.

## 📞 Soporte y Contacto

### Para Problemas Técnicos
1. Revisa la sección **Troubleshooting** de este README
2. Consulta la documentación específica del módulo
3. Abre DevTools (F12) y busca errores en la consola
4. Verifica que `config.js` esté correctamente configurado

### Para Mejoras o Sugerencias
1. Revisa el roadmap de versiones futuras
2. Considera las mejoras sugeridas en la sección "Próximas Mejoras"
3. Contacta al equipo de desarrollo

## 📝 Licencia

Este proyecto fue creado para uso comercial. Puedes modificarlo libremente según tus necesidades.

## 🤝 Soporte

Para dudas o consultas sobre personalización:
1. Revisa este README completo
2. Consulta la documentación de módulos específicos
3. Inspecciona el código (está comentado)
4. Prueba en tu navegador con DevTools (F12)
5. Verifica la sección de Troubleshooting

## 📋 Checklist de Configuración Inicial

Antes de desplegar, asegúrate de:

- [ ] Editar `config.js` con información real (WhatsApp, contacto, redes)
- [ ] Cambiar contraseña de admin en `config.js`
- [ ] Configurar Google Analytics (si deseas)
- [ ] Configurar Google Sheets (si deseas usar productos dinámicos)
- [ ] Actualizar `sitemap.xml` con tu dominio
- [ ] Agregar imágenes reales de productos
- [ ] Probar calculadora con diferentes dimensiones
- [ ] Probar cotizaciones y envío por WhatsApp
- [ ] Probar panel de administración
- [ ] Probar en móvil, tablet y desktop
- [ ] Probar modo oscuro/claro
- [ ] Verificar accesibilidad (navegación por teclado)
- [ ] Verificar performance (Lighthouse)
- [ ] Hacer backup de datos de ejemplo
- [ ] Leer `DEPLOYMENT.md` antes de desplegar

---

**Desarrollado con ❤️ para Metales & Hierros Mar del Plata**

**Versión**: 3.0 - Sistema Integral de Alambrados

**Última actualización**: 2024

*¡Éxito con tu ferretería online! 🏗️*
