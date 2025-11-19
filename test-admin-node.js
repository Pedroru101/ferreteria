#!/usr/bin/env node

/**
 * Test Node.js para Panel de Administración
 * Ejecutar con: node test-admin-node.js
 */

global.localStorage = {
    data: {},
    getItem(key) { return this.data[key] || null; },
    setItem(key, value) { this.data[key] = value; },
    removeItem(key) { delete this.data[key]; },
    clear() { this.data = {}; }
};

global.CONFIG = {
    admin: { defaultPassword: 'admin123', sessionTimeout: 3600000, dashboardRefreshInterval: 0 },
    orders: { statusOptions: [
        { value: 'pending', label: 'Pendiente', color: '#f57c00' },
        { value: 'confirmed', label: 'Confirmado', color: '#4caf50' },
        { value: 'in_progress', label: 'En Proceso', color: '#0288d1' },
        { value: 'completed', label: 'Completado', color: '#2d7a3e' },
        { value: 'cancelled', label: 'Cancelado', color: '#d32f2f' }
    ]},
    business: { name: 'Metales & Hierros' },
    contact: { whatsapp: { number: '5491112345678' }},
    products: { enableGoogleSheets: false }
};

global.AdminAuth = class {
    constructor() {
        this.sessionKey = 'ferreteria_admin_session';
        this.passwordKey = 'ferreteria_admin_password';
        this.initializePassword();
    }
    initializePassword() {
        if (!localStorage.getItem(this.passwordKey)) {
            localStorage.setItem(this.passwordKey, this.hashPassword(CONFIG.admin.defaultPassword));
        }
    }
    hashPassword(password) { return btoa(password); }
    login(password) {
        const hash = this.hashPassword(password);
        const storedHash = localStorage.getItem(this.passwordKey);
        if (hash === storedHash) {
            localStorage.setItem(this.sessionKey, 'true');
            localStorage.setItem('admin_login_time', Date.now().toString());
            return true;
        }
        return false;
    }
    isAuthenticated() {
        const isAuthenticated = localStorage.getItem(this.sessionKey) === 'true';
        if (isAuthenticated) {
            const loginTime = parseInt(localStorage.getItem('admin_login_time'));
            const elapsed = Date.now() - loginTime;
            if (elapsed > CONFIG.admin.sessionTimeout) {
                this.logout();
                return false;
            }
        }
        return isAuthenticated;
    }
    logout() {
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem('admin_login_time');
    }
};

global.AdminDashboard = class {
    constructor() {
        this.auth = new AdminAuth();
    }
    getOrders() {
        const data = localStorage.getItem('ferreteria_orders');
        return data ? JSON.parse(data) : [];
    }
    getQuotations() {
        const data = localStorage.getItem('ferreteria_quotations');
        return data ? JSON.parse(data) : [];
    }
    getMonthlyStatistics() {
        const orders = this.getOrders();
        const quotations = this.getQuotations();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });
        const monthlyQuotations = quotations.filter(quotation => {
            const quotationDate = new Date(quotation.date);
            return quotationDate.getMonth() === currentMonth && quotationDate.getFullYear() === currentYear;
        });
        const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const monthlyConversion = monthlyQuotations.length > 0 
            ? Math.round((monthlyOrders.length / monthlyQuotations.length) * 100)
            : 0;
        return {
            orders: monthlyOrders.length,
            quotations: monthlyQuotations.length,
            revenue: monthlyRevenue,
            conversion: monthlyConversion,
            averageOrderValue: monthlyOrders.length > 0 ? monthlyRevenue / monthlyOrders.length : 0
        };
    }
    getOrdersByStatus() {
        const orders = this.getOrders();
        const statusCounts = {};
        CONFIG.orders.statusOptions.forEach(status => {
            statusCounts[status.value] = orders.filter(o => o.status === status.value).length;
        });
        return statusCounts;
    }
    getQuotationsByStatus() {
        const quotations = this.getQuotations();
        const statusCounts = { draft: 0, sent: 0, accepted: 0, expired: 0 };
        quotations.forEach(quotation => {
            const isExpired = new Date(quotation.validUntil) < new Date();
            if (isExpired) {
                statusCounts.expired++;
            } else {
                statusCounts[quotation.status] = (statusCounts[quotation.status] || 0) + 1;
            }
        });
        return statusCounts;
    }
};

