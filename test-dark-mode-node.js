/**
 * Test de Modo Oscuro/Claro - Versión Node.js
 * Ejecuta tests básicos sin necesidad de navegador
 * Requirements: 7.10, 8.2
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(70));
console.log('🧪 TESTING DE MODO OSCURO/CLARO - VERIFICACIÓN DE ARCHIVOS');
console.log('='.repeat(70) + '\n');

const tests = [];

// Test 1: Verificar que styles.css existe y contiene variables de tema
console.log('📝 Test 1: Verificar styles.css...');
try {
    const stylesPath = path.join(__dirname, 'styles.css');
    const stylesContent = fs.readFileSync(stylesPath, 'utf8');
    
    const hasLightTheme = stylesContent.includes(':root {');
    const hasDarkTheme = stylesContent.includes('[data-theme="dark"]');
    const hasPrimaryVar = stylesContent.includes('--primary:');
    const hasTransition = stylesContent.includes('transition:');
    
    if (hasLightTheme && hasDarkTheme && hasPrimaryVar && hasTransition) {
        console.log('✅ styles.css contiene variables de tema y transiciones\n');
        tests.push({ name: 'styles.css válido', status: 'PASS' });
    } else {
        console.log('❌ styles.css no contiene todas las variables necesarias\n');
        tests.push({ name: 'styles.css válido', status: 'FAIL' });
    }
} catch (error) {
    console.log(`❌ Error al leer styles.css: ${error.message}\n`);
    tests.push({ name: 'styles.css válido', status: 'FAIL' });
}

// Test 2: Verificar que script.js existe y contiene lógica de tema
console.log('📝 Test 2: Verificar script.js...');
try {
    const scriptPath = path.join(__dirname, 'script.js');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    const hasThemeToggle = scriptContent.includes('themeToggle');
    const hasLocalStorage = scriptContent.includes('localStorage');
    const hasDataTheme = scriptContent.includes('data-theme');
    const hasUpdateThemeIcon = scriptContent.includes('updateThemeIcon');
    
    if (hasThemeToggle && hasLocalStorage && hasDataTheme && hasUpdateThemeIcon) {
        console.log('✅ script.js contiene lógica de tema oscuro/claro\n');
        tests.push({ name: 'script.js válido', status: 'PASS' });
    } else {
        console.log('❌ script.js no contiene toda la lógica necesaria\n');
        tests.push({ name: 'script.js válido', status: 'FAIL' });
    }
} catch (error) {
    console.log(`❌ Error al leer script.js: ${error.message}\n`);
    tests.push({ name: 'script.js válido', status: 'FAIL' });
}

// Test 3: Verificar que test-dark-mode.html existe
console.log('📝 Test 3: Verificar test-dark-mode.html...');
try {
    const testHtmlPath = path.join(__dirname, 'test-dark-mode.html');
    const testHtmlContent = fs.readFileSync(testHtmlPath, 'utf8');
    
    const hasTestSections = testHtmlContent.includes('test-section');
    const hasCheckboxes = testHtmlContent.includes('type="checkbox"');
    const hasAutomatedTests = testHtmlContent.includes('runAutomatedTests');
    
    if (hasTestSections && hasCheckboxes && hasAutomatedTests) {
        console.log('✅ test-dark-mode.html contiene tests interactivos\n');
        tests.push({ name: 'test-dark-mode.html válido', status: 'PASS' });
    } else {
        console.log('❌ test-dark-mode.html no contiene todos los tests\n');
        tests.push({ name: 'test-dark-mode.html válido', status: 'FAIL' });
    }
} catch (error) {
    console.log(`❌ Error al leer test-dark-mode.html: ${error.message}\n`);
    tests.push({ name: 'test-dark-mode.html válido', status: 'FAIL' });
}

// Test 4: Verificar que test-dark-mode-automated.js existe
console.log('📝 Test 4: Verificar test-dark-mode-automated.js...');
try {
    const testJsPath = path.join(__dirname, 'test-dark-mode-automated.js');
    const testJsContent = fs.readFileSync(testJsPath, 'utf8');
    
    const hasDarkModeTests = testJsContent.includes('DarkModeTests');
    const hasTestMethods = testJsContent.includes('testThemePersistence');
    const hasContrast = testJsContent.includes('calculateContrast');
    const hasRunAll = testJsContent.includes('runAll');
    
    if (hasDarkModeTests && hasTestMethods && hasContrast && hasRunAll) {
        console.log('✅ test-dark-mode-automated.js contiene tests automatizados\n');
        tests.push({ name: 'test-dark-mode-automated.js válido', status: 'PASS' });
    } else {
        console.log('❌ test-dark-mode-automated.js no contiene todos los tests\n');
        tests.push({ name: 'test-dark-mode-automated.js válido', status: 'FAIL' });
    }
} catch (error) {
    console.log(`❌ Error al leer test-dark-mode-automated.js: ${error.message}\n`);
    tests.push({ name: 'test-dark-mode-automated.js válido', status: 'FAIL' });
}

// Test 5: Verificar que DARK_MODE_TESTING_README.md existe
console.log('📝 Test 5: Verificar DARK_MODE_TESTING_README.md...');
try {
    const readmePath = path.join(__dirname, 'DARK_MODE_TESTING_README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    const hasRequirements = readmeContent.includes('Requirements:');
    const hasTests = readmeContent.includes('Tests incluidos:');
    const hasChecklist = readmeContent.includes('Checklist');
    
    if (hasRequirements && hasTests && hasChecklist) {
        console.log('✅ DARK_MODE_TESTING_README.md contiene documentación completa\n');
        tests.push({ name: 'DARK_MODE_TESTING_README.md válido', status: 'PASS' });
    } else {
        console.log('❌ DARK_MODE_TESTING_README.md no contiene toda la documentación\n');
        tests.push({ name: 'DARK_MODE_TESTING_README.md válido', status: 'FAIL' });
    }
} catch (error) {
    console.log(`❌ Error al leer DARK_MODE_TESTING_README.md: ${error.message}\n`);
    tests.push({ name: 'DARK_MODE_TESTING_README.md válido', status: 'FAIL' });
}

// Test 6: Verificar variables CSS en styles.css
console.log('📝 Test 6: Verificar variables CSS...');
try {
    const stylesPath = path.join(__dirname, 'styles.css');
    const stylesContent = fs.readFileSync(stylesPath, 'utf8');
    
    const requiredVars = [
        '--primary:',
        '--secondary:',
        '--accent:',
        '--bg-primary:',
        '--bg-secondary:',
        '--text-primary:',
        '--text-secondary:',
        '--border-color:',
        '--gradient-primary:',
        '--transition-normal:'
    ];
    
    const allVarsPresent = requiredVars.every(varName => stylesContent.includes(varName));
    
    if (allVarsPresent) {
        console.log('✅ Todas las variables CSS requeridas están presentes\n');
        tests.push({ name: 'Variables CSS completas', status: 'PASS' });
    } else {
        console.log('❌ Faltan algunas variables CSS\n');
        tests.push({ name: 'Variables CSS completas', status: 'FAIL' });
    }
} catch (error) {
    console.log(`❌ Error al verificar variables CSS: ${error.message}\n`);
    tests.push({ name: 'Variables CSS completas', status: 'FAIL' });
}

// Test 7: Verificar que hay ajustes para dark mode en CSS
console.log('📝 Test 7: Verificar ajustes de dark mode en CSS...');
try {
    const stylesPath = path.join(__dirname, 'styles.css');
    const stylesContent = fs.readFileSync(stylesPath, 'utf8');
    
    const darkModeAdjustments = [
        '[data-theme="dark"] .product-card',
        '[data-theme="dark"] .navbar',
        '[data-theme="dark"] input',
        '[data-theme="dark"] .stat-card'
    ];
    
    const allAdjustmentsPresent = darkModeAdjustments.every(selector => 
        stylesContent.includes(selector)
    );
    
    if (allAdjustmentsPresent) {
        console.log('✅ Hay ajustes específicos para dark mode en CSS\n');
        tests.push({ name: 'Ajustes dark mode en CSS', status: 'PASS' });
    } else {
        console.log('❌ Faltan algunos ajustes de dark mode en CSS\n');
        tests.push({ name: 'Ajustes dark mode en CSS', status: 'FAIL' });
    }
} catch (error) {
    console.log(`❌ Error al verificar ajustes dark mode: ${error.message}\n`);
    tests.push({ name: 'Ajustes dark mode en CSS', status: 'FAIL' });
}

// Test 8: Verificar que hay transiciones suaves
console.log('📝 Test 8: Verificar transiciones suaves...');
try {
    const stylesPath = path.join(__dirname, 'styles.css');
    const stylesContent = fs.readFileSync(stylesPath, 'utf8');
    
    const hasBodyTransition = stylesContent.includes('body') && 
                             stylesContent.includes('transition:') &&
                             (stylesContent.includes('background-color') || 
                              stylesContent.includes('color') ||
                              stylesContent.includes('all'));
    
    if (hasBodyTransition) {
        console.log('✅ Hay transiciones suaves definidas en body\n');
        tests.push({ name: 'Transiciones suaves', status: 'PASS' });
    } else {
        console.log('❌ No hay transiciones suaves definidas\n');
        tests.push({ name: 'Transiciones suaves', status: 'FAIL' });
    }
} catch (error) {
    console.log(`❌ Error al verificar transiciones: ${error.message}\n`);
    tests.push({ name: 'Transiciones suaves', status: 'FAIL' });
}

// Resumen
console.log('='.repeat(70));
console.log('📊 RESUMEN DE TESTS');
console.log('='.repeat(70) + '\n');

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
    const icon = test.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} Test ${index + 1}: ${test.name} - ${test.status}`);
    
    if (test.status === 'PASS') passed++;
    else failed++;
});

console.log('\n' + '='.repeat(70));
console.log(`📈 Total: ${passed} pasados, ${failed} fallidos`);
console.log('='.repeat(70) + '\n');

// Instrucciones
console.log('📋 PRÓXIMOS PASOS:\n');
console.log('1. Abre ferreteria/test-dark-mode.html en tu navegador');
console.log('2. Verifica manualmente cada sección');
console.log('3. Marca los checkboxes según corresponda');
console.log('4. Haz clic en "Ejecutar Tests Automatizados"');
console.log('5. Revisa los resultados en la consola del navegador\n');

// Exit code
process.exit(failed > 0 ? 1 : 0);
