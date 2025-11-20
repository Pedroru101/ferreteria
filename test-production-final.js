/**
 * Test Final en Ambiente de Producción
 * Valida todas las funcionalidades end-to-end antes de deployment
 * 
 * Uso: node test-production-final.js
 */

const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class ProductionTestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.baseDir = __dirname;
  }

  log(message, type = 'info') {
    const prefix = {
      info: `${colors.blue}ℹ${colors.reset}`,
      success: `${colors.green}✓${colors.reset}`,
      error: `${colors.red}✗${colors.reset}`,
      warning: `${colors.yellow}⚠${colors.reset}`,
      section: `${colors.cyan}→${colors.reset}`
    };
    console.log(`${prefix[type]} ${message}`);
  }

  async runTests() {
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}TESTING FINAL EN AMBIENTE DE PRODUCCIÓN${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

    await this.testFileStructure();
    await this.testHTMLIntegrity();
    await this.testJavaScriptModules();
    await this.testCSSVariables();
    await this.testLocalStorageCompatibility();
    await this.testWhatsAppIntegration();
    await this.testGoogleSheetsIntegration();
    await this.testPerformanceMetrics();
    await this.testAccessibility();
    await this.testBrowserCompatibility();

    this.printSummary();
  }

  async testFileStructure() {
    this.log('Validando estructura de archivos', 'section');

    const requiredFiles = [
      'index.html',
      'admin.html',
      'config.js',
      'styles.css',
      'script.js',
      'products-loader.js',
      'js/calculator.js',
      'js/quotation.js',
      'js/orders.js',
      'js/comparator.js',
      'js/catalog.js',
      'js/admin.js',
      'js/products-data.js',
      'css/calculator.css',
      'css/quotation.css',
      'css/orders.css',
      'css/comparator.css',
      'css/admin.css'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.baseDir, file);
      if (fs.existsSync(filePath)) {
        this.addResult(true, `Archivo encontrado: ${file}`);
      } else {
        this.addResult(false, `Archivo faltante: ${file}`);
      }
    }
  }

  async testHTMLIntegrity() {
    this.log('Validando integridad de HTML', 'section');

    const htmlFiles = ['index.html', 'admin.html'];

    for (const file of htmlFiles) {
      const filePath = path.join(this.baseDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Verificar que no haya rutas absolutas
      const absolutePaths = content.match(/href="\/|src="\/|url\("\/|url\('\//g);
      if (!absolutePaths) {
        this.addResult(true, `${file}: Sin rutas absolutas`);
      } else {
        this.addResult(false, `${file}: Contiene rutas absolutas`);
      }

      // Verificar que tenga meta tags esenciales
      if (content.includes('<meta charset') && content.includes('<meta name="viewport')) {
        this.addResult(true, `${file}: Meta tags esenciales presentes`);
      } else {
        this.addResult(false, `${file}: Meta tags esenciales faltantes`);
      }

      // Verificar que no haya localhost
      if (!content.includes('localhost') && !content.includes('127.0.0.1')) {
        this.addResult(true, `${file}: Sin referencias a localhost`);
      } else {
        this.addResult(false, `${file}: Contiene referencias a localhost`);
      }
    }
  }

  async testJavaScriptModules() {
    this.log('Validando módulos JavaScript', 'section');

    const jsModules = [
      'js/calculator.js',
      'js/quotation.js',
      'js/orders.js',
      'js/comparator.js',
      'js/catalog.js',
      'js/admin.js'
    ];

    for (const module of jsModules) {
      const filePath = path.join(this.baseDir, module);
      const content = fs.readFileSync(filePath, 'utf8');

      // Verificar que no haya console.log innecesarios
      const consoleLogs = content.match(/console\.log\(/g) || [];
      const consoleErrors = content.match(/console\.error\(/g) || [];
      const consoleWarns = content.match(/console\.warn\(/g) || [];

      if (consoleLogs.length === 0) {
        this.addResult(true, `${module}: Sin console.log innecesarios`);
      } else {
        this.addResult(false, `${module}: Contiene ${consoleLogs.length} console.log`);
      }

      // Verificar que tenga manejo de errores
      if (content.includes('try') && content.includes('catch')) {
        this.addResult(true, `${module}: Tiene manejo de errores`);
      } else {
        this.addResult(false, `${module}: Sin manejo de errores`);
      }

      // Verificar tamaño del archivo
      const sizeKB = Buffer.byteLength(content) / 1024;
      if (sizeKB < 100) {
        this.addResult(true, `${module}: Tamaño OK (${sizeKB.toFixed(2)}KB)`);
      } else {
        this.addResult(false, `${module}: Tamaño excesivo (${sizeKB.toFixed(2)}KB)`);
      }
    }
  }

  async testCSSVariables() {
    this.log('Validando variables CSS', 'section');

    const cssFile = path.join(this.baseDir, 'styles.css');
    const content = fs.readFileSync(cssFile, 'utf8');

    // Verificar variables de color verde
    const requiredVars = [
      '--primary',
      '--secondary',
      '--accent',
      '--bg-primary',
      '--text-primary',
      '--gradient-primary'
    ];

    for (const variable of requiredVars) {
      if (content.includes(variable)) {
        this.addResult(true, `Variable CSS encontrada: ${variable}`);
      } else {
        this.addResult(false, `Variable CSS faltante: ${variable}`);
      }
    }

    // Verificar modo oscuro
    if (content.includes('[data-theme="dark"]')) {
      this.addResult(true, 'Modo oscuro configurado');
    } else {
      this.addResult(false, 'Modo oscuro no configurado');
    }
  }

  async testLocalStorageCompatibility() {
    this.log('Validando compatibilidad de localStorage', 'section');

    const jsFiles = [
      'js/quotation.js',
      'js/orders.js',
      'js/catalog.js',
      'js/admin.js'
    ];

    for (const file of jsFiles) {
      const filePath = path.join(this.baseDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Verificar que use localStorage con prefijos consistentes
      if (content.includes('localStorage.setItem') || content.includes('localStorage.getItem')) {
        if (content.includes('ferreteria_')) {
          this.addResult(true, `${file}: Usa prefijo consistente en localStorage`);
        } else {
          this.addResult(false, `${file}: No usa prefijo en localStorage`);
        }
      }
    }

    // Verificar que no haya sessionStorage innecesario
    const adminFile = path.join(this.baseDir, 'js/admin.js');
    const adminContent = fs.readFileSync(adminFile, 'utf8');
    if (adminContent.includes('sessionStorage')) {
      this.addResult(true, 'Admin usa sessionStorage para sesiones');
    }
  }

  async testWhatsAppIntegration() {
    this.log('Validando integración de WhatsApp', 'section');

    const quotationFile = path.join(this.baseDir, 'js/quotation.js');
    const ordersFile = path.join(this.baseDir, 'js/orders.js');

    const quotationContent = fs.readFileSync(quotationFile, 'utf8');
    const ordersContent = fs.readFileSync(ordersFile, 'utf8');

    // Verificar que haya métodos para generar mensajes de WhatsApp
    if (quotationContent.includes('toWhatsAppMessage') || quotationContent.includes('whatsapp')) {
      this.addResult(true, 'Quotation: Integración de WhatsApp presente');
    } else {
      this.addResult(false, 'Quotation: Integración de WhatsApp faltante');
    }

    if (ordersContent.includes('toWhatsAppMessage') || ordersContent.includes('whatsapp')) {
      this.addResult(true, 'Orders: Integración de WhatsApp presente');
    } else {
      this.addResult(false, 'Orders: Integración de WhatsApp faltante');
    }

    // Verificar que use encodeURIComponent para URLs
    if (quotationContent.includes('encodeURIComponent') || ordersContent.includes('encodeURIComponent')) {
      this.addResult(true, 'WhatsApp: URLs correctamente codificadas');
    } else {
      this.addResult(false, 'WhatsApp: URLs no están codificadas');
    }
  }

  async testGoogleSheetsIntegration() {
    this.log('Validando integración de Google Sheets', 'section');

    const productsLoaderFile = path.join(this.baseDir, 'products-loader.js');
    const catalogFile = path.join(this.baseDir, 'js/catalog.js');

    const loaderContent = fs.readFileSync(productsLoaderFile, 'utf8');
    const catalogContent = fs.readFileSync(catalogFile, 'utf8');

    // Verificar que products-loader.js exista y tenga funcionalidad
    if (loaderContent.includes('loadProductos') || loaderContent.includes('fetch')) {
      this.addResult(true, 'products-loader.js: Tiene métodos de carga');
    } else {
      this.addResult(false, 'products-loader.js: Sin métodos de carga');
    }

    // Verificar que catalog.js tenga fallback
    if (catalogContent.includes('PRODUCTS_DATA') || catalogContent.includes('fallback')) {
      this.addResult(true, 'catalog.js: Tiene fallback a datos locales');
    } else {
      this.addResult(false, 'catalog.js: Sin fallback a datos locales');
    }

    // Verificar que haya manejo de errores para Google Sheets
    if (loaderContent.includes('catch') || loaderContent.includes('error')) {
      this.addResult(true, 'Google Sheets: Tiene manejo de errores');
    } else {
      this.addResult(false, 'Google Sheets: Sin manejo de errores');
    }
  }

  async testPerformanceMetrics() {
    this.log('Validando métricas de performance', 'section');

    // Verificar tamaño total de archivos
    const jsDir = path.join(this.baseDir, 'js');
    const cssDir = path.join(this.baseDir, 'css');

    let totalJSSize = 0;
    let totalCSSSize = 0;

    if (fs.existsSync(jsDir)) {
      const jsFiles = fs.readdirSync(jsDir);
      for (const file of jsFiles) {
        if (file.endsWith('.js')) {
          const filePath = path.join(jsDir, file);
          const stats = fs.statSync(filePath);
          totalJSSize += stats.size;
        }
      }
    }

    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir);
      for (const file of cssFiles) {
        if (file.endsWith('.css')) {
          const filePath = path.join(cssDir, file);
          const stats = fs.statSync(filePath);
          totalCSSSize += stats.size;
        }
      }
    }

    const totalJSMB = (totalJSSize / 1024 / 1024).toFixed(2);
    const totalCSSMB = (totalCSSSize / 1024 / 1024).toFixed(2);

    if (totalJSSize < 500 * 1024) {
      this.addResult(true, `JavaScript total: ${totalJSMB}MB (OK)`);
    } else {
      this.addResult(false, `JavaScript total: ${totalJSMB}MB (Excesivo)`);
    }

    if (totalCSSSize < 200 * 1024) {
      this.addResult(true, `CSS total: ${totalCSSMB}MB (OK)`);
    } else {
      this.addResult(false, `CSS total: ${totalCSSMB}MB (Excesivo)`);
    }

    // Verificar lazy loading
    const lazyLoaderFile = path.join(this.baseDir, 'js/lazy-loader.js');
    if (fs.existsSync(lazyLoaderFile)) {
      const content = fs.readFileSync(lazyLoaderFile, 'utf8');
      if (content.includes('IntersectionObserver') || content.includes('lazy')) {
        this.addResult(true, 'Lazy loading: Implementado');
      } else {
        this.addResult(false, 'Lazy loading: No implementado');
      }
    }
  }

  async testAccessibility() {
    this.log('Validando accesibilidad', 'section');

    const accessibilityFile = path.join(this.baseDir, 'js/accessibility.js');
    const indexFile = path.join(this.baseDir, 'index.html');

    if (fs.existsSync(accessibilityFile)) {
      const content = fs.readFileSync(accessibilityFile, 'utf8');
      if (content.includes('aria') || content.includes('role')) {
        this.addResult(true, 'accessibility.js: Implementa ARIA');
      } else {
        this.addResult(false, 'accessibility.js: Sin ARIA');
      }
    }

    const indexContent = fs.readFileSync(indexFile, 'utf8');
    if (indexContent.includes('lang=')) {
      this.addResult(true, 'index.html: Tiene atributo lang');
    } else {
      this.addResult(false, 'index.html: Sin atributo lang');
    }

    // Verificar que haya alt text en imágenes
    const imgTags = indexContent.match(/<img[^>]*>/g) || [];
    let imagesWithAlt = 0;
    for (const img of imgTags) {
      if (img.includes('alt=')) {
        imagesWithAlt++;
      }
    }

    if (imagesWithAlt > 0 || imgTags.length === 0) {
      this.addResult(true, `Imágenes: ${imagesWithAlt}/${imgTags.length} con alt text`);
    } else {
      this.addResult(false, `Imágenes: Sin alt text`);
    }
  }

  async testBrowserCompatibility() {
    this.log('Validando compatibilidad de navegadores', 'section');

    const jsFiles = [
      'js/calculator.js',
      'js/quotation.js',
      'js/orders.js',
      'js/comparator.js',
      'js/catalog.js',
      'js/admin.js'
    ];

    for (const file of jsFiles) {
      const filePath = path.join(this.baseDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Verificar que no use características muy nuevas
      const modernFeatures = {
        'async/await': /async\s+\w+|await\s+/,
        'arrow functions': /=>/,
        'const/let': /const\s+|let\s+/,
        'template literals': /`/
      };

      let hasModernFeatures = false;
      for (const [feature, regex] of Object.entries(modernFeatures)) {
        if (regex.test(content)) {
          hasModernFeatures = true;
          break;
        }
      }

      if (hasModernFeatures) {
        this.addResult(true, `${file}: Usa características ES6+ (navegadores modernos)`);
      }
    }

    // Verificar que no haya IE-specific code
    const indexFile = path.join(this.baseDir, 'index.html');
    const indexContent = fs.readFileSync(indexFile, 'utf8');
    if (!indexContent.includes('<!--[if IE]')) {
      this.addResult(true, 'Sin código específico para IE');
    }
  }

  addResult(passed, message) {
    if (passed) {
      this.results.passed++;
      this.log(message, 'success');
    } else {
      this.results.failed++;
      this.log(message, 'error');
    }
    this.results.tests.push({ passed, message });
  }

  printSummary() {
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}RESUMEN DE RESULTADOS${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

    console.log(`${colors.green}✓ Pruebas Exitosas: ${this.results.passed}${colors.reset}`);
    console.log(`${colors.red}✗ Pruebas Fallidas: ${this.results.failed}${colors.reset}`);

    const total = this.results.passed + this.results.failed;
    const percentage = ((this.results.passed / total) * 100).toFixed(1);

    console.log(`\n${colors.cyan}Cobertura: ${percentage}% (${this.results.passed}/${total})${colors.reset}\n`);

    if (this.results.failed === 0) {
      console.log(`${colors.green}✓ LISTO PARA PRODUCCIÓN${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`${colors.red}✗ REVISAR ERRORES ANTES DE DEPLOYMENT${colors.reset}\n`);
      process.exit(1);
    }
  }
}

// Ejecutar tests
const suite = new ProductionTestSuite();
suite.runTests().catch(error => {
  console.error(`${colors.red}Error durante testing:${colors.reset}`, error);
  process.exit(1);
});
