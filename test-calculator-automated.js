/**
 * Test automatizado para la calculadora de materiales
 * Ejecutar: node test-calculator-automated.js
 */

// Simulación de CONFIG
const CONFIG = {
    calculator: {
        defaultPostSpacing: 2.5,
        cornerPosts: 4,
        meshRollLength: 10,
        wireTypes: {
            standard: { strands: 5, name: 'Alambre estándar (5 hilos)' },
            reinforced: { strands: 7, name: 'Alambre reforzado (7 hilos)' },
            olimpo: { strands: 3, name: 'Alambre de púa (3 hilos)', isPua: true }
        }
    }
};

// Clase MaterialCalculator (copiada del archivo original)
class MaterialCalculator {
    constructor(config = {}) {
        this.config = config || CONFIG?.calculator || {};
        this.postSpacing = this.config.defaultPostSpacing || 2.5;
        this.cornerPosts = this.config.cornerPosts || 4;
        this.meshRollLength = this.config.meshRollLength || 10;
        this.wireTypes = this.config.wireTypes || {
            standard: { strands: 5, name: 'Alambre estándar (5 hilos)' },
            reinforced: { strands: 7, name: 'Alambre reforzado (7 hilos)' },
            olimpo: { strands: 3, name: 'Alambre de púa (3 hilos)', isPua: true }
        };
    }

    calculatePerimeter(length, width) {
        if (!length || !width || length <= 0 || width <= 0) {
            throw new Error('Las dimensiones deben ser valores positivos');
        }
        return 2 * (parseFloat(length) + parseFloat(width));
    }

    calculatePosts(perimeter, spacing = null) {
        if (!perimeter || perimeter <= 0) {
            throw new Error('El perímetro debe ser un valor positivo');
        }

        const effectiveSpacing = spacing || this.postSpacing;
        
        if (effectiveSpacing <= 0) {
            throw new Error('La separación entre postes debe ser un valor positivo');
        }

        const totalPosts = Math.ceil(perimeter / effectiveSpacing);
        const intermediatePosts = Math.max(0, totalPosts - this.cornerPosts);

        return {
            corner: this.cornerPosts,
            intermediate: intermediatePosts,
            total: totalPosts,
            spacing: effectiveSpacing
        };
    }

    calculateWire(perimeter, strands) {
        if (!perimeter || perimeter <= 0) {
            throw new Error('El perímetro debe ser un valor positivo');
        }

        if (!strands || strands <= 0) {
            throw new Error('El número de hilos debe ser un valor positivo');
        }

        const totalMeters = perimeter * strands;
        const kgPerMeter = 0.15;
        const totalKg = Math.ceil(totalMeters * kgPerMeter);

        return {
            strands: strands,
            metersPerStrand: perimeter,
            totalMeters: totalMeters,
            estimatedKg: totalKg
        };
    }

    calculateMesh(perimeter, height) {
        if (!perimeter || perimeter <= 0) {
            throw new Error('El perímetro debe ser un valor positivo');
        }

        if (!height || height <= 0) {
            throw new Error('La altura debe ser un valor positivo');
        }

        const rollsNeeded = Math.ceil(perimeter / this.meshRollLength);
        const totalMeters = perimeter;

        return {
            height: height,
            rollLength: this.meshRollLength,
            rollsNeeded: rollsNeeded,
            totalMeters: totalMeters,
            coverage: rollsNeeded * this.meshRollLength
        };
    }

    calculateOlimpoSpecial(perimeter) {
        const puaStrands = 3;
        const wireData = this.calculateWire(perimeter, puaStrands);
        
        return {
            ...wireData,
            wireType: 'Alambre de púa',
            isOlimpo: true,
            note: 'Los postes Olimpo incluyen 3 hilos de alambre de púa incorporados'
        };
    }

    calculateAccessories(posts, perimeter, materialType) {
        const accessories = {};

        if (materialType === 'wire') {
            accessories.grampas = Math.ceil(posts.total * 10);
            accessories.tensores = Math.ceil(perimeter / 25);
            accessories.alambreAtar = Math.ceil(perimeter / 50);
        } else if (materialType === 'mesh') {
            accessories.abrazaderas = Math.ceil(posts.total * 4);
            accessories.tensores = Math.ceil(perimeter / 20);
            accessories.alambreAtar = Math.ceil(perimeter / 30);
        }

        accessories.esquineros = 4;
        accessories.varillasAnclaje = posts.corner;

        return accessories;
    }

