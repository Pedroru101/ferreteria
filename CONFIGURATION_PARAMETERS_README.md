# Implementación: Configuración de Parámetros (Tarea 50)

## Descripción
Esta tarea implementa un formulario de configuración en el panel de administración que permite ajustar parámetros clave del sistema sin necesidad de editar código.

## Funcionalidades Implementadas

### 1. Formulario de Configuración
- **Ubicación**: Panel de Administración → Pestaña "Configuración"
- **Campos disponibles**:
  - Separación entre postes (metros) - Default: 2.5
  - Postes esquineros - Default: 4
  - Costo de instalación por metro (ARS) - Default: 500
  - Margen de ganancia (%) - Default: 20
  - Validez de cotizaciones (días) - Default: 30

### 2. Validación de Datos
La función `saveConfiguration()` valida todos los campos antes de guardar:
- Separación entre postes: debe ser un número positivo
- Postes esquineros: debe ser un número válido (≥ 0)
- Costo de instalación: debe ser un número válido (≥ 0)
- Margen de ganancia: debe ser un número válido (≥ 0)
- Validez de cotizaciones: debe ser un número positivo

### 3. Almacenamiento
- Los datos se guardan en `localStorage` con la clave `ferreteria_config`
- Estructura JSON:
```json
{
  "calculator": {
    "defaultPostSpacing": 2.5,
    "cornerPosts": 4
  },
  "pricing": {
    "installationPricePerMeter": 500,
    "marginPercentage": 20
  },
  "quotation": {
    "validityDays": 30
  }
}
```

### 4. Actualización Global
- El objeto `CONFIG` global se actualiza inmediatamente con los nuevos valores
- Esto permite que todos los módulos usen la configuración actualizada

### 5. Recarga de Página
- Después de guardar, la página se recarga automáticamente en 2 segundos
- Esto asegura que todos los módulos carguen con la nueva configuración

## Archivos Modificados

### ferreteria/admin.html
- Formulario de configuración con 5 campos de entrada
- Botón "Guardar Configuración"
- Estructura HTML semántica

### ferreteria/js/admin.js
- Función `loadConfigurationValues()`: Carga valores guardados en los campos del formulario
- Función `saveConfiguration()`: Valida, guarda y recarga la página
- Llamada a `loadConfigurationValues()` en `handleLogin()` para cargar valores después del login

### ferreteria/config.js
- Estructura de configuración ya existente con valores por defecto

## Cómo Usar

### Para Administradores
1. Accede a `admin.html`
2. Inicia sesión con la contraseña (default: `admin123`)
3. Ve a la pestaña "Configuración"
4. Modifica los valores según necesites
5. Haz clic en "Guardar Configuración"
6. La página se recargará automáticamente

### Para Desarrolladores
```javascript
// Acceder a la configuración guardada
const config = JSON.parse(localStorage.getItem('ferreteria_config'));

// Usar valores de configuración
const postSpacing = CONFIG.calculator.defaultPostSpacing;
const installationPrice = CONFIG.pricing.installationPricePerMeter;
const quotationValidity = CONFIG.quotation.validityDays;
```

## Validación de Datos

### Separación entre Postes
- Tipo: Número decimal
- Rango: > 0
- Unidad: Metros
- Ejemplo: 2.5, 3.0, 2.75

### Postes Esquineros
- Tipo: Número entero
- Rango: ≥ 0
- Valor típico: 4 (uno en cada esquina)

### Costo de Instalación
- Tipo: Número decimal
- Rango: ≥ 0
- Unidad: ARS por metro lineal
- Ejemplo: 500, 600, 750

### Margen de Ganancia
- Tipo: Número decimal
- Rango: ≥ 0
- Unidad: Porcentaje (%)
- Ejemplo: 20, 25, 30

### Validez de Cotizaciones
- Tipo: Número entero
- Rango: > 0
- Unidad: Días
- Ejemplo: 30, 45, 60

## Flujo de Datos

```
Usuario modifica valores
        ↓
Hace clic en "Guardar Configuración"
        ↓
Validación de datos
        ↓
Actualización de CONFIG global
        ↓
Guardado en localStorage
        ↓
Notificación de éxito
        ↓
Recarga de página (2 segundos)
        ↓
Nuevos valores disponibles en toda la aplicación
```

## Manejo de Errores

Si hay un error en la validación:
1. Se muestra una notificación de error específica
2. Los datos NO se guardan
3. La página NO se recarga
4. El usuario puede corregir el error y reintentar

## Requisitos Cumplidos

✅ Crear formulario para editar configuraciones
✅ Permitir ajustar: separación entre postes, costo instalación, validez cotizaciones
✅ Guardar en localStorage (`ferreteria_config`)
✅ Actualizar CONFIG global
✅ Recargar página para aplicar cambios

## Testing

Para verificar que la funcionalidad funciona:

1. Abre `test-config-parameters.html` en el navegador
2. Verifica que todas las pruebas pasen
3. Accede a `admin.html` y prueba manualmente:
   - Modifica los valores
   - Guarda la configuración
   - Verifica que la página se recargue
   - Abre la consola (F12) y ejecuta:
     ```javascript
     JSON.parse(localStorage.getItem('ferreteria_config'))
     ```
   - Verifica que los valores guardados coincidan

## Notas Importantes

- La configuración se persiste en localStorage, por lo que se mantiene entre sesiones
- Si no hay configuración guardada, se usan los valores por defecto de CONFIG
- La recarga de página es necesaria para asegurar que todos los módulos carguen con la nueva configuración
- Los valores se validan antes de guardar para evitar datos inválidos
