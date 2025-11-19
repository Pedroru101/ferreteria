/**
 * Tests para el módulo de catálogo interactivo
 * Valida: apertura de modal, agregar a carrito, contador, persistencia, carga de datos
 * Requirements: 3.4, 3.10, 3.11, 3.1, 3.2
 */

// Configuración de test
const TEST_CONFIG = {
    timeout: 5000,
    verbose: true
};

// Utilidades de test
const TestUtils = {
    log: (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
        console.log(`${prefix} ${message}`);
    },

    assert: (condition, message) => {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    },

    assertEquals: (actual, expected, message) => {
        if (actual !== expected) {
            throw new Error(`${message} - Expected: ${expected}, Got: ${actual}`);
        }
    },

    assertExists: (element, selector) => {
        if (!element) {
            throw new Error(`Element not found: ${selector}`);
        }
    },

    clearStorage: () => {
        localStorage.clear();
        sessionStorage.clear();
    },

    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};

// Suite de tests
const CatalogTestSuite = {
    results: {
        passed: 0,
        failed: 0,
        tests: []
    },

    /**
     * Test 1: Carga de productos desde datos hardcodeados
     * Validates: Requirements 3.1, 3.2
     */
    async testLoadHardcodedProducts() {
        const testName = 'Load Hardcoded Products';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            // Crear nueva instancia de CatalogManager
            const catalog = new CatalogManager();
            
            // Cargar productos
            const products = await catalog.loadProducts();
            
            // Validaciones
            TestUtils.assert(products.length > 0, 'Products should be loaded');
            TestUtils.assert(Array.isArray(products), 'Products should be an array');
            
            // Verificar estructura de producto
            const firstProduct = products[0];
            TestUtils.assertExists(firstProduct.id, 'product.id');
            TestUtils.assertExists(firstProduct.name, 'product.name');
            TestUtils.assertExists(firstProduct.category, 'product.category');
            TestUtils.assert(typeof firstProduct.price === 'number', 'Product price should be a number');
            
            TestUtils.log(`✓ Loaded ${products.length} products`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 2: Búsqueda de producto por ID
     * Validates: Requirements 3.4
     */
    async testGetProductById() {
        const testName = 'Get Product By ID';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            // Obtener primer producto
            const firstProduct = catalog.products[0];
            const foundProduct = catalog.getProductById(firstProduct.id);
            
            TestUtils.assertExists(foundProduct, `product with id ${firstProduct.id}`);
            TestUtils.assertEquals(foundProduct.id, firstProduct.id, 'Product ID should match');
            TestUtils.assertEquals(foundProduct.name, firstProduct.name, 'Product name should match');
            
            TestUtils.log(`✓ Found product: ${foundProduct.name}`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 3: Agregar producto al carrito
     * Validates: Requirements 3.10, 3.11
     */
    async testAddToCart() {
        const testName = 'Add Product To Cart';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            TestUtils.clearStorage();
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            const firstProduct = catalog.products[0];
            const initialCount = catalog.getCartCount();
            
            // Agregar producto
            const success = catalog.addToCart(firstProduct.id, 2);
            
            TestUtils.assert(success === true, 'addToCart should return true');
            TestUtils.assertEquals(catalog.getCartCount(), initialCount + 2, 'Cart count should increase by 2');
            
            const cartItems = catalog.getCartItems();
            TestUtils.assert(cartItems.length > 0, 'Cart should have items');
            TestUtils.assertEquals(cartItems[0].id, firstProduct.id, 'Cart item ID should match');
            TestUtils.assertEquals(cartItems[0].quantity, 2, 'Cart item quantity should be 2');
            
            TestUtils.log(`✓ Added ${firstProduct.name} to cart (qty: 2)`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 4: Actualizar cantidad en carrito
     * Validates: Requirements 3.10, 3.11
     */
    async testUpdateCartQuantity() {
        const testName = 'Update Cart Quantity';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            TestUtils.clearStorage();
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            const firstProduct = catalog.products[0];
            catalog.addToCart(firstProduct.id, 1);
            
            // Actualizar cantidad
            const success = catalog.updateCartQuantity(firstProduct.id, 5);
            
            TestUtils.assert(success === true, 'updateCartQuantity should return true');
            TestUtils.assertEquals(catalog.getCartCount(), 5, 'Cart count should be 5');
            
            const cartItems = catalog.getCartItems();
            TestUtils.assertEquals(cartItems[0].quantity, 5, 'Item quantity should be 5');
            
            TestUtils.log(`✓ Updated quantity to 5`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 5: Eliminar producto del carrito
     * Validates: Requirements 3.10, 3.11
     */
    async testRemoveFromCart() {
        const testName = 'Remove From Cart';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            TestUtils.clearStorage();
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            const firstProduct = catalog.products[0];
            catalog.addToCart(firstProduct.id, 2);
            
            const countBefore = catalog.getCartCount();
            const success = catalog.removeFromCart(firstProduct.id);
            
            TestUtils.assert(success === true, 'removeFromCart should return true');
            TestUtils.assertEquals(catalog.getCartCount(), 0, 'Cart should be empty');
            TestUtils.assertEquals(catalog.getCartItems().length, 0, 'Cart items should be empty');
            
            TestUtils.log(`✓ Removed product from cart`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 6: Persistencia en localStorage
     * Validates: Requirements 3.10, 3.11
     */
    async testLocalStoragePersistence() {
        const testName = 'LocalStorage Persistence';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            TestUtils.clearStorage();
            
            // Primera instancia: agregar productos
            const catalog1 = new CatalogManager();
            await catalog1.loadProducts();
            
            const firstProduct = catalog1.products[0];
            const secondProduct = catalog1.products[1];
            
            catalog1.addToCart(firstProduct.id, 3);
            catalog1.addToCart(secondProduct.id, 2);
            
            const cartDataBefore = catalog1.getCartItems();
            TestUtils.assertEquals(cartDataBefore.length, 2, 'Should have 2 items before');
            
            // Segunda instancia: verificar que se cargó desde localStorage
            const catalog2 = new CatalogManager();
            const cartDataAfter = catalog2.getCartItems();
            
            TestUtils.assertEquals(cartDataAfter.length, 2, 'Should have 2 items after reload');
            TestUtils.assertEquals(cartDataAfter[0].quantity, 3, 'First item quantity should be 3');
            TestUtils.assertEquals(cartDataAfter[1].quantity, 2, 'Second item quantity should be 2');
            
            TestUtils.log(`✓ Cart persisted correctly in localStorage`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 7: Cálculo de total del carrito
     * Validates: Requirements 3.10, 3.11
     */
    async testCartTotal() {
        const testName = 'Cart Total Calculation';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            TestUtils.clearStorage();
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            const firstProduct = catalog.products[0];
            const secondProduct = catalog.products[1];
            
            catalog.addToCart(firstProduct.id, 2);
            catalog.addToCart(secondProduct.id, 3);
            
            const expectedTotal = (firstProduct.price * 2) + (secondProduct.price * 3);
            const actualTotal = catalog.getCartTotal();
            
            TestUtils.assertEquals(actualTotal, expectedTotal, 'Cart total should match calculation');
            
            TestUtils.log(`✓ Cart total: ${actualTotal}`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 8: Búsqueda de productos
     * Validates: Requirements 3.1, 3.2
     */
    async testSearchProducts() {
        const testName = 'Search Products';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            // Buscar por nombre
            const results = catalog.searchProducts('hormigon');
            
            TestUtils.assert(results.length > 0, 'Should find products matching "hormigon"');
            TestUtils.assert(results.every(p => 
                p.name.toLowerCase().includes('hormigon') || 
                p.description.toLowerCase().includes('hormigon')
            ), 'All results should match search query');
            
            TestUtils.log(`✓ Found ${results.length} products matching "hormigon"`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 9: Obtener productos por categoría
     * Validates: Requirements 3.1, 3.2
     */
    async testGetProductsByCategory() {
        const testName = 'Get Products By Category';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            const postes = catalog.getProductsByCategory('postes');
            
            TestUtils.assert(postes.length > 0, 'Should find products in postes category');
            TestUtils.assert(postes.every(p => p.category === 'postes'), 'All results should be in postes category');
            
            TestUtils.log(`✓ Found ${postes.length} products in postes category`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 10: Exportar carrito para cotización
     * Validates: Requirements 3.10, 3.11
     */
    async testExportCartForQuotation() {
        const testName = 'Export Cart For Quotation';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            TestUtils.clearStorage();
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            const firstProduct = catalog.products[0];
            catalog.addToCart(firstProduct.id, 2);
            
            const exported = catalog.exportCartForQuotation();
            
            TestUtils.assert(exported.items.length > 0, 'Exported data should have items');
            TestUtils.assertEquals(exported.itemCount, 2, 'Item count should be 2');
            TestUtils.assert(exported.subtotal > 0, 'Subtotal should be greater than 0');
            TestUtils.assertEquals(exported.items[0].quantity, 2, 'Item quantity should be 2');
            
            TestUtils.log(`✓ Exported cart with ${exported.itemCount} items`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 11: Limpiar carrito
     * Validates: Requirements 3.10, 3.11
     */
    async testClearCart() {
        const testName = 'Clear Cart';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            TestUtils.clearStorage();
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            const firstProduct = catalog.products[0];
            catalog.addToCart(firstProduct.id, 5);
            
            TestUtils.assert(catalog.getCartCount() > 0, 'Cart should have items');
            
            catalog.clearCart();
            
            TestUtils.assertEquals(catalog.getCartCount(), 0, 'Cart should be empty after clear');
            TestUtils.assertEquals(catalog.getCartItems().length, 0, 'Cart items should be empty');
            
            TestUtils.log(`✓ Cart cleared successfully`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 12: Incrementar cantidad existente en carrito
     * Validates: Requirements 3.10, 3.11
     */
    async testIncrementExistingCartItem() {
        const testName = 'Increment Existing Cart Item';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            TestUtils.clearStorage();
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            const firstProduct = catalog.products[0];
            
            // Agregar producto dos veces
            catalog.addToCart(firstProduct.id, 2);
            catalog.addToCart(firstProduct.id, 3);
            
            const cartItems = catalog.getCartItems();
            TestUtils.assertEquals(cartItems.length, 1, 'Should have only 1 unique item');
            TestUtils.assertEquals(cartItems[0].quantity, 5, 'Quantity should be 5 (2+3)');
            
            TestUtils.log(`✓ Quantities incremented correctly`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 13: Validación de producto no encontrado
     * Validates: Requirements 3.4
     */
    async testProductNotFound() {
        const testName = 'Product Not Found';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            const catalog = new CatalogManager();
            await catalog.loadProducts();
            
            const notFound = catalog.getProductById('nonexistent_id');
            
            TestUtils.assert(notFound === undefined, 'Should return undefined for nonexistent product');
            
            const success = catalog.addToCart('nonexistent_id', 1);
            TestUtils.assert(success === false, 'addToCart should return false for nonexistent product');
            
            TestUtils.log(`✓ Correctly handled nonexistent product`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Test 14: Formato de precio
     * Validates: Requirements 3.4
     */
    async testPriceFormatting() {
        const testName = 'Price Formatting';
        try {
            TestUtils.log(`Starting: ${testName}`, 'test');
            
            const catalog = new CatalogManager();
            
            const formatted = catalog.formatPrice(3500);
            
            TestUtils.assert(typeof formatted === 'string', 'Formatted price should be a string');
            TestUtils.assert(formatted.length > 0, 'Formatted price should not be empty');
            
            TestUtils.log(`✓ Price formatted: ${formatted}`, 'pass');
            this.recordResult(testName, true);
        } catch (error) {
            TestUtils.log(`✗ ${error.message}`, 'fail');
            this.recordResult(testName, false, error.message);
        }
    },

    /**
     * Registra resultado de test
     */
    recordResult(testName, passed, error = null) {
        if (passed) {
            this.results.passed++;
        } else {
            this.results.failed++;
        }
        
        this.results.tests.push({
            name: testName,
            passed: passed,
            error: error
        });
    },

    /**
     * Ejecuta todos los tests
     */
    async runAll() {
        TestUtils.log('='.repeat(60), 'info');
        TestUtils.log('CATALOG INTERACTIVE TESTING SUITE', 'info');
        TestUtils.log('='.repeat(60), 'info');
        
        const tests = [
            this.testLoadHardcodedProducts.bind(this),
            this.testGetProductById.bind(this),
            this.testAddToCart.bind(this),
            this.testUpdateCartQuantity.bind(this),
            this.testRemoveFromCart.bind(this),
            this.testLocalStoragePersistence.bind(this),
            this.testCartTotal.bind(this),
            this.testSearchProducts.bind(this),
            this.testGetProductsByCategory.bind(this),
            this.testExportCartForQuotation.bind(this),
            this.testClearCart.bind(this),
            this.testIncrementExistingCartItem.bind(this),
            this.testProductNotFound.bind(this),
            this.testPriceFormatting.bind(this)
        ];
        
        for (const test of tests) {
            await test();
            await TestUtils.sleep(100);
        }
        
        this.printResults();
    },

    /**
     * Imprime resultados de los tests
     */
    printResults() {
        TestUtils.log('='.repeat(60), 'info');
        TestUtils.log('TEST RESULTS', 'info');
        TestUtils.log('='.repeat(60), 'info');
        
        this.results.tests.forEach((test, index) => {
            const status = test.passed ? '✓ PASS' : '✗ FAIL';
            TestUtils.log(`${index + 1}. ${status}: ${test.name}`, test.passed ? 'pass' : 'fail');
            if (test.error) {
                TestUtils.log(`   Error: ${test.error}`, 'fail');
            }
        });
        
        TestUtils.log('='.repeat(60), 'info');
        TestUtils.log(`Total: ${this.results.passed + this.results.failed} tests`, 'info');
        TestUtils.log(`Passed: ${this.results.passed}`, 'pass');
        TestUtils.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'fail' : 'pass');
        TestUtils.log('='.repeat(60), 'info');
        
        return {
            total: this.results.passed + this.results.failed,
            passed: this.results.passed,
            failed: this.results.failed,
            success: this.results.failed === 0
        };
    }
};

// Ejecutar tests si se llama directamente
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CatalogTestSuite;
}

if (typeof window !== 'undefined') {
    window.CatalogTestSuite = CatalogTestSuite;
}
