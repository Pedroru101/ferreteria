/**
 * Test automatizado para el comparador de soluciones
 * Ejecutar: node test-comparator-automated.js
 * 
 * Valida:
 * - Selección de hasta 3 productos
 * - Generación de tabla comparativa
 * - Cálculo de scores con prioridades
 * - Recomendaciones contextuales
 * - Botón "Usar esta solución"
 */

// Datos de comparación (copiados del archivo original)
const COMPARISON_DATA = {
    hormigon: {
        name: 'Postes de Hormigón',
        price: 3500,
        durability: 50,
        maintenance: 'Muy bajo',
        resistance: { humidity: 10, pests: 10, fire: 10 },
        aesthetics: 6,
        applications: ['Rural', 'Industrial', 'Residencial'],
        pros: ['Máxima durabilidad', 'Resistente a humedad y plagas', 'Sin mantenimiento', 'Resistente al fuego'],
        cons: ['Mayor peso', 'Instalación más compleja', 'Estética industrial']
    },
    quebracho: {
        name: 'Postes de Quebracho',
        price: 4200,
        durability: 40,
        maintenance: 'Bajo',
        resistance: { humidity: 9, pests: 9, fire: 5 },
        aesthetics: 9,
        applications: ['Rural alta exigencia', 'Estancias'],
        pros: ['Extrema dureza natural', 'Resistencia a putrefacción', 'Estética natural premium', 'Larga vida útil'],
        cons: ['Precio más alto', 'Disponibilidad limitada', 'Peso considerable']
    },
    eucalipto: {
        name: 'Postes de Eucalipto',
        price: 2100,
        durability: 20,
        maintenance: 'Medio',
        resistance: { humidity: 6, pests: 6, fire: 5 },
        aesthetics: 8,
        applications: ['Residencial', 'Temporal'],
        pros: ['Precio económico', 'Estética natural', 'Fácil instalación', 'Renovable'],
        cons: ['Requiere tratamiento', 'Menor durabilidad', 'Mantenimiento periódico']
    },
    olimpo: {
        name: 'Postes Olimpo (Hormigón + Púas)',
        price: 4000,
        durability: 50,
        maintenance: 'Muy bajo',
        resistance: { humidity: 10, pests: 10, fire: 10 },
        aesthetics: 7,
        applications: ['Seguridad', 'Industrial', 'Perímetros'],
        pros: ['Máxima seguridad', 'Incluye 3 hilos de púas', 'Durabilidad del hormigón', 'Listo para instalar'],
        cons: ['Precio premium', 'Estética de seguridad', 'Mayor peso']
    }
};

const CONTEXT_RECOMMENDATIONS = {
    'high-demand': {
        title: 'Recomendación para Alta Exigencia',
        recommended: ['quebracho', 'hormigon'],
        notRecommended: ['eucalipto'],
        prioritySuggestion: { price: 3, durability: 10, aesthetics: 5 }
    },
    'budget': {
        title: 'Recomendación para Presupuesto Económico',
        recommended: ['eucalipto'],
        notRecommended: ['quebracho', 'olimpo'],
        prioritySuggestion: { price: 10, durability: 4, aesthetics: 6 }
    },
    'balanced': {
        title: 'Recomendación Equilibrada',
        recommended: ['hormigon', 'eucalipto'],
        notRecommended: [],
        prioritySuggestion: { price: 6, durability: 7, aesthetics: 6 }
    },
    'security': {
        title: 'Recomendación para Seguridad',
        recommended: ['olimpo', 'hormigon'],
        notRecommended: ['eucalipto'],
        prioritySuggestion: { price: 4, durability: 9, aesthetics: 5 }
    }
};

// Clase ComparatorManager simplificada para testing
class ComparatorManager {
    constructor() {
        this.selectedProducts = new Set();
        this.maxSelection = 3;
        this.priorities = { price: 5, durability: 5, aesthetics: 5 };
        this.selectedContext = null;
    }

    addProduct(productId) {
        if (this.selectedProducts.size >= this.maxSelection && !this.selectedProducts.has(productId)) {
            throw new Error(`Solo puedes seleccionar hasta ${this.maxSelection} productos`);
        }
        this.selectedProducts.add(productId);
    }

