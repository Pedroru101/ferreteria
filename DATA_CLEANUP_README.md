# Data Cleanup Manager - Sistema de Limpieza Automática de Datos

## Descripción General

El `DataCleanupManager` es un módulo que gestiona automáticamente la limpieza de datos antiguos en el navegador, incluyendo:

- **Cotizaciones expiradas**: Elimina cotizaciones cuya fecha de validez ha pasado
- **Logs de errores antiguos**: Elimina registros de errores más antiguos que 7 días
- **Verificación de cuota de almacenamiento**: Monitorea el uso de localStorage y ejecuta limpieza de emergencia si es necesario

## Características

### 1. Limpieza de Cotizaciones Expiradas
- Verifica automáticamente todas las cotizaciones guardadas
- Elimina aquellas cuya fecha de validez ha pasado
- Mantiene las cotizaciones válidas intactas
- Se ejecuta periódicamente según la configuración

### 2. Limpieza de Logs de Errores
- Mantiene un registro de errores en localStorage
- Elimina automáticamente logs más antiguos que 7 días (configurable)
- Limita el número máximo de logs para evitar saturación
- Preserva los logs recientes para debugging

### 3. Verificación de Cuota de Almacenamiento
- Monitorea el uso de localStorage en tiempo real
- Genera advertencias cuando el uso supera el 75%
- Ejecuta limpieza de emergencia cuando supera el 90%
- Intenta liberar espacio eliminando datos antiguos

### 4. Limpieza de Emergencia
- Se activa automáticamente cuando el almacenamiento está crítico
- Mantiene los datos más recientes
- Elimina datos antiguos de forma inteligente
- Notifica al usuario sobre la situación

## Configuración

La configuración se realiza en `config.js`:

```javascript
dataCleanup: {
    enabled: true,                          // Habilitar/deshabilitar el sistema
    checkInterval: 3600000,                 // Intervalo de verificación (1 hora en ms)
    quotationExpiryDays: 30,                // Días de validez de cotizaciones
    errorLogRetentionDays: 7,               // Días de retención de logs de error
    maxStorageMB: 5,                        // Límite máximo de almacenamiento
    autoCleanupOnInit: true,                // Ejecutar limpieza al inicializar
    cleanupTasks: {
        expiredQuotations: true,            // Limpiar cotizaciones expiradas
        oldErrorLogs: true,                 // Limpiar logs antiguos
        storageQuotaCheck: true             // Verificar cuota de almacenamiento
    }
}
```

## Uso

### Inicialización Automática

El módulo se inicializa automáticamente cuando se carga la página:

```javascript
// En script.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initDataCleanup === 'function') {
        const cleanupManager = initDataCleanup();
        if (cleanupManager) {
            console.log('✅ Sistema de limpieza automática de datos inicializado');
        }
    }
});
```

### Uso Manual

Puedes acceder al gestor de limpieza manualmente:

```javascript
// Obtener la instancia global
const manager = dataCleanupManager;

// Ejecutar limpieza inmediata
manager.forceCleanup();

// Obtener estadísticas
const stats = manager.getCleanupStats();
console.log(stats);

// Ejecutar limpieza de emergencia
manager.attemptEmergencyCleanup();

// Destruir el gestor
manager.destroy();
```

## Métodos Disponibles

### `init()`
Inicializa el gestor y programa la limpieza automática.

```javascript
manager.init();
```

### `runCleanup()`
Ejecuta un ciclo completo de limpieza.

```javascript
const stats = manager.runCleanup();
// Retorna: { quotationsRemoved, logsRemoved, storageWarnings, lastRun }
```

### `cleanupExpiredQuotations()`
Limpia solo las cotizaciones expiradas.

```javascript
const removed = manager.cleanupExpiredQuotations();
console.log(`Se eliminaron ${removed} cotizaciones expiradas`);
```

### `cleanupOldErrorLogs()`
Limpia solo los logs de error antiguos.

```javascript
const removed = manager.cleanupOldErrorLogs();
console.log(`Se eliminaron ${removed} logs antiguos`);
```

### `checkStorageQuota()`
Verifica la cuota de almacenamiento.

```javascript
const warnings = manager.checkStorageQuota();
if (warnings > 0) {
    console.warn('Almacenamiento crítico');
}
```

### `attemptEmergencyCleanup()`
Ejecuta limpieza de emergencia cuando el almacenamiento está crítico.

```javascript
manager.attemptEmergencyCleanup();
```

### `getCleanupStats()`
Obtiene estadísticas del último ciclo de limpieza.

```javascript
const stats = manager.getCleanupStats();
console.log(stats);
// Retorna: {
//     quotationsRemoved: number,
//     logsRemoved: number,
//     storageWarnings: number,
//     lastRun: ISO string,
//     currentStorageMB: number,
//     maxStorageMB: number,
//     nextCleanupTime: Date
// }
```

### `forceCleanup()`
Fuerza una limpieza inmediata.

```javascript
const stats = manager.forceCleanup();
```

### `destroy()`
Detiene el gestor y limpia los timers.

```javascript
manager.destroy();
```

## Estructura de Datos

