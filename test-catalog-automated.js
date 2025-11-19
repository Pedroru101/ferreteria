/**
 * Tests automatizados para el módulo de catálogo interactivo
 * Ejecutable en Node.js
 * Requirements: 3.4, 3.10, 3.11, 3.1, 3.2
 */

// Mock de localStorage para Node.js
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

// Mock de sessionStorage
const sessionStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

// Configurar globales
global.localStorage = localStorageMock;
global.sessionStorage = sessionStorageMock;
global.document = {
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: () => {},
    body: { style: {} }
};
global.window = {
    addEventListener: () => {},
    CatalogManager: null,
    catalogManager: null
};

// Cargar configuración
const CONFIG = {
    products: {
        enableGoogleSheets: false
    },
    pricing: {
        currencySymbol: '$',
        currencyFormat: {
            locale: 'es-AR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    }
};

// Datos de productos simplificados
const PRODUCTS_DATA = {
    postes: [
        {
            id: 'poste_hormigon_2_5',
            name: 'Poste de Hormigón 2.5m',
            category: 'postes',
            subcategory: 'hormigon',
            description: 'Poste de hormigón armado',
            specs: {
                material: 'Hormigón armado',
                height: '2.5m',
                resistance: { humidity: 10, pests: 10, fire: 10 }
            },
            applications: ['Rural', 'Industrial'],
            price: 3500,
            stock: 150,
            image: 'assets/images/products/poste-hormigon.jpg',
            featured: true
        },
        {
            id: 'poste_quebracho_2_5',
            name: 'Poste de Quebracho 2.5m',
            category: 'postes',
            subcategory: 'quebracho',
            description: 'Poste de quebracho colorado',
            specs: {
                material: 'Quebracho colorado',
                height: '2.5m',
                resistance: { humidity: 9, pests: 9, fire: 5 }
            },
            applications: ['Rural alta exigencia'],
            price: 4200,
            stock: 80,
            image: 'assets/images/products/poste-quebracho.jpg',
            featured: true
        }
    ],
    tejidos: [
        {
            id: 'tejido_romboidal_1_0',
            name: 'Tejido Romboidal 1.0m',
            category: 'tejidos',
            subcategory: 'romboidal',
            description: 'Tejido romboidal de 1.0m de altura',
            specs: {
                caliber: '14',
                mesh_size: '63mm',
                height: '1.0m',
                roll_length: '10m'
            },
            applications: ['Residencial'],
            price: 2500,
            stock: 200,
            image: 'assets/images/products/tejido.jpg',
            featured: false
        }
    ],
    alambres: [
        {
            id: 'alambre_galvanizado_4',
            name: 'Alambre Galvanizado Calibre 4',
            category: 'alambres',
            subcategory: 'galvanizado',
            description: 'Alambre galvanizado de calibre 4',
            specs: {
                wire_type: 'Galvanizado',
                caliber: '4',
                presentation: 'Bobina'
            },
            applications: ['General'],
            price: 1500,
            stock: 300,
            image: 'assets/images/products/alambre.jpg',
            featured: false
        }
    ],
    accesorios: [
        {
            id: 'grampa_standard',
            name: 'Grampa Standard',
            category: 'accesorios',
            subcategory: 'grampas',
            description: 'Grampa estándar para postes',
            specs: {
                type: 'Grampa',
                material: 'Acero'
            },
            applications: ['General'],
            price: 50,
            stock: 1000,
            image: 'assets/images/products/grampa.jpg',
            featured: false
        }
    ]
};

// Clase CatalogManager simplificada para testing
class CatalogManager {
    constructor() {
        this.products = [];
        this.selectedProducts = this.loadCartFromStorage();
        this.isLoading = false;
        this.loadError = null;
    }

    async loadProducts() {
        if (this.products.length > 0) {
            return this.products;
        }

        this.isLoading = true;
        this.loadError = null;

        try {
            this.products = [
                ...PRODUCTS_DATA.postes,
                ...PRODUCTS_DATA.tejidos,
                ...PRODUCTS_DATA.alambres,
                ...PRODUCTS_DATA.accesorios
            ];
            this.isLoading = false;
            return this.products;
        } catch (error) {
            this.loadError = error;
            this.isLoading = false;
            return [];
        }
    }

    getProductById(productId) {
        return this.products.find(p => p.id === productId);
    }

    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category);
    }

    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
    }

    addToCart(productId, quantity = 1) {
        const product = this.getProductById(productId);
        if (!product) {
            return false;
        }

        const existingIndex = this.selectedProducts.findIndex(p => p.id === productId);
        
        if (existingIndex !== -1) {
            this.selectedProducts[existingIndex].quantity += quantity;
        } else {
            this.selectedProducts.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                priceUnit: product.priceUnit || 'unidad',
                quantity: quantity,
                image: product.image
            });
        }

        this.saveCartToStorage();
        return true;
    }

    updateCartQuantity(productId, quantity) {
        const index = this.selectedProducts.findIndex(p => p.id === productId);
        
        if (index === -1) {
            return false;
        }

        if (quantity <= 0) {
            return this.removeFromCart(productId);
        }

        this.selectedProducts[index].quantity = quantity;
        this.saveCartToStorage();
        return true;
    }

    removeFromCart(productId) {
        const index = this.selectedProducts.findIndex(p => p.id === productId);
        
        if (index === -1) {
            return false;
        }

        this.selectedProducts.splice(index, 1);
        this.saveCartToStorage();
        return true;
    }

    clearCart() {
        this.selectedProducts = [];
        this.saveCartToStorage();
    }

    getCartCount() {
        return this.selectedProducts.reduce((total, item) => total + item.quantity, 0);
    }

    getCartTotal() {
        return this.selectedProducts.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    getCartItems() {
        return [...this.selectedProducts];
    }

    saveCartToStorage() {
        try {
            const cartData = {
                items: this.selectedProducts,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('ferreteria_cart', JSON.stringify(cartData));
        } catch (error) {
            console.error('Error al guardar carrito:', error);
        }
    }

    loadCartFromStorage() {
        try {
            const data = localStorage.getItem('ferreteria_cart');
            if (!data) {
                return [];
            }

            const cartData = JSON.parse(data);
            return cartData.items || [];
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            return [];
        }
    }

    formatPrice(price) {
        const symbol = CONFIG.pricing?.currencySymbol || '$';
        const locale = CONFIG.pricing?.currencyFormat?.locale || 'es-AR';
        const options = {
            minimumFractionDigits: CONFIG.pricing?.currencyFormat?.minimumFractionDigits || 0,
            maximumFractionDigits: CONFIG.pricing?.currencyFormat?.maximumFractionDigits || 2
        };

        const formatted = new Intl.NumberFormat(locale, options).format(price);
        return `${symbol}${formatted}`;
    }

    exportCartForQuotation() {
        return {
            items: this.selectedProducts.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.price,
                priceUnit: item.priceUnit,
                subtotal: item.price * item.quantity
            })),
            subtotal: this.getCartTotal(),
            itemCount: this.getCartCount()
        };
    }
}