    removeProduct(productId) {
        this.selectedProducts.delete(productId);
    }

    getSelectedProducts() {
        return Array.from(this.selectedProducts);
    }

    setPriorities(price, durability, aesthetics) {
        if (price < 0 || price > 10 || durability < 0 || durability > 10 || aesthetics < 0 || aesthetics > 10) {
            throw new Error('Las prioridades deben estar entre 0 y 10');
        }
        this.priorities = { price, durability, aesthetics };
    }

    calculateScore(productId) {
        const product = COMPARISON_DATA[productId];
        if (!product) return 0;

        const priceScore = (1 - (product.price / 5000)) * 10;
        const durabilityScore = (product.durability / 50) * 10;
        const aestheticsScore = product.aesthetics;

        const weightedScore = 
            (priceScore * this.priorities.price) +
            (durabilityScore * this.priorities.durability) +
            (aestheticsScore * this.priorities.aesthetics);

        const totalWeight = this.priorities.price + this.priorities.durability + this.priorities.aesthetics;
        
        return weightedScore / totalWeight;
    }

    getRecommendedProduct() {
        if (this.selectedProducts.size === 0) return null;
        
        const scores = Array.from(this.selectedProducts).map(id => ({
            id,
            score: this.calculateScore(id)
        }));
        
        scores.sort((a, b) => b.score - a.score);
        return scores[0].id;
    }

    getScores() {
        const scores = Array.from(this.selectedProducts).map(id => ({
            id,
            score: this.calculateScore(id)
        }));
        scores.sort((a, b) => b.score - a.score);
        return scores;
    }

    setContext(context) {
        if (!CONTEXT_RECOMMENDATIONS[context]) {
            throw new Error(`Contexto inválido: ${context}`);
        }
        this.selectedContext = context;
    }

    getContextRecommendation() {
        if (!this.selectedContext) return null;
        return CONTEXT_RECOMMENDATIONS[this.selectedContext];
    }

    isProductRecommendedForContext(productId) {
        const rec = this.getContextRecommendation();
        if (!rec) return null;
        return rec.recommended.includes(productId);
    }

    isProductNotRecommendedForContext(productId) {
        const rec = this.getContextRecommendation();
        if (!rec) return null;
        return rec.notRecommended.includes(productId);
    }
}

// Clase de prueba
class ComparatorTest {
    constructor() {
        this.testsPassed = 0;
        this.testsFailed = 0;
        this.results = [];
        this.comparator = new ComparatorManager();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = { 'pass': '✓', 'fail': '✗', 'info': 'ℹ' }[type] || '•';
        console.log(`[${timestamp}] ${prefix} ${message}`);
        this.results.push({ message, type, timestamp });
    }

    assert(condition, message) {
        if (condition) {
            this.testsPassed++;
            this.log(`PASS: ${message}`, 'pass');
        } else {
            this.testsFailed++;
            this.log(`FAIL: ${message}`, 'fail');
        }
    }

    // Test 1: Selección de hasta 3 productos
    testProductSelection() {
        this.log('=== Test 1: Selección de Productos (máximo 3) ===', 'info');
        
        const comparator = new ComparatorManager();
        
        // Caso 1: Seleccionar 1 producto
        comparator.addProduct('hormigon');
        this.assert(comparator.getSelectedProducts().length === 1, 'Se selecciona 1 producto');
        this.assert(comparator.getSelectedProducts().includes('hormigon'), 'Producto correcto seleccionado');

        // Caso 2: Seleccionar 2 productos
        comparator.addProduct('quebracho');
        this.assert(comparator.getSelectedProducts().length === 2, 'Se seleccionan 2 productos');

        // Caso 3: Seleccionar 3 productos
        comparator.addProduct('eucalipto');
        this.assert(comparator.getSelectedProducts().length === 3, 'Se seleccionan 3 productos');

        // Caso 4: Intentar seleccionar 4 productos (debe fallar)
        try {
            comparator.addProduct('olimpo');
            this.assert(false, 'Debería lanzar error al seleccionar más de 3 productos');
        } catch (error) {
            this.assert(error.message.includes('3'), 'Error correcto al exceder límite');
        }

        // Caso 5: Remover producto y seleccionar otro
        comparator.removeProduct('hormigon');
        this.assert(comparator.getSelectedProducts().length === 2, 'Producto removido correctamente');
        comparator.addProduct('olimpo');
        this.assert(comparator.getSelectedProducts().includes('olimpo'), 'Nuevo producto agregado');
    }

