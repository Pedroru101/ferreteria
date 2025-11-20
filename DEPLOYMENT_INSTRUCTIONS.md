# Instrucciones de Deployment - Sistema Integral de Alambrados

**Estado**: ✅ LISTO PARA PRODUCCIÓN  
**Fecha**: 19 de Noviembre de 2025

---

## Paso 1: Verificación Pre-Deployment

### Ejecutar Tests Automatizados
```bash
node ferreteria/test-production-final.js
```

**Resultado esperado**: 73/73 pruebas exitosas ✅

### Verificar Configuración
```javascript
// Abrir ferreteria/config.js y verificar:
CONFIG.business = {
    name: "Metales & Hierros Mar del Plata",
    whatsappNumber: "+54 9 11 XXXX-XXXX",  // Actualizar
    email: "contacto@example.com"           // Actualizar
};

CONFIG.products = {
    enableGoogleSheets: true,
    googleSheetsUrl: "https://docs.google.com/spreadsheets/d/..."  // Si aplica
};
```

---

## Paso 2: Seleccionar Hosting

### Opciones Recomendadas

#### Netlify (Recomendado)
```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Conectar repositorio
netlify init

# 3. Configurar build
# Build command: (dejar vacío - es sitio estático)
# Publish directory: ferreteria

# 4. Deployar
netlify deploy --prod
```

#### Vercel
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deployar
vercel --prod
```

#### GitHub Pages
```bash
# 1. Crear repositorio en GitHub
# 2. Push del código
git push origin main

