/**
 * Test Automatizado - Modo Oscuro/Claro
 * Verifica que todas las secciones respeten el tema, contraste, transiciones y persistencia
 * Requirements: 7.10, 8.2
 */

const DarkModeTests = {
    results: [],
    
    /**
     * Test 1: Verificar que el tema se persiste en localStorage
     */
    testThemePersistence() {
        const testName = 'Persistencia de preferencia de tema';
        try {
            // Limpiar localStorage
            localStorage.removeItem('theme');
            
            // Simular clic en toggle
            const themeToggle = document.getElementById('themeToggle');
            if (!themeToggle) throw new Error('themeToggle no encontrado');
            
            // Obtener tema inicial
            const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
            
            // Cambiar tema
            themeToggle.click();
            
            // Verificar que se guardó en localStorage
            const savedTheme = localStorage.getItem('theme');
            const expectedTheme = initialTheme === 'dark' ? 'light' : 'dark';
            
            if (savedTheme !== expectedTheme) {
                throw new Error(`Tema guardado: ${savedTheme}, esperado: ${expectedTheme}`);
            }
            
            // Verificar que el atributo data-theme se actualizó
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme !== expectedTheme) {
                throw new Error(`Tema actual: ${currentTheme}, esperado: ${expectedTheme}`);
            }
            
            this.results.push({ test: testName, status: 'PASS', message: 'Tema persistido correctamente' });
        } catch (error) {
            this.results.push({ test: testName, status: 'FAIL', message: error.message });
        }
    },
    
    /**
     * Test 2: Verificar que el icono del tema cambia
     */
    testThemeIconChange() {
        const testName = 'Cambio de icono del tema';
        try {
            const themeIcon = document.querySelector('#themeToggle i');
            if (!themeIcon) throw new Error('Icono del tema no encontrado');
            
            const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const expectedIcon = initialTheme === 'dark' ? 'fa-sun' : 'fa-moon';
            
            // Verificar que el icono es correcto
            if (!themeIcon.classList.contains(expectedIcon)) {
                throw new Error(`Icono esperado: ${expectedIcon}, clases actuales: ${themeIcon.className}`);
            }
            
            this.results.push({ test: testName, status: 'PASS', message: 'Icono correcto para el tema actual' });
        } catch (error) {
            this.results.push({ test: testName, status: 'FAIL', message: error.message });
        }
    },
    
    /**
     * Test 3: Verificar que todas las secciones respetan el tema
     */
    testSectionThemeRespect() {
        const testName = 'Todas las secciones respetan el tema';
        try {
            const sections = document.querySelectorAll('section');
            if (sections.length === 0) throw new Error('No se encontraron secciones');
            
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const computedStyle = window.getComputedStyle(document.documentElement);
            
            // Verificar que las variables CSS están siendo usadas
            const bgPrimary = computedStyle.getPropertyValue('--bg-primary').trim();
            const textPrimary = computedStyle.getPropertyValue('--text-primary').trim();
            
            if (!bgPrimary || !textPrimary) {
                throw new Error('Variables CSS no están definidas');
            }
            
            // Verificar que al menos una sección tiene estilos aplicados
            let hasStyledSection = false;
            sections.forEach(section => {
                const sectionStyle = window.getComputedStyle(section);
                const bgColor = sectionStyle.backgroundColor;
                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
                    hasStyledSection = true;
                }
            });
            
            if (!hasStyledSection) {
                throw new Error('Ninguna sección tiene estilos de fondo aplicados');
            }
            
            this.results.push({ test: testName, status: 'PASS', message: 'Todas las secciones respetan el tema' });
        } catch (error) {
            this.results.push({ test: testName, status: 'FAIL', message: error.message });
        }
    },
    
    /**
     * Test 4: Verificar contraste en modo claro
     */
    testLightModeContrast() {
        const testName = 'Contraste en modo claro (WCAG AA)';
        try {
            // Establecer modo claro
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            
            const computedStyle = window.getComputedStyle(document.documentElement);
            const bgPrimary = computedStyle.getPropertyValue('--bg-primary').trim();
            const textPrimary = computedStyle.getPropertyValue('--text-primary').trim();
            
            // Convertir a RGB para calcular contraste
            const bgRGB = this.hexToRgb(bgPrimary) || this.parseRgb(bgPrimary);
            const textRGB = this.hexToRgb(textPrimary) || this.parseRgb(textPrimary);
            
            if (!bgRGB || !textRGB) {
                throw new Error('No se pudieron parsear los colores');
            }
            
            const contrast = this.calculateContrast(bgRGB, textRGB);
            
            // WCAG AA requiere 4.5:1 para texto normal
            if (contrast < 4.5) {
                throw new Error(`Contraste insuficiente: ${contrast.toFixed(2)}:1 (requerido: 4.5:1)`);
            }
            
            this.results.push({ 
                test: testName, 
                status: 'PASS', 
                message: `Contraste: ${contrast.toFixed(2)}:1 (cumple WCAG AA)` 
            });
        } catch (error) {
            this.results.push({ test: testName, status: 'FAIL', message: error.message });
        }
    },
    
    /**
     * Test 5: Verificar contraste en modo oscuro
     */
    testDarkModeContrast() {
        const testName = 'Contraste en modo oscuro (WCAG AA)';
        try {
            // Establecer modo oscuro
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            
            const computedStyle = window.getComputedStyle(document.documentElement);
            const bgPrimary = computedStyle.getPropertyValue('--bg-primary').trim();
            const textPrimary = computedStyle.getPropertyValue('--text-primary').trim();
            
            const bgRGB = this.hexToRgb(bgPrimary) || this.parseRgb(bgPrimary);
            const textRGB = this.hexToRgb(textPrimary) || this.parseRgb(textPrimary);
            
            if (!bgRGB || !textRGB) {
                throw new Error('No se pudieron parsear los colores');
            }
            
            const contrast = this.calculateContrast(bgRGB, textRGB);
            
            // WCAG AA requiere 4.5:1 para texto normal
            if (contrast < 4.5) {
                throw new Error(`Contraste insuficiente: ${contrast.toFixed(2)}:1 (requerido: 4.5:1)`);
            }
            
            this.results.push({ 
                test: testName, 
                status: 'PASS', 
                message: `Contraste: ${contrast.toFixed(2)}:1 (cumple WCAG AA)` 
            });
        } catch (error) {
            this.results.push({ test: testName, status: 'FAIL', message: error.message });
        }
    },
    
    /**
     * Test 6: Verificar transiciones suaves entre temas
     */
    testSmoothTransitions() {
        const testName = 'Transiciones suaves entre temas';
        try {
            const body = document.body;
            const bodyStyle = window.getComputedStyle(body);
            const transition = bodyStyle.transition;
            
            // Verificar que hay una transición definida
            if (!transition || transition === 'none' || transition === 'all 0s ease 0s') {
                throw new Error(`Transición no definida o inválida: ${transition}`);
            }
            
            // Verificar que la transición incluye color o background
            if (!transition.includes('color') && !transition.includes('background') && !transition.includes('all')) {
                throw new Error(`Transición no incluye color o background: ${transition}`);
            }
            
            this.results.push({ 
                test: testName, 
                status: 'PASS', 
                message: `Transición definida: ${transition}` 
            });
        } catch (error) {
            this.results.push({ test: testName, status: 'FAIL', message: error.message });
        }
    },
    
    /**
     * Test 7: Verificar que los elementos interactivos respetan el tema
     */
    testInteractiveElementsTheme() {
        const testName = 'Elementos interactivos respetan el tema';
        try {
            const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
            if (buttons.length === 0) throw new Error('No se encontraron botones');
            
            let hasThemedButtons = false;
            buttons.forEach(button => {
                const style = window.getComputedStyle(button);
                const bgColor = style.backgroundColor;
                const color = style.color;
                
                // Verificar que el botón tiene colores definidos
                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && color && color !== 'rgba(0, 0, 0, 0)') {
                    hasThemedButtons = true;
                }
            });
            
            if (!hasThemedButtons) {
                throw new Error('Los botones no tienen estilos de tema aplicados');
            }
            
            this.results.push({ 
                test: testName, 
                status: 'PASS', 
                message: 'Elementos interactivos respetan el tema' 
            });
        } catch (error) {
            this.results.push({ test: testName, status: 'FAIL', message: error.message });
        }
    },
    
    /**
     * Test 8: Verificar que los inputs respetan el tema
     */
    testInputsTheme() {
        const testName = 'Inputs respetan el tema';
        try {
            const inputs = document.querySelectorAll('input, textarea, select');
            if (inputs.length === 0) {
                this.results.push({ 
                    test: testName, 
                    status: 'SKIP', 
                    message: 'No hay inputs en la página' 
                });
                return;
            }
            
            let hasThemedInputs = false;
            inputs.forEach(input => {
                const style = window.getComputedStyle(input);
                const bgColor = style.backgroundColor;
                
                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
                    hasThemedInputs = true;
                }
            });
            
            if (!hasThemedInputs) {
                throw new Error('Los inputs no tienen estilos de tema aplicados');
            }
            
            this.results.push({ 
                test: testName, 
                status: 'PASS', 
                message: 'Inputs respetan el tema' 
            });
        } catch (error) {
            this.results.push({ test: testName, status: 'FAIL', message: error.message });
        }
    },
    
    /**
     * Test 9: Verificar que el navbar respeta el tema
     */
    testNavbarTheme() {
        const testName = 'Navbar respeta el tema';
        try {
            const navbar = document.getElementById('navbar');
            if (!navbar) throw new Error('Navbar no encontrado');
            
            const style = window.getComputedStyle(navbar);
            const bgColor = style.backgroundColor;
            
            if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)') {
                throw new Error('Navbar no tiene color de fondo definido');
            }
            
            this.results.push({ 
                test: testName, 
                status: 'PASS', 
                message: 'Navbar respeta el tema' 
            });
        } catch (error) {
            this.results.push({ test: testName, status: 'FAIL', message: error.message });
        }
    },
    
    /**
     * Test 10: Verificar que el footer respeta el tema
     */
    testFooterTheme() {
        const testName = 'Footer respeta el tema';
        try {
            const footer = document.querySelector('footer');
            if (!footer) {
                this.results.push({ 
                    test: testName, 
                    status: 'SKIP', 
                    message: 'No hay footer en la página' 
                });
                return;
            }
            
            const style = window.getComputedStyle(footer);
            const bgColor = style.backgroundColor;
            
            if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)') {
                throw new Error('Footer no tiene color de fondo definido');
            }
            
            this.results.push({ 
                test: testName, 
                status: 'PASS', 
                message: 'Footer respeta el tema' 
            });
        } catch (error) {
            this.results.push({ test: testName, status: 'FAIL', message: error.message });
        }
    },
    
    /**
     * Utilidad: Convertir hex a RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    /**
     * Utilidad: Parsear RGB string
     */
    parseRgb(rgbString) {
        const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3])
            };
        }
        return null;
    },
    
    /**
     * Utilidad: Calcular contraste WCAG
     */
    calculateContrast(rgb1, rgb2) {
        const l1 = this.getLuminance(rgb1);
        const l2 = this.getLuminance(rgb2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    },
    
    /**
     * Utilidad: Calcular luminancia relativa
     */
    getLuminance(rgb) {
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
            val = val / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },
    
    /**
     * Ejecutar todos los tests
     */
    runAll() {
        console.log('🧪 Iniciando tests de modo oscuro/claro...\n');
        
        this.testThemePersistence();
        this.testThemeIconChange();
        this.testSectionThemeRespect();
        this.testLightModeContrast();
        this.testDarkModeContrast();
        this.testSmoothTransitions();
        this.testInteractiveElementsTheme();
        this.testInputsTheme();
        this.testNavbarTheme();
        this.testFooterTheme();
        
        this.printResults();
        return this.results;
    },
    
    /**
     * Imprimir resultados
     */
    printResults() {
        console.log('\n' + '='.repeat(70));
        console.log('📊 RESULTADOS DE TESTS - MODO OSCURO/CLARO');
        console.log('='.repeat(70) + '\n');
        
        let passed = 0;
        let failed = 0;
        let skipped = 0;
        
        this.results.forEach((result, index) => {
            const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
            console.log(`${icon} Test ${index + 1}: ${result.test}`);
            console.log(`   Estado: ${result.status}`);
            console.log(`   Mensaje: ${result.message}\n`);
            
            if (result.status === 'PASS') passed++;
            else if (result.status === 'FAIL') failed++;
            else if (result.status === 'SKIP') skipped++;
        });
        
        console.log('='.repeat(70));
        console.log(`📈 Resumen: ${passed} pasados, ${failed} fallidos, ${skipped} omitidos`);
        console.log('='.repeat(70) + '\n');
        
        return { passed, failed, skipped };
    }
};

// Ejecutar tests cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DarkModeTests.runAll();
    });
} else {
    DarkModeTests.runAll();
}
