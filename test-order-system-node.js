#!/usr/bin/env node

/**
 * Test Automatizado del Sistema de Pedidos - Versión Node.js
 * Ejecuta validaciones del sistema de pedidos sin dependencias del navegador
 */

const fs = require('fs');
const path = require('path');

// Simular config.js
global.CONFIG = {
    business: { name: 'Metales & Hierros' },
    pricing: { 
        currencySymbol: '$', 
        currencyFormat: { 
            locale: 'es-AR', 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 2 
        } 
    },
    orders: {
        prefix: 'ORD',
        requireCustomerData: ['name', 'phone'],
        optionalCustomerData: ['email', 'address', 'installationDate', 'paymentMethod'],
        statusOptions: [
            { value: 'pending', label: 'Pendiente', color: '#f57c00', icon: 'clock' },
            { value: 'confirmed', label: 'Confirmado', color: '#4caf50', icon: 'check' },
            { value: 'in_progress', label: 'En Proceso', color: '#0288d1', icon: 'spinner' },
            { value: 'completed', label: 'Completado', color: '#2d7a3e', icon: 'check-circle' },
            { value: 'cancelled', label: 'Cancelado', color: '#d32f2f', icon: 'times-circle' }
        ]
    }
};

// Simular localStorage
const localStorage = {
    data: {},
    getItem(key) { return this.data[key] || null; },
    setItem(key, value) { this.data[key] = value; },
    removeItem(key) { delete this.data[key]; },
    clear() { this.data = {}; }
};
global.localStorage = localStorage;

// Cargar el código de órdenes
const ordersCode = fs.readFileSync(path.join(__dirname, 'js/orders.js'), 'utf8');
eval(ordersCode);

// Resultados de tests
let testsPassed = 0;
let testsFailed = 0;
const testResults = [];

function logTest(name, passed, message = '') {
    const icon = passed ? '✓' : '✗';
    const status = passed ? 'PASADO' : 'FALLIDO';
    console.log(`${icon} ${name} - ${status}`);
    if (message) {
        console.log(`  ${message}`);
    }
    
    if (passed) {
        testsPassed++;
    } else {
        testsFailed++;
    }
    
    testResults.push({ name, passed, message });
}

console.log('=== TESTS DEL SISTEMA DE PEDIDOS ===\n');

// TEST 1: Creación de Pedido
console.log('TEST 1: Creación de Pedido');
try {
    const orderManager = new OrderManager();
    const testQuotation = {
        id: 'COT-TEST-001',
        items: [
            { id: 'prod_001', name: 'Poste de Hormigón 2.5m', quantity: 10, unitPrice: 3500, subtotal: 35000 }
        ],
        subtotal: 35000,
        total: 35000
    };
    const testCustomer = { name: 'Cliente Test', phone: '+54 9 11 1234-5678' };
    const order = orderManager.createOrder(testQuotation, testCustomer);
    
    const passed = order && order.id && order.status === 'pending' && order.total === 35000;
    logTest('Creación de Pedido', passed, `ID: ${order.id}, Estado: ${order.status}`);
    
    global.testOrderId = order.id;
} catch (error) {
    logTest('Creación de Pedido', false, error.message);
}

// TEST 2: Generación de Número de Orden Único
console.log('\nTEST 2: Generación de Número de Orden Único');
try {
    const orderManager = new OrderManager();
    const testQuotation = {
        id: 'COT-TEST-002',
        items: [{ id: 'prod_001', name: 'Poste', quantity: 5, unitPrice: 3500, subtotal: 17500 }],
        subtotal: 17500,
        total: 17500
    };
    const testCustomer = { name: 'Cliente 2', phone: '+54 9 11 1234-5679' };
    
    const order1 = orderManager.createOrder(testQuotation, testCustomer);
    const order2 = orderManager.createOrder(testQuotation, testCustomer);
    
    const idPattern = /^ORD-\d{8}-\d{4}$/;
    const passed = order1.id !== order2.id && idPattern.test(order1.id) && idPattern.test(order2.id);
    logTest('Generación de Número Único', passed, `ID1: ${order1.id}, ID2: ${order2.id}`);
} catch (error) {
    logTest('Generación de Número Único', false, error.message);
}

