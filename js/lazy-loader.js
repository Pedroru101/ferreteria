/**
 * Lazy Loader - Sistema de carga diferida de módulos y librerías
 * Carga módulos solo cuando el usuario accede a sus secciones
 * Carga jsPDF bajo demanda para generación de PDFs
 */

class LazyLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingPromises = new Map();
        this.intersectionObserver = null;
        this.initIntersectionObserver();
    }

    /**
     * Inicializa IntersectionObserver para detectar secciones visibles
     */
    initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.loadModuleForSection(sectionId);
                }
            });
        }, options);

        // Observar secciones que requieren lazy loading
        const lazyLoadSections = [
            'calculadora',
            'comparador',
            'consulta-cotizacion',
            'consulta-pedido'
        ];

        lazyLoadSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                this.intersectionObserver.observe(section);
            }
        });
    }

    /**
     * Carga el módulo correspondiente a una sección
     */
    async loadModuleForSection(sectionId) {
        const moduleMap = {
            'calculadora': 'calculator-ui',
            'comparador': 'comparator',
            'consulta-cotizacion': 'quotation-display',
            'consulta-pedido': 'order-tracking'
        };

        const moduleName = moduleMap[sectionId];
        if (moduleName && !this.loadedModules.has(moduleName)) {
            await this.loadModule(moduleName);
            this.loadedModules.add(moduleName);
            
            // Dejar de observar después de cargar
            const section = document.getElementById(sectionId);
            if (section) {
                this.intersectionObserver.unobserve(section);
            }
        }
    }

    /**
     * Carga un módulo JavaScript
     */
    async loadModule(moduleName) {
        // Evitar cargas duplicadas
        if (this.loadingPromises.has(moduleName)) {
            return this.loadingPromises.get(moduleName);
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `js/${moduleName}.js`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                resolve();
            };

            script.onerror = () => {
                console.error(`Error al cargar módulo: ${moduleName}`);
                reject(new Error(`Failed to load module: ${moduleName}`));
            };

            document.body.appendChild(script);
        });

        this.loadingPromises.set(moduleName, promise);
        return promise;
    }

    /**
     * Carga jsPDF bajo demanda
     */
    async loadJsPDF() {
        if (window.jspdf) {
            return window.jspdf;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.async = true;

            script.onload = () => {
                resolve(window.jspdf);
            };

            script.onerror = () => {
                console.error('Error al cargar jsPDF');
                reject(new Error('Failed to load jsPDF'));
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Carga Chart.js bajo demanda (para gráficos en admin)
     */
    async loadChartJS() {
        if (window.Chart) {
            return window.Chart;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
            script.async = true;

            script.onload = () => {
                resolve(window.Chart);
            };

            script.onerror = () => {
                console.error('Error al cargar Chart.js');
                reject(new Error('Failed to load Chart.js'));
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Carga admin.js cuando se accede a /admin.html
     */
    async loadAdminModule() {
        return this.loadModule('admin');
    }

    /**
     * Destruye el observer cuando ya no es necesario
     */
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
    }
}

// Instancia global del lazy loader
const lazyLoader = new LazyLoader();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}