    calculateComplete(params) {
        try {
            const {
                length,
                width,
                perimeter: customPerimeter,
                postType,
                postSpacing,
                materialType,
                wireStrands,
                meshHeight
            } = params;

            const perimeter = customPerimeter || this.calculatePerimeter(length, width);
            const posts = this.calculatePosts(perimeter, postSpacing);

            const result = {
                perimeter: perimeter,
                posts: posts,
                postType: postType || 'hormigon'
            };

            if (postType === 'olimpo') {
                result.wire = this.calculateOlimpoSpecial(perimeter);
                result.materialType = 'wire';
            } else if (materialType === 'wire') {
                result.wire = this.calculateWire(perimeter, wireStrands || 5);
                result.materialType = 'wire';
            } else if (materialType === 'mesh') {
                result.mesh = this.calculateMesh(perimeter, meshHeight || 1.5);
                result.materialType = 'mesh';
            }

            result.accessories = this.calculateAccessories(
                posts,
                perimeter,
                result.materialType
            );

            return result;
        } catch (error) {
            console.error('Error en cálculo completo:', error);
            throw error;
        }
    }

    validateInput(value, min = 0, max = Infinity) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return { valid: false, error: 'Debe ingresar un número válido' };
        }
        if (num <= min) {
            return { valid: false, error: `El valor debe ser mayor a ${min}` };
        }
        if (num > max) {
            return { valid: false, error: `El valor debe ser menor o igual a ${max}` };
        }
        return { valid: true, value: num };
    }
}

