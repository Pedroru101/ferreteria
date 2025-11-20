# Guía de Usuario - Calculadora de Materiales

## Introducción

La **Calculadora de Materiales** es una herramienta interactiva que te permite calcular automáticamente todos los materiales necesarios para tu proyecto de cercado. Solo necesitas ingresar las dimensiones de tu terreno y seleccionar el tipo de materiales que deseas usar.

## Acceso a la Calculadora

1. Abre el sitio web de **Metales & Hierros Mar del Plata**
2. Desplázate hacia la sección **"Calculadora de Presupuesto"** o haz clic en el enlace de navegación
3. Verás un formulario interactivo con varios campos para completar

## Paso 1: Ingresar Dimensiones del Terreno

### Opción A: Terreno Rectangular (Recomendado)

Si tu terreno tiene forma rectangular:

1. Selecciona **"Perímetro Simple"** en el selector de tipo de cerca
2. Ingresa el **Largo** en metros (ej: 50)
3. Ingresa el **Ancho** en metros (ej: 30)
4. La calculadora calcula automáticamente el perímetro total: **160 metros**

**Ejemplo:**
```
Largo: 50 m
Ancho: 30 m
Perímetro Total: 160 m
```

### Opción B: Terreno Irregular (Múltiples Segmentos)

Si tu terreno tiene forma irregular con varios segmentos:

1. Selecciona **"Múltiples Segmentos"** en el selector de tipo de cerca
2. Haz clic en **"Agregar Segmento"**
3. Ingresa la longitud de cada segmento en metros
4. Repite hasta completar todos los segmentos
5. La calculadora suma automáticamente todos los segmentos

**Ejemplo:**
```
Segmento 1: 50 m
Segmento 2: 30 m
Segmento 3: 40 m
Segmento 4: 25 m
Perímetro Total: 145 m
```

**Para eliminar un segmento:** Haz clic en el botón **"Eliminar"** junto al segmento

## Paso 2: Seleccionar Tipo de Poste

Elige el tipo de poste que mejor se adapte a tu proyecto:

### Hormigón
- **Precio:** $3,500 por unidad
- **Durabilidad:** 50 años
- **Ventajas:** Máxima resistencia, sin mantenimiento, resistente a humedad y plagas
- **Ideal para:** Proyectos de larga duración, zonas húmedas, uso industrial

### Quebracho
- **Precio:** $4,200 por unidad
- **Durabilidad:** 40 años
- **Ventajas:** Extrema dureza natural, estética premium, resistencia superior
- **Ideal para:** Estancias, proyectos de alta exigencia, zonas rurales

### Eucalipto
- **Precio:** $2,100 por unidad
- **Durabilidad:** 20 años
- **Ventajas:** Precio económico, estética natural, fácil instalación
- **Ideal para:** Presupuesto limitado, cercas temporales, uso residencial

### Olimpo (Hormigón + Púas)
- **Precio:** $4,000 por unidad
- **Durabilidad:** 50 años
- **Ventajas:** Máxima seguridad, incluye 3 hilos de púa, listo para instalar
- **Ideal para:** Seguridad perimetral, zonas de riesgo, instalaciones industriales

## Paso 3: Seleccionar Material de Cierre

Elige entre dos opciones: **Alambre** o **Tejido Romboidal**

### Opción A: Alambre

1. Selecciona la pestaña **"Alambre"**
2. Elige el **número de hilos** (típicamente 3 o 5 hilos)
3. La calculadora calcula automáticamente los metros lineales necesarios

**Ejemplo:**
```
Perímetro: 160 m
Número de hilos: 5
Total de alambre: 800 m
```

**Nota especial para Olimpo:** Si seleccionaste postes Olimpo, se agregan automáticamente 3 hilos de alambre de púa al cálculo.

### Opción B: Tejido Romboidal

1. Selecciona la pestaña **"Tejido Romboidal"**
2. Elige la **altura** del tejido:
   - 1.00 m (bajo)
   - 1.20 m (estándar)
   - 1.50 m (alto)
   - 1.80 m (muy alto)
   - 2.00 m (máximo)
3. La calculadora calcula automáticamente los rollos necesarios (10 m por rollo)

**Ejemplo:**
```
Perímetro: 160 m
Altura del tejido: 1.50 m
Rollos necesarios: 16 rollos
```

## Paso 4: Revisar Resultados

