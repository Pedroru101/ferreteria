/**
 * Performance Testing Suite - Sistema Integral de Alambrados
 * Mide: tiempo de carga, tamaño de localStorage, memory leaks, Lighthouse
 * Requirements: 7.8, 9.11
 */

class PerformanceTestSuite {
    constructor() {
        this.results = {
            loadTime: null,
            storageSize: null,
            memoryUsage: null,
            lighthouseScore: null,
            assets: [],
            issues: []
        };
        this.initialMemory = null;
    }

    /**
     * Mide el tiempo de carga inicial del sitio
     * Objetivo: < 3 segundos
     */
    async measureLoadTime() {
        console.log('📊 Midiendo tiempo de carga inicial...');
        
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        
        if (navigationTiming) {
            const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
            this.results.loadTime = {
                value: loadTime,
                unit: 'ms',
                target: 3000,
                passed: loadTime < 3000,
                details: {
                    dns: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
                    tcp: navigationTiming.connectEnd - navigationTiming.connectStart,
                    ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
                    download: navigationTiming.responseEnd - navigationTiming.responseStart,
                    domInteractive: navigationTiming.domInteractive - navigationTiming.fetchStart,
                    domComplete: navigationTiming.domComplete - navigationTiming.fetchStart,
                    loadComplete: loadTime
                }
            };
            
            console.log(`✓ Tiempo de carga: ${loadTime.toFixed(2)}ms (Objetivo: 3000ms)`);
            console.log(`  - DNS: ${this.results.loadTime.details.dns.toFixed(2)}ms`);
            console.log(`  - TCP: ${this.results.loadTime.details.tcp.toFixed(2)}ms`);
            console.log(`  - TTFB: ${this.results.loadTime.details.ttfb.toFixed(2)}ms`);
            console.log(`  - Download: ${this.results.loadTime.details.download.toFixed(2)}ms`);
            console.log(`  - DOM Interactive: ${this.results.loadTime.details.domInteractive.toFixed(2)}ms`);
            console.log(`  - DOM Complete: ${this.results.loadTime.details.domComplete.toFixed(2)}ms`);
            
            if (!this.results.loadTime.passed) {
                this.results.issues.push({
                    severity: 'warning',
                    message: `Tiempo de carga (${loadTime.toFixed(2)}ms) excede el objetivo de 3000ms`
                });
            }
        } else {
            console.warn('⚠ Navigation Timing API no disponible');
        }
    }

