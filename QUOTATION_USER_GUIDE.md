# Guía de Usuario - Sistema de Cotizaciones

## Introducción

El **Sistema de Cotizaciones** te permite obtener presupuestos instantáneos y profesionales para tu proyecto de cercado. Puedes generar cotizaciones desde la calculadora, seleccionar productos del catálogo, descargar PDFs y compartir por WhatsApp.

## Acceso al Sistema de Cotizaciones

### Opción 1: Desde la Calculadora
1. Completa los cálculos en la **Calculadora de Materiales**
2. Haz clic en **"Generar Cotización"**
3. Se abrirá automáticamente el modal de cotización con los materiales calculados

### Opción 2: Desde el Catálogo
1. Navega a la sección **"Catálogo"**
2. Selecciona productos individuales
3. Haz clic en **"Agregar a Cotización"** en cada producto
4. Haz clic en el **carrito flotante** para ver tu cotización

### Opción 3: Crear Cotización Manual
1. Abre el modal de cotización
2. Agrega productos manualmente
3. Ajusta cantidades según necesites

## Estructura de una Cotización

### Encabezado
```
METALES & HIERROS MAR DEL PLATA
Cotización Profesional
Número: COT-1705315800000-123
Fecha: 15 de enero de 2024
Válida hasta: 14 de febrero de 2024
```

### Tabla de Productos
```
PRODUCTO                    CANTIDAD    PRECIO UNIT.    SUBTOTAL
Poste Hormigón 2.5m         64          $3,500          $224,000
Alambre Galvanizado 5 hilos 800 m       $25/m           $20,000
Grampas (caja x 100)        4           $1,200          $4,800
Tensores                    64          $150            $9,600
```

### Resumen de Totales
```
Subtotal de Materiales:     $258,400
Servicio de Instalación:    $50,000 (opcional)
─────────────────────────────────────
TOTAL:                      $308,400
```

## Paso 1: Revisar Productos

Cuando se abre el modal de cotización:

1. **Verifica cada producto:**
   - Nombre del producto
   - Cantidad
   - Precio unitario
   - Subtotal

2. **Ajusta cantidades si es necesario:**
   - Haz clic en el campo de cantidad
   - Ingresa la cantidad deseada
   - El subtotal se actualiza automáticamente

3. **Elimina productos que no necesites:**
   - Haz clic en el botón **"Eliminar"** o **"X"** junto al producto
   - El total se recalcula automáticamente

## Paso 2: Agregar Servicio de Instalación (Opcional)

Si deseas incluir servicio de instalación profesional:

1. Marca la casilla **"Incluir Servicio de Instalación"**
2. Ingresa los **metros lineales** de cerca a instalar
3. El sistema calcula automáticamente:
   - Costo por metro: $500 (configurable)
   - Costo total: metros × $500

**Ejemplo:**
```
Metros lineales: 160 m
Precio por metro: $500
Costo de instalación: $80,000
```

4. El total general se actualiza incluyendo la instalación

## Paso 3: Revisar Total

Antes de proceder, verifica:

- ✓ Todos los productos están correctos
- ✓ Las cantidades son exactas
- ✓ El servicio de instalación está incluido si lo necesitas
- ✓ El total es el esperado

**Nota:** Los precios mostrados son los vigentes al momento de generar la cotización. Si los precios cambian después, tu cotización guardada mantiene los precios originales durante 30 días.

## Paso 4: Descargar PDF

Para descargar la cotización en formato PDF:

1. Haz clic en el botón **"Descargar PDF"**
2. Se generará automáticamente un archivo PDF profesional
3. El archivo se descargará a tu carpeta de descargas
4. Puedes imprimirlo o compartirlo por email

**Contenido del PDF:**
- Logo y datos de la empresa
- Número y fecha de cotización
- Tabla completa de productos
- Totales y forma de pago
- Validez de la cotización
- Datos de contacto

## Paso 5: Enviar por WhatsApp

Para compartir la cotización por WhatsApp:

1. Haz clic en el botón **"Enviar por WhatsApp"**
2. Se abrirá automáticamente WhatsApp (si está instalado)
3. Se pre-cargará un mensaje con:
   - Número de cotización
   - Lista de productos
   - Cantidades
   - Total
4. Puedes agregar un mensaje personal si lo deseas
5. Haz clic en **"Enviar"**

**Ejemplo de mensaje:**
```
*Cotización: COT-1705315800000-123*

*Materiales para Cercado:*
• Poste Hormigón 2.5m x64 = $224,000
• Alambre Galvanizado x800m = $20,000
• Grampas x4 = $4,800
• Tensores x64 = $9,600

*Instalación:* 160m x $500 = $80,000

*TOTAL: $338,400*

Válida hasta: 14/02/2024
```