// Clase de prueba
class CalculatorTest {
    constructor() {
        this.testsPassed = 0;
        this.testsFailed = 0;
        this.results = [];
        this.calculator = new MaterialCalculator(CONFIG);
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = {
            'pass': '✓',
            'fail': '✗',
            'info': 'ℹ'
        }[type] || '•';
        
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

    // Test 1: Cálculo de perímetro con diferentes dimensiones
    testPerimeterCalculation() {
        this.log('=== Test 1: Cálculo de Perímetro ===', 'info');
        
        // Caso 1: Terreno cuadrado 10x10
        const perimeter1 = this.calculator.calculatePerimeter(10, 10);
        this.assert(perimeter1 === 40, 'Perímetro 10x10 = 40m');

        // Caso 2: Terreno rectangular 20x15
        const perimeter2 = this.calculator.calculatePerimeter(20, 15);
        this.assert(perimeter2 === 70, 'Perímetro 20x15 = 70m');

        // Caso 3: Terreno pequeño 5x5
        const perimeter3 = this.calculator.calculatePerimeter(5, 5);
        this.assert(perimeter3 === 20, 'Perímetro 5x5 = 20m');

        // Caso 4: Terreno grande 100x50
        const perimeter4 = this.calculator.calculatePerimeter(100, 50);
        this.assert(perimeter4 === 300, 'Perímetro 100x50 = 300m');

        // Caso 5: Decimales
        const perimeter5 = this.calculator.calculatePerimeter(10.5, 8.5);
        this.assert(perimeter5 === 38, 'Perímetro 10.5x8.5 = 38m');
    }

    // Test 2: Cálculo correcto de cantidad de postes
    testPostCalculation() {
        this.log('=== Test 2: Cálculo de Postes ===', 'info');
        
        // Caso 1: Perímetro 40m con espaciado 2.5m
        const posts1 = this.calculator.calculatePosts(40);
        this.assert(posts1.total === 16, 'Perímetro 40m = 16 postes totales');
        this.assert(posts1.corner === 4, 'Siempre 4 postes esquineros');
        this.assert(posts1.intermediate === 12, 'Postes intermedios = 12');

        // Caso 2: Perímetro 100m con espaciado 2.5m
        const posts2 = this.calculator.calculatePosts(100);
        this.assert(posts2.total === 40, 'Perímetro 100m = 40 postes totales');

        // Caso 3: Espaciado personalizado 5m
        const posts3 = this.calculator.calculatePosts(100, 5);
        this.assert(posts3.total === 20, 'Perímetro 100m con espaciado 5m = 20 postes');
        this.assert(posts3.spacing === 5, 'Espaciado guardado correctamente');

        // Caso 4: Perímetro pequeño 20m
        const posts4 = this.calculator.calculatePosts(20);
        this.assert(posts4.total === 8, 'Perímetro 20m = 8 postes');

        // Caso 5: Perímetro muy grande 500m
        const posts5 = this.calculator.calculatePosts(500);
        this.assert(posts5.total === 200, 'Perímetro 500m = 200 postes');
    }

    // Test 3: Cálculo de alambre y tejido
    testWireAndMeshCalculation() {
        this.log('=== Test 3: Cálculo de Alambre y Tejido ===', 'info');
        
        // Caso 1: Alambre 5 hilos en perímetro 40m
        const wire1 = this.calculator.calculateWire(40, 5);
        this.assert(wire1.totalMeters === 200, 'Alambre 40m x 5 hilos = 200m');
        this.assert(wire1.strands === 5, 'Número de hilos = 5');
        this.assert(wire1.metersPerStrand === 40, 'Metros por hilo = 40m');

        // Caso 2: Alambre 3 hilos en perímetro 100m
        const wire2 = this.calculator.calculateWire(100, 3);
        this.assert(wire2.totalMeters === 300, 'Alambre 100m x 3 hilos = 300m');

        // Caso 3: Tejido romboidal 1.5m de altura en perímetro 40m
        const mesh1 = this.calculator.calculateMesh(40, 1.5);
        this.assert(mesh1.rollsNeeded === 4, 'Perímetro 40m = 4 rollos de 10m');
        this.assert(mesh1.height === 1.5, 'Altura = 1.5m');
        this.assert(mesh1.coverage === 40, 'Cobertura = 40m');

        // Caso 4: Tejido 2.0m de altura en perímetro 100m
        const mesh2 = this.calculator.calculateMesh(100, 2.0);
        this.assert(mesh2.rollsNeeded === 10, 'Perímetro 100m = 10 rollos');
        this.assert(mesh2.height === 2.0, 'Altura = 2.0m');

        // Caso 5: Tejido 1.0m de altura en perímetro 25m
        const mesh3 = this.calculator.calculateMesh(25, 1.0);
        this.assert(mesh3.rollsNeeded === 3, 'Perímetro 25m = 3 rollos (redondeado)');
    }

    // Test 4: Lógica especial de postes Olimpo
    testOlimpoSpecialLogic() {
        this.log('=== Test 4: Lógica Especial Postes Olimpo ===', 'info');
        
        // Caso 1: Olimpo siempre tiene 3 hilos de púa
        const olimpo1 = this.calculator.calculateOlimpoSpecial(40);
        this.assert(olimpo1.strands === 3, 'Olimpo siempre tiene 3 hilos');
        this.assert(olimpo1.totalMeters === 120, 'Olimpo 40m x 3 hilos = 120m');
        this.assert(olimpo1.isOlimpo === true, 'Flag isOlimpo = true');

        // Caso 2: Olimpo en perímetro 100m
        const olimpo2 = this.calculator.calculateOlimpoSpecial(100);
        this.assert(olimpo2.totalMeters === 300, 'Olimpo 100m x 3 hilos = 300m');
        this.assert(olimpo2.wireType === 'Alambre de púa', 'Tipo de alambre = púa');

        // Caso 3: Cálculo completo con postType olimpo
        const complete = this.calculator.calculateComplete({
            length: 10,
            width: 10,
            postType: 'olimpo',
            materialType: 'wire'
        });
        this.assert(complete.postType === 'olimpo', 'Post type = olimpo');
        this.assert(complete.wire.isOlimpo === true, 'Wire es Olimpo');
        this.assert(complete.wire.strands === 3, 'Olimpo tiene 3 hilos');
    }

    // Test 5: Validación de inputs
    testInputValidation() {
        this.log('=== Test 5: Validación de Inputs ===', 'info');
        
        // Caso 1: Número válido
        const valid1 = this.calculator.validateInput(10);
        this.assert(valid1.valid === true, 'Número 10 es válido');
        this.assert(valid1.value === 10, 'Valor parseado correctamente');

        // Caso 2: Número inválido (texto)
        const invalid1 = this.calculator.validateInput('abc');
        this.assert(invalid1.valid === false, 'Texto "abc" es inválido');
        this.assert(invalid1.error.includes('número válido'), 'Mensaje de error correcto');

        // Caso 3: Número negativo
        const invalid2 = this.calculator.validateInput(-5);
        this.assert(invalid2.valid === false, 'Número negativo es inválido');

        // Caso 4: Cero
        const invalid3 = this.calculator.validateInput(0);
        this.assert(invalid3.valid === false, 'Cero es inválido');

        // Caso 5: Número decimal válido
        const valid2 = this.calculator.validateInput(10.5);
        this.assert(valid2.valid === true, 'Decimal 10.5 es válido');
        this.assert(valid2.value === 10.5, 'Decimal parseado correctamente');

        // Caso 6: Número dentro de rango
        const valid3 = this.calculator.validateInput(50, 0, 100);
        this.assert(valid3.valid === true, '50 está dentro de rango 0-100');

        // Caso 7: Número fuera de rango máximo
        const invalid4 = this.calculator.validateInput(150, 0, 100);
        this.assert(invalid4.valid === false, '150 está fuera de rango 0-100');
    }

    // Test 6: Recálculo automático (propiedades de idempotencia)
    testRecalculationConsistency() {
        this.log('=== Test 6: Consistencia de Recálculo ===', 'info');
        
        // Caso 1: Múltiples cálculos del mismo perímetro dan el mismo resultado
        const calc1 = this.calculator.calculatePosts(100);
        const calc2 = this.calculator.calculatePosts(100);
        this.assert(
            calc1.total === calc2.total && calc1.intermediate === calc2.intermediate,
            'Cálculos repetidos son idempotentes'
        );

        // Caso 2: Cambiar espaciado y volver al original
        const posts1 = this.calculator.calculatePosts(100, 2.5);
        const posts2 = this.calculator.calculatePosts(100, 5);
        const posts3 = this.calculator.calculatePosts(100, 2.5);
        this.assert(posts1.total === posts3.total, 'Volver al espaciado original da mismo resultado');

        // Caso 3: Cálculo completo es determinístico
        const params = {
            length: 20,
            width: 15,
            postType: 'hormigon',
            materialType: 'wire',
            wireStrands: 5
        };
        const complete1 = this.calculator.calculateComplete(params);
        const complete2 = this.calculator.calculateComplete(params);
        this.assert(
            complete1.perimeter === complete2.perimeter &&
            complete1.posts.total === complete2.posts.total,
            'Cálculo completo es determinístico'
        );
    }

    // Test 7: Cálculo de accesorios
    testAccessoriesCalculation() {
        this.log('=== Test 7: Cálculo de Accesorios ===', 'info');
        
        const posts = this.calculator.calculatePosts(100);
        
        // Caso 1: Accesorios para alambre
        const acc1 = this.calculator.calculateAccessories(posts, 100, 'wire');
        this.assert(acc1.grampas > 0, 'Grampas calculadas para alambre');
        this.assert(acc1.tensores > 0, 'Tensores calculados para alambre');
        this.assert(acc1.esquineros === 4, 'Esquineros siempre 4');

        // Caso 2: Accesorios para tejido
        const acc2 = this.calculator.calculateAccessories(posts, 100, 'mesh');
        this.assert(acc2.abrazaderas > 0, 'Abrazaderas calculadas para tejido');
        this.assert(acc2.tensores > 0, 'Tensores calculados para tejido');

        // Caso 3: Accesorios varían con perímetro
        const posts2 = this.calculator.calculatePosts(200);
        const acc3 = this.calculator.calculateAccessories(posts2, 200, 'wire');
        this.assert(acc3.grampas > acc1.grampas, 'Más grampas para perímetro mayor');
    }

    // Test 8: Manejo de errores
    testErrorHandling() {
        this.log('=== Test 8: Manejo de Errores ===', 'info');
        
        // Caso 1: Perímetro negativo
        try {
            this.calculator.calculatePerimeter(-10, 10);
            this.assert(false, 'Debería lanzar error para dimensión negativa');
        } catch (error) {
            this.assert(error.message.includes('positivos'), 'Error correcto para dimensión negativa');
        }

        // Caso 2: Perímetro cero
        try {
            this.calculator.calculatePosts(0);
            this.assert(false, 'Debería lanzar error para perímetro cero');
        } catch (error) {
            this.assert(error.message.includes('positivo'), 'Error correcto para perímetro cero');
        }

        // Caso 3: Hilos negativos
        try {
            this.calculator.calculateWire(100, -5);
            this.assert(false, 'Debería lanzar error para hilos negativos');
        } catch (error) {
            this.assert(error.message.includes('positivo'), 'Error correcto para hilos negativos');
        }

        // Caso 4: Altura negativa en tejido
        try {
            this.calculator.calculateMesh(100, -1.5);
            this.assert(false, 'Debería lanzar error para altura negativa');
        } catch (error) {
            this.assert(error.message.includes('positivo'), 'Error correcto para altura negativa');
        }
    }

    // Test 9: Cálculo completo integrado
    testCompleteCalculation() {
        this.log('=== Test 9: Cálculo Completo Integrado ===', 'info');
        
        // Caso 1: Cálculo completo con alambre
        const complete1 = this.calculator.calculateComplete({
            length: 20,
            width: 15,
            postType: 'hormigon',
            materialType: 'wire',
            wireStrands: 5
        });
        this.assert(complete1.perimeter === 70, 'Perímetro calculado correctamente');
        this.assert(complete1.posts.total > 0, 'Postes calculados');
        this.assert(complete1.wire !== undefined, 'Alambre incluido');
        this.assert(complete1.accessories !== undefined, 'Accesorios incluidos');

        // Caso 2: Cálculo completo con tejido
        const complete2 = this.calculator.calculateComplete({
            length: 30,
            width: 20,
            postType: 'quebracho',
            materialType: 'mesh',
            meshHeight: 1.8
        });
        this.assert(complete2.mesh !== undefined, 'Tejido incluido');
        this.assert(complete2.mesh.height === 1.8, 'Altura de tejido correcta');

        // Caso 3: Cálculo con perímetro personalizado
        const complete3 = this.calculator.calculateComplete({
            perimeter: 150,
            postType: 'eucalipto',
            materialType: 'wire',
            wireStrands: 3
        });
        this.assert(complete3.perimeter === 150, 'Perímetro personalizado usado');
        this.assert(complete3.postType === 'eucalipto', 'Tipo de poste correcto');
    }

    // Test 10: Propiedades matemáticas
    testMathematicalProperties() {
        this.log('=== Test 10: Propiedades Matemáticas ===', 'info');
        
        // Caso 1: Perímetro es proporcional a dimensiones
        const p1 = this.calculator.calculatePerimeter(10, 10);
        const p2 = this.calculator.calculatePerimeter(20, 20);
        this.assert(p2 === p1 * 2, 'Perímetro es proporcional a dimensiones');

        // Caso 2: Más postes con espaciado menor
        const posts1 = this.calculator.calculatePosts(100, 5);
        const posts2 = this.calculator.calculatePosts(100, 2.5);
        this.assert(posts2.total > posts1.total, 'Espaciado menor = más postes');

        // Caso 3: Más alambre con más hilos
        const wire1 = this.calculator.calculateWire(100, 3);
        const wire2 = this.calculator.calculateWire(100, 5);
        this.assert(wire2.totalMeters > wire1.totalMeters, 'Más hilos = más alambre');

        // Caso 4: Más rollos con perímetro mayor
        const mesh1 = this.calculator.calculateMesh(50, 1.5);
        const mesh2 = this.calculator.calculateMesh(100, 1.5);
        this.assert(mesh2.rollsNeeded > mesh1.rollsNeeded, 'Perímetro mayor = más rollos');
    }

    // Ejecutar todos los tests
    runAll() {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║     TEST AUTOMATIZADO - CALCULADORA DE MATERIALES          ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        this.testPerimeterCalculation();
        this.testPostCalculation();
        this.testWireAndMeshCalculation();
        this.testOlimpoSpecialLogic();
        this.testInputValidation();
        this.testRecalculationConsistency();
        this.testAccessoriesCalculation();
        this.testErrorHandling();
        this.testCompleteCalculation();
        this.testMathematicalProperties();

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
const tester = new CalculatorTest();
tester.runAll();