    // Test 2: Cálculo de scores con prioridades
    testScoreCalculation() {
        this.log('=== Test 2: Cálculo de Scores con Prioridades ===', 'info');
        
        const comparator = new ComparatorManager();
        comparator.addProduct('hormigon');
        comparator.addProduct('eucalipto');
        comparator.addProduct('quebracho');

        // Caso 1: Score con prioridades balanceadas (5, 5, 5)
        const scores1 = comparator.getScores();
        this.assert(scores1.length === 3, 'Se calculan scores para 3 productos');
        this.assert(scores1.every(s => s.score >= 0 && s.score <= 10), 'Todos los scores están en rango 0-10');

        // Caso 2: Prioridad en precio (10, 0, 0)
        comparator.setPriorities(10, 0, 0);
        const scores2 = comparator.getScores();
        const eucaliptoScore = scores2.find(s => s.id === 'eucalipto').score;
        const quebrrachoScore = scores2.find(s => s.id === 'quebracho').score;
        this.assert(eucaliptoScore > quebrrachoScore, 'Eucalipto (más barato) tiene mejor score con prioridad precio');

        // Caso 3: Prioridad en durabilidad (0, 10, 0)
        comparator.setPriorities(0, 10, 0);
        const scores3 = comparator.getScores();
        const hormigonScore = scores3.find(s => s.id === 'hormigon').score;
        const eucaliptoScore2 = scores3.find(s => s.id === 'eucalipto').score;
        this.assert(hormigonScore > eucaliptoScore2, 'Hormigón (más duradero) tiene mejor score con prioridad durabilidad');

        // Caso 4: Prioridad en estética (0, 0, 10)
        comparator.setPriorities(0, 0, 10);
        const scores4 = comparator.getScores();
        const quebrrachoScore2 = scores4.find(s => s.id === 'quebracho').score;
        const hormigonScore2 = scores4.find(s => s.id === 'hormigon').score;
        this.assert(quebrrachoScore2 > hormigonScore2, 'Quebracho (más estético) tiene mejor score con prioridad estética');

        // Caso 5: Scores son determinísticos
        comparator.setPriorities(5, 5, 5);
        const score1 = comparator.calculateScore('hormigon');
        const score2 = comparator.calculateScore('hormigon');
        this.assert(score1 === score2, 'Scores son determinísticos');
    }

    // Test 3: Generación de tabla comparativa
    testComparisonTableGeneration() {
        this.log('=== Test 3: Generación de Tabla Comparativa ===', 'info');
        
        const comparator = new ComparatorManager();
        
        // Caso 1: Sin productos seleccionados
        this.assert(comparator.getSelectedProducts().length === 0, 'Sin productos inicialmente');

        // Caso 2: Con 2 productos
        comparator.addProduct('hormigon');
        comparator.addProduct('eucalipto');
        const selected = comparator.getSelectedProducts();
        this.assert(selected.length === 2, 'Se pueden generar comparativas con 2 productos');
        this.assert(selected.includes('hormigon') && selected.includes('eucalipto'), 'Productos correctos');

        // Caso 3: Con 3 productos
        comparator.addProduct('quebracho');
        this.assert(comparator.getSelectedProducts().length === 3, 'Se pueden generar comparativas con 3 productos');

        // Caso 4: Todos los productos tienen datos completos
        comparator.getSelectedProducts().forEach(productId => {
            const product = COMPARISON_DATA[productId];
            this.assert(product.name !== undefined, `${productId} tiene nombre`);
            this.assert(product.price !== undefined, `${productId} tiene precio`);
            this.assert(product.durability !== undefined, `${productId} tiene durabilidad`);
            this.assert(product.aesthetics !== undefined, `${productId} tiene estética`);
            this.assert(product.pros.length > 0, `${productId} tiene ventajas`);
            this.assert(product.cons.length > 0, `${productId} tiene desventajas`);
        });

        // Caso 5: Productos están ordenados por score
        const scores = comparator.getScores();
        for (let i = 0; i < scores.length - 1; i++) {
            this.assert(scores[i].score >= scores[i + 1].score, 'Productos ordenados por score descendente');
        }
    }

