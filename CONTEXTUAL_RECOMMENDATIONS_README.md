# Sistema de Recomendaciones Contextuales - Comparador

## Descripción

Sistema de recomendaciones inteligentes que sugiere productos según el contexto de uso del cliente. Implementa los requerimientos 5.6, 5.7 y 5.8 del documento de especificaciones.

## Funcionalidades Implementadas

### 1. Selector de Contexto

Cuatro contextos principales disponibles:

#### Alta Exigencia
- **Uso**: Instalaciones industriales, campos con uso intensivo
- **Productos recomendados**: Quebracho, Hormigón
- **Prioridades sugeridas**: Durabilidad 10, Precio 3, Estética 5
- **Ventajas destacadas**:
  - Quebracho: Extrema dureza natural, resistencia a putrefacción, 40+ años de vida útil
  - Hormigón: Máxima durabilidad (50+ años), sin mantenimiento, resistencia total

#### Presupuesto Económico
- **Uso**: Proyectos residenciales con presupuesto ajustado
- **Productos recomendados**: Eucalipto
- **Prioridades sugeridas**: Precio 10, Durabilidad 4, Estética 6
- **Ventajas destacadas**:
  - Precio más accesible del mercado
  - Buena durabilidad con tratamiento (20 años)
  - Estética natural atractiva
  - Fácil instalación

#### Equilibrado
- **Uso**: Balance entre inversión y durabilidad
- **Productos recomendados**: Hormigón, Eucalipto
- **Prioridades sugeridas**: Precio 6, Durabilidad 7, Estética 6
- **Ventajas destacadas**:
  - Hormigón: Excelente relación costo-beneficio a largo plazo
  - Eucalipto: Inversión inicial baja con buena durabilidad

#### Seguridad
- **Uso**: Perímetros industriales, máxima protección
- **Productos recomendados**: Olimpo, Hormigón
- **Prioridades sugeridas**: Durabilidad 9, Precio 4, Estética 5
- **Ventajas destacadas**:
  - Olimpo: Sistema completo con 3 hilos de púa integrados
  - Hormigón: Base sólida para sistemas de seguridad

### 2. Tarjeta de Recomendación

Cuando el usuario selecciona un contexto, se muestra:
- Título y descripción del contexto
- Lista de productos recomendados con:
  - Nombre y precio
  - Ventajas específicas para ese contexto
  - Botón de selección rápida
- Nota sobre productos no recomendados

### 3. Integración con Tabla Comparativa

La tabla comparativa muestra:
- **Badge "Mejor Score"**: Producto con mejor puntuación según prioridades
- **Badge "Recomendado para tu contexto"**: Productos sugeridos para el contexto seleccionado
- **Badge "No ideal para tu contexto"**: Productos no recomendados
- **Fila adicional**: "Ventajas para tu contexto" con razones específicas

### 4. Ajuste Automático de Prioridades

Al seleccionar un contexto, los sliders de prioridades se ajustan automáticamente según las necesidades típicas de ese contexto.

## Estructura de Datos

### CONTEXT_RECOMMENDATIONS

```javascript
{
  'context-id': {
    title: string,
    description: string,
    recommended: string[],
    reasons: {
      [productId]: string[]
    },
    notRecommended: string[],
    prioritySuggestion: {
      price: number,
      durability: number,
      aesthetics: number
    }
  }
}
```

## Archivos Modificados

1. **ferreteria/index.html**
   - Agregado selector de contexto en sección comparador

2. **ferreteria/js/comparator.js**
   - Agregado objeto `CONTEXT_RECOMMENDATIONS`
   - Agregado método `handleContextSelection()`
   - Agregado método `applyContextRecommendation()`
   - Agregado método `quickSelectProduct()`
   - Agregado método `applySuggestedPriorities()`
   - Modificado método `generateComparisonTable()` para mostrar badges contextuales

3. **ferreteria/css/comparator.css**
   - Agregados estilos para selector de contexto
   - Agregados estilos para tarjeta de recomendación
   - Agregados estilos para badges contextuales
   - Agregados estilos para fila de ventajas contextuales

4. **ferreteria/test-comparator.html**
   - Actualizado con selector de contexto para pruebas

## Flujo de Usuario

1. Usuario accede al comparador
2. Selecciona su contexto de uso (Alta Exigencia, Presupuesto, etc.)
3. Sistema muestra tarjeta con recomendaciones específicas
4. Usuario puede seleccionar productos recomendados con un clic
5. Sliders de prioridades se ajustan automáticamente
6. Tabla comparativa muestra badges y ventajas contextuales
7. Usuario puede comparar hasta 3 productos con información relevante

## Validación de Requerimientos

✅ **Req 5.6**: Ventajas específicas según contexto
- Implementado en `CONTEXT_RECOMMENDATIONS.reasons`
- Mostrado en tarjeta de recomendación y tabla comparativa

✅ **Req 5.7**: Recomendación para alta exigencia
- Contexto "high-demand" recomienda quebracho/hormigón
- Ventajas específicas destacadas

✅ **Req 5.8**: Recomendación para presupuesto económico
- Contexto "budget" recomienda eucalipto
- Ventajas de precio y relación costo-beneficio destacadas

## Pruebas

Para probar la funcionalidad:

1. Abrir `ferreteria/test-comparator.html` en el navegador
2. Hacer clic en cada botón de contexto
3. Verificar que aparece la tarjeta de recomendación
4. Verificar que los sliders se ajustan automáticamente
5. Seleccionar productos y verificar badges en la tabla
6. Verificar fila "Ventajas para tu contexto"

## Notas Técnicas

- Los contextos son mutuamente excluyentes (solo uno activo a la vez)
- Las prioridades sugeridas son valores entre 0-10
- Los productos no recomendados se muestran con badge rojo
- La selección rápida verifica que no se exceda el límite de 3 productos
- Responsive design para móviles y tablets
