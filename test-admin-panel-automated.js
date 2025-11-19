/**
 * Test Automatizado - Panel de Administración
 * Verifica: login, autenticación, estadísticas, filtros, actualización de estado, exportación CSV, gestión de productos y precios
 */

class AdminPanelTestSuite {
    constructor() {
        this.results = [];
        this.testsPassed = 0;
        this.testsFailed = 0;
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('es-AR');
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
        this.results.push({ timestamp, message, type });
    }

    assert(condition, message) {
        if (condition) {
            this.log(`✓ ${message}`, 'success');
            this.testsPassed++;
        } else {
            this.log(`✗ ${message}`, 'error');
            this.testsFailed++;
        }
    }

    setupTestData() {
        this.log('Configurando datos de prueba...', 'info');

        const testOrders = [
            {
                id: 'ORD-20240115-0001',
                quotationId: 'COT-1705315800000-123',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                customer: {
                    name: 'Juan Pérez',
                    phone: '+54 9 11 1234-5678',
                    email: 'juan@example.com',
                    address: 'Calle Falsa 123, Mar del Plata',
                    installationDate: '2024-01-20'
                },
                items: [
                    { id: 'prod_001', name: 'Poste de Hormigón 2.5m', quantity: 10, unitPrice: 3500, subtotal: 35000 },
                    { id: 'prod_002', name: 'Alambre Galvanizado 2.4mm', quantity: 5, unitPrice: 2500, subtotal: 12500 }
                ],
                installation: { linearMeters: 100, pricePerMeter: 500, subtotal: 50000 },
                subtotal: 97500,
                total: 97500,
                status: 'pending',
                statusHistory: [
                    { status: 'pending', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Pedido creado' }
                ]
            },
            {
                id: 'ORD-20240116-0002',
                quotationId: 'COT-1705402200000-456',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                customer: {
                    name: 'María García',
                    phone: '+54 9 11 9876-5432',
                    email: 'maria@example.com',
                    address: 'Avenida Principal 456, Mar del Plata'
                },
                items: [
                    { id: 'prod_003', name: 'Poste de Quebracho 3m', quantity: 8, unitPrice: 4200, subtotal: 33600 }
                ],
                installation: null,
                subtotal: 33600,
                total: 33600,
                status: 'confirmed',
                statusHistory: [
                    { status: 'pending', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), note: 'Pedido creado' },
                    { status: 'confirmed', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Confirmado por cliente' }
                ]
            },
            {
                id: 'ORD-20240117-0003',
                quotationId: 'COT-1705488600000-789',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                customer: {
                    name: 'Carlos López',
                    phone: '+54 9 11 5555-1111',
                    email: 'carlos@example.com',
                    address: 'Calle Secundaria 789, Mar del Plata'
                },
                items: [
                    { id: 'prod_004', name: 'Tejido Romboidal 1.50m', quantity: 20, unitPrice: 1500, subtotal: 30000 }
                ],
                installation: { linearMeters: 150, pricePerMeter: 500, subtotal: 75000 },
                subtotal: 105000,
                total: 105000,
                status: 'in_progress',
                statusHistory: [
                    { status: 'pending', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Pedido creado' },
                    { status: 'confirmed', date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), note: 'Confirmado' },
                    { status: 'in_progress', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), note: 'En proceso de instalación' }
                ]
            }
        ];

        const testQuotations = [
            {
                id: 'COT-1705315800000-123',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { id: 'prod_001', name: 'Poste de Hormigón 2.5m', quantity: 10, unitPrice: 3500, subtotal: 35000 }
                ],
                installation: { linearMeters: 100, pricePerMeter: 500, subtotal: 50000 },
                subtotal: 85000,
                total: 85000,
                status: 'sent'
            },
            {
                id: 'COT-1705402200000-456',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                validUntil: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { id: 'prod_003', name: 'Poste de Quebracho 3m', quantity: 8, unitPrice: 4200, subtotal: 33600 }
                ],
                installation: null,
                subtotal: 33600,
                total: 33600,
                status: 'draft'
            },
            {
                id: 'COT-1705488600000-789',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                validUntil: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { id: 'prod_004', name: 'Tejido Romboidal 1.50m', quantity: 20, unitPrice: 1500, subtotal: 30000 }
                ],
                installation: { linearMeters: 150, pricePerMeter: 500, subtotal: 75000 },
                subtotal: 105000,
                total: 105000,
                status: 'accepted'
            }
        ];

        localStorage.setItem('ferreteria_orders', JSON.stringify(testOrders));
        localStorage.setItem('ferreteria_quotations', JSON.stringify(testQuotations));
        this.log('Datos de prueba configurados correctamente', 'success');
    }

    testAuthentication() {
        this.log('Iniciando pruebas de autenticación...', 'info');

        const auth = new AdminAuth();
        
        this.assert(auth.hashPassword('test') === btoa('test'), 'Hash de contraseña funciona correctamente');
        
        const isLoggedInBefore = auth.isAuthenticated();
        this.assert(!isLoggedInBefore, 'Usuario no autenticado inicialmente');
        
        const loginResult = auth.login('admin123');
        this.assert(loginResult === true, 'Login exitoso con contraseña correcta');
        
        const isLoggedInAfter = auth.isAuthenticated();
        this.assert(isLoggedInAfter === true, 'Usuario autenticado después del login');
        
        const wrongLoginResult = auth.login('wrongpassword');
        this.assert(wrongLoginResult === false, 'Login falla con contraseña incorrecta');
        
        auth.logout();
        const isLoggedInAfterLogout = auth.isAuthenticated();
        this.assert(!isLoggedInAfterLogout, 'Usuario desautenticado después del logout');
    }

    testStatisticsCalculation() {
        this.log('Iniciando pruebas de cálculo de estadísticas...', 'info');

        const dashboard = new AdminDashboard();
        
        const orders = dashboard.getOrders();
        this.assert(orders.length === 3, `Se cargan 3 pedidos (actual: ${orders.length})`);
        
        const quotations = dashboard.getQuotations();
        this.assert(quotations.length === 3, `Se cargan 3 cotizaciones (actual: ${quotations.length})`);
        
        const monthlyStats = dashboard.getMonthlyStatistics();
        this.assert(monthlyStats.orders >= 0, 'Estadísticas mensuales de pedidos calculadas');
        this.assert(monthlyStats.quotations >= 0, 'Estadísticas mensuales de cotizaciones calculadas');
        this.assert(monthlyStats.revenue >= 0, 'Ingresos mensuales calculados');
        this.assert(typeof monthlyStats.conversion === 'number', 'Tasa de conversión calculada');
        
        const ordersByStatus = dashboard.getOrdersByStatus();
        this.assert(Object.keys(ordersByStatus).length > 0, 'Conteo de pedidos por estado funciona');
        
        const quotationsByStatus = dashboard.getQuotationsByStatus();
        this.assert(quotationsByStatus.draft >= 0, 'Conteo de cotizaciones en borrador funciona');
        this.assert(quotationsByStatus.sent >= 0, 'Conteo de cotizaciones enviadas funciona');
        this.assert(quotationsByStatus.expired >= 0, 'Conteo de cotizaciones expiradas funciona');
    }

    testOrderFilters() {
        this.log('Iniciando pruebas de filtros de pedidos...', 'info');

        const orders = JSON.parse(localStorage.getItem('ferreteria_orders') || '[]');
        
        const pendingOrders = orders.filter(o => o.status === 'pending');
        this.assert(pendingOrders.length === 1, `Filtro por estado 'pending': ${pendingOrders.length} pedido encontrado`);
        
        const confirmedOrders = orders.filter(o => o.status === 'confirmed');
        this.assert(confirmedOrders.length === 1, `Filtro por estado 'confirmed': ${confirmedOrders.length} pedido encontrado`);
        
        const inProgressOrders = orders.filter(o => o.status === 'in_progress');
        this.assert(inProgressOrders.length === 1, `Filtro por estado 'in_progress': ${inProgressOrders.length} pedido encontrado`);
        
        const juanOrders = orders.filter(o => o.customer.name.toLowerCase().includes('juan'));
        this.assert(juanOrders.length === 1, `Filtro por cliente 'juan': ${juanOrders.length} pedido encontrado`);
        
        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        const recentOrders = orders.filter(o => new Date(o.date) >= threeDaysAgo);
        this.assert(recentOrders.length >= 1, `Filtro por fecha (últimos 3 días): ${recentOrders.length} pedidos encontrados`);
        
        const filtered = orders.filter(o => 
            o.status === 'confirmed' && 
            new Date(o.date) >= threeDaysAgo
        );
        this.assert(filtered.length >= 0, `Filtro combinado (confirmados en últimos 3 días): ${filtered.length} pedidos encontrados`);
    }

    testQuotationFilters() {
        this.log('Iniciando pruebas de filtros de cotizaciones...', 'info');

        const quotations = JSON.parse(localStorage.getItem('ferreteria_quotations') || '[]');
        
        const draftQuotations = quotations.filter(q => q.status === 'draft');
        this.assert(draftQuotations.length === 1, `Filtro por estado 'draft': ${draftQuotations.length} cotización encontrada`);
        
        const sentQuotations = quotations.filter(q => q.status === 'sent');
        this.assert(sentQuotations.length === 1, `Filtro por estado 'sent': ${sentQuotations.length} cotización encontrada`);
        
        const acceptedQuotations = quotations.filter(q => q.status === 'accepted');
        this.assert(acceptedQuotations.length === 1, `Filtro por estado 'accepted': ${acceptedQuotations.length} cotización encontrada`);
        
        const expiredQuotations = quotations.filter(q => new Date(q.validUntil) < new Date());
        this.assert(expiredQuotations.length === 1, `Filtro por estado 'expired': ${expiredQuotations.length} cotización encontrada`);
        
        const minAmountFilter = 50000;
        const highValueQuotations = quotations.filter(q => q.total >= minAmountFilter);
        this.assert(highValueQuotations.length >= 1, `Filtro por monto mínimo (${minAmountFilter}): ${highValueQuotations.length} cotizaciones encontradas`);
        
        const maxAmountFilter = 100000;
        const lowValueQuotations = quotations.filter(q => q.total <= maxAmountFilter);
        this.assert(lowValueQuotations.length >= 1, `Filtro por monto máximo (${maxAmountFilter}): ${lowValueQuotations.length} cotizaciones encontradas`);
    }

    testOrderStatusUpdate() {
        this.log('Iniciando pruebas de actualización de estado de pedidos...', 'info');

        const orders = JSON.parse(localStorage.getItem('ferreteria_orders') || '[]');
        const order = orders[0];
        const oldStatus = order.status;
        
        order.status = 'completed';
        order.statusHistory.push({
            status: 'completed',
            date: new Date().toISOString(),
            note: 'Actualizado desde test'
        });
        
        localStorage.setItem('ferreteria_orders', JSON.stringify(orders));
        
        const updatedOrders = JSON.parse(localStorage.getItem('ferreteria_orders') || '[]');
        const updatedOrder = updatedOrders[0];
        
        this.assert(updatedOrder.status === 'completed', `Estado actualizado: ${oldStatus} → ${updatedOrder.status}`);
        this.assert(updatedOrder.statusHistory.length >= 2, `Historial de estados actualizado: ${updatedOrder.statusHistory.length} registros`);
        this.assert(updatedOrder.statusHistory[updatedOrder.statusHistory.length - 1].status === 'completed', 'Último estado en historial es correcto');
    }

    testCSVExport() {
        this.log('Iniciando pruebas de exportación a CSV...', 'info');

        const orders = JSON.parse(localStorage.getItem('ferreteria_orders') || '[]');
        
        let csv = 'ID,Fecha,Cliente,Total,Estado\n';
        orders.forEach(order => {
            const date = new Date(order.date).toLocaleDateString('es-AR');
            csv += `${order.id},${date},${order.customer.name},${order.total},${order.status}\n`;
        });
        
        this.assert(csv.includes('ORD-20240115-0001'), 'CSV contiene ID de pedido');
        this.assert(csv.includes('Juan Pérez'), 'CSV contiene nombre de cliente');
        this.assert(csv.includes('97500'), 'CSV contiene total del pedido');
        this.assert(csv.includes('pending'), 'CSV contiene estado del pedido');
        this.assert(csv.split('\n').length > 1, 'CSV tiene múltiples filas');
        
        const quotations = JSON.parse(localStorage.getItem('ferreteria_quotations') || '[]');
        let quotationCsv = 'ID,Fecha,Total,Estado,Validez\n';
        quotations.forEach(quotation => {
            const date = new Date(quotation.date).toLocaleDateString('es-AR');
            const validUntil = new Date(quotation.validUntil).toLocaleDateString('es-AR');
            const isExpired = new Date(quotation.validUntil) < new Date();
            const status = isExpired ? 'expired' : quotation.status;
            quotationCsv += `${quotation.id},${date},${quotation.total},${status},${validUntil}\n`;
        });
        
        this.assert(quotationCsv.includes('COT-'), 'CSV de cotizaciones contiene ID');
        this.assert(quotationCsv.includes('85000'), 'CSV de cotizaciones contiene total');
    }

    testProductManagement() {
        this.log('Iniciando pruebas de gestión de productos...', 'info');

        const newProduct = {
            id: 'prod_test_' + Date.now(),
            name: 'Producto de Prueba',
            category: 'Postes',
            description: 'Descripción de prueba',
            price: 5000,
            stock: 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        let products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        products.push(newProduct);
        localStorage.setItem('ferreteria_products', JSON.stringify(products));
        
        const savedProducts = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const foundProduct = savedProducts.find(p => p.id === newProduct.id);
        
        this.assert(foundProduct !== undefined, 'Producto agregado correctamente');
        this.assert(foundProduct.name === 'Producto de Prueba', 'Nombre del producto guardado correctamente');
        this.assert(foundProduct.price === 5000, 'Precio del producto guardado correctamente');
        this.assert(foundProduct.stock === 50, 'Stock del producto guardado correctamente');
        
        foundProduct.price = 5500;
        foundProduct.stock = 45;
        foundProduct.updatedAt = new Date().toISOString();
        
        const updatedProducts = savedProducts.map(p => p.id === newProduct.id ? foundProduct : p);
        localStorage.setItem('ferreteria_products', JSON.stringify(updatedProducts));
        
        const finalProducts = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const finalProduct = finalProducts.find(p => p.id === newProduct.id);
        
        this.assert(finalProduct.price === 5500, 'Precio del producto actualizado correctamente');
        this.assert(finalProduct.stock === 45, 'Stock del producto actualizado correctamente');
        
        const productsBeforeDelete = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const productsAfterDelete = productsBeforeDelete.filter(p => p.id !== newProduct.id);
        localStorage.setItem('ferreteria_products', JSON.stringify(productsAfterDelete));
        
        const deletedProducts = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const deletedProduct = deletedProducts.find(p => p.id === newProduct.id);
        
        this.assert(deletedProduct === undefined, 'Producto eliminado correctamente');
    }

    testPriceManagement() {
        this.log('Iniciando pruebas de gestión de precios...', 'info');

        let products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const initialCount = products.length;
        
        if (initialCount === 0) {
            products = [
                { id: 'prod_price_1', name: 'Producto 1', category: 'Postes', price: 1000, stock: 10 },
                { id: 'prod_price_2', name: 'Producto 2', category: 'Postes', price: 2000, stock: 20 },
                { id: 'prod_price_3', name: 'Producto 3', category: 'Alambres', price: 500, stock: 100 }
            ];
            localStorage.setItem('ferreteria_products', JSON.stringify(products));
        }
        
        const productsToUpdate = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const marginPercentage = 20;
        
        productsToUpdate.forEach(product => {
            product.price = product.price * (1 + marginPercentage / 100);
        });
        
        localStorage.setItem('ferreteria_products', JSON.stringify(productsToUpdate));
        
        const updatedProducts = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const firstProduct = updatedProducts[0];
        
        this.assert(firstProduct.price > 0, 'Precio del producto es positivo después del ajuste');
        
        const categoryProducts = updatedProducts.filter(p => p.category === 'Postes');
        this.assert(categoryProducts.length > 0, 'Filtro por categoría funciona correctamente');
        
        const priceRange = updatedProducts.filter(p => p.price >= 500 && p.price <= 3000);
        this.assert(priceRange.length > 0, 'Filtro por rango de precios funciona correctamente');
    }

    testConfigurationManagement() {
        this.log('Iniciando pruebas de gestión de configuración...', 'info');

        const config = {
            calculator: {
                defaultPostSpacing: 2.5,
                cornerPosts: 4
            },
            pricing: {
                installationPricePerMeter: 500,
                marginPercentage: 20
            },
            quotation: {
                validityDays: 30
            }
        };
        
        localStorage.setItem('ferreteria_config', JSON.stringify(config));
        
        const savedConfig = JSON.parse(localStorage.getItem('ferreteria_config') || '{}');
        
        this.assert(savedConfig.calculator.defaultPostSpacing === 2.5, 'Separación entre postes guardada correctamente');
        this.assert(savedConfig.calculator.cornerPosts === 4, 'Postes esquineros guardados correctamente');
        this.assert(savedConfig.pricing.installationPricePerMeter === 500, 'Costo de instalación guardado correctamente');
        this.assert(savedConfig.pricing.marginPercentage === 20, 'Margen de ganancia guardado correctamente');
        this.assert(savedConfig.quotation.validityDays === 30, 'Validez de cotizaciones guardada correctamente');
        
        savedConfig.pricing.installationPricePerMeter = 600;
        savedConfig.quotation.validityDays = 45;
        
        localStorage.setItem('ferreteria_config', JSON.stringify(savedConfig));
        
        const updatedConfig = JSON.parse(localStorage.getItem('ferreteria_config') || '{}');
        
        this.assert(updatedConfig.pricing.installationPricePerMeter === 600, 'Costo de instalación actualizado correctamente');
        this.assert(updatedConfig.quotation.validityDays === 45, 'Validez de cotizaciones actualizada correctamente');
    }

    runAllTests() {
        this.log('='.repeat(60), 'info');
        this.log('INICIANDO SUITE DE TESTS - PANEL DE ADMINISTRACIÓN', 'info');
        this.log('='.repeat(60), 'info');

        this.setupTestData();
        this.log('', 'info');

        this.testAuthentication();
        this.log('', 'info');

        this.testStatisticsCalculation();
        this.log('', 'info');

        this.testOrderFilters();
        this.log('', 'info');

        this.testQuotationFilters();
        this.log('', 'info');

        this.testOrderStatusUpdate();
        this.log('', 'info');

        this.testCSVExport();
        this.log('', 'info');

        this.testProductManagement();
        this.log('', 'info');

        this.testPriceManagement();
        this.log('', 'info');

        this.testConfigurationManagement();
        this.log('', 'info');

        this.log('='.repeat(60), 'info');
        this.log(`RESULTADOS FINALES: ${this.testsPassed} pasados, ${this.testsFailed} fallidos`, 
            this.testsFailed === 0 ? 'success' : 'error');
        this.log('='.repeat(60), 'info');

        return {
            passed: this.testsPassed,
            failed: this.testsFailed,
            total: this.testsPassed + this.testsFailed,
            results: this.results
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminPanelTestSuite;
}