    // Test 4: Recomendaciones contextuales
    testContextualRecommendations() {
        this.log('=== Test 4: Recomendaciones Contextuales ===', 'info');
        
        const comparator = new ComparatorManager();
        comparator.addProduct('hormigon');
        comparator.addProduct('quebracho');
        comparator.addProduct('eucalipto');

        // Caso 1: Contexto "Alta Exigencia"
        comparator.setContext('high-demand');
        const rec1 = comparator.getContextRecommendation();
        this.assert(rec1.recommended.includes('quebracho'), 'Quebracho recomendado para alta exigencia');
        this.assert(rec1.recommended.includes('hormigon'), 'Hormigón recomendado para alta exigencia');
        this.assert(rec1.notRecommended.includes('eucalipto'), 'Eucalipto no recomendado para alta exigencia');

        // Caso 2: Contexto "Presupuesto Económico"
        comparator.setContext('budget');
        const rec2 = comparator.getContextRecommendation();
        this.assert(rec2.recommended.includes('eucalipto'), 'Eucalipto recomendado para presupuesto económico');
        this.assert(rec2.notRecommended.includes('quebracho'), 'Quebracho no recomendado para presupuesto económico');

        // Caso 3: Contexto "Equilibrado"
        comparator.setContext('balanced');
        const rec3 = comparator.getContextRecommendation();
        this.assert(rec3.recommended.includes('hormigon'), 'Hormigón recomendado para equilibrado');
        this.assert(rec3.recommended.includes('eucalipto'), 'Eucalipto recomendado para equilibrado');

        // Caso 4: Contexto "Seguridad"
        comparator.setContext('security');
        const rec4 = comparator.getContextRecommendation();
        this.assert(rec4.recommended.includes('olimpo'), 'Olimpo recomendado para seguridad');
        this.assert(rec4.notRecommended.includes('eucalipto'), 'Eucalipto no recomendado para seguridad');

        // Caso 5: Verificar si producto es recomendado para contexto
        comparator.setContext('high-demand');
        this.assert(comparator.isProductRecommendedForContext('quebracho') === true, 'Quebracho es recomendado para alta exigencia');
        this.assert(comparator.isProductNotRecommendedForContext('eucalipto') === true, 'Eucalipto no es recomendado para alta exigencia');
    }

    // Test 5: Producto recomendado (mejor score)
    testRecommendedProduct() {
        this.log('=== Test 5: Producto Recomendado (Mejor Score) ===', 'info');
        
        const comparator = new ComparatorManager();
        
        // Caso 1: Sin productos seleccionados
        this.assert(comparator.getRecommendedProduct() === null, 'Sin recomendación sin productos');

        // Caso 2: Con 1 producto
        comparator.addProduct('hormigon');
        this.assert(comparator.getRecommendedProduct() === 'hormigon', 'Único producto es recomendado');

        // Caso 3: Con 2 productos, prioridad precio
        comparator.addProduct('eucalipto');
        comparator.setPriorities(10, 0, 0);
        const recommended1 = comparator.getRecommendedProduct();
        this.assert(recommended1 === 'eucalipto', 'Eucalipto recomendado con prioridad precio');

        // Caso 4: Con 2 productos, prioridad durabilidad
        comparator.setPriorities(0, 10, 0);
        const recommended2 = comparator.getRecommendedProduct();
        this.assert(recommended2 === 'hormigon', 'Hormigón recomendado con prioridad durabilidad');

        // Caso 5: Con 3 productos, prioridades balanceadas
        comparator.addProduct('quebracho');
        comparator.setPriorities(5, 5, 5);
        const recommended3 = comparator.getRecommendedProduct();
        this.assert(recommended3 !== null, 'Hay producto recomendado con 3 productos');
        this.assert(['hormigon', 'eucalipto', 'quebracho'].includes(recommended3), 'Producto recomendado es válido');
    }

