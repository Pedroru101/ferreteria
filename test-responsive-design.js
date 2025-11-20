/**
 * Test de Responsive Design - Tarea 68
 * Verifica que el sitio sea usable en mobile, tablet y desktop
 * sin overflow horizontal
 */

const BREAKPOINTS = {
    mobile: { min: 320, max: 767, name: 'Mobile' },
    tablet: { min: 768, max: 1199, name: 'Tablet' },
    desktop: { min: 1200, max: 1920, name: 'Desktop' }
};

const SECTIONS_TO_TEST = [
    'inicio',
    'productos',
    'servicios',
    'fabricacion',
    'calculadora',
    'comparador',
    'consulta-cotizacion',
    'consulta-pedido',
    'galeria',
    'contacto'
];

class ResponsiveDesignTester {
    constructor() {
        this.results = {
            mobile: { passed: 0, failed: 0, issues: [] },
            tablet: { passed: 0, failed: 0, issues: [] },
            desktop: { passed: 0, failed: 0, issues: [] }
        };
        this.originalWidth = window.innerWidth;
    }

    /**
     * Simula un cambio de tamaño de ventana
     */
    setViewportWidth(width) {
        // Usar Object.defineProperty para simular innerWidth
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width
        });

        // Disparar evento resize
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Verifica que no haya overflow horizontal
     */
    checkHorizontalOverflow(breakpoint) {
        const body = document.body;
        const html = document.documentElement;

        const bodyWidth = body.scrollWidth;
        const windowWidth = window.innerWidth;
        const htmlWidth = html.scrollWidth;

        const hasOverflow = bodyWidth > windowWidth || htmlWidth > windowWidth;

        if (hasOverflow) {
            this.results[breakpoint].failed++;
            this.results[breakpoint].issues.push(
                `Overflow horizontal detectado: body=${bodyWidth}px, window=${windowWidth}px`
            );
            return false;
        }

        this.results[breakpoint].passed++;
        return true;
    }

    /**
     * Verifica que todos los elementos sean visibles
     */
    checkElementsVisibility(breakpoint) {
        const elements = document.querySelectorAll('[id]');
        let allVisible = true;

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);

            // Verificar que el elemento no esté oculto
            if (style.display === 'none' || style.visibility === 'hidden') {
                return; // Elementos ocultos son válidos
            }

            // Verificar que el elemento tenga dimensiones válidas
            if (rect.width <= 0 || rect.height <= 0) {
                // Algunos elementos pueden tener 0 altura (como scripts)
                if (el.offsetHeight === 0 && el.tagName !== 'SCRIPT') {
                    this.results[breakpoint].issues.push(
                        `Elemento sin dimensiones: ${el.id || el.tagName}`
                    );
                    allVisible = false;
                }
            }
        });

        if (allVisible) {
            this.results[breakpoint].passed++;
        } else {
            this.results[breakpoint].failed++;
        }

        return allVisible;
    }

    /**
     * Verifica que los botones sean clickeables
     */
    checkButtonsClickable(breakpoint) {
        const buttons = document.querySelectorAll('button, a.btn-primary, a.btn-secondary, .btn-primary, .btn-secondary');
        let allClickable = true;

        buttons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const style = window.getComputedStyle(btn);

            // Verificar tamaño mínimo de botón (48x48px es estándar)
            if (rect.width < 44 || rect.height < 44) {
                // Algunos botones pueden ser más pequeños, pero deben ser accesibles
                if (rect.width < 30 || rect.height < 30) {
                    this.results[breakpoint].issues.push(
                        `Botón muy pequeño: ${btn.textContent.substring(0, 20)} (${rect.width}x${rect.height}px)`
                    );
                    allClickable = false;
                }
            }

            // Verificar que no esté oculto
            if (style.display === 'none' || style.visibility === 'hidden') {
                return;
            }

            // Verificar que sea visible en viewport
            if (rect.top > window.innerHeight || rect.bottom < 0) {
                // Está fuera del viewport, pero eso es válido
                return;
            }
        });

        if (allClickable) {
            this.results[breakpoint].passed++;
        } else {
            this.results[breakpoint].failed++;
        }

        return allClickable;
    }

    /**
     * Verifica que los inputs sean usables
     */
    checkInputsUsable(breakpoint) {
        const inputs = document.querySelectorAll('input, textarea, select');
        let allUsable = true;

        inputs.forEach(input => {
            const rect = input.getBoundingClientRect();
            const style = window.getComputedStyle(input);

            // Verificar que sea visible
            if (style.display === 'none' || style.visibility === 'hidden') {
                return;
            }

            // Verificar tamaño mínimo
            if (rect.width < 30 || rect.height < 30) {
                this.results[breakpoint].issues.push(
                    `Input muy pequeño: ${input.name || input.id} (${rect.width}x${rect.height}px)`
                );
                allUsable = false;
            }

            // Verificar que tenga padding suficiente
            const padding = window.getComputedStyle(input).padding;
            if (padding === '0px') {
                this.results[breakpoint].issues.push(
                    `Input sin padding: ${input.name || input.id}`
                );
                allUsable = false;
            }
        });

        if (allUsable) {
            this.results[breakpoint].passed++;
        } else {
            this.results[breakpoint].failed++;
        }

        return allUsable;
    }

    /**
     * Verifica que las imágenes sean responsive
     */
    checkImagesResponsive(breakpoint) {
        const images = document.querySelectorAll('img');
        let allResponsive = true;

        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const style = window.getComputedStyle(img);

            // Verificar que la imagen no sea más ancha que el viewport
            if (rect.width > window.innerWidth) {
                this.results[breakpoint].issues.push(
                    `Imagen más ancha que viewport: ${img.src.substring(0, 30)} (${rect.width}px > ${window.innerWidth}px)`
                );
                allResponsive = false;
            }

            // Verificar que tenga max-width
            if (style.maxWidth === 'none' || style.maxWidth === 'initial') {
                // Algunos elementos pueden no tener max-width, pero deben ser contenidos
                if (rect.width > window.innerWidth * 0.95) {
                    this.results[breakpoint].issues.push(
                        `Imagen sin max-width: ${img.src.substring(0, 30)}`
                    );
                    allResponsive = false;
                }
            }
        });

        if (allResponsive) {
            this.results[breakpoint].passed++;
        } else {
            this.results[breakpoint].failed++;
        }

        return allResponsive;
    }

    /**
     * Verifica que el navbar sea usable
     */
    checkNavbarUsable(breakpoint) {
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            this.results[breakpoint].passed++;
            return true;
        }

        const rect = navbar.getBoundingClientRect();
        const style = window.getComputedStyle(navbar);

        // Verificar que sea visible
        if (style.display === 'none') {
            this.results[breakpoint].failed++;
            this.results[breakpoint].issues.push('Navbar oculto');
            return false;
        }

        // Verificar altura mínima
        if (rect.height < 40) {
            this.results[breakpoint].failed++;
            this.results[breakpoint].issues.push(`Navbar muy pequeño: ${rect.height}px`);
            return false;
        }

        // En mobile, verificar que el hamburger sea visible
        if (breakpoint === 'mobile') {
            const hamburger = document.querySelector('.hamburger');
            if (hamburger) {
                const hamburgerStyle = window.getComputedStyle(hamburger);
                if (hamburgerStyle.display === 'none') {
                    this.results[breakpoint].failed++;
                    this.results[breakpoint].issues.push('Hamburger menu no visible en mobile');
                    return false;
                }
            }
        }

        this.results[breakpoint].passed++;
        return true;
    }

    /**
     * Verifica que no haya texto cortado
     */
    checkTextNotCutOff(breakpoint) {
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
        let allOk = true;

        textElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);

            // Verificar que no esté oculto
            if (style.display === 'none' || style.visibility === 'hidden') {
                return;
            }

            // Verificar overflow
            if (el.scrollWidth > el.clientWidth && style.overflow === 'hidden') {
                // Esto es válido si tiene text-overflow: ellipsis
                if (style.textOverflow !== 'ellipsis') {
                    this.results[breakpoint].issues.push(
                        `Texto cortado sin ellipsis: ${el.textContent.substring(0, 30)}`
                    );
                    allOk = false;
                }
            }
        });

        if (allOk) {
            this.results[breakpoint].passed++;
        } else {
            this.results[breakpoint].failed++;
        }

        return allOk;
    }

    /**
     * Verifica que los modales sean usables
     */
    checkModalsUsable(breakpoint) {
        const modals = document.querySelectorAll('.modal, [role="dialog"]');
        let allUsable = true;

        modals.forEach(modal => {
            const rect = modal.getBoundingClientRect();
            const style = window.getComputedStyle(modal);

            // Si el modal está visible
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                // Verificar que no sea más ancho que el viewport
                if (rect.width > window.innerWidth) {
                    this.results[breakpoint].issues.push(
                        `Modal más ancho que viewport: ${rect.width}px > ${window.innerWidth}px`
                    );
                    allUsable = false;
                }

                // Verificar que tenga padding
                const padding = window.getComputedStyle(modal).padding;
                if (padding === '0px') {
                    this.results[breakpoint].issues.push('Modal sin padding');
                    allUsable = false;
                }
            }
        });

        if (allUsable) {
            this.results[breakpoint].passed++;
        } else {
            this.results[breakpoint].failed++;
        }

        return allUsable;
    }

    /**
     * Ejecuta todos los tests para un breakpoint
     */
    testBreakpoint(breakpoint) {
        console.log(`\n📱 Testeando ${BREAKPOINTS[breakpoint].name} (${BREAKPOINTS[breakpoint].min}-${BREAKPOINTS[breakpoint].max}px)`);

        this.setViewportWidth(BREAKPOINTS[breakpoint].min + 10);

        // Ejecutar todos los tests
        this.checkHorizontalOverflow(breakpoint);
        this.checkElementsVisibility(breakpoint);
        this.checkButtonsClickable(breakpoint);
        this.checkInputsUsable(breakpoint);
        this.checkImagesResponsive(breakpoint);
        this.checkNavbarUsable(breakpoint);
        this.checkTextNotCutOff(breakpoint);
        this.checkModalsUsable(breakpoint);

        return this.results[breakpoint];
    }

    /**
     * Ejecuta todos los tests
     */
    runAllTests() {
        console.log('🚀 Iniciando tests de responsive design...\n');

        Object.keys(BREAKPOINTS).forEach(breakpoint => {
            this.testBreakpoint(breakpoint);
        });

        this.printResults();
        this.restoreViewport();

        return this.results;
    }

    /**
     * Imprime los resultados
     */
    printResults() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESULTADOS DE RESPONSIVE DESIGN');
        console.log('='.repeat(60));

        Object.keys(BREAKPOINTS).forEach(breakpoint => {
            const result = this.results[breakpoint];
            const total = result.passed + result.failed;
            const percentage = total > 0 ? ((result.passed / total) * 100).toFixed(1) : 0;

            console.log(`\n${BREAKPOINTS[breakpoint].name}:`);
            console.log(`  ✅ Pasados: ${result.passed}`);
            console.log(`  ❌ Fallidos: ${result.failed}`);
            console.log(`  📈 Porcentaje: ${percentage}%`);

            if (result.issues.length > 0) {
                console.log(`  ⚠️  Problemas encontrados:`);
                result.issues.forEach(issue => {
                    console.log(`     - ${issue}`);
                });
            }
        });

        console.log('\n' + '='.repeat(60));
    }

    /**
     * Restaura el viewport original
     */
    restoreViewport() {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: this.originalWidth
        });
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Obtiene un resumen de los resultados
     */
    getSummary() {
        const summary = {
            totalTests: 0,
            totalPassed: 0,
            totalFailed: 0,
            breakpoints: {}
        };

        Object.keys(BREAKPOINTS).forEach(breakpoint => {
            const result = this.results[breakpoint];
            summary.totalTests += result.passed + result.failed;
            summary.totalPassed += result.passed;
            summary.totalFailed += result.failed;
            summary.breakpoints[breakpoint] = {
                passed: result.passed,
                failed: result.failed,
                issues: result.issues
            };
        });

        return summary;
    }
}

// Exportar para uso en Node.js o navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveDesignTester;
}
