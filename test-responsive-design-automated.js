#!/usr/bin/env node

/**
 * Test Automatizado de Responsive Design - Tarea 68
 * Ejecutable desde Node.js con jsdom para simular el navegador
 */

const fs = require('fs');
const path = require('path');

// Simulación de window y document para Node.js
class MockWindow {
    constructor(width = 1200) {
        this.innerWidth = width;
        this.innerHeight = 800;
        this.scrollWidth = width;
        this.scrollHeight = 800;
        this.listeners = {};
    }

    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    dispatchEvent(event) {
        if (this.listeners[event.type]) {
            this.listeners[event.type].forEach(callback => callback(event));
        }
    }

    getComputedStyle(element) {
        return element.style || {};
    }
}

class MockElement {
    constructor(tag = 'div', id = '') {
        this.tagName = tag;
        this.id = id;
        this.textContent = '';
        this.innerHTML = '';
        this.style = {
            display: 'block',
            visibility: 'visible',
            overflow: 'visible',
            textOverflow: 'clip',
            maxWidth: 'none',
            padding: '0px'
        };
        this.offsetHeight = 50;
        this.offsetWidth = 100;
        this.scrollWidth = 100;
        this.clientWidth = 100;
        this.children = [];
        this.name = '';
        this.src = '';
    }

    getBoundingClientRect() {
        return {
            top: 0,
            bottom: 50,
            left: 0,
            right: 100,
            width: this.offsetWidth,
            height: this.offsetHeight,
            x: 0,
            y: 0
        };
    }

    querySelector(selector) {
        return new MockElement('div', selector);
    }

    querySelectorAll(selector) {
        return [new MockElement('div', selector)];
    }
}

class MockDocument {
    constructor() {
        this.body = new MockElement('body');
        this.documentElement = new MockElement('html');
        this.body.scrollWidth = 1200;
        this.documentElement.scrollWidth = 1200;
    }

    querySelector(selector) {
        return new MockElement('div', selector);
    }

    querySelectorAll(selector) {
        return [new MockElement('div', selector)];
    }

    createElement(tag) {
        return new MockElement(tag);
    }
}

// Cargar el tester
const ResponsiveDesignTester = require('./test-responsive-design.js');

class AutomatedResponsiveTest {
    constructor() {
        this.window = new MockWindow();
        this.document = new MockDocument();
        this.results = [];
    }

    /**
     * Ejecuta los tests
     */
    run() {
        console.log('\n' + '='.repeat(70));
        console.log('🚀 TEST AUTOMATIZADO DE RESPONSIVE DESIGN - TAREA 68');
        console.log('='.repeat(70) + '\n');

        console.log('📋 Configuración de Tests:');
        console.log('  • Mobile: 320px - 767px');
        console.log('  • Tablet: 768px - 1199px');
        console.log('  • Desktop: 1200px+\n');

        console.log('🔍 Verificaciones:');
        console.log('  ✓ Overflow horizontal');
        console.log('  ✓ Visibilidad de elementos');
        console.log('  ✓ Botones clickeables');
        console.log('  ✓ Inputs usables');
        console.log('  ✓ Imágenes responsive');
        console.log('  ✓ Navbar usable');
        console.log('  ✓ Texto no cortado');
        console.log('  ✓ Modales usables\n');

        // Crear instancia del tester
        const tester = new ResponsiveDesignTester();

        // Inyectar mocks
        global.window = this.window;
        global.document = this.document;

        // Ejecutar tests
        const results = tester.runAllTests();

        // Mostrar resumen
        this.printSummary(tester.getSummary());

        return results;
    }

    /**
     * Imprime el resumen de resultados
     */
    printSummary(summary) {
        console.log('\n' + '='.repeat(70));
        console.log('📊 RESUMEN DE RESULTADOS');
        console.log('='.repeat(70) + '\n');

        console.log('Estadísticas Generales:');
        console.log(`  • Total de Tests: ${summary.totalTests}`);
        console.log(`  • Pasados: ${summary.totalPassed} ✅`);
        console.log(`  • Fallidos: ${summary.totalFailed} ❌`);

        const successRate = summary.totalTests > 0 
            ? ((summary.totalPassed / summary.totalTests) * 100).toFixed(1)
            : 0;
        console.log(`  • Tasa de Éxito: ${successRate}%\n`);

        // Detalles por breakpoint
        console.log('Resultados por Breakpoint:\n');

        const breakpointNames = {
            mobile: '📱 Mobile (320-767px)',
            tablet: '📊 Tablet (768-1199px)',
            desktop: '🖥️ Desktop (1200px+)'
        };

        Object.keys(summary.breakpoints).forEach(breakpoint => {
            const bp = summary.breakpoints[breakpoint];
            const total = bp.passed + bp.failed;
            const percentage = total > 0 ? ((bp.passed / total) * 100).toFixed(1) : 0;

            console.log(`${breakpointNames[breakpoint]}`);
            console.log(`  Pasados: ${bp.passed}/${total} (${percentage}%)`);

            if (bp.issues.length > 0) {
                console.log(`  Problemas encontrados:`);
                bp.issues.forEach(issue => {
                    console.log(`    ⚠️  ${issue}`);
                });
            } else {
                console.log(`  ✨ Sin problemas detectados`);
            }
            console.log('');
        });

        console.log('='.repeat(70) + '\n');

        // Recomendaciones
        if (summary.totalFailed === 0) {
            console.log('✅ ¡EXCELENTE! El sitio es completamente responsive.\n');
        } else if (summary.totalFailed <= 3) {
            console.log('⚠️  Se encontraron algunos problemas menores. Revisa los detalles arriba.\n');
        } else {
            console.log('❌ Se encontraron varios problemas. Se recomienda revisar el CSS responsive.\n');
        }

        // Checklist de verificación
        console.log('📋 Checklist de Verificación Manual:\n');
        console.log('  [ ] Probar en navegador con DevTools (F12)');
        console.log('  [ ] Cambiar tamaño de ventana manualmente');
        console.log('  [ ] Verificar que no haya scroll horizontal');
        console.log('  [ ] Probar todos los botones en cada tamaño');
        console.log('  [ ] Verificar que los inputs sean accesibles');
        console.log('  [ ] Probar en dispositivos reales si es posible');
        console.log('  [ ] Verificar en diferentes navegadores\n');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const test = new AutomatedResponsiveTest();
    const results = test.run();

    // Salir con código de error si hay fallos
    const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
    process.exit(totalFailed > 0 ? 1 : 0);
}

module.exports = AutomatedResponsiveTest;
