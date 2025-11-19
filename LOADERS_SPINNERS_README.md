# Sistema de Loaders y Spinners

## Descripción General

El sistema de loaders y spinners proporciona una forma consistente y reutilizable de mostrar indicadores de carga en diferentes contextos de la aplicación. Incluye:

- **Overlay Loader**: Cubre toda la pantalla con un fondo oscuro y un spinner
- **Inline Loader**: Se muestra dentro de un contenedor específico
- **Button Spinner**: Agrega un spinner a un botón mientras se procesa
- **Skeleton Loader**: Muestra un placeholder animado mientras se cargan datos
- **Progress Loader**: Barra de progreso animada

## Instalación

El sistema está incluido en el proyecto. Solo necesitas asegurarte de que:

1. El archivo CSS esté incluido en `index.html`:
```html
<link rel="stylesheet" href="css/loaders.css">
```

2. El archivo JavaScript esté incluido en `index.html`:
```html
<script src="js/loaders.js"></script>
```

## Uso

### 1. Overlay Loader (Pantalla Completa)

Muestra un loader que cubre toda la pantalla. Ideal para operaciones largas.

```javascript
// Mostrar overlay
loaderManager.showOverlay('Cargando...', 'Por favor espera');

// Ocultar overlay
loaderManager.hideOverlay();

// Usar con función asincrónica
await loaderManager.withOverlay(
    async () => {
        // Tu código aquí
        const data = await fetchData();
        return data;
    },
    'Cargando datos...',
    'Conectando con el servidor'
);
```

### 2. Inline Loader (Dentro de un Contenedor)

Muestra un loader dentro de un elemento específico.

```javascript
// Mostrar inline loader
const loaderId = loaderManager.showInline(
    '#contenedor',
    'Cargando productos...',
    'spinner' // tipo: 'spinner', 'dots', 'wave', 'progress'
);

// Ocultar inline loader
loaderManager.hideInline(loaderId);

// Usar con función asincrónica
await loaderManager.withInline(
    '#contenedor',
    async () => {
        const data = await fetchProducts();
        return data;
    },
    'Cargando catálogo...',
    'spinner'
);
```

### 3. Button Spinner

Agrega un spinner a un botón mientras se procesa una acción.

```javascript
// Agregar spinner a botón
loaderManager.addButtonSpinner('#miBoton', 'Procesando...');

// Remover spinner
loaderManager.removeButtonSpinner('#miBoton');

// Usar con función asincrónica
await loaderManager.withButtonSpinner(
    '#miBoton',
    async () => {
        // Tu código aquí
        await procesarDatos();
    },
    'Guardando...'
);
```

### 4. Skeleton Loader

Muestra un placeholder animado mientras se cargan datos.

```javascript
// Crear skeleton loader
loaderManager.createSkeleton('#contenedor', {
    lines: 3,           // Número de líneas de texto
    avatarSize: 48,     // Tamaño del avatar en píxeles
    showAvatar: true,   // Mostrar avatar
    showCard: false     // Mostrar card
});

// Después de cargar, reemplazar con contenido real
document.querySelector('#contenedor').innerHTML = contenidoReal;
```

### 5. Tipos de Loaders Inline

#### Spinner (por defecto)
```javascript
loaderManager.showInline('#contenedor', 'Cargando...', 'spinner');
```

#### Puntos (Dots)
```javascript
loaderManager.showInline('#contenedor', 'Cargando...', 'dots');
```

#### Onda (Wave)
```javascript
loaderManager.showInline('#contenedor', 'Cargando...', 'wave');
```

#### Progreso (Progress)
```javascript
loaderManager.showInline('#contenedor', 'Procesando...', 'progress');
```

### 6. Métodos Abreviados