// Suite de tests
class TestRunner {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
        console.log(`${prefix} ${message}`);
    }

    async test(name, fn) {
        try {
            this.log(`Starting: ${name}`, 'test');
            await fn();
            this.log(`✓ ${name}`, 'pass');
            this.results.passed++;
            this.results.tests.push({ name, passed: true });
        } catch (error) {
            this.log(`✗ ${name}: ${error.message}`, 'fail');
            this.results.failed++;
            this.results.tests.push({ name, passed: false, error: error.message });
        }
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message} - Expected: ${expected}, Got: ${actual}`);
        }
    }

    printResults() {
        console.log('\n' + '='.repeat(60));
        console.log('TEST RESULTS - CATALOG INTERACTIVE');
        console.log('='.repeat(60));
        
        this.results.tests.forEach((test, index) => {
            const status = test.passed ? '✓ PASS' : '✗ FAIL';
            console.log(`${index + 1}. ${status}: ${test.name}`);
            if (test.error) {
                console.log(`   Error: ${test.error}`);
            }
        });
        
        console.log('='.repeat(60));
        console.log(`Total: ${this.results.passed + this.results.failed}`);
        console.log(`Passed: ${this.results.passed}`);
        console.log(`Failed: ${this.results.failed}`);
        console.log('='.repeat(60));
        
        return this.results.failed === 0;
    }
}

// Ejecutar tests
async function runTests() {
    const runner = new TestRunner();

    runner.log('='.repeat(60), 'info');
    runner.log('CATALOG INTERACTIVE TESTING SUITE', 'info');
    runner.log('='.repeat(60), 'info');

    // Test 1: Cargar productos
    await runner.test('Load Hardcoded Products', async () => {
        const catalog = new CatalogManager();
        const products = await catalog.loadProducts();
        runner.assert(products.length > 0, 'Products should be loaded');
        runner.assert(Array.isArray(products), 'Products should be an array');
    });

    // Test 2: Obtener producto por ID
    await runner.test('Get Product By ID', async () => {
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        const product = catalog.getProductById('poste_hormigon_2_5');
        runner.assert(product !== undefined, 'Product should be found');
        runner.assertEquals(product.name, 'Poste de Hormigón 2.5m', 'Product name should match');
    });

    // Test 3: Agregar al carrito
    await runner.test('Add To Cart', async () => {
        localStorage.clear();
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        const success = catalog.addToCart('poste_hormigon_2_5', 2);
        runner.assert(success === true, 'addToCart should return true');
        runner.assertEquals(catalog.getCartCount(), 2, 'Cart count should be 2');
    });

    // Test 4: Actualizar cantidad
    await runner.test('Update Cart Quantity', async () => {
        localStorage.clear();
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        catalog.addToCart('poste_hormigon_2_5', 1);
        const success = catalog.updateCartQuantity('poste_hormigon_2_5', 5);
        runner.assert(success === true, 'updateCartQuantity should return true');
        runner.assertEquals(catalog.getCartCount(), 5, 'Cart count should be 5');
    });

    // Test 5: Eliminar del carrito
    await runner.test('Remove From Cart', async () => {
        localStorage.clear();
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        catalog.addToCart('poste_hormigon_2_5', 2);
        const success = catalog.removeFromCart('poste_hormigon_2_5');
        runner.assert(success === true, 'removeFromCart should return true');
        runner.assertEquals(catalog.getCartCount(), 0, 'Cart should be empty');
    });

    // Test 6: Persistencia en localStorage
    await runner.test('LocalStorage Persistence', async () => {
        localStorage.clear();
        const catalog1 = new CatalogManager();
        await catalog1.loadProducts();
        catalog1.addToCart('poste_hormigon_2_5', 3);
        catalog1.addToCart('poste_quebracho_2_5', 2);

        const catalog2 = new CatalogManager();
        const items = catalog2.getCartItems();
        runner.assertEquals(items.length, 2, 'Should have 2 items');
        runner.assertEquals(items[0].quantity, 3, 'First item quantity should be 3');
    });

    // Test 7: Cálculo de total
    await runner.test('Cart Total Calculation', async () => {
        localStorage.clear();
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        catalog.addToCart('poste_hormigon_2_5', 2);
        catalog.addToCart('poste_quebracho_2_5', 1);
        const expected = (3500 * 2) + (4200 * 1);
        runner.assertEquals(catalog.getCartTotal(), expected, 'Cart total should match');
    });

    // Test 8: Búsqueda de productos
    await runner.test('Search Products', async () => {
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        const results = catalog.searchProducts('Hormigón');
        runner.assert(results.length > 0, 'Should find products matching "Hormigón"');
    });

    // Test 9: Obtener por categoría
    await runner.test('Get Products By Category', async () => {
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        const postes = catalog.getProductsByCategory('postes');
        runner.assert(postes.length > 0, 'Should find postes');
        runner.assert(postes.every(p => p.category === 'postes'), 'All should be postes');
    });

    // Test 10: Exportar para cotización
    await runner.test('Export Cart For Quotation', async () => {
        localStorage.clear();
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        catalog.addToCart('poste_hormigon_2_5', 2);
        const exported = catalog.exportCartForQuotation();
        runner.assert(exported.items.length > 0, 'Should have items');
        runner.assertEquals(exported.itemCount, 2, 'Item count should be 2');
    });

    // Test 11: Limpiar carrito
    await runner.test('Clear Cart', async () => {
        localStorage.clear();
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        catalog.addToCart('poste_hormigon_2_5', 5);
        catalog.clearCart();
        runner.assertEquals(catalog.getCartCount(), 0, 'Cart should be empty');
    });

    // Test 12: Incrementar cantidad existente
    await runner.test('Increment Existing Cart Item', async () => {
        localStorage.clear();
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        catalog.addToCart('poste_hormigon_2_5', 2);
        catalog.addToCart('poste_hormigon_2_5', 3);
        const items = catalog.getCartItems();
        runner.assertEquals(items.length, 1, 'Should have 1 unique item');
        runner.assertEquals(items[0].quantity, 5, 'Quantity should be 5');
    });

    // Test 13: Producto no encontrado
    await runner.test('Product Not Found', async () => {
        const catalog = new CatalogManager();
        await catalog.loadProducts();
        const notFound = catalog.getProductById('nonexistent');
        runner.assert(notFound === undefined, 'Should return undefined');
        const success = catalog.addToCart('nonexistent', 1);
        runner.assert(success === false, 'addToCart should return false');
    });

    // Test 14: Formato de precio
    await runner.test('Price Formatting', async () => {
        const catalog = new CatalogManager();
        const formatted = catalog.formatPrice(3500);
        runner.assert(typeof formatted === 'string', 'Should be a string');
        runner.assert(formatted.length > 0, 'Should not be empty');
    });

    const success = runner.printResults();
    process.exit(success ? 0 : 1);
}

// Ejecutar
runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