# 3. Ir a Settings > Pages
# 4. Seleccionar rama main y carpeta /ferreteria
# 5. GitHub Pages se actualiza automáticamente
```

#### Hosting Estático Manual
```bash
# 1. Copiar contenido de ferreteria/ a servidor
# 2. Configurar servidor para servir index.html en rutas no encontradas
# 3. Configurar SSL/HTTPS
# 4. Configurar dominio personalizado
```

---

## Paso 3: Configuración de Dominio

### Cambiar Dominio
1. Ir a configuración de hosting
2. Agregar dominio personalizado
3. Actualizar DNS records:
   ```
   CNAME: www.example.com -> hosting.example.com
   A: example.com -> IP del hosting
   ```
4. Esperar propagación DNS (hasta 48 horas)

### Configurar SSL/HTTPS
- Netlify: Automático con Let's Encrypt
- Vercel: Automático con Let's Encrypt
- GitHub Pages: Automático
- Manual: Usar certbot o similar

---

## Paso 4: Configuración de Google Sheets (Opcional)

### Si Usas Google Sheets para Productos

1. **Crear Hoja de Cálculo**
   - Crear en Google Drive
   - Compartir públicamente (lectura)
   - Copiar ID de la URL

2. **Configurar en config.js**
   ```javascript
   CONFIG.products = {
       enableGoogleSheets: true,
       googleSheetsUrl: "https://docs.google.com/spreadsheets/d/SHEET_ID/edit"
   };
   ```

3. **Estructura de la Hoja**
   ```
   Columnas: id, name, category, price, stock, description, specs
   Filas: Datos de productos
   ```

4. **Verificar Carga**
   - Abrir sitio en navegador
   - Verificar que cargue productos
   - Si falla, verifica que la hoja sea pública

---

## Paso 5: Configuración de WhatsApp

### Obtener Número de WhatsApp
1. Crear cuenta de WhatsApp Business (opcional)
2. Obtener número de teléfono
3. Verificar número en WhatsApp

### Configurar en config.js
```javascript
CONFIG.business = {
    whatsappNumber: "+54 9 11 1234-5678"  // Formato: +54 9 AREA NUMERO
};
```

### Probar Integración
1. Generar cotización
2. Hacer clic en "Enviar por WhatsApp"
3. Verificar que se abra WhatsApp con mensaje pre-cargado
4. Enviar mensaje de prueba

---

## Paso 6: Monitoreo Post-Deployment

### Configurar Google Analytics
```html
<!-- Ya incluido en index.html -->
<!-- Verificar que el ID de GA esté correcto en config.js -->
```

### Configurar Error Tracking (Sentry)
```javascript
// Opcional: Agregar a script.js
if (window.location.hostname !== 'localhost') {
    Sentry.init({
        dsn: "https://your-sentry-dsn@sentry.io/project-id",
        environment: "production"
    });
}
```

### Monitoreo de Uptime
- Usar servicio como UptimeRobot
- Configurar alertas por email
- Verificar disponibilidad cada 5 minutos

---

## Paso 7: Verificación Post-Deployment

### Checklist de Verificación
- [ ] Sitio carga correctamente
- [ ] Todas las secciones son accesibles
- [ ] Calculadora funciona
- [ ] Cotizaciones se generan
- [ ] WhatsApp funciona
- [ ] Google Sheets carga (si configurado)
- [ ] LocalStorage funciona
- [ ] Modo oscuro/claro funciona
- [ ] Responsive design funciona
- [ ] No hay errores en consola

### Pruebas Manuales
```
1. Abrir en Chrome, Firefox, Safari, Edge
2. Probar en mobile (iOS y Android)
3. Generar cotización completa
4. Enviar por WhatsApp
5. Crear pedido
6. Consultar estado de pedido
7. Usar comparador
8. Cambiar tema oscuro/claro
9. Verificar accesibilidad (Tab, Enter)
```

---

## Paso 8: Mantenimiento Continuo

### Tareas Diarias
- Revisar pedidos nuevos
- Responder mensajes de WhatsApp
- Verificar que el sitio esté online

### Tareas Semanales
- Revisar logs de errores
- Actualizar precios si es necesario
- Hacer backup de datos

### Tareas Mensuales
- Revisar analytics
- Optimizar performance
- Actualizar contenido
- Hacer backup completo

### Tareas Anuales
- Renovar SSL/HTTPS
- Actualizar dependencias
- Revisar seguridad
- Planificar mejoras

---

## Troubleshooting

### El sitio no carga
```
1. Verificar que el hosting esté online
2. Verificar que los archivos estén en el servidor
3. Verificar que index.html esté en la raíz
4. Verificar que los paths sean relativos
5. Revisar logs del servidor
```

### WhatsApp no funciona
```
1. Verificar que el número esté configurado en config.js
2. Verificar que el número tenga formato correcto (+54 9 ...)
3. Verificar que WhatsApp esté instalado en el dispositivo
4. Probar en navegador diferente
5. Revisar consola del navegador para errores
```

### Google Sheets no carga
```
1. Verificar que la URL esté correcta en config.js
2. Verificar que la hoja sea pública
3. Verificar que la estructura de columnas sea correcta
4. Revisar consola del navegador para errores CORS
5. Usar fallback a datos locales
```

### LocalStorage no funciona
```
1. Verificar que el navegador no esté en modo privado
2. Verificar que no haya límite de almacenamiento
3. Verificar que el sitio esté en HTTPS
4. Limpiar cache del navegador
5. Probar en navegador diferente
```

### Performance lento
```
1. Verificar tamaño de archivos (< 500KB JS, < 200KB CSS)
2. Verificar que lazy loading esté activo
3. Verificar que no haya memory leaks
4. Usar DevTools para profiling
5. Optimizar imágenes si es necesario
```

---

## Rollback en Caso de Problemas

### Si Algo Sale Mal
```bash
# 1. Revertir a versión anterior
git revert HEAD

# 2. Deployar versión anterior
netlify deploy --prod

# 3. Investigar el problema
# 4. Corregir en desarrollo
# 5. Deployar nuevamente
```

---

## Contacto y Soporte

### En Caso de Problemas
1. Revisar logs del servidor
2. Revisar consola del navegador (F12)
3. Revisar PRODUCTION_TESTING_SUMMARY.md
4. Contactar al equipo de desarrollo

### Información Útil
- Repositorio: [URL del repositorio]
- Documentación: Ver archivos .md en ferreteria/
- Testing: Ejecutar test-production-final.js
- Staging: Abrir test-production-staging.html

---

## Resumen de Deployment

```
✅ Paso 1: Verificación Pre-Deployment
✅ Paso 2: Seleccionar Hosting
✅ Paso 3: Configuración de Dominio
✅ Paso 4: Configuración de Google Sheets (Opcional)
✅ Paso 5: Configuración de WhatsApp
✅ Paso 6: Monitoreo Post-Deployment
✅ Paso 7: Verificación Post-Deployment
✅ Paso 8: Mantenimiento Continuo

ESTADO: LISTO PARA PRODUCCIÓN ✅
```

---

**Generado**: 19 de Noviembre de 2025  
**Versión**: 1.0  
**Próxima Revisión**: Post-deployment (7 días)