## Paso 6: Guardar Cotización

La cotización se guarda automáticamente en tu navegador:

1. Se asigna un **número único** (COT-timestamp-random)
2. Se guarda con la **fecha actual**
3. Se establece una **validez de 30 días**
4. Se almacena en tu navegador (no requiere cuenta)

**Para recuperar una cotización guardada:**
1. Abre el sitio web
2. Navega a la sección de cotizaciones
3. Verás un listado de tus cotizaciones guardadas
4. Haz clic en la que desees para abrirla

## Gestión de Cotizaciones Guardadas

### Ver Cotizaciones Guardadas
1. Haz clic en **"Mis Cotizaciones"** en el menú
2. Verás un listado con:
   - Número de cotización
   - Fecha de creación
   - Total
   - Días restantes de validez
   - Estado (válida, próxima a expirar, expirada)

### Acciones Disponibles
Para cada cotización guardada puedes:
- **Ver:** Abre la cotización completa
- **Descargar PDF:** Descarga el PDF nuevamente
- **Enviar por WhatsApp:** Comparte nuevamente
- **Duplicar:** Crea una copia para modificar
- **Eliminar:** Borra la cotización

### Validez de Cotizaciones
- **Válida:** Menos de 30 días desde su creación
- **Próxima a expirar:** Menos de 5 días para vencer
- **Expirada:** Más de 30 días desde su creación

**Nota:** Las cotizaciones expiradas se eliminan automáticamente después de 30 días.

## Convertir Cotización a Pedido

Cuando estés listo para confirmar tu compra:

1. Abre la cotización que deseas confirmar
2. Haz clic en **"Confirmar Pedido"**
3. Se abrirá un formulario con tus datos
4. Completa la información requerida:
   - Nombre completo
   - Teléfono
   - Email
   - Dirección de instalación
   - Fecha preferida de instalación
   - Método de pago preferido
5. Haz clic en **"Confirmar Pedido"**
6. Se generará un número de orden único
7. Recibirás una confirmación por WhatsApp

## Comparar Cotizaciones

Si tienes múltiples cotizaciones guardadas:

1. Abre la sección **"Mis Cotizaciones"**
2. Selecciona hasta 3 cotizaciones para comparar
3. Haz clic en **"Comparar"**
4. Verás una tabla comparativa con:
   - Productos en cada cotización
   - Diferencias de precios
   - Totales
   - Diferencias de costo

## Solución de Problemas

### "No puedo descargar el PDF"
- Verifica que tu navegador permita descargas
- Intenta con otro navegador
- Comprueba que tengas espacio en disco

### "El mensaje de WhatsApp no se envía"
- Verifica que WhatsApp esté instalado
- Comprueba tu conexión a internet
- Intenta copiar el mensaje manualmente

### "Mi cotización desapareció"
- Verifica que no haya expirado (30 días)
- Comprueba que no hayas limpiado el caché del navegador
- Intenta acceder desde el mismo navegador y dispositivo

### "Los precios en la cotización son diferentes"
- Los precios se actualizan regularmente
- Tu cotización guardada mantiene los precios originales
- Genera una nueva cotización para ver precios actuales

### "No puedo modificar una cotización guardada"
- Las cotizaciones guardadas son de solo lectura
- Duplica la cotización para crear una versión modificable
- O crea una nueva cotización desde cero

## Consejos Prácticos

### Para Presupuestos Grandes
- Solicita un descuento por volumen
- Contacta directamente por WhatsApp
- Pregunta por opciones de financiamiento

### Para Múltiples Proyectos
- Crea cotizaciones separadas para cada proyecto
- Usa la función de duplicar para ahorrar tiempo
- Compara precios entre proyectos

### Para Compartir con Terceros
- Descarga el PDF para compartir por email
- Usa WhatsApp para compartir rápidamente
- Proporciona el número de cotización para referencia

### Para Seguimiento
- Guarda el número de cotización
- Anota la fecha de validez
- Contacta antes de que expire si necesitas más tiempo

## Datos Guardados

Tu información se guarda de forma segura:
- **Ubicación:** En tu navegador (localStorage)
- **Privacidad:** No se envía a servidores externos
- **Acceso:** Solo tú puedes acceder desde tu dispositivo
- **Duración:** Se mantiene hasta que limpies el caché

## Contacto y Soporte

Para preguntas sobre cotizaciones:
- **WhatsApp:** [Número de contacto]
- **Email:** [Email de contacto]
- **Teléfono:** [Teléfono de contacto]
- **Horario:** Lunes a viernes 9:00 - 18:00

---

**Última actualización:** Enero 2024
**Versión:** 1.0