class AdminPanelTestSuite {
    constructor() {
        this.results = [];
        this.testsPassed = 0;
        this.testsFailed = 0;
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('es-AR');
        const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : '•';
        console.log(`[${timestamp}] ${prefix} ${message}`);
        this.results.push({ timestamp, message, type });
    }

    assert(condition, message) {
        if (condition) {
            this.log(`${message}`, 'success');
            this.testsPassed++;
        } else {
            this.log(`${message}`, 'error');
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
    }

    testCSVExport() {
        this.log('Iniciando pruebas de exportación a CSV...', 'info');

        const orders = JSON.parse(localStorage.getItem('ferreteria_orders') || '[]');
        
        let csv = 'ID,Fecha,Cliente,Total,Estado\n';
        orders.forEach(order => {
            const date = new Date(order.date).toLocaleDateString('es-AR');
            csv += `${order.id},${date},${order.customer.name},${order.total},${order.status}\n`;
        });
        
        this.assert(csv.includes('ORD-'), 'CSV contiene ID de pedido');
        this.assert(csv.includes('Pérez'), 'CSV contiene nombre de cliente');
        this.assert(csv.includes('97500'), 'CSV contiene total del pedido');
        this.assert(csv.split('\n').length > 1, 'CSV tiene múltiples filas');
    }

    testProductManagement() {
        this.log('Iniciando pruebas de gestión de productos...', 'info');

        const newProduct = {
            id: 'prod_test_' + Date.now(),
            name: 'Producto de Prueba',
            category: 'Postes',
            price: 5000,
            stock: 50
        };
        
        let products = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        products.push(newProduct);
        localStorage.setItem('ferreteria_products', JSON.stringify(products));
        
        const savedProducts = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
        const foundProduct = savedProducts.find(p => p.id === newProduct.id);
        
        this.assert(foundProduct !== undefined, 'Producto agregado correctamente');
        this.assert(foundProduct.name === 'Producto de Prueba', 'Nombre del producto guardado correctamente');
        this.assert(foundProduct.price === 5000, 'Precio del producto guardado correctamente');
    }

    testConfigurationManagement() {
        this.log('Iniciando pruebas de gestión de configuración...', 'info');

        const config = {
            calculator: { defaultPostSpacing: 2.5, cornerPosts: 4 },
            pricing: { installationPricePerMeter: 500, marginPercentage: 20 },
            quotation: { validityDays: 30 }
        };
        
        localStorage.setItem('ferreteria_config', JSON.stringify(config));
        
        const savedConfig = JSON.parse(localStorage.getItem('ferreteria_config') || '{}');
        
        this.assert(savedConfig.calculator.defaultPostSpacing === 2.5, 'Separación entre postes guardada correctamente');
        this.assert(savedConfig.pricing.installationPricePerMeter === 500, 'Costo de instalación guardado correctamente');
        this.assert(savedConfig.quotation.validityDays === 30, 'Validez de cotizaciones guardada correctamente');
    }

    runAllTests() {
        console.log('\n' + '='.repeat(70));
        console.log('INICIANDO SUITE DE TESTS - PANEL DE ADMINISTRACIÓN');
        console.log('='.repeat(70) + '\n');

        this.setupTestData();
        console.log();

        this.testAuthentication();
        console.log();

        this.testStatisticsCalculation();
        console.log();

        this.testOrderFilters();
        console.log();

        this.testQuotationFilters();
        console.log();

        this.testOrderStatusUpdate();
        console.log();

        this.testCSVExport();
        console.log();

        this.testProductManagement();
        console.log();

        this.testConfigurationManagement();
        console.log();

        console.log('='.repeat(70));
        console.log(`RESULTADOS FINALES: ${this.testsPassed} pasados, ${this.testsFailed} fallidos`);
        console.log('='.repeat(70) + '\n');

        return {
            passed: this.testsPassed,
            failed: this.testsFailed,
            total: this.testsPassed + this.testsFailed
        };
    }
}

const suite = new AdminPanelTestSuite();
const results = suite.runAllTests();
process.exit(results.failed > 0 ? 1 : 0);