// TEST 3: Conversión de Cotización a Pedido
console.log('\nTEST 3: Conversión de Cotización a Pedido');
try {
    const orderManager = new OrderManager();
    const testQuotation = {
        id: 'COT-TEST-003',
        items: [
            { id: 'prod_001', name: 'Poste', quantity: 10, unitPrice: 3500, subtotal: 35000 },
            { id: 'prod_002', name: 'Tejido', quantity: 5, unitPrice: 8500, subtotal: 42500 }
        ],
        installation: { linearMeters: 50, pricePerMeter: 500, subtotal: 25000 },
        subtotal: 102500,
        total: 102500
    };
    const testCustomer = { name: 'Cliente 3', phone: '+54 9 11 1234-5680' };
    
    const order = orderManager.createOrder(testQuotation, testCustomer);
    
    const passed = order.quotationId === testQuotation.id && 
                   order.items.length === 2 && 
                   order.installation.linearMeters === 50 &&
                   order.total === 102500;
    logTest('Conversión de Cotización', passed, `Items: ${order.items.length}, Total: ${order.total}`);
} catch (error) {
    logTest('Conversión de Cotización', false, error.message);
}

// TEST 4: Actualización de Estado
console.log('\nTEST 4: Actualización de Estado');
try {
    const orderManager = new OrderManager();
    const testQuotation = {
        id: 'COT-TEST-004',
        items: [{ id: 'prod_001', name: 'Poste', quantity: 10, unitPrice: 3500, subtotal: 35000 }],
        subtotal: 35000,
        total: 35000
    };
    const testCustomer = { name: 'Cliente 4', phone: '+54 9 11 1234-5681' };
    
    const order = orderManager.createOrder(testQuotation, testCustomer);
    const orderId = order.id;
    
    orderManager.updateOrderStatus(orderId, 'confirmed', 'Confirmado por cliente');
    const updatedOrder = orderManager.getOrderById(orderId);
    
    const passed = updatedOrder.status === 'confirmed' && 
                   updatedOrder.statusHistory.length === 2 &&
                   updatedOrder.statusHistory.some(h => h.status === 'confirmed');
    logTest('Actualización de Estado', passed, `Estado: ${updatedOrder.status}, Historial: ${updatedOrder.statusHistory.length}`);
} catch (error) {
    logTest('Actualización de Estado', false, error.message);
}

// TEST 5: Historial de Estados
console.log('\nTEST 5: Historial de Estados');
try {
    const orderManager = new OrderManager();
    const testQuotation = {
        id: 'COT-TEST-005',
        items: [{ id: 'prod_001', name: 'Poste', quantity: 10, unitPrice: 3500, subtotal: 35000 }],
        subtotal: 35000,
        total: 35000
    };
    const testCustomer = { name: 'Cliente 5', phone: '+54 9 11 1234-5682' };
    
    const order = orderManager.createOrder(testQuotation, testCustomer);
    const orderId = order.id;
    
    orderManager.updateOrderStatus(orderId, 'confirmed', 'Confirmado');
    orderManager.updateOrderStatus(orderId, 'in_progress', 'En proceso');
    orderManager.updateOrderStatus(orderId, 'completed', 'Completado');
    
    const updatedOrder = orderManager.getOrderById(orderId);
    
    const statuses = updatedOrder.statusHistory.map(h => h.status);
    const passed = updatedOrder.statusHistory.length === 4 &&
                   statuses.includes('pending') &&
                   statuses.includes('confirmed') &&
                   statuses.includes('in_progress') &&
                   statuses.includes('completed');
    logTest('Historial de Estados', passed, `Registros: ${updatedOrder.statusHistory.length}`);
} catch (error) {
    logTest('Historial de Estados', false, error.message);
}

// TEST 6: Consulta de Pedido por ID
console.log('\nTEST 6: Consulta de Pedido por ID');
try {
    const orderManager = new OrderManager();
    const testQuotation = {
        id: 'COT-TEST-006',
        items: [{ id: 'prod_001', name: 'Poste', quantity: 10, unitPrice: 3500, subtotal: 35000 }],
        subtotal: 35000,
        total: 35000
    };
    const testCustomer = { name: 'Cliente 6', phone: '+54 9 11 1234-5683' };
    
    const order = orderManager.createOrder(testQuotation, testCustomer);
    const orderId = order.id;
    
    const retrievedOrder = orderManager.getOrderById(orderId);
    
    const passed = retrievedOrder && 
                   retrievedOrder.id === orderId && 
                   retrievedOrder.customer.name === testCustomer.name;
    logTest('Consulta de Pedido', passed, `ID: ${orderId}`);
} catch (error) {
    logTest('Consulta de Pedido', false, error.message);
}

