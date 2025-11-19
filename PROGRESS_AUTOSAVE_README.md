# Sistema de Guardado Automático de Progreso

## Descripción General

El sistema de guardado automático de progreso permite que los usuarios recuperen su trabajo si abandonan un formulario sin completarlo. El sistema guarda automáticamente el estado de:

- **Calculadora de Materiales**: Dimensiones, tipo de poste, material seleccionado, resultados
- **Formularios de Cotización**: Productos seleccionados, cantidades, datos del cliente
- **Formularios de Pedidos**: Datos del cliente, dirección, fecha de instalación

## Características

### 1. Guardado Automático
- Se guarda automáticamente cada 30 segundos mientras el usuario completa un formulario
- Solo se guarda si el formulario tiene datos válidos
- Se almacena en localStorage con prefijo `ferreteria_`

### 2. Recuperación de Progreso
- Al cargar la página, el sistema detecta si hay progreso guardado
- Muestra un prompt visual ofreciendo recuperar el progreso anterior
- El usuario puede elegir recuperar o descartar el progreso

### 3. Limpieza Automática
- El progreso se descarta automáticamente después de 24 horas
- Se ejecuta una limpieza cada hora para eliminar datos antiguos
- El usuario puede descartar manualmente el progreso

## Archivos Principales

### `js/progress-manager.js`
Clase principal que gestiona:
- Detección de progreso recuperable
- Guardado automático de formularios
- Limpieza de datos antiguos
- Interfaz de recuperación

### `css/progress-manager.css`
Estilos para:
- Prompt de recuperación de progreso
- Animaciones de entrada/salida
- Diseño responsive
- Modo claro/oscuro

### `js/calculator-ui.js` (modificado)
Integración con el sistema de guardado:
- Método `setupAutoSave()` para iniciar auto-guardado
- Método `loadSavedState()` para cargar estado guardado
- Limpieza de auto-guardado en `reset()`

## Uso

### Para Desarrolladores

#### Iniciar Auto-Guardado
```javascript
progressManager.startAutoSave('calculator_state', () => {
    return {
        data: this.getFormData(),
        results: this.currentResults,
        timestamp: new Date().toISOString()
    };
}, 30000); // Intervalo en ms
```

#### Detener Auto-Guardado
```javascript
progressManager.stopAutoSave('calculator_state');
```

#### Guardar Progreso Manual
```javascript
progressManager.saveFormProgress('form_id', formData);
```

#### Cargar Progreso Guardado
```javascript
const saved = progressManager.loadFormProgress('form_id');
if (saved) {
    // Restaurar formulario con datos guardados
}
```

#### Obtener Estadísticas
```javascript
const stats = progressManager.getProgressStats();
console.log(stats);
// {
//   hasCalculatorProgress: true,
//   hasQuotationProgress: false,
//   hasOrderProgress: false,
//   calculatorAge: 5, // minutos
//   quotationAge: null,
//   orderAge: null
// }
```

### Para Usuarios

1. **Completar un Formulario**: El sistema guarda automáticamente cada 30 segundos
2. **Abandonar la Página**: El progreso se mantiene en localStorage
3. **Volver a la Página**: Se muestra un prompt ofreciendo recuperar el progreso
4. **Recuperar**: Haz clic en "Recuperar" para continuar donde lo dejaste
5. **Descartar**: Haz clic en "Descartar" para empezar de nuevo

## Almacenamiento

### Claves de localStorage

```
ferreteria_calculator_state
{
    data: { fenceType, length, width, postType, materialType, ... },
    results: { perimeter, posts, wire/mesh, accessories },
    timestamp: "2024-01-15T10:30:00Z"
}

ferreteria_quotation_draft
{
    data: { items, installation, total },
    timestamp: "2024-01-15T10:30:00Z"
}

ferreteria_order_draft
{
    data: { customer, items, installation, total },
    timestamp: "2024-01-15T10:30:00Z"
}

ferreteria_form_<formId>
{
    data: { campo1, campo2, ... },
    timestamp: "2024-01-15T10:30:00Z",
    formId: "<formId>"
}
```

## Límites

- **Tamaño máximo de localStorage**: 5 MB
- **Edad máxima de progreso**: 24 horas
- **Intervalo de auto-guardado**: 30 segundos (configurable)
- **Intervalo de limpieza**: 1 hora

## Configuración

### En `config.js`

```javascript
CONFIG.quotation = {
    autoSave: true,  // Habilitar/deshabilitar auto-guardado
    validityDays: 30,
    // ... otras opciones
};
```

## Casos de Uso

### Caso 1: Usuario Completa Calculadora Parcialmente
1. Usuario ingresa dimensiones y selecciona tipo de poste
2. Sistema guarda automáticamente cada 30 segundos
3. Usuario cierra la pestaña sin completar
4. Usuario vuelve a la página
5. Se muestra prompt de recuperación
6. Usuario hace clic en "Recuperar"
7. Calculadora se restaura con los datos anteriores

### Caso 2: Usuario Abandona Formulario de Pedido
1. Usuario completa datos del cliente
2. Sistema guarda automáticamente
3. Usuario navega a otra sección
4. Usuario vuelve a la página
5. Se muestra prompt de recuperación
6. Usuario recupera el formulario de pedido

### Caso 3: Limpieza Automática
1. Usuario guarda progreso hace 25 horas
2. Sistema ejecuta limpieza automática
3. Progreso antiguo se elimina
4. Usuario vuelve a la página
5. No hay progreso para recuperar

## Troubleshooting

### El prompt de recuperación no aparece
- Verificar que localStorage esté habilitado
- Verificar que `progress-manager.js` esté cargado
- Revisar la consola para errores

### El progreso no se guarda
- Verificar que el formulario tenga datos válidos
- Verificar que localStorage no esté lleno
- Revisar la consola para errores de almacenamiento

### El progreso se pierde después de 24 horas
- Esto es intencional para evitar datos obsoletos
- El usuario debe completar el formulario dentro de 24 horas

## Seguridad

- Los datos se guardan en localStorage del navegador (no en servidor)
- No se transmiten datos sensibles a través de la red
- Los datos se limpian automáticamente después de 24 horas
- El usuario puede descartar datos manualmente en cualquier momento

## Performance

- Auto-guardado usa debounce para evitar guardados excesivos
- Limpieza automática se ejecuta en background
- No afecta la velocidad de carga de la página
- Tamaño típico de datos guardados: 1-5 KB

## Compatibilidad

- Navegadores modernos con soporte para localStorage
- Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- Requiere JavaScript habilitado
- Funciona en modo incógnito/privado (con limitaciones)

## Futuras Mejoras

- [ ] Sincronización con servidor (opcional)
- [ ] Encriptación de datos sensibles
- [ ] Múltiples puntos de guardado
- [ ] Historial de cambios
- [ ] Exportación de progreso
- [ ] Sincronización entre dispositivos