```javascript
// Mostrar overlay
loaderManager.showOverlay('Texto', 'Subtexto');

// Mostrar inline con spinner
loaderManager.showInline('#contenedor', 'Texto');

// Mostrar inline con puntos
loaderManager.showDots('#contenedor', 'Cargando...');

// Mostrar inline con onda
loaderManager.showWave('#contenedor', 'Cargando...');

// Mostrar inline con progreso
loaderManager.showProgress('#contenedor', 'Procesando...');
```

## Ejemplos Prácticos

### Ejemplo 1: Cargar Productos desde Google Sheets

```javascript
async function cargarProductos() {
    try {
        await loaderManager.withOverlay(
            async () => {
                const productos = await productsLoader.loadProductos();
                mostrarProductos(productos);
            },
            'Cargando catálogo...',
            'Conectando con Google Sheets'
        );
    } catch (error) {
        showNotification('Error al cargar productos', 'error');
    }
}
```

### Ejemplo 2: Generar PDF

```javascript
async function generarPDF() {
    const btn = document.getElementById('downloadBtn');
    
    try {
        await loaderManager.withButtonSpinner(
            btn,
            async () => {
                const pdf = await generarPDFCotizacion();
                descargarPDF(pdf);
            },
            'Generando PDF...'
        );
    } catch (error) {
        showNotification('Error al generar PDF', 'error');
    }
}
```

### Ejemplo 3: Cargar Datos en Contenedor

```javascript
async function cargarDatos() {
    try {
        await loaderManager.withInline(
            '#datosContainer',
            async () => {
                const datos = await fetchDatos();
                mostrarDatos(datos);
            },
            'Cargando datos...',
            'spinner'
        );
    } catch (error) {
        showNotification('Error al cargar datos', 'error');
    }
}
```

### Ejemplo 4: Skeleton Loader para Tarjetas

```javascript
async function cargarTarjetas() {
    const container = document.getElementById('tarjetas');
    
    // Mostrar skeleton
    loaderManager.createSkeleton(container, {
        lines: 4,
        showCard: true
    });
    
    // Cargar datos
    const tarjetas = await fetchTarjetas();
    
    // Mostrar contenido real
    container.innerHTML = renderTarjetas(tarjetas);
}
```

## Estilos y Personalización

### Variables CSS Disponibles

Los loaders utilizan las variables CSS del tema:

```css
--primary: Color principal
--bg-primary: Fondo principal
--text-primary: Texto principal
--shadow-color: Color de sombra
```

### Personalizar Colores

Para cambiar los colores de los loaders, modifica las variables CSS en `styles.css`:

```css
:root {
    --primary: #2d7a3e;
    --bg-primary: #f8faf9;
    --text-primary: #1a1a1a;
}

[data-theme="dark"] {
    --primary: #4caf50;
    --bg-primary: #0d1f0d;
    --text-primary: #e8f5e9;
}
```

## Integración con Modo Oscuro

Todos los loaders respetan automáticamente el tema actual (claro/oscuro). No necesitas hacer nada especial.

## Rendimiento

- Los loaders son ligeros y no afectan el rendimiento
- Se pueden mostrar múltiples loaders simultáneamente
- Los loaders se limpian automáticamente cuando se ocultan
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)

## Accesibilidad

- Los loaders incluyen atributos ARIA apropiados
- Funcionan correctamente con lectores de pantalla
- Mantienen el foco del teclado cuando es necesario

## Troubleshooting

### El loader no aparece

1. Verifica que `loaderManager` esté disponible globalmente
2. Asegúrate de que el CSS esté incluido
3. Comprueba la consola del navegador para errores

### El loader no desaparece

1. Asegúrate de llamar a `hideOverlay()` o `hideInline()`
2. Si usas `withOverlay()` o `withInline()`, el loader se oculta automáticamente
3. Verifica que no haya errores en la función asincrónica

### El spinner no gira

1. Verifica que el CSS esté cargado correctamente
2. Comprueba que no haya conflictos de CSS
3. Abre las herramientas de desarrollo y verifica las animaciones

## Compatibilidad

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Navegadores móviles modernos

## Licencia

Parte del proyecto Metales & Hierros Mar del Plata