// TEST 7: Validación de Datos del Cliente
console.log('\nTEST 7: Validación de Datos del Cliente');
try {
    const orderManager = new OrderManager();
    const testQuotation = {
        id: 'COT-TEST-007',
        items: [{ id: 'prod_001', name: 'Poste', quantity: 10, unitPrice: 3500, subtotal: 35000 }],
        subtotal: 35000,
        total: 35000
    };
    
    let validationPassed = false;
    try {
        const invalidCustomer = { phone: '+54 9 11 1234-5684' };
        orderManager.createOrder(testQuotation, invalidCustomer);
    } catch (error) {
        if (error.message.includes('Campo requerido')) {
            validationPassed = true;
        }
    }
    
    logTest('Validación de Datos', validationPassed, 'Rechaza datos incompletos');
} catch (error) {
    logTest('Validación de Datos', false, error.message);
}

// TEST 8: Generación de Mensaje WhatsApp
console.log('\nTEST 8: Generación de Mensaje WhatsApp');
try {
    const orderManager = new OrderManager();
    const testQuotation = {
        id: 'COT-TEST-008',
        items: [
            { id: 'prod_001', name: 'Poste de Hormigón 2.5m', quantity: 10, unitPrice: 3500, subtotal: 35000 }
        ],
        subtotal: 35000,
        total: 35000
    };
    const testCustomer = { name: 'Cliente Test', phone: '+54 9 11 1234-5685' };
    
    const order = orderManager.createOrder(testQuotation, testCustomer);
    const message = order.toWhatsAppMessage();
    
    const passed = message && 
                   message.includes(order.id) && 
                   message.includes(testCustomer.name) &&
                   message.includes(testCustomer.phone);
    logTest('Mensaje WhatsApp', passed, 'Contiene ID, cliente y teléfono');
} catch (error) {
    logTest('Mensaje WhatsApp', false, error.message);
}

// TEST 9: Persistencia en localStorage
console.log('\nTEST 9: Persistencia en localStorage');
try {
    const orderManager = new OrderManager();
    const testQuotation = {
        id: 'COT-TEST-009',
        items: [{ id: 'prod_001', name: 'Poste', quantity: 10, unitPrice: 3500, subtotal: 35000 }],
        subtotal: 35000,
        total: 35000
    };
    const testCustomer = { name: 'Cliente 9', phone: '+54 9 11 1234-5686' };
    
    const order = orderManager.createOrder(testQuotation, testCustomer);
    const orderId = order.id;
    
    const savedData = localStorage.getItem('ferreteria_orders');
    const savedOrders = JSON.parse(savedData);
    const savedOrder = savedOrders.find(o => o.id === orderId);
    
    const passed = savedOrder && savedOrder.customer.name === testCustomer.name;
    logTest('Persistencia en localStorage', passed, `Pedidos guardados: ${savedOrders.length}`);
} catch (error) {
    logTest('Persistencia en localStorage', false, error.message);
}

// TEST 10: Recuperación desde localStorage
console.log('\nTEST 10: Recuperación desde localStorage');
try {
    const orderManager = new OrderManager();
    const testQuotation = {
        id: 'COT-TEST-010',
        items: [{ id: 'prod_001', name: 'Poste', quantity: 10, unitPrice: 3500, subtotal: 35000 }],
        subtotal: 35000,
        total: 35000
    };
    const testCustomer = { name: 'Cliente 10', phone: '+54 9 11 1234-5687' };
    
    const order = orderManager.createOrder(testQuotation, testCustomer);
    const orderId = order.id;
    
    const newOrderManager = new OrderManager();
    const retrievedOrder = newOrderManager.getOrderById(orderId);
    
    const passed = retrievedOrder && retrievedOrder.id === orderId;
    logTest('Recuperación desde localStorage', passed, `Pedido recuperado: ${orderId}`);
} catch (error) {
    logTest('Recuperación desde localStorage', false, error.message);
}

// Resumen
console.log('\n=== RESUMEN DE TESTS ===\n');
console.log(`Total de tests: ${testResults.length}`);
console.log(`✓ Pasados: ${testsPassed}`);
console.log(`✗ Fallidos: ${testsFailed}`);

if (testsFailed === 0) {
    console.log('\n✓ TODOS LOS TESTS PASARON EXITOSAMENTE');
    process.exit(0);
} else {
    console.log(`\n✗ ${testsFailed} TEST(S) FALLARON`);
    process.exit(1);
}
