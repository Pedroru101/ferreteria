# Guía de Administrador - Panel de Control

## Tabla de Contenidos

1. [Acceso al Panel](#acceso-al-panel)
2. [Gestión de Pedidos](#gestión-de-pedidos)
3. [Gestión de Cotizaciones](#gestión-de-cotizaciones)
4. [Gestión de Productos](#gestión-de-productos)
5. [Gestión de Precios](#gestión-de-precios)
6. [Configuración del Sistema](#configuración-del-sistema)
7. [Integración con Google Sheets](#integración-con-google-sheets)
8. [Exportación de Datos](#exportación-de-datos)
9. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Acceso al Panel

### Cómo Acceder

1. **Abre tu navegador** y ve a la URL de tu sitio seguida de `/admin.html`
   - Ejemplo: `https://tudominio.com/admin.html`

2. **Pantalla de Login**
   - Verás un formulario con un campo de contraseña
   - Ingresa la contraseña de administrador (por defecto: `admin123`)
   - Haz clic en "Iniciar Sesión"

### Seguridad

- **Contraseña por defecto**: `admin123`
- **Cambiar contraseña**: Actualmente la contraseña se almacena en `localStorage`. Para cambiarla:
  1. Abre la consola del navegador (F12)
  2. Ejecuta: `localStorage.setItem('ferreteria_admin_password', btoa('tu_nueva_contraseña'))`
  3. Recarga la página

### Sesión

- Tu sesión permanece activa durante **1 hora** de inactividad
- Si la sesión expira, deberás volver a iniciar sesión
- Haz clic en "Cerrar Sesión" para salir manualmente

---

## Gestión de Pedidos

### Acceder a Pedidos

1. En el panel de administración, haz clic en la pestaña **"Pedidos"**
2. Verás una tabla con todos los pedidos registrados

### Información de Cada Pedido

| Campo | Descripción |
|-------|-------------|
| **ID Pedido** | Número único del pedido (ej: ORD-20240115-0001) |
| **Fecha** | Fecha en que se creó el pedido |
| **Cliente** | Nombre del cliente |
| **Teléfono** | Número de contacto del cliente |
| **Total** | Monto total del pedido en ARS |
| **Estado** | Estado actual del pedido |

### Estados de Pedidos

- **Pendiente** (naranja): Pedido recién creado, esperando confirmación
- **Confirmado** (verde): Pedido confirmado por el administrador
- **En Proceso** (azul): Pedido en fase de preparación/instalación
- **Completado** (verde oscuro): Pedido finalizado
- **Cancelado** (rojo): Pedido cancelado

### Filtrar Pedidos

Usa los controles en la parte superior para filtrar:

1. **Por Estado**: Selecciona un estado específico
2. **Por Fecha**: Ingresa rango de fechas (desde - hasta)
3. **Por Cliente**: Escribe el nombre o teléfono del cliente
4. **Limpiar Filtros**: Haz clic en "Limpiar" para resetear todos los filtros

### Ver Detalles de un Pedido

1. Haz clic en el botón **"Ver"** en la fila del pedido
2. Se abrirá una ventana con:
   - Datos completos del cliente
   - Lista de productos con cantidades y precios
   - Detalles de instalación (si aplica)
   - Historial de cambios de estado

### Actualizar Estado de un Pedido

1. Haz clic en el botón **"Actualizar"** en la fila del pedido
2. Se abrirá un formulario con:
   - Selector de nuevo estado
   - Campo para agregar una nota/comentario
3. Completa los datos y haz clic en "Guardar"
4. El sistema enviará automáticamente una notificación por WhatsApp al cliente

### Exportar Pedidos

1. Haz clic en el botón **"Exportar CSV"**
2. Se descargará un archivo con todos los pedidos (aplicando filtros actuales)
3. El archivo contiene: ID, Fecha, Cliente, Total, Estado

---

## Gestión de Cotizaciones

### Acceder a Cotizaciones

1. En el panel de administración, haz clic en la pestaña **"Cotizaciones"**
2. Verás una tabla con todas las cotizaciones registradas

### Información de Cada Cotización

| Campo | Descripción |
|-------|-------------|
| **ID Cotización** | Número único (ej: COT-1705315800000-123) |
| **Fecha** | Fecha de generación |
| **Total** | Monto total en ARS |
| **Estado** | Estado actual (Borrador, Enviada, Aceptada, Expirada) |
| **Validez** | Fecha hasta la cual es válida |

### Estados de Cotizaciones

- **Borrador**: Cotización no enviada al cliente
- **Enviada**: Cotización enviada por WhatsApp
- **Aceptada**: Cliente aceptó la cotización
- **Expirada**: Pasó la fecha de validez (30 días por defecto)

### Filtrar Cotizaciones

1. **Por Estado**: Selecciona un estado específico
2. **Por Fecha**: Ingresa rango de fechas
3. **Por Monto**: Ingresa monto mínimo y/o máximo
4. **Limpiar Filtros**: Resetea todos los filtros

### Ver Detalles de una Cotización

1. Haz clic en el botón **"Ver"** en la fila de la cotización
2. Se abrirá una ventana con:
   - Datos de la cotización
   - Lista completa de productos
   - Desglose de precios
   - Información de validez

### Exportar Cotizaciones

1. Haz clic en el botón **"Exportar CSV"**
2. Se descargará un archivo con todas las cotizaciones (aplicando filtros)
3. Útil para análisis de ventas y reportes

---

## Gestión de Productos

### Acceder a Productos

1. En el panel de administración, haz clic en la pestaña **"Productos"**

### Si Usas Google Sheets

Si tu sistema está configurado para cargar productos desde Google Sheets:

1. Verás un mensaje indicando que los productos se cargan desde Google Sheets
2. **Para editar productos**: Edita directamente en tu hoja de cálculo de Google Sheets
3. **Para actualizar el cache**: Haz clic en "Recargar desde Google Sheets"
4. El sistema mostrará la fecha y hora de la última actualización

### Si Usas Almacenamiento Local

Si los productos se guardan localmente:

1. Verás una tabla con todos los productos
2. Puedes buscar productos por nombre
3. Puedes filtrar por categoría

#### Agregar un Producto

1. Haz clic en el botón **"Agregar Producto"**
2. Completa el formulario:
   - **Nombre**: Nombre del producto
   - **Categoría**: Selecciona una categoría existente
   - **Descripción**: Descripción breve
   - **Precio**: Precio en ARS
   - **Stock**: Cantidad disponible
   - **Especificaciones**: Detalles técnicos (opcional)
3. Haz clic en "Guardar"

#### Editar un Producto

1. Haz clic en el botón **"Editar"** en la fila del producto
2. Modifica los campos necesarios
3. Haz clic en "Guardar"

#### Eliminar un Producto

1. Haz clic en el botón **"Eliminar"** en la fila del producto
2. Confirma la eliminación
3. El producto se eliminará del sistema

#### Exportar Productos

1. Haz clic en el botón **"Exportar"**
2. Se descargará un archivo JSON con todos los productos
3. Útil para backup o migración

#### Importar Productos

1. Haz clic en el botón **"Importar"**
2. Selecciona un archivo JSON previamente exportado
3. Los productos se cargarán en el sistema

---

## Gestión de Precios

### Acceder a Precios

1. En el panel de administración, haz clic en la pestaña **"Precios"**
2. Verás una tabla con todos los productos y sus precios actuales

### Filtrar por Categoría

1. Usa el selector de categoría para ver solo productos de una categoría
2. Haz clic en "Limpiar" para ver todos

### Editar Precio Individual

1. Haz clic en el botón **"Editar"** en la fila del producto
2. Ingresa el nuevo precio
3. Haz clic en "Guardar"

### Ajuste Masivo de Precios

Esta función permite aplicar cambios de precio a múltiples productos a la vez:

1. Haz clic en el botón **"Ajuste Masivo"**
2. Se abrirá un formulario con opciones:
   - **Categoría**: Selecciona la categoría a ajustar (o todas)
   - **Tipo de ajuste**: 
     - Incremento porcentual (ej: +10%)
     - Decremento porcentual (ej: -5%)
     - Precio fijo
   - **Valor**: Ingresa el porcentaje o precio
3. Haz clic en "Aplicar"
4. Se mostrarán los cambios antes de confirmar

### Ejemplo de Ajuste Masivo

**Escenario**: Aumentar precios de postes en 15%

1. Haz clic en "Ajuste Masivo"
2. Selecciona categoría: "Postes"
3. Tipo de ajuste: "Incremento porcentual"
4. Valor: 15
5. Haz clic en "Aplicar"
6. Revisa los nuevos precios
7. Haz clic en "Confirmar"

---

## Configuración del Sistema

### Acceder a Configuración

1. En el panel de administración, haz clic en la pestaña **"Configuración"**
2. Verás varios grupos de configuración

### Sección: Calculadora

**Separación entre postes (metros)**
- Valor por defecto: 2.5
- Controla la distancia entre postes en los cálculos
- Cambiar este valor afectará los cálculos futuros

**Postes esquineros**
- Valor por defecto: 4
- Número de postes en las esquinas (generalmente siempre 4)

### Sección: Precios

**Costo de instalación por metro**
- Valor por defecto: 500 ARS
- Precio que se cobra por cada metro lineal de instalación
- Se usa cuando el cliente selecciona "Incluir instalación"

**Margen de ganancia (%)**
- Valor por defecto: 20%
- Porcentaje de ganancia aplicado a los precios
- Afecta los cálculos de rentabilidad

### Sección: Cotizaciones

**Validez de cotizaciones (días)**
- Valor por defecto: 30
- Número de días que una cotización es válida
- Después de este período, la cotización se marca como "Expirada"

### Guardar Configuración

1. Modifica los valores que necesites
2. Haz clic en el botón **"Guardar Configuración"**
3. Se mostrará un mensaje de confirmación
4. La página se recargará con los nuevos valores

---

## Integración con Google Sheets

### Configuración Inicial

Para usar Google Sheets como fuente de productos:

1. **Crea una hoja de cálculo en Google Sheets** con la siguiente estructura:

| Nombre | Categoría | Precio | Stock | Descripción |
|--------|-----------|--------|-------|-------------|
| Poste Hormigón 2.5m | Postes | 3500 | 50 | Poste de hormigón armado |
| Tejido Romboidal 1.5m | Tejidos | 2500 | 100 | Tejido romboidal 63mm |

2. **Comparte la hoja públicamente**:
   - Haz clic en "Compartir"
   - Selecciona "Cualquiera con el enlace"
   - Copia el ID de la hoja (está en la URL)

3. **Configura en config.js**:
   ```javascript
   CONFIG.products.enableGoogleSheets = true;
   CONFIG.products.googleSheetsId = 'TU_ID_DE_HOJA';
   CONFIG.products.googleSheetsRange = 'Productos!A1:E100';
   ```

### Recargar Datos desde Google Sheets

1. En la pestaña **"Productos"**, haz clic en **"Recargar desde Google Sheets"**
2. El sistema descargará los datos más recientes
3. Se mostrará la fecha y hora de la última actualización
4. Los cambios se reflejarán inmediatamente en el sitio

### Ventajas de Usar Google Sheets

- Edita productos sin acceder al panel de administración
- Múltiples usuarios pueden editar simultáneamente
- Historial de cambios automático
- Acceso desde cualquier dispositivo

### Solución de Problemas

**"No se cargan los productos"**
- Verifica que la hoja esté compartida públicamente
- Confirma que el ID de la hoja sea correcto
- Revisa que el rango sea válido

**"Los cambios no se reflejan"**
- Haz clic en "Recargar desde Google Sheets"
- Espera unos segundos
- Recarga la página del sitio

---

## Exportación de Datos

### Exportar Pedidos

1. Ve a la pestaña **"Pedidos"**
2. Aplica los filtros que desees (opcional)
3. Haz clic en **"Exportar CSV"**
4. Se descargará un archivo `pedidos.csv`

**Contenido del archivo**:
- ID Pedido
- Fecha
- Cliente
- Teléfono
- Total
- Estado

### Exportar Cotizaciones

1. Ve a la pestaña **"Cotizaciones"**
2. Aplica los filtros que desees (opcional)
3. Haz clic en **"Exportar CSV"**
4. Se descargará un archivo `cotizaciones.csv`

**Contenido del archivo**:
- ID Cotización
- Fecha
- Total
- Estado
- Validez

### Exportar Productos

1. Ve a la pestaña **"Productos"**
2. Haz clic en **"Exportar"**
3. Se descargará un archivo `productos.json`

**Uso del archivo**:
- Backup de productos
- Migración a otro sistema
- Análisis de inventario

### Abrir Archivos CSV

Los archivos CSV se pueden abrir con:
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Cualquier editor de texto

### Importar Productos

1. Ve a la pestaña **"Productos"**
2. Haz clic en **"Importar"**
3. Selecciona un archivo `productos.json` previamente exportado
4. Los productos se cargarán en el sistema

---

## Preguntas Frecuentes

### ¿Cómo cambio la contraseña de administrador?

Abre la consola del navegador (F12) y ejecuta:
```javascript
localStorage.setItem('ferreteria_admin_password', btoa('tu_nueva_contraseña'))
```

Luego recarga la página.

### ¿Qué pasa si olvido la contraseña?

Abre la consola del navegador (F12) y ejecuta:
```javascript
localStorage.removeItem('ferreteria_admin_password')
```

Luego recarga la página. La contraseña se reiniciará a `admin123`.

### ¿Cuánto tiempo dura mi sesión?

Tu sesión dura **1 hora** de inactividad. Si no haces nada durante ese tiempo, deberás volver a iniciar sesión.

### ¿Puedo acceder desde mi teléfono?

Sí, el panel de administración es responsive y funciona en dispositivos móviles. Simplemente ve a `/admin.html` desde tu teléfono.

### ¿Dónde se guardan los datos?

Los datos se guardan en el navegador (localStorage). Esto significa:
- Los datos persisten entre sesiones
- Cada navegador tiene sus propios datos
- Si limpias el cache del navegador, perderás los datos

### ¿Cómo hago backup de mis datos?

1. Ve a cada pestaña (Pedidos, Cotizaciones, Productos)
2. Haz clic en "Exportar"
3. Guarda los archivos en un lugar seguro

### ¿Puedo tener múltiples administradores?

Actualmente, todos los administradores comparten la misma contraseña. Para múltiples usuarios con diferentes permisos, se requeriría una actualización del sistema.

### ¿Qué significa "Cotización Expirada"?

Una cotización se marca como expirada cuando pasa la fecha de validez (30 días por defecto). El cliente puede solicitar una nueva cotización con precios actualizados.

### ¿Cómo notifico al cliente sobre cambios en su pedido?

Cuando actualizas el estado de un pedido, el sistema envía automáticamente un mensaje por WhatsApp al cliente con los detalles del cambio.

### ¿Puedo editar un pedido después de crearlo?

Puedes cambiar el estado del pedido y agregar notas. Para cambios más profundos (productos, precios), se recomienda crear una nueva cotización.

### ¿Qué pasa con los datos antiguos?

Los datos se guardan indefinidamente en localStorage. Para limpiar datos antiguos:
1. Exporta los datos que necesites
2. Abre la consola (F12)
3. Ejecuta: `localStorage.clear()` (esto borra TODO)
4. Recarga la página

---

## Soporte y Contacto

Si encuentras problemas o tienes preguntas:

1. Revisa esta guía nuevamente
2. Consulta la sección de Preguntas Frecuentes
3. Contacta al equipo de desarrollo

**Última actualización**: Enero 2024
