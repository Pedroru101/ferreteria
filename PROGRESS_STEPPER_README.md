# Progress Stepper Component - Indicadores de Progreso

## Descripción

El componente **Progress Stepper** proporciona un indicador visual del progreso a través del flujo de la aplicación: **Calculadora → Cotización → Pedido**.

Permite a los usuarios:
- Ver en qué paso del proceso se encuentran
- Navegar entre pasos completados
- Entender el flujo general de la aplicación
- Recuperar el progreso guardado automáticamente

## Características

### 1. **Variantes de Diseño**

#### Horizontal (Estándar)
```javascript
new ProgressStepper({
    variant: 'horizontal',
    compact: false
});
```
- Muestra los pasos en línea horizontal
- Ideal para pantallas grandes
- Incluye barra de progreso opcional

#### Horizontal Compacto
```javascript
new ProgressStepper({
    variant: 'horizontal',
    compact: true
});
```
- Versión reducida para espacios limitados
- Mantiene toda la funcionalidad
- Mejor para dispositivos móviles

#### Vertical
```javascript
new ProgressStepper({
    variant: 'vertical'
});
```
- Muestra los pasos en columna vertical
- Ideal para formularios largos
- Mejor legibilidad en móviles

### 2. **Estados de Pasos**

Cada paso puede estar en uno de estos estados:

- **Activo**: Paso actual (resaltado con animación)
- **Completado**: Paso finalizado (con checkmark)
- **Deshabilitado**: Paso no accesible (requiere completar pasos anteriores)
- **Pendiente**: Paso futuro

### 3. **Barra de Progreso**

Muestra visualmente el porcentaje de progreso completado:
```javascript
new ProgressStepper({
    showProgressBar: true  // Por defecto: true
});
```

## Uso

### Inicialización Básica

```javascript
const stepper = new ProgressStepper({
    containerId: 'progressStepper',
    steps: [
        { id: 'calculator', label: 'Calculadora', icon: 'calculator' },
        { id: 'quotation', label: 'Cotización', icon: 'file-invoice' },
        { id: 'order', label: 'Pedido', icon: 'shopping-cart' }
    ],
    currentStep: 0,
    variant: 'horizontal',
    compact: false,
    showProgressBar: true
});
```

### Opciones de Configuración

| Opción | Tipo | Defecto | Descripción |
|--------|------|---------|-------------|
| `containerId` | string | 'progressStepper' | ID del contenedor HTML |
| `steps` | array | [] | Array de pasos con id, label, description, icon |
| `currentStep` | number | 0 | Índice del paso actual |
| `variant` | string | 'horizontal' | 'horizontal' o 'vertical' |
| `compact` | boolean | false | Modo compacto |
| `showProgressBar` | boolean | true | Mostrar barra de progreso |
| `onStepClick` | function | null | Callback al hacer clic en un paso |
| `autoAdvance` | boolean | false | Avanzar automáticamente al completar |

### Métodos Principales

#### Navegación

```javascript
// Ir al siguiente paso
stepper.nextStep();

// Ir al paso anterior
stepper.previousStep();

// Ir a un paso específico
stepper.goToStep(2);

// Reiniciar desde el principio
stepper.reset();
```

#### Completar Pasos

```javascript
// Completar el paso actual
stepper.completeStep();

// Completar un paso específico
stepper.completeStep(1);
```

#### Obtener Información

```javascript
// Obtener información del paso actual
const current = stepper.getCurrentStep();
// {
//   index: 0,
//   step: { id: 'calculator', label: 'Calculadora', ... },
//   isCompleted: false,
//   isLast: false
// }

// Obtener progreso general
const progress = stepper.getProgress();
// {
//   current: 1,
//   total: 3,
//   percentage: 33.33,
//   completed: 0,
//   completedSteps: []
// }

// Verificar si un paso está completado
stepper.isStepCompleted(0);

// Verificar si un paso es accesible
stepper.isStepAccessible(1);
```

#### Gestión de Estado

```javascript
// Guardar estado en localStorage
stepper.saveState();

// Cargar estado desde localStorage
stepper.loadState();

// Destruir el componente
stepper.destroy();
```

## FlowStepper - Gestor del Flujo Completo

El `FlowStepper` es una clase especializada que gestiona el flujo completo de la aplicación.

### Inicialización

```javascript
const flowStepper = new FlowStepper();
```

Se inicializa automáticamente cuando la página carga y hay una sección `#calculadora`.

### Métodos

```javascript
// Completar la calculadora
flowStepper.completeCalculator(calculatorData);

// Completar la cotización
flowStepper.completeQuotation(quotationData);

// Completar el pedido
flowStepper.completeOrder(orderData);

// Obtener estado del flujo
const state = flowStepper.getFlowState();

// Reiniciar el flujo
flowStepper.resetFlow();
```

### Integración Automática

El `FlowStepper` se integra automáticamente con los módulos existentes:

#### En CalculatorUI