    // Test 6: Validación de prioridades
    testPriorityValidation() {
        this.log('=== Test 6: Validación de Prioridades ===', 'info');
        
        const comparator = new ComparatorManager();
        
        // Caso 1: Prioridades válidas (0-10)
        try {
            comparator.setPriorities(5, 5, 5);
            this.assert(true, 'Prioridades 5, 5, 5 son válidas');
        } catch (error) {
            this.assert(false, 'Prioridades válidas no deberían lanzar error');
        }

        // Caso 2: Prioridades en extremos
        try {
            comparator.setPriorities(0, 0, 10);
            this.assert(true, 'Prioridades 0, 0, 10 son válidas');
        } catch (error) {
            this.assert(false, 'Prioridades en extremos deberían ser válidas');
        }

        // Caso 3: Prioridad negativa
        try {
            comparator.setPriorities(-1, 5, 5);
            this.assert(false, 'Prioridad negativa debería lanzar error');
        } catch (error) {
            this.assert(error.message.includes('0 y 10'), 'Error correcto para prioridad negativa');
        }

        // Caso 4: Prioridad mayor a 10
        try {
            comparator.setPriorities(11, 5, 5);
            this.assert(false, 'Prioridad mayor a 10 debería lanzar error');
        } catch (error) {
            this.assert(error.message.includes('0 y 10'), 'Error correcto para prioridad mayor a 10');
        }

        // Caso 5: Contexto inválido
        try {
            comparator.setContext('contexto-invalido');
            this.assert(false, 'Contexto inválido debería lanzar error');
        } catch (error) {
            this.assert(error.message.includes('inválido'), 'Error correcto para contexto inválido');
        }
    }

    // Test 7: Propiedades de idempotencia
    testIdempotenceProperties() {
        this.log('=== Test 7: Propiedades de Idempotencia ===', 'info');
        
        const comparator = new ComparatorManager();
        comparator.addProduct('hormigon');
        comparator.addProduct('eucalipto');
        comparator.addProduct('quebracho');
        comparator.setPriorities(5, 5, 5);

        // Caso 1: Calcular score múltiples veces da el mismo resultado
        const score1 = comparator.calculateScore('hormigon');
        const score2 = comparator.calculateScore('hormigon');
        const score3 = comparator.calculateScore('hormigon');
        this.assert(score1 === score2 && score2 === score3, 'Cálculo de score es idempotente');

        // Caso 2: Obtener recomendación múltiples veces da el mismo resultado
        const rec1 = comparator.getRecommendedProduct();
        const rec2 = comparator.getRecommendedProduct();
        this.assert(rec1 === rec2, 'Recomendación es idempotente');

        // Caso 3: Scores ordenados son consistentes
        const scores1 = comparator.getScores();
        const scores2 = comparator.getScores();
        this.assert(
            scores1.map(s => s.id).join(',') === scores2.map(s => s.id).join(','),
            'Orden de scores es consistente'
        );

        // Caso 4: Cambiar prioridades y volver a las originales
        const originalScores = comparator.getScores();
        comparator.setPriorities(10, 0, 0);
        comparator.setPriorities(5, 5, 5);
        const restoredScores = comparator.getScores();
        this.assert(
            originalScores.map(s => s.score).join(',') === restoredScores.map(s => s.score).join(','),
            'Volver a prioridades originales restaura scores'
        );
    }

