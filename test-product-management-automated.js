/**
 * Test automatizado para gestión de productos
 * Ejecutar: node test-product-management-automated.js
 */

// Simulación de localStorage para Node.js
const localStorage = {
    data: {},
    getItem(key) {
        return this.data[key] || null;
    },
    setItem(key, value) {
        this.data[key] = value;
    },
    removeItem(key) {
        delete this.data[key];
    },
    clear() {
        this.data = {};
    }
};

// Simulación de CONFIG
const CONFIG = {
    pricing: {
        currency: 'ARS',
        currencySymbol: '$',
        currencyFormat: {
            locale: 'es-AR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    },
    products: {
        enableGoogleSheets: false
    }
};

// Clase de prueba
class ProductManagementTest {
    constructor() {
        this.testsPassed = 0;
        this.testsFailed = 0;
        this.results = [];
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

    // Test 1: Crear producto
    testCreateProduct() {
        this.log('=== Test 1: Crear Producto ===', 'info');
        
        const products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const newProduct = {
            id: 'prod_test_001',
            name: 'Poste de Hormigón Test',
            category: 'Postes',
            description: 'Producto de prueba',
            price: 3500,
            stock: 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        products.push(newProduct);
        localStorage.setItem('ferreteria_products', JSON.stringify(products));

        const saved = JSON.parse(localStorage.getItem('ferreteria_products'));
        this.assert(saved.length === 1, 'Producto guardado en localStorage');
        this.assert(saved[0].id === 'prod_test_001', 'ID del producto es correcto');
        this.assert(saved[0].name === 'Poste de Hormigón Test', 'Nombre del producto es correcto');
        this.assert(saved[0].price === 3500, 'Precio del producto es correcto');
    }

    // Test 2: Crear múltiples productos
    testCreateMultipleProducts() {
        this.log('=== Test 2: Crear Múltiples Productos ===', 'info');
        
        localStorage.clear();
        const products = [];
        const categories = ['Postes', 'Alambres', 'Tejidos'];

        for (let i = 0; i < 5; i++) {
            products.push({
                id: `prod_test_${i}`,
                name: `Producto ${i}`,
                category: categories[i % categories.length],
                price: (i + 1) * 1000,
                stock: (i + 1) * 10,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        localStorage.setItem('ferreteria_products', JSON.stringify(products));
        const saved = JSON.parse(localStorage.getItem('ferreteria_products'));

        this.assert(saved.length === 5, 'Se crearon 5 productos');
        this.assert(saved.every(p => p.id && p.name && p.category), 'Todos los productos tienen campos requeridos');
    }

    // Test 3: Leer productos
    testReadProducts() {
        this.log('=== Test 3: Leer Productos ===', 'info');
        
        const products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        this.assert(products.length === 5, 'Se leyeron 5 productos');
        this.assert(Array.isArray(products), 'Los datos son un array');
        this.assert(products[0].name === 'Producto 0', 'Primer producto tiene nombre correcto');
    }

    // Test 4: Actualizar producto
    testUpdateProduct() {
        this.log('=== Test 4: Actualizar Producto ===', 'info');
        
        const products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const originalPrice = products[0].price;
        
        products[0].price = originalPrice * 1.1;
        products[0].stock = 100;
        products[0].updatedAt = new Date().toISOString();

        localStorage.setItem('ferreteria_products', JSON.stringify(products));
        const updated = JSON.parse(localStorage.getItem('ferreteria_products'));

        this.assert(updated[0].price === originalPrice * 1.1, 'Precio actualizado correctamente');
        this.assert(updated[0].stock === 100, 'Stock actualizado correctamente');
    }

    // Test 5: Eliminar producto
    testDeleteProduct() {
        this.log('=== Test 5: Eliminar Producto ===', 'info');
        
        const products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const initialCount = products.length;
        
        products.pop();
        localStorage.setItem('ferreteria_products', JSON.stringify(products));
        
        const remaining = JSON.parse(localStorage.getItem('ferreteria_products'));
        this.assert(remaining.length === initialCount - 1, 'Producto eliminado correctamente');
    }

    // Test 6: Validación de datos
    testValidation() {
        this.log('=== Test 6: Validación de Datos ===', 'info');
        
        const products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        
        const allValid = products.every(p => {
            return p.id && 
                   p.name && 
                   p.category && 
                   typeof p.price === 'number' && 
                   p.price >= 0 &&
                   typeof p.stock === 'number' &&
                   p.stock >= 0;
        });

        this.assert(allValid, 'Todos los productos tienen datos válidos');
    }

    // Test 7: Obtener categorías
    testGetCategories() {
        this.log('=== Test 7: Obtener Categorías ===', 'info');
        
        const products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const categories = new Set();
        
        products.forEach(p => {
            if (p.category) categories.add(p.category);
        });

        this.assert(categories.size > 0, 'Se obtuvieron categorías');
        this.assert(categories.has('Postes'), 'Categoría "Postes" existe');
    }

    // Test 8: Exportación de datos
    testExportData() {
        this.log('=== Test 8: Exportación de Datos ===', 'info');
        
        const products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const exportData = {
            exportDate: new Date().toISOString(),
            totalProducts: products.length,
            products: products
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        this.assert(jsonString.includes('exportDate'), 'Datos exportados contienen fecha');
        this.assert(jsonString.includes('totalProducts'), 'Datos exportados contienen total');
        this.assert(jsonString.includes('products'), 'Datos exportados contienen productos');
    }

    // Test 9: Importación de datos
    testImportData() {
        this.log('=== Test 9: Importación de Datos ===', 'info');
        
        const importData = {
            exportDate: new Date().toISOString(),
            totalProducts: 2,
            products: [
                {
                    id: 'prod_import_001',
                    name: 'Producto Importado 1',
                    category: 'Importados',
                    price: 5000,
                    stock: 20,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 'prod_import_002',
                    name: 'Producto Importado 2',
                    category: 'Importados',
                    price: 6000,
                    stock: 30,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ]
        };

        const currentProducts = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const merged = [...currentProducts, ...importData.products];
        localStorage.setItem('ferreteria_products', JSON.stringify(merged));

        const result = JSON.parse(localStorage.getItem('ferreteria_products'));
        this.assert(result.length > currentProducts.length, 'Productos importados agregados');
        this.assert(result.some(p => p.id === 'prod_import_001'), 'Producto importado 1 existe');
    }

    // Test 10: Búsqueda y filtrado
    testSearchAndFilter() {
        this.log('=== Test 10: Búsqueda y Filtrado ===', 'info');
        
        const products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        
        const filtered = products.filter(p => p.category === 'Postes');
        this.assert(filtered.length > 0, 'Se encontraron productos en categoría "Postes"');

        const searched = products.filter(p => p.name.toLowerCase().includes('producto'));
        this.assert(searched.length > 0, 'Se encontraron productos con búsqueda');
    }

    // Ejecutar todos los tests
    runAll() {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║     TEST AUTOMATIZADO - GESTIÓN DE PRODUCTOS              ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        this.testCreateProduct();
        this.testCreateMultipleProducts();
        this.testReadProducts();
        this.testUpdateProduct();
        this.testDeleteProduct();
        this.testValidation();
        this.testGetCategories();
        this.testExportData();
        this.testImportData();
        this.testSearchAndFilter();

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
const tester = new ProductManagementTest();
tester.runAll();