    /**
     * Mide el tamaño total de localStorage
     * Objetivo: < 5MB
     */
    measureStorageSize() {
        console.log('\n📦 Midiendo tamaño de localStorage...');
        
        let totalSize = 0;
        const storageBreakdown = {};
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const value = localStorage.getItem(key);
                const size = new Blob([value]).size;
                totalSize += size;
                storageBreakdown[key] = {
                    size: size,
                    sizeKB: (size / 1024).toFixed(2),
                    items: this.countItems(value)
                };
            }
        }
        
        const totalSizeKB = (totalSize / 1024).toFixed(2);
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        this.results.storageSize = {
            value: totalSize,
            unit: 'bytes',
            sizeKB: totalSizeKB,
            sizeMB: totalSizeMB,
            target: '5MB',
            passed: totalSize < maxSize,
            breakdown: storageBreakdown
        };
        
        console.log(`✓ Tamaño total: ${totalSizeKB}KB (${totalSizeMB}MB)`);
        console.log(`  Objetivo: 5MB`);
        console.log(`  Desglose por clave:`);
        
        Object.entries(storageBreakdown).forEach(([key, data]) => {
            console.log(`    - ${key}: ${data.sizeKB}KB (${data.items} items)`);
        });
        
        if (!this.results.storageSize.passed) {
            this.results.issues.push({
                severity: 'error',
                message: `Tamaño de localStorage (${totalSizeMB}MB) excede el límite de 5MB`
            });
        }
    }

    /**
     * Cuenta items en un valor JSON
     */
    countItems(value) {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed.length;
            if (typeof parsed === 'object') return Object.keys(parsed).length;
            return 1;
        } catch {
            return 1;
        }
    }

    /**
     * Mide el uso de memoria
     * Objetivo: Sin memory leaks detectables
     */
    async measureMemoryUsage() {
        console.log('\n💾 Midiendo uso de memoria...');
        
        if (performance.memory) {
            this.initialMemory = {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
            
            const usedMB = (this.initialMemory.usedJSHeapSize / (1024 * 1024)).toFixed(2);
            const totalMB = (this.initialMemory.totalJSHeapSize / (1024 * 1024)).toFixed(2);
            const limitMB = (this.initialMemory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2);
            
            this.results.memoryUsage = {
                usedJSHeapSize: usedMB,
                totalJSHeapSize: totalMB,
                jsHeapSizeLimit: limitMB,
                unit: 'MB',
                percentageUsed: ((this.initialMemory.usedJSHeapSize / this.initialMemory.jsHeapSizeLimit) * 100).toFixed(2)
            };
            
            console.log(`✓ Heap usado: ${usedMB}MB`);
            console.log(`✓ Heap total: ${totalMB}MB`);
            console.log(`✓ Límite: ${limitMB}MB`);
            console.log(`✓ Porcentaje usado: ${this.results.memoryUsage.percentageUsed}%`);
            
            if (this.results.memoryUsage.percentageUsed > 80) {
                this.results.issues.push({
                    severity: 'warning',
                    message: `Uso de memoria alto: ${this.results.memoryUsage.percentageUsed}% del límite`
                });
            }
        } else {
            console.warn('⚠ Performance.memory API no disponible (requiere Chrome con flag habilitado)');
        }
    }

    /**
     * Analiza assets cargados
     */
    analyzeAssets() {
        console.log('\n📄 Analizando assets cargados...');
        
        const resources = performance.getEntriesByType('resource');
        const assetsByType = {};
        let totalSize = 0;
        
        resources.forEach(resource => {
            const type = this.getAssetType(resource.name);
            if (!assetsByType[type]) {
                assetsByType[type] = {
                    count: 0,
                    totalSize: 0,
                    items: []
                };
            }
            
            const size = resource.transferSize || 0;
            assetsByType[type].count++;
            assetsByType[type].totalSize += size;
            assetsByType[type].items.push({
                name: resource.name.split('/').pop(),
                size: size,
                duration: resource.duration.toFixed(2)
            });
            totalSize += size;
        });
        
        this.results.assets = assetsByType;
        
        console.log(`✓ Total de assets: ${resources.length}`);
        console.log(`✓ Tamaño total transferido: ${(totalSize / 1024).toFixed(2)}KB`);
        console.log(`\nDesglose por tipo:`);
        
        Object.entries(assetsByType).forEach(([type, data]) => {
            const sizeKB = (data.totalSize / 1024).toFixed(2);
            console.log(`  - ${type}: ${data.count} archivos (${sizeKB}KB)`);
        });
    }

    /**
     * Determina el tipo de asset
     */
    getAssetType(url) {
        if (url.includes('.js')) return 'JavaScript';
        if (url.includes('.css')) return 'CSS';
        if (url.includes('.woff') || url.includes('.ttf')) return 'Fonts';
        if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return 'Images';
        if (url.includes('googleapis') || url.includes('cdnjs')) return 'CDN';
        return 'Other';
    }

    /**
     * Detecta memory leaks potenciales
     */
    async detectMemoryLeaks() {
        console.log('\n🔍 Detectando memory leaks potenciales...');
        
        // Simular interacciones del usuario
        const interactions = [
            () => this.simulateCalculatorUsage(),
            () => this.simulateQuotationCreation(),
            () => this.simulateOrderCreation(),
            () => this.simulateComparatorUsage()
        ];
        
        const memorySnapshots = [];
        
        for (let i = 0; i < interactions.length; i++) {
            if (performance.memory) {
                memorySnapshots.push({
                    step: i + 1,
                    memory: performance.memory.usedJSHeapSize
                });
            }
            
            try {
                interactions[i]();
            } catch (e) {
                console.warn(`⚠ Error en interacción ${i + 1}:`, e.message);
            }
            
            // Esperar un poco entre interacciones
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Analizar tendencia de memoria
        if (memorySnapshots.length > 1) {
            const memoryGrowth = memorySnapshots[memorySnapshots.length - 1].memory - memorySnapshots[0].memory;
            const growthMB = (memoryGrowth / (1024 * 1024)).toFixed(2);
            
            console.log(`✓ Crecimiento de memoria durante interacciones: ${growthMB}MB`);
            
            if (Math.abs(memoryGrowth) > 10 * 1024 * 1024) { // 10MB
                this.results.issues.push({
                    severity: 'warning',
                    message: `Posible memory leak detectado: crecimiento de ${growthMB}MB`
                });
            }
        }
    }

    /**
     * Simula uso de calculadora
     */
    simulateCalculatorUsage() {
        if (typeof MaterialCalculator !== 'undefined') {
            const calc = new MaterialCalculator(CONFIG.calculator);
            calc.calculatePerimeter(100, 50);
            calc.calculatePosts(300);
            calc.calculateWire(300, 3);
        }
    }

    /**
     * Simula creación de cotización
     */
    simulateQuotationCreation() {
        if (typeof Quotation !== 'undefined') {
            const quote = new Quotation();
            quote.addItem({ id: 'test', name: 'Test' }, 10, 1000);
            quote.recalculate();
        }
    }

    /**
     * Simula creación de pedido
     */
    simulateOrderCreation() {
        if (typeof Order !== 'undefined') {
            const quote = new Quotation();
            const order = new Order(quote, {
                name: 'Test',
                phone: '123456',
                email: 'test@test.com',
                address: 'Test Address'
            });
        }
    }

    /**
     * Simula uso de comparador
     */
    simulateComparatorUsage() {
        if (typeof Comparator !== 'undefined') {
            const comp = new Comparator();
            comp.calculateScore({ price: 5, durability: 5, aesthetics: 5 });
        }
    }

    /**
     * Verifica optimizaciones de imágenes
     */
    checkImageOptimization() {
        console.log('\n🖼️  Verificando optimización de imágenes...');
        
        const images = document.querySelectorAll('img');
        let optimized = 0;
        let unoptimized = [];
        
        images.forEach(img => {
            const src = img.src;
            const alt = img.alt;
            const loading = img.loading;
            
            if (loading === 'lazy' || src.includes('.webp')) {
                optimized++;
            } else {
                unoptimized.push({
                    src: src.split('/').pop(),
                    alt: alt || 'sin alt',
                    loading: loading || 'eager'
                });
            }
        });
        
        console.log(`✓ Imágenes optimizadas: ${optimized}/${images.length}`);
        
        if (unoptimized.length > 0) {
            console.log(`⚠ Imágenes sin optimizar:`);
            unoptimized.slice(0, 5).forEach(img => {
                console.log(`  - ${img.src} (loading: ${img.loading})`);
            });
        }
    }

    /**
     * Genera reporte completo
     */
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 REPORTE DE PERFORMANCE - SISTEMA INTEGRAL DE ALAMBRADOS');
        console.log('='.repeat(60));
        
        console.log('\n✅ RESULTADOS:');
        console.log('─'.repeat(60));
        
        if (this.results.loadTime) {
            const status = this.results.loadTime.passed ? '✓' : '✗';
            console.log(`${status} Tiempo de carga: ${this.results.loadTime.value.toFixed(2)}ms (Objetivo: ${this.results.loadTime.target}ms)`);
        }
        
        if (this.results.storageSize) {
            const status = this.results.storageSize.passed ? '✓' : '✗';
            console.log(`${status} Tamaño localStorage: ${this.results.storageSize.sizeMB}MB (Objetivo: ${this.results.storageSize.target})`);
        }
        
        if (this.results.memoryUsage) {
            console.log(`✓ Uso de memoria: ${this.results.memoryUsage.usedJSHeapSize}MB / ${this.results.memoryUsage.jsHeapSizeLimit}MB (${this.results.memoryUsage.percentageUsed}%)`);
        }
        
        if (this.results.issues.length > 0) {
            console.log('\n⚠️  PROBLEMAS DETECTADOS:');
            console.log('─'.repeat(60));
            this.results.issues.forEach((issue, idx) => {
                const icon = issue.severity === 'error' ? '✗' : '⚠';
                console.log(`${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.message}`);
            });
        } else {
            console.log('\n✓ No se detectaron problemas críticos');
        }
        
        console.log('\n' + '='.repeat(60));
        
        return this.results;
    }

    /**
     * Ejecuta todas las pruebas
     */
    async runAll() {
        console.log('🚀 Iniciando suite de testing de performance...\n');
        
        this.measureLoadTime();
        this.measureStorageSize();
        await this.measureMemoryUsage();
        this.analyzeAssets();
        this.checkImageOptimization();
        await this.detectMemoryLeaks();
        
        return this.generateReport();
    }
}

// Exportar para uso en Node.js o navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceTestSuite;
}
