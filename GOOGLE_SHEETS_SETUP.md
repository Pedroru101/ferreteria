# Configuración de Google Sheets para Productos

Esta guía te ayudará a configurar Google Sheets para cargar productos, servicios y datos de fabricación dinámicamente en tu sitio web.

## 📋 Requisitos Previos

1. Una cuenta de Google
2. Acceso a Google Cloud Console
3. Una hoja de cálculo de Google Sheets

## 🚀 Paso 1: Crear y Configurar Google Sheets

### 1.1. Crear la hoja de cálculo

1. Ve a [Google Sheets](https://sheets.google.com/)
2. Crea una nueva hoja de cálculo
3. Renombra las pestañas según necesites:
   - **Productos**: Para el catálogo de productos
   - **Servicios**: Para los servicios ofrecidos
   - **Fabricacion**: Para datos de fabricación a medida

### 1.2. Estructura de las hojas

#### Hoja "Productos"
| Nombre | Descripción | Categoría | Precio | Stock | Imagen |
|--------|-------------|-----------|--------|-------|--------|
| Hierro Redondo 12mm | Hierro redondo de construcción | Hierros | 1500 | Disponible | url_imagen.jpg |
| Tejido Romboidal 2m | Tejido galvanizado | Tejidos | 8500 | Disponible | url_imagen.jpg |

#### Hoja "Servicios"
| Nombre | Descripción | Icono | Orden |
|--------|-------------|-------|-------|
| Asesoramiento Técnico | Te ayudamos a elegir los materiales | fa-ruler-combined | 1 |
| Corte a Medida | Servicio de corte con plasma | fa-cut | 2 |

#### Hoja "Fabricacion"
| Título | Descripción | Icono | Características |
|--------|-------------|-------|-----------------|
| Tejidos Personalizados | Romboidal, hexagonal, olímpico | fa-hammer | Cualquier altura y largo |
| Postes a Medida | Postes de cemento, hierro | fa-drafting-compass | Diferentes alturas |

## 🔑 Paso 2: Configurar Google Cloud Console

### 2.1. Crear un proyecto

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el nombre del proyecto

### 2.2. Habilitar Google Sheets API

1. En el menú lateral, ve a **APIs y Servicios** → **Biblioteca**
2. Busca "Google Sheets API"
3. Haz clic en "Habilitar"

### 2.3. Crear credenciales (API Key)

1. Ve a **APIs y Servicios** → **Credenciales**
2. Haz clic en **Crear credenciales** → **Clave de API**
3. Copia la API Key generada
4. (Opcional) Restringe la API Key:
   - Restricciones de aplicación: **Referentes HTTP**
   - Agrega tu dominio (ej: `https://tudominio.com/*`)
   - Restricciones de API: Selecciona solo **Google Sheets API**

## ⚙️ Paso 3: Configurar el Sitio Web

### 3.1. Actualizar config.js

Abre el archivo `config.js` y actualiza la sección de productos:

```javascript
products: {
    // Habilitar carga desde Google Sheets
    enableGoogleSheets: true, // ← Cambiar a true

    // ID de la hoja de cálculo
    spreadsheetId: 'TU_SPREADSHEET_ID_AQUI',

    // API Key de Google
    apiKey: 'TU_API_KEY_AQUI',

    // ... resto de la configuración
}
```

### 3.2. Obtener el Spreadsheet ID

El Spreadsheet ID se encuentra en la URL de tu hoja de cálculo:

```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
                                      ^^^^^^^^^^^^^^^^^^
                                      Copia esta parte
```

### 3.3. Incluir el script en index.html

Agrega el script antes del cierre de `</body>`:

```html
<!-- Antes de los otros scripts -->
<script src="products-loader.js"></script>
<script src="script.js"></script>
```

## 💻 Paso 4: Usar los Datos en tu Sitio

### 4.1. Cargar productos en el sitio

En tu archivo `script.js`, agrega:

```javascript
// Esperar a que se cargue la página
document.addEventListener('DOMContentLoaded', async function() {

    if (CONFIG.products.enableGoogleSheets) {
        try {
            // Cargar productos
            const productos = await productsLoader.loadProductos();

            if (productos && productos.length > 0) {
                console.log('Productos cargados:', productos);
                renderProductos(productos);
            }

            // Cargar servicios
            const servicios = await productsLoader.loadServicios();

            if (servicios && servicios.length > 0) {
                console.log('Servicios cargados:', servicios);
                renderServicios(servicios);
            }

            // Cargar fabricación
            const fabricacion = await productsLoader.loadFabricacion();

            if (fabricacion && fabricacion.length > 0) {
                console.log('Fabricación cargada:', fabricacion);
                renderFabricacion(fabricacion);
            }

        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    }
});

// Función para renderizar productos
function renderProductos(productos) {
    const container = document.querySelector('.products-grid');

    productos.forEach(producto => {
        const html = `
            <div class="product-card">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <span class="precio">$${producto.precio}</span>
            </div>
        `;
        container.innerHTML += html;
    });
}
```

## 🔒 Paso 5: Seguridad

### 5.1. Hacer la hoja pública (solo lectura)

1. Abre tu Google Sheet
2. Haz clic en **Compartir**
3. En "Obtener enlace", selecciona **Cualquier persona con el enlace**
4. Asegúrate de que el permiso sea **Lector** (no Editor)

### 5.2. Variables de entorno (Producción)

Para producción, considera usar variables de entorno:

1. Copia `.env.example` a `.env`
2. Completa los valores:

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=tu_spreadsheet_id
GOOGLE_SHEETS_API_KEY=tu_api_key
```

3. Usa un servidor backend para ocultar las credenciales

## 🧪 Paso 6: Probar

1. Abre tu sitio web
2. Abre la consola del navegador (F12)
3. Deberías ver mensajes como:
   ```
   Cargando datos de productos desde Google Sheets...
   ✓ Cargados 10 elementos de productos
   ```

## 📝 Notas Importantes

- **Cache**: Los datos se guardan en cache por 60 minutos por defecto
- **Límites**: La API de Google Sheets tiene límites de uso diarios
- **Actualización**: Los cambios en Google Sheets se reflejarán después del tiempo de cache
- **Seguridad**: No compartas tu API Key públicamente

## 🆘 Solución de Problemas

### Error: "API key not valid"
- Verifica que la API Key esté correcta en `config.js`
- Asegúrate de que Google Sheets API esté habilitada
- Verifica las restricciones de la API Key

### Error: "The caller does not have permission"
- Verifica que la hoja esté compartida como "Cualquier persona con el enlace puede ver"

### No se cargan datos
- Verifica que `enableGoogleSheets` esté en `true`
- Verifica el Spreadsheet ID
- Abre la consola del navegador para ver errores
- Verifica que los nombres de las hojas coincidan con la configuración

## 📚 Referencias

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Límites de uso de Google Sheets API](https://developers.google.com/sheets/api/limits)