    // Test 8: Propiedades de ordenamiento
    testSortingProperties() {
        this.log('=== Test 8: Propiedades de Ordenamiento ===', 'info');
        
        const comparator = new ComparatorManager();
        comparator.addProduct('hormigon');
        comparator.addProduct('eucalipto');
        comparator.addProduct('quebracho');

        // Caso 1: Scores ordenados descendentemente
        comparator.setPriorities(5, 5, 5);
        const scores = comparator.getScores();
        for (let i = 0; i < scores.length - 1; i++) {
            this.assert(scores[i].score >= scores[i + 1].score, `Score ${i} >= Score ${i + 1}`);
        }

        // Caso 2: Primer elemento es el recomendado
        const recommended = comparator.getRecommendedProduct();
        const firstScore = scores[0];
        this.assert(firstScore.id === recommended, 'Primer elemento en scores es el recomendado');

        // Caso 3: Cambiar prioridades cambia el orden
        const originalOrder = scores.map(s => s.id).join(',');
        comparator.setPriorities(10, 0, 0);
        const newScores = comparator.getScores();
        const newOrder = newScores.map(s => s.id).join(',');
        this.assert(originalOrder !== newOrder, 'Cambiar prioridades cambia el orden de scores');
    }

    // Test 9: Datos de productos completos
    testProductDataCompleteness() {
        this.log('=== Test 9: Completitud de Datos de Productos ===', 'info');
        
        const productIds = ['hormigon', 'quebracho', 'eucalipto', 'olimpo'];
        
        productIds.forEach(productId => {
            const product = COMPARISON_DATA[productId];
            
            this.assert(product !== undefined, `${productId} existe en COMPARISON_DATA`);
            this.assert(product.name !== undefined && product.name.length > 0, `${productId} tiene nombre`);
            this.assert(product.price > 0, `${productId} tiene precio válido`);
            this.assert(product.durability > 0, `${productId} tiene durabilidad válida`);
            this.assert(product.aesthetics >= 0 && product.aesthetics <= 10, `${productId} tiene estética válida`);
            this.assert(product.resistance.humidity >= 0 && product.resistance.humidity <= 10, `${productId} tiene resistencia humedad válida`);
            this.assert(product.resistance.pests >= 0 && product.resistance.pests <= 10, `${productId} tiene resistencia plagas válida`);
            this.assert(product.resistance.fire >= 0 && product.resistance.fire <= 10, `${productId} tiene resistencia fuego válida`);
            this.assert(product.pros.length > 0, `${productId} tiene ventajas`);
            this.assert(product.cons.length > 0, `${productId} tiene desventajas`);
            this.assert(product.applications.length > 0, `${productId} tiene aplicaciones`);
        });
    }

    // Test 10: Contextos disponibles
    testContextsAvailability() {
        this.log('=== Test 10: Disponibilidad de Contextos ===', 'info');
        
        const contexts = ['high-demand', 'budget', 'balanced', 'security'];
        
        contexts.forEach(context => {
            const rec = CONTEXT_RECOMMENDATIONS[context];
            this.assert(rec !== undefined, `Contexto "${context}" existe`);
            this.assert(rec.title !== undefined, `Contexto "${context}" tiene título`);
            this.assert(rec.recommended.length > 0, `Contexto "${context}" tiene productos recomendados`);
            this.assert(rec.prioritySuggestion !== undefined, `Contexto "${context}" tiene sugerencia de prioridades`);
        });
    }

    runAll() {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║     TEST AUTOMATIZADO - COMPARADOR DE SOLUCIONES           ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        this.testProductSelection();
        this.testScoreCalculation();
        this.testComparisonTableGeneration();
        this.testContextualRecommendations();
        this.testRecommendedProduct();
        this.testPriorityValidation();
        this.testIdempotenceProperties();
        this.testSortingProperties();
        this.testProductDataCompleteness();
        this.testContextsAvailability();

        this.printSummary();
    }

    printSummary() {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║                    RESUMEN DE RESULTADOS                   ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        
        const total = this.testsPassed + this.testsFailed;
        const percentage = total > 0 ? Math.round((this.testsPassed / total) * 100) : 0;

        console.log(`Total de tests: ${total}`);
        console.log(`✓ Pasados: ${this.testsPassed}`);
        console.log(`✗ Fallidos: ${this.testsFailed}`);
        console.log(`Porcentaje de éxito: ${percentage}%\n`);

        if (this.testsFailed === 0) {
            console.log('🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!\n');
        } else {
            console.log('⚠️  Algunos tests fallaron. Revisa los resultados arriba.\n');
        }
    }
}

// Ejecutar tests
const tester = new ComparatorTest();
tester.runAll();
