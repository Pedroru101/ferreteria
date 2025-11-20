# Configuración de Google Analytics 4

Esta guía proporciona instrucciones paso a paso para configurar Google Analytics 4 con el sitio de Metales & Hierros Mar del Plata.

## Paso 1: Crear una Propiedad en Google Analytics

### 1.1 Acceder a Google Analytics

1. Ir a [Google Analytics](https://analytics.google.com/)
2. Iniciar sesión con tu cuenta de Google
3. Si es la primera vez, hacer clic en "Crear cuenta"

### 1.2 Crear una Nueva Propiedad

1. En el panel izquierdo, hacer clic en "Administración"
2. En la columna "Propiedad", hacer clic en "Crear propiedad"
3. Completar los datos:
   - **Nombre de la propiedad**: "Metales & Hierros Mar del Plata"
   - **Zona horaria de informes**: "America/Argentina/Buenos_Aires"
   - **Moneda de informes**: "ARS"
4. Hacer clic en "Crear"

### 1.3 Crear un Flujo de Datos Web

1. En la sección "Recopilación de datos", hacer clic en "Flujos de datos"
2. Hacer clic en "Crear flujo"
3. Seleccionar "Web"
4. Completar los datos:
   - **URL del sitio web**: "https://www.metalesmdp.com.ar"
   - **Nombre del flujo**: "Sitio Principal"
5. Hacer clic en "Crear flujo"

### 1.4 Obtener el ID de Medición

1. En la página del flujo, copiar el "ID de medición" (formato: G-XXXXXXXXXX)
2. Este es el ID que necesitas para config.js

## Paso 2: Configurar en config.js

```javascript
const CONFIG = {
    analytics: {
        googleAnalyticsId: 'G-XXXXXXXXXX', // Reemplazar con tu ID
        enableEventTracking: true
    }
};
```

## Paso 3: Crear Eventos Personalizados en GA

### 3.1 Acceder a Eventos Personalizados

1. En Google Analytics, ir a "Administración"
2. En la columna "Propiedad", hacer clic en "Eventos personalizados"
3. Hacer clic en "Crear evento"

### 3.2 Crear Eventos

Crear los siguientes eventos personalizados:

#### Evento: quotation_create

```
Nombre del evento: quotation_create
Descripción: Se dispara cuando se crea una cotización
Parámetros:
- quotation_id (string)
- quotation_total (number)
- items_count (number)
- has_installation (boolean)
```

#### Evento: order_create

```
Nombre del evento: order_create
Descripción: Se dispara cuando se crea un pedido
Parámetros:
- order_id (string)
- order_total (number)
- items_count (number)
- customer_name (string)
```

#### Evento: quotation_download_pdf

```
Nombre del evento: quotation_download_pdf
Descripción: Se dispara cuando se descarga un PDF
Parámetros:
- quotation_id (string)
- quotation_total (number)
```

#### Evento: quotation_send_whatsapp

```
Nombre del evento: quotation_send_whatsapp
Descripción: Se dispara cuando se envía por WhatsApp
Parámetros:
- quotation_id (string)
- quotation_total (number)
```

#### Evento: calculator_calculate

```
Nombre del evento: calculator_calculate
Descripción: Se dispara cuando se realiza un cálculo
Parámetros:
- perimeter (number)
- post_type (string)
- material_type (string)
- total_posts (number)
```

#### Evento: catalog_add_to_cart

```
Nombre del evento: catalog_add_to_cart
Descripción: Se dispara cuando se agrega un producto
Parámetros:
- product_id (string)
- product_name (string)
- product_category (string)
- product_price (number)
- quantity (number)
```

#### Evento: comparator_select_products

```
Nombre del evento: comparator_select_products
Descripción: Se dispara cuando se seleccionan productos para comparar
Parámetros:
- products_count (number)
- products (string)
```

#### Evento: admin_login

```
Nombre del evento: admin_login
Descripción: Se dispara cuando un administrador inicia sesión
Parámetros:
- admin_name (string)
```

## Paso 4: Crear Conversiones (Goals)

### 4.1 Acceder a Conversiones

1. En Google Analytics, ir a "Administración"
2. En la columna "Propiedad", hacer clic en "Conversiones"
3. Hacer clic en "Crear conversión"

### 4.2 Crear Conversiones

#### Conversión: Cotización Creada

```
Nombre: Cotización Creada
Descripción: Usuario creó una cotización
Evento: quotation_create
Valor de conversión: quotation_total
```

#### Conversión: Pedido Creado

```
Nombre: Pedido Creado
Descripción: Usuario creó un pedido
Evento: order_create
Valor de conversión: order_total
```

#### Conversión: PDF Descargado

```
Nombre: PDF Descargado
Descripción: Usuario descargó un PDF
Evento: quotation_download_pdf
Valor de conversión: 1
```

#### Conversión: WhatsApp Enviado

```
Nombre: WhatsApp Enviado
Descripción: Usuario envió cotización por WhatsApp
Evento: quotation_send_whatsapp
Valor de conversión: 1
```

## Paso 5: Crear Audiencias

### 5.1 Acceder a Audiencias

1. En Google Analytics, ir a "Administración"
2. En la columna "Propiedad", hacer clic en "Audiencias"
3. Hacer clic en "Crear audiencia"

### 5.2 Crear Audiencias

#### Audiencia: Usuarios que Crearon Cotizaciones

```
Nombre: Usuarios que Crearon Cotizaciones
Descripción: Usuarios que han creado al menos una cotización
Condición: quotation_create ocurrió
```

#### Audiencia: Usuarios que Crearon Pedidos

```
Nombre: Usuarios que Crearon Pedidos
Descripción: Usuarios que han creado al menos un pedido
Condición: order_create ocurrió
```

#### Audiencia: Usuarios Activos

```
Nombre: Usuarios Activos
Descripción: Usuarios que visitaron en los últimos 7 días
Condición: Sesiones > 0 en los últimos 7 días
```

## Paso 6: Crear Reportes Personalizados

### 6.1 Acceder a Reportes

1. En Google Analytics, ir a "Reportes"
2. Hacer clic en "Crear nuevo informe"

### 6.2 Crear Reportes

#### Reporte: Conversiones por Fuente

```
Nombre: Conversiones por Fuente
Dimensiones: Fuente/Medio
Métricas: Conversiones, Tasa de conversión
Filtro: Conversión = Sí
```

#### Reporte: Valor de Cotizaciones

```
Nombre: Valor de Cotizaciones
Dimensiones: Fecha
Métricas: Evento (quotation_create), Valor de evento
Filtro: Evento = quotation_create
```

#### Reporte: Embudo de Conversión

```
Nombre: Embudo de Conversión
Pasos:
1. calculator_calculate
2. quotation_create
3. order_create
```

## Paso 7: Configurar Alertas

### 7.1 Crear Alertas

1. En Google Analytics, ir a "Administración"
2. En la columna "Propiedad", hacer clic en "Alertas personalizadas"
3. Hacer clic en "Crear alerta"

### 7.2 Alertas Recomendadas

#### Alerta: Caída en Tráfico

```
Nombre: Caída en Tráfico
Condición: Sesiones disminuyen más del 50%
Período: Diario
Notificación: Email
```

#### Alerta: Aumento en Conversiones

```
Nombre: Aumento en Conversiones
Condición: Conversiones aumentan más del 100%
Período: Diario
Notificación: Email
```

## Paso 8: Verificar la Instalación

### 8.1 Usar Google Analytics Debugger

1. Instalar la extensión [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)
2. Activar la extensión
3. Abrir la consola del navegador (F12)
4. Ir a la pestaña "Google Analytics"
5. Realizar acciones en el sitio
6. Verificar que los eventos aparezcan en la consola

### 8.2 Usar Real-Time Reports

1. En Google Analytics, ir a "Reportes" → "En tiempo real"
2. Realizar acciones en el sitio
3. Verificar que aparezcan en tiempo real

### 8.3 Verificar en la Consola

```javascript
// En la consola del navegador
console.log(analyticsManager);
// Debería mostrar la instancia del gestor de analytics

// Verificar que gtag esté disponible
console.log(typeof gtag);
// Debería mostrar "function"

// Verificar que los eventos se registren
analyticsManager.trackEvent('test_event', { test: true });
// Debería ver el evento en la consola
```

## Paso 9: Configurar Filtros (Opcional)

### 9.1 Crear Filtros

1. En Google Analytics, ir a "Administración"
2. En la columna "Propiedad", hacer clic en "Filtros"
3. Hacer clic en "Crear filtro"

### 9.2 Filtros Recomendados

#### Filtro: Excluir Tráfico Interno

```
Nombre: Excluir Tráfico Interno
Tipo: Excluir
Campo: Dirección IP
Expresión: ^192\.168\..*
```

#### Filtro: Incluir Solo Dominio Principal

```
Nombre: Incluir Solo Dominio Principal
Tipo: Incluir
Campo: Nombre de host
Expresión: ^www\.metalesmdp\.com\.ar$
```

## Paso 10: Integración con Google Search Console

### 10.1 Conectar Search Console

1. En Google Analytics, ir a "Administración"
2. En la columna "Propiedad", hacer clic en "Conexiones de Search Console"
3. Hacer clic en "Conectar"
4. Seleccionar la propiedad de Search Console
5. Hacer clic en "Conectar"

## Paso 11: Integración con Google Ads (Opcional)

### 11.1 Conectar Google Ads

1. En Google Analytics, ir a "Administración"
2. En la columna "Propiedad", hacer clic en "Conexiones de Google Ads"
3. Hacer clic en "Conectar"
4. Seleccionar la cuenta de Google Ads
5. Hacer clic en "Conectar"

## Paso 12: Configurar Objetivos de Negocio

### 12.1 Definir KPIs

```
KPI 1: Cotizaciones Creadas
- Meta: 50 cotizaciones/mes
- Métrica: Conversión (quotation_create)

KPI 2: Pedidos Creados
- Meta: 20 pedidos/mes
- Métrica: Conversión (order_create)

KPI 3: Tasa de Conversión
- Meta: 40% (pedidos/cotizaciones)
- Métrica: order_create / quotation_create

KPI 4: Valor Promedio de Pedido
- Meta: $50,000
- Métrica: Valor de evento (order_create)

KPI 5: Tasa de Rebote
- Meta: < 50%
- Métrica: Tasa de rebote
```

## Troubleshooting

### Los eventos no aparecen en Google Analytics

1. Verificar que el ID de GA sea correcto
2. Verificar que `enableEventTracking` esté en `true`
3. Usar Google Analytics Debugger para verificar
4. Esperar 24-48 horas para que aparezcan en reportes
5. Verificar en Real-Time Reports

### Las conversiones no se registran

1. Verificar que el evento se dispare correctamente
2. Verificar que la conversión esté configurada correctamente
3. Verificar que el nombre del evento coincida exactamente
4. Usar Real-Time Reports para verificar en tiempo real

### Los datos no coinciden con otras fuentes

1. Verificar que los filtros no excluyan datos importantes
2. Verificar que no haya múltiples IDs de GA
3. Verificar que el período de tiempo sea el mismo
4. Considerar diferencias en zonas horarias

## Recursos Adicionales

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Google Analytics Academy](https://analytics.google.com/analytics/academy/)
- [Google Analytics Help Center](https://support.google.com/analytics)
- [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)

## Soporte

Para preguntas o problemas con la configuración de Google Analytics, contactar al equipo de desarrollo.