Una vez completados todos los campos, verás un **panel de resultados** con el desglose completo:

### Desglose de Materiales

```
POSTES
├─ Postes esquineros: 4 unidades
├─ Postes intermedios: 60 unidades
└─ Total postes: 64 unidades

CIERRE
├─ Alambre: 800 metros (5 hilos)
└─ Precio: $X,XXX

ACCESORIOS
├─ Grampas: 320 unidades
├─ Tensores: 64 unidades
└─ Abrazaderas: 128 unidades

RESUMEN TOTAL
├─ Cantidad de postes: 64
├─ Metros de alambre: 800
├─ Accesorios: 512 unidades
└─ Presupuesto estimado: $XXX,XXX
```

## Paso 5: Generar Cotización

Cuando estés satisfecho con los cálculos:

1. Haz clic en el botón **"Generar Cotización"** en la parte inferior del panel de resultados
2. Se abrirá un modal con los materiales calculados
3. Podrás revisar, agregar o quitar productos
4. Procede a generar la cotización formal

## Recálculo Automático

La calculadora recalcula automáticamente cuando:
- Cambias el largo o ancho del terreno
- Agregas o eliminas segmentos
- Cambias el tipo de poste
- Cambias el número de hilos o altura del tejido
- Modificas la separación entre postes

**No necesitas hacer clic en ningún botón de "Calcular"** - todo es en tiempo real.

## Configuración Avanzada

Si necesitas ajustar parámetros específicos:

1. Haz clic en **"Configuración Avanzada"** (si está disponible)
2. Puedes modificar:
   - **Separación entre postes:** Por defecto 2.5 m (rango: 1.5 m a 5 m)
   - **Número de postes esquineros:** Por defecto 4
   - **Largo de rollo de tejido:** Por defecto 10 m

## Validación de Datos

La calculadora valida automáticamente tus entradas:

- ✓ Solo acepta números positivos
- ✓ Rechaza valores negativos o cero
- ✓ Rechaza texto o caracteres especiales
- ✓ Muestra mensajes de error claros si hay problemas

**Ejemplo de error:**
```
❌ Error: La longitud debe ser mayor a 0
```

## Consejos Prácticos

### Para Terrenos Pequeños (< 50 m)
- Usa postes de eucalipto para economizar
- Considera 3 hilos de alambre en lugar de 5
- Verifica que la separación entre postes sea adecuada

### Para Terrenos Medianos (50-200 m)
- Hormigón es una buena opción de relación precio-durabilidad
- 5 hilos de alambre es estándar
- Tejido romboidal 1.50 m es recomendado

### Para Terrenos Grandes (> 200 m)
- Considera quebracho para máxima durabilidad
- Aumenta la separación entre postes a 3 m si es posible
- Tejido romboidal 1.80 m o 2.00 m para mayor seguridad

### Para Zonas Húmedas
- Evita eucalipto (requiere mantenimiento frecuente)
- Elige hormigón o quebracho
- Aumenta el número de hilos de alambre

### Para Presupuesto Limitado
- Usa eucalipto con 3 hilos de alambre
- Aumenta la separación entre postes a 3 m
- Considera tejido romboidal 1.00 m

## Solución de Problemas

### "La calculadora no recalcula"
- Verifica que hayas ingresado números válidos
- Recarga la página si es necesario
- Limpia el caché del navegador

### "Los resultados parecen incorrectos"
- Verifica que el perímetro sea correcto
- Comprueba que seleccionaste el tipo de poste correcto
- Revisa la separación entre postes en configuración avanzada

### "No puedo agregar más segmentos"
- Verifica que hayas seleccionado "Múltiples Segmentos"
- Intenta eliminar un segmento y vuelve a intentar
- Recarga la página si persiste el problema

## Próximos Pasos

Una vez que tengas los cálculos:

1. **Generar Cotización:** Haz clic en "Generar Cotización" para obtener precios
2. **Comparar Soluciones:** Usa el Comparador para ver alternativas
3. **Consultar Catálogo:** Explora productos específicos en el catálogo
4. **Contactar:** Envía tu cotización por WhatsApp para confirmar

## Contacto y Soporte

Si tienes preguntas sobre la calculadora:
- **WhatsApp:** [Número de contacto]
- **Email:** [Email de contacto]
- **Teléfono:** [Teléfono de contacto]

---

**Última actualización:** Enero 2024
**Versión:** 1.0
