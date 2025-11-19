/**
 * Test Automatizado - Sistema de Pedidos
 * Valida: conversión de cotización a pedido, generación de número de orden,
 * envío por WhatsApp, consulta de estado, actualización de estado e historial
 */

class OrderSystemTest {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            tests: []
        };
        this.testOrders = [];
    }

    async runAllTests() {
        console.log('=== Iniciando Tests del Sistema de Pedidos ===\n');

        await this.testOrderCreation();
        await this.testOrderIdGeneration();
        await this.testOrderConversionFromQuotation();
        await this.testOrderStatusUpdate();
        await this.testOrderStatusHistory();
        await this.testOrderRetrieval();
        await this.testOrderValidation();
        await this.testWhatsAppMessageGeneration();
        await this.testOrderPersistence();
        await this.testOrderStatistics();

        this.printSummary();
        return this.results;
    }

    async testOrderCreation() {
        console.log('TEST 1: Creación de Pedido');
        
        try {
            const orderManager = new OrderManager();
            const testQuotation = this.createTestQuotation();
            const testCustomer = this.createTestCustomer();

            const order = orderManager.createOrder(testQuotation, testCustomer);

            if (!order || !order.id) {
                throw new Error('Pedido no creado correctamente');
            }

            if (order.status !== 'pending') {
                throw new Error(`Estado inicial debe ser 'pending', obtuvo: ${order.status}`);
            }

            if (order.customer.name !== testCustomer.name) {
                throw new Error('Datos del cliente no guardados correctamente');
            }

            if (order.total !== testQuotation.total) {
                throw new Error('Total del pedido no coincide con la cotización');
            }

            this.testOrders.push(order.id);
            this.addTestResult('Creación de Pedido', true);
            console.log('✓ Pedido creado exitosamente\n');
        } catch (error) {
            this.addTestResult('Creación de Pedido', false, error.message);
            console.error('✗ Error:', error.message, '\n');
        }
    }

    async testOrderIdGeneration() {
        console.log('TEST 2: Generación de Número de Orden');
        
        try {
            const orderManager = new OrderManager();
            const testQuotation = this.createTestQuotation();
            const testCustomer = this.createTestCustomer();

            const order1 = orderManager.createOrder(testQuotation, testCustomer);
            const order2 = orderManager.createOrder(testQuotation, testCustomer);

            if (!order1.id || !order2.id) {
                throw new Error('IDs de pedido no generados');
            }

            if (order1.id === order2.id) {
                throw new Error('IDs de pedido no son únicos');
            }

            const idPattern = /^ORD-\d{8}-\d{4}$/;
            if (!idPattern.test(order1.id)) {
                throw new Error(`Formato de ID inválido: ${order1.id}`);
            }

            this.testOrders.push(order1.id, order2.id);
            this.addTestResult('Generación de Número de Orden', true);
            console.log(`✓ IDs generados correctamente: ${order1.id}, ${order2.id}\n`);
        } catch (error) {
            this.addTestResult('Generación de Número de Orden', false, error.message);
            console.error('✗ Error:', error.message, '\n');
        }
    }

    async testOrderConversionFromQuotation() {
        console.log('TEST 3: Conversión de Cotización a Pedido');
        
        try {
            const orderManager = new OrderManager();
            const testQuotation = this.createTestQuotation();
            const testCustomer = this.createTestCustomer();

            const order = orderManager.createOrder(testQuotation, testCustomer);

            if (order.quotationId !== testQuotation.id) {
                throw new Error('ID de cotización no guardado en el pedido');
            }

            if (!order.items || order.items.length === 0) {
                throw new Error('Items de la cotización no copiados al pedido');
            }

            if (order.items.length !== testQuotation.items.length) {
                throw new Error('Cantidad de items no coincide');
            }

            if (order.installation && testQuotation.installation) {
                if (order.installation.linearMeters !== testQuotation.installation.linearMeters) {
                    throw new Error('Datos de instalación no copiados correctamente');
                }
            }

            this.testOrders.push(order.id);
            this.addTestResult('Conversión de Cotización a Pedido', true);
            console.log('✓ Cotización convertida a pedido correctamente\n');
        } catch (error) {
            this.addTestResult('Conversión de Cotización a Pedido', false, error.message);
            console.error('✗ Error:', error.message, '\n');
        }
    }

    async testOrderStatusUpdate() {
        console.log('TEST 4: Actualización de Estado de Pedido');
        
        try {
            const orderManager = new OrderManager();
            const testQuotation = this.createTestQuotation();
            const testCustomer = this.createTestCustomer();

            const order = orderManager.createOrder(testQuotation, testCustomer);
            const orderId = order.id;

            const newStatus = 'confirmed';
            const note = 'Pedido confirmado por el cliente';

            const updatedOrder = orderManager.updateOrderStatus(orderId, newStatus, note);

            if (updatedOrder.status !== newStatus) {
                throw new Error(`Estado no actualizado. Esperado: ${newStatus}, Obtuvo: ${updatedOrder.status}`);
            }

            if (!updatedOrder.statusHistory.find(h => h.status === newStatus)) {
                throw new Error('Cambio de estado no registrado en historial');
            }

            this.testOrders.push(orderId);
            this.addTestResult('Actualización de Estado de Pedido', true);
            console.log(`✓ Estado actualizado a '${newStatus}'\n`);
        } catch (error) {
            this.addTestResult('Actualización de Estado de Pedido', false, error.message);
            console.error('✗ Error:', error.message, '\n');
        }
    }

    async testOrderStatusHistory() {
        console.log('TEST 5: Historial de Estados');
        
        try {
            const orderManager = new OrderManager();
            const testQuotation = this.createTestQuotation();
            const testCustomer = this.createTestCustomer();

            const order = orderManager.createOrder(testQuotation, testCustomer);
            const orderId = order.id;

            if (!order.statusHistory || order.statusHistory.length === 0) {
                throw new Error('Historial inicial vacío');
            }

            const initialHistoryLength = order.statusHistory.length;

            orderManager.updateOrderStatus(orderId, 'confirmed', 'Confirmado');
            orderManager.updateOrderStatus(orderId, 'in_progress', 'En proceso');
            orderManager.updateOrderStatus(orderId, 'completed', 'Completado');

            const updatedOrder = orderManager.getOrderById(orderId);

            if (updatedOrder.statusHistory.length !== initialHistoryLength + 3) {
                throw new Error('Historial no actualizado correctamente');
            }

            const statuses = updatedOrder.statusHistory.map(h => h.status);
            if (!statuses.includes('confirmed') || !statuses.includes('in_progress') || !statuses.includes('completed')) {
                throw new Error('No todos los estados están en el historial');
            }

            const allHaveTimestamp = updatedOrder.statusHistory.every(h => h.date);
            if (!allHaveTimestamp) {
                throw new Error('Algunos registros del historial no tienen timestamp');
            }

            this.testOrders.push(orderId);
            this.addTestResult('Historial de Estados', true);
            console.log(`✓ Historial con ${updatedOrder.statusHistory.length} registros\n`);
        } catch (error) {
            this.addTestResult('Historial de Estados', false, error.message);
            console.error('✗ Error:', error.message, '\n');
        }
    }

    async testOrderRetrieval() {
        console.log('TEST 6: Consulta de Pedido por ID');
        
        try {
            const orderManager = new OrderManager();
            const testQuotation = this.createTestQuotation();
            const testCustomer = this.createTestCustomer();

            const order = orderManager.createOrder(testQuotation, testCustomer);
            const orderId = order.id;

            const retrievedOrder = orderManager.getOrderById(orderId);

            if (!retrievedOrder) {
                throw new Error('Pedido no encontrado');
            }

            if (retrievedOrder.id !== orderId) {
                throw new Error('ID del pedido recuperado no coincide');
            }

            if (retrievedOrder.customer.name !== testCustomer.name) {
                throw new Error('Datos del cliente no coinciden');
            }

            this.testOrders.push(orderId);
            this.addTestResult('Consulta de Pedido por ID', true);
            console.log(`✓ Pedido recuperado: ${orderId}\n`);
        } catch (error) {
            this.addTestResult('Consulta de Pedido por ID', false, error.message);
            console.error('✗ Error:', error.message, '\n');
        }
    }

    async testOrderValidation() {
        console.log('TEST 7: Validación de Datos del Cliente');
        
        try {
            const orderManager = new OrderManager();
            const testQuotation = this.createTestQuotation();

            const invalidCustomer = {
                phone: '+54 9 11 1234-5678'
            };

            try {
                orderManager.createOrder(testQuotation, invalidCustomer);
                throw new Error('Debería haber lanzado error por falta de nombre');
            } catch (error) {
                if (!error.message.includes('Campo requerido')) {
                    throw error;
                }
            }

            const validCustomer = this.createTestCustomer();
            const order = orderManager.createOrder(testQuotation, validCustomer);

            if (!order) {
                throw new Error('Pedido no creado con datos válidos');
            }

            this.testOrders.push(order.id);
            this.addTestResult('Validación de Datos del Cliente', true);
            console.log('✓ Validación de datos funcionando correctamente\n');
        } catch (error) {
            this.addTestResult('Validación de Datos del Cliente', false, error.message);
            console.error('✗ Error:', error.message, '\n');
        }
    }

    async testWhatsAppMessageGeneration() {
        console.log('TEST 8: Generación de Mensaje WhatsApp');
        
        try {
            const orderManager = new OrderManager();
            const testQuotation = this.createTestQuotation();
            const testCustomer = this.createTestCustomer();

            const order = orderManager.createOrder(testQuotation, testCustomer);

            const message = order.toWhatsAppMessage();

            if (!message) {
                throw new Error('Mensaje no generado');
            }

            if (!message.includes(order.id)) {
                throw new Error('Número de orden no incluido en el mensaje');
            }

            if (!message.includes(testCustomer.name)) {
                throw new Error('Nombre del cliente no incluido en el mensaje');
            }

            if (!message.includes(testCustomer.phone)) {
                throw new Error('Teléfono del cliente no incluido en el mensaje');
            }

            if (!message.includes(order.total.toString())) {
                throw new Error('Total no incluido en el mensaje');
            }

            this.testOrders.push(order.id);
            this.addTestResult('Generación de Mensaje WhatsApp', true);
            console.log('✓ Mensaje WhatsApp generado correctamente\n');
        } catch (error) {
            this.addTestResult('Generación de Mensaje WhatsApp', false, error.message);
            console.error('✗ Error:', error.message, '\n');
        }
    }

    async testOrderPersistence() {
        console.log('TEST 9: Persistencia en localStorage');
        
        try {
            const orderManager = new OrderManager();
            const testQuotation = this.createTestQuotation();
            const testCustomer = this.createTestCustomer();

            const order = orderManager.createOrder(testQuotation, testCustomer);
            const orderId = order.id;

            const savedData = localStorage.getItem('ferreteria_orders');
            if (!savedData) {
                throw new Error('Datos no guardados en localStorage');
            }

            const savedOrders = JSON.parse(savedData);
            const savedOrder = savedOrders.find(o => o.id === orderId);

            if (!savedOrder) {
                throw new Error('Pedido no encontrado en localStorage');
            }

            if (savedOrder.customer.name !== testCustomer.name) {
                throw new Error('Datos del cliente no persistidos correctamente');
            }

            const newOrderManager = new OrderManager();
            const retrievedOrder = newOrderManager.getOrderById(orderId);

            if (!retrievedOrder) {
                throw new Error('Pedido no recuperado después de recargar desde localStorage');
            }

            this.testOrders.push(orderId);
            this.addTestResult('Persistencia en localStorage', true);
            console.log('✓ Datos persistidos correctamente en localStorage\n');
        } catch (error) {
            this.addTestResult('Persistencia en localStorage', false, error.message);
            console.error('✗ Error:', error.message, '\n');
        }
    }

    async testOrderStatistics() {
        console.log('TEST 10: Estadísticas de Pedidos');
        
        try {
            const orderManager = new OrderManager();

            const stats = orderManager.getStatistics();

            if (typeof stats.total !== 'number') {
                throw new Error('Total de pedidos no es un número');
            }

            if (typeof stats.revenue !== 'number') {
                throw new Error('Ingresos no es un número');
            }

            if (!stats.byStatus || typeof stats.byStatus !== 'object') {
                throw new Error('Estadísticas por estado no disponibles');
            }

            this.addTestResult('Estadísticas de Pedidos', true);
            console.log(`✓ Estadísticas: ${stats.total} pedidos, Ingresos: ${stats.revenue}\n`);
        } catch (error) {
            this.addTestResult('Estadísticas de Pedidos', false, error.message);
            console.error('✗ Error:', error.message, '\n');
        }
    }

    createTestQuotation() {
        return {
            id: `COT-TEST-${Date.now()}`,
            items: [
                {
                    id: 'poste_hormigon_25',
                    name: 'Poste de Hormigón 2.5m',
                    quantity: 10,
                    unitPrice: 3500,
                    subtotal: 35000
                },
                {
                    id: 'tejido_romboidal_150',
                    name: 'Tejido Romboidal 1.5m',
                    quantity: 5,
                    unitPrice: 8500,
                    subtotal: 42500
                }
            ],
            installation: {
                linearMeters: 50,
                pricePerMeter: 500,
                subtotal: 25000
            },
            subtotal: 102500,
            total: 102500
        };
    }

    createTestCustomer() {
        return {
            name: `Cliente Test ${Date.now()}`,
            phone: '+54 9 11 1234-5678',
            email: 'test@example.com',
            address: 'Calle Test 123, Mar del Plata',
            installationDate: '2024-02-01',
            paymentMethod: 'transfer'
        };
    }

    addTestResult(testName, passed, errorMessage = null) {
        if (passed) {
            this.results.passed++;
        } else {
            this.results.failed++;
        }

        this.results.tests.push({
            name: testName,
            passed: passed,
            error: errorMessage
        });
    }

    printSummary() {
        console.log('\n=== RESUMEN DE TESTS ===\n');
        console.log(`Total de tests: ${this.results.tests.length}`);
        console.log(`✓ Pasados: ${this.results.passed}`);
        console.log(`✗ Fallidos: ${this.results.failed}`);
        console.log('\nDetalle de resultados:');

        this.results.tests.forEach((test, index) => {
            const icon = test.passed ? '✓' : '✗';
            const status = test.passed ? 'PASADO' : 'FALLIDO';
            console.log(`${index + 1}. ${icon} ${test.name} - ${status}`);
            if (test.error) {
                console.log(`   Error: ${test.error}`);
            }
        });

        console.log('\n=== FIN DE TESTS ===\n');

        if (this.results.failed === 0) {
            console.log('✓ TODOS LOS TESTS PASARON EXITOSAMENTE');
        } else {
            console.log(`✗ ${this.results.failed} TEST(S) FALLARON`);
        }
    }

    cleanup() {
        const orderManager = new OrderManager();
        this.testOrders.forEach(orderId => {
            try {
                orderManager.deleteOrder(orderId);
            } catch (error) {
                console.warn(`No se pudo eliminar pedido de prueba: ${orderId}`);
            }
        });
        console.log(`\nLimpieza: ${this.testOrders.length} pedidos de prueba eliminados`);
    }
}

if (typeof window !== 'undefined') {
    window.OrderSystemTest = OrderSystemTest;
}