```javascript
// Cuando se genera una cotización
if (typeof flowStepper !== 'undefined' && flowStepper) {
    flowStepper.completeCalculator(this.currentResults);
}
```

#### En OrderFormUI

```javascript
// Cuando se crea un pedido
if (typeof flowStepper !== 'undefined' && flowStepper) {
    flowStepper.completeQuotation(this.quotationData);
    flowStepper.completeOrder(order.toJSON());
}
```

## Estilos CSS

### Variables CSS Utilizadas

```css
--primary: Color principal (verde)
--primary-hover: Color principal hover
--border-color: Color de bordes
--bg-primary: Fondo principal
--bg-secondary: Fondo secundario
--text-primary: Texto principal
--text-secondary: Texto secundario
--text-muted: Texto atenuado
--transition-normal: Transición estándar
```

### Personalización

Puedes personalizar los estilos modificando las variables CSS en `styles.css`:

```css
:root {
    --primary: #2d7a3e;
    --primary-hover: #236030;
    /* ... más variables ... */
}
```

## Almacenamiento

El componente guarda automáticamente el estado en `localStorage`:

- **Clave**: `stepper_state` (para ProgressStepper)
- **Clave**: `flow_state` (para FlowStepper)

El estado se recupera automáticamente al recargar la página.

## Ejemplos de Uso

### Ejemplo 1: Stepper Simple

```html
<div id="myStepper"></div>

<script>
const stepper = new ProgressStepper({
    containerId: 'myStepper',
    steps: [
        { id: 'step1', label: 'Paso 1', icon: 'play' },
        { id: 'step2', label: 'Paso 2', icon: 'cog' },
        { id: 'step3', label: 'Paso 3', icon: 'check' }
    ]
});

// Avanzar al siguiente paso
document.getElementById('nextBtn').addEventListener('click', () => {
    stepper.nextStep();
});
</script>
```

### Ejemplo 2: Stepper con Callback

```javascript
const stepper = new ProgressStepper({
    containerId: 'progressStepper',
    steps: [...],
    onStepClick: (stepIndex, step) => {
        console.log(`Navegando a: ${step.label}`);
        
        // Validar si se puede navegar
        if (stepIndex > 0 && !isCalculatorComplete) {
            showWarning('Completa la calculadora primero');
            return false;
        }
        
        return true;
    }
});
```

### Ejemplo 3: Stepper Vertical

```javascript
const stepper = new ProgressStepper({
    containerId: 'progressStepper',
    steps: [
        { 
            id: 'info', 
            label: 'Información', 
            description: 'Ingresa tus datos',
            icon: 'user'
        },
        { 
            id: 'confirm', 
            label: 'Confirmación', 
            description: 'Revisa los datos',
            icon: 'check-square'
        },
        { 
            id: 'complete', 
            label: 'Finalización', 
            description: 'Completa el proceso',
            icon: 'flag-checkered'
        }
    ],
    variant: 'vertical'
});
```

## Testing

Se incluye un archivo de prueba: `test-progress-stepper.html`

Para probar el componente:
1. Abre `test-progress-stepper.html` en el navegador
2. Prueba las diferentes variantes (horizontal, compacto, vertical)
3. Verifica la navegación entre pasos
4. Comprueba que el estado se guarda en localStorage

## Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- **Dispositivos**: Desktop, Tablet, Mobile
- **Modo Oscuro**: Soportado completamente

## Requisitos

- Font Awesome 6.4.0+ (para iconos)
- CSS Variables (soportado en navegadores modernos)
- JavaScript ES6+

## Archivos Incluidos

- `js/progress-stepper.js` - Componente principal
- `css/progress-stepper.css` - Estilos
- `test-progress-stepper.html` - Archivo de prueba
- `PROGRESS_STEPPER_README.md` - Esta documentación

## Notas de Implementación

### Integración con Calculadora

El stepper se integra automáticamente cuando se genera una cotización desde la calculadora.

### Integración con Pedidos

El stepper se actualiza cuando se crea un pedido desde el formulario de órdenes.

### Persistencia

El estado del stepper se guarda automáticamente en localStorage y se recupera al recargar la página.

### Animaciones

El componente incluye animaciones suaves para:
- Transición entre pasos
- Checkmark de completado
- Pulso del paso activo
- Barra de progreso

## Troubleshooting

### El stepper no aparece

1. Verifica que el contenedor existe: `<div id="progressStepper"></div>`
2. Verifica que `progress-stepper.js` está cargado
3. Verifica que `progress-stepper.css` está incluido

### Los estilos no se aplican

1. Verifica que `progress-stepper.css` está en el `<head>`
2. Verifica que las variables CSS están definidas en `styles.css`
3. Abre la consola del navegador para ver errores

### El estado no se guarda

1. Verifica que `StorageManager` está disponible
2. Verifica que localStorage no está deshabilitado
3. Verifica que hay espacio disponible en localStorage

## Licencia

Parte del Sistema Integral de Alambrados - Metales & Hierros Mar del Plata