### Cotizaciones
```javascript
{
    id: "COT-1705315800000-123",
    date: "2024-01-15T10:30:00Z",
    validUntil: "2024-02-14T10:30:00Z",
    items: [...],
    total: 85000,
    status: "sent"
}
```

### Logs de Error
```javascript
{
    timestamp: "2024-01-15T10:30:00Z",
    context: "StorageManager.set",
    message: "Error al guardar datos",
    stack: "Error: ...\n    at ..."
}
```

## Eventos y Notificaciones

El sistema genera notificaciones automáticas en los siguientes casos:

1. **Almacenamiento crítico (>90%)**
   - Notificación: "Almacenamiento casi lleno: XMB / YMB"
   - Tipo: warning
   - Acción: Ejecuta limpieza de emergencia

2. **Almacenamiento alto (>75%)**
   - Log en consola: "Almacenamiento alto: XMB / YMB"
   - Tipo: warning

3. **Limpieza completada**
   - Log en consola con estadísticas
   - Tipo: info

## Pruebas

Se incluye un archivo de prueba: `test-data-cleanup.html`

Para probar el módulo:

1. Abre `test-data-cleanup.html` en el navegador
2. Usa los botones para crear datos de prueba
3. Ejecuta las funciones de limpieza
4. Verifica los resultados en los paneles de salida

### Casos de Prueba Disponibles

1. **Limpieza de Cotizaciones Expiradas**
   - Crear cotizaciones con diferentes fechas de validez
   - Ejecutar limpieza
   - Verificar que solo se eliminan las expiradas

2. **Limpieza de Logs Antiguos**
   - Crear logs con diferentes antigüedades
   - Ejecutar limpieza
   - Verificar que solo se eliminan los > 7 días

3. **Verificación de Cuota**
   - Ver estadísticas de almacenamiento
   - Verificar porcentaje de uso
   - Comprobar espacio disponible

4. **Limpieza Completa**
   - Ejecutar ciclo completo
   - Ver estadísticas
   - Forzar limpieza inmediata

5. **Limpieza de Emergencia**
   - Llenar almacenamiento
   - Ejecutar limpieza de emergencia
   - Verificar liberación de espacio

## Integración con Otros Módulos

### StorageManager
El `DataCleanupManager` utiliza `StorageManager` para acceder a los datos:

```javascript
// Obtener datos
const quotations = StorageManager.get('quotations', []);

// Guardar datos
StorageManager.set('quotations', filtered);

// Obtener tamaño
const sizeMB = StorageManager.getSizeInMB();
```

### ErrorHandler
Los errores se registran automáticamente:

```javascript
// Los errores se guardan en 'ferreteria_error_logs'
ErrorHandler.logError(error, 'context');
```

## Mejores Prácticas

1. **Mantener la configuración actualizada**
   - Ajustar `checkInterval` según necesidades
   - Configurar `maxStorageMB` según disponibilidad

2. **Monitorear el almacenamiento**
   - Revisar regularmente `getCleanupStats()`
   - Actuar si el uso supera el 75%

3. **Configurar alertas**
   - Implementar notificaciones personalizadas
   - Alertar al usuario sobre almacenamiento crítico

4. **Pruebas regulares**
   - Usar `test-data-cleanup.html` periódicamente
   - Verificar que la limpieza funciona correctamente

## Troubleshooting

### El módulo no se inicializa
- Verificar que `config.js` esté cargado antes de `data-cleanup.js`
- Verificar que `CONFIG.dataCleanup.enabled` sea `true`
- Revisar la consola para errores

### La limpieza no se ejecuta
- Verificar que `checkInterval` no sea demasiado grande
- Comprobar que `autoCleanupOnInit` sea `true`
- Usar `forceCleanup()` para ejecutar manualmente

### El almacenamiento sigue lleno
- Ejecutar `attemptEmergencyCleanup()`
- Revisar qué datos ocupan más espacio
- Considerar aumentar `maxStorageMB`

### Los logs no se limpian
- Verificar que `cleanupTasks.oldErrorLogs` sea `true`
- Comprobar que `errorLogRetentionDays` sea correcto
- Usar `cleanupOldErrorLogs()` manualmente

## Rendimiento

- **Tiempo de ejecución**: < 100ms en la mayoría de casos
- **Impacto en performance**: Mínimo (se ejecuta en background)
- **Frecuencia recomendada**: Cada 1 hora (3600000ms)
- **Overhead de memoria**: < 1MB

## Seguridad

- No se elimina información crítica sin verificación
- Se mantienen copias de datos recientes
- Se registran todas las operaciones de limpieza
- Se validan fechas antes de eliminar

## Futuras Mejoras

- [ ] Exportar datos antes de eliminar
- [ ] Historial de limpiezas realizadas
- [ ] Configuración por tipo de dato
- [ ] Sincronización con servidor
- [ ] Compresión de datos antiguos
- [ ] Análisis de uso de almacenamiento

## Soporte

Para reportar problemas o sugerencias:
1. Revisar `test-data-cleanup.html`
2. Verificar logs en la consola
3. Contactar al equipo de desarrollo
