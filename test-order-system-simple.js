#!/usr/bin/env node

/**
 * Test Simplificado del Sistema de Pedidos
 * Valida la lógica core sin dependencias del navegador
 */

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

// Clase Order simplificada
class Order {
    constructor(quotation, customerData) {
        this.id = this.generateOrderId();
        this.quotationId = quotation ? quotation.id : null;
        this.date = new Date();
        this.customer = this.validateCustomerData(customerData);
        this.items = quotation ? [...quotation.items] : [];
        this.installation = quotation && quotation.installation ? { ...quotation.installation } : null;
        this.subtotal = quotation ? quotation.subtotal : 0;
        this.total = quotation ? quotation.total : 0;
        this.status = 'pending';
        this.statusHistory = [{
            status: 'pending',
            date: new Date(),
            note: 'Pedido creado'
        }];
    }

    generateOrderId() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        const prefix = CONFIG.orders?.prefix || 'ORD';
        return `${prefix}-${year}${month}${day}-${random}`;
    }

    validateCustomerData(data) {
        const required = CONFIG.orders?.requireCustomerData || ['name', 'phone'];
        const validated = {};

        required.forEach(field => {
            if (!data[field]) {
                throw new Error(`Campo requerido faltante: ${field}`);
            }
            validated[field] = data[field];
        });

        const optional = CONFIG.orders?.optionalCustomerData || ['email', 'address', 'installationDate'];
        optional.forEach(field => {
            if (data[field]) {
                validated[field] = data[field];
            }
        });

        return validated;
    }

    updateStatus(newStatus, note = '') {
        const validStatuses = CONFIG.orders?.statusOptions?.map(s => s.value) || 
            ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Estado inválido: ${newStatus}`);
        }

        this.status = newStatus;
        this.statusHistory.push({
            status: newStatus,
            date: new Date(),
            note: note || `Estado actualizado a ${newStatus}`
        });

        return this;
    }

    toWhatsAppMessage() {
        const businessName = CONFIG.business?.name || 'Metales & Hierros';
        
        let message = `*Nuevo Pedido - ${businessName}*\n\n`;
        message += `*Número de Orden:* ${this.id}\n`;
        message += `*Fecha:* ${this.formatDate(this.date)}\n\n`;
        
        message += `*Cliente:*\n`;
        message += `Nombre: ${this.customer.name}\n`;
        message += `Teléfono: ${this.customer.phone}\n`;
        
        if (this.customer.email) {
            message += `Email: ${this.customer.email}\n`;
        }
        
        if (this.customer.address) {
            message += `Dirección: ${this.customer.address}\n`;
        }
        
        message += `\n*Productos:*\n`;
        this.items.forEach((item, index) => {
            const price = this.formatCurrency(item.subtotal);
            message += `${index + 1}. ${item.name} x${item.quantity} - ${price}\n`;
        });
        
        if (this.installation) {
            message += `\n*Instalación:*\n`;
            const installPrice = this.formatCurrency(this.installation.subtotal);
            message += `${this.installation.linearMeters}m x ${this.formatCurrency(this.installation.pricePerMeter)} = ${installPrice}\n`;
            
            if (this.customer.installationDate) {
                message += `Fecha preferida: ${this.formatDate(new Date(this.customer.installationDate))}\n`;
            }
        }
        
        message += `\n*Total: ${this.formatCurrency(this.total)}*`;
        
        return encodeURIComponent(message);
    }

    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    formatCurrency(amount) {
        const symbol = CONFIG.pricing?.currencySymbol || '$';
        const locale = CONFIG.pricing?.currencyFormat?.locale || 'es-AR';
        const options = {
            minimumFractionDigits: CONFIG.pricing?.currencyFormat?.minimumFractionDigits || 0,
            maximumFractionDigits: CONFIG.pricing?.currencyFormat?.maximumFractionDigits || 2
        };
        
        const formatted = new Intl.NumberFormat(locale, options).format(amount);
        return `${symbol}${formatted}`;
    }

    toJSON() {
        return {
            id: this.id,
            quotationId: this.quotationId,
            date: this.date.toISOString(),
            customer: this.customer,
            items: this.items,
            installation: this.installation,
            subtotal: this.subtotal,
            total: this.total,
            status: this.status,
            statusHistory: this.statusHistory.map(h => ({
                status: h.status,
                date: h.date.toISOString(),
                note: h.note
            }))
        };
    }

    static fromJSON(data) {
        const order = Object.create(Order.prototype);
        order.id = data.id;
        order.quotationId = data.quotationId;
        order.date = new Date(data.date);
        order.customer = data.customer;
        order.items = data.items;
        order.installation = data.installation;
        order.subtotal = data.subtotal;
        order.total = data.total;
        order.status = data.status;
        order.statusHistory = data.statusHistory.map(h => ({
            status: h.status,
            date: new Date(h.date),
            note: h.note
        }));
        return order;
    }
}

// Clase OrderManager simplificada
class OrderManager {
    constructor() {
        this.storageKey = 'ferreteria_orders';
        this.orders = this.loadOrders();
    }

    loadOrders() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return [];
            
            const ordersData = JSON.parse(data);
            return ordersData.map(orderData => Order.fromJSON(orderData));
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            return [];
        }
    }

    saveOrders() {
        try {
            const ordersData = this.orders.map(order => order.toJSON());
            localStorage.setItem(this.storageKey, JSON.stringify(ordersData));
            return true;
        } catch (error) {
            console.error('Error al guardar pedidos:', error);
            throw error;
        }
    }

    createOrder(quotation, customerData) {
        try {
            const order = new Order(quotation, customerData);
            this.orders.push(order);
            this.saveOrders();
            return order;
        } catch (error) {
            console.error('Error al crear pedido:', error);
            throw error;
        }
    }

    getOrderById(orderId) {
        return this.orders.find(order => order.id === orderId);
    }

    updateOrderStatus(orderId, newStatus, note = '') {
        const order = this.getOrderById(orderId);
        
        if (!order) {
            throw new Error(`Pedido no encontrado: ${orderId}`);
        }

        order.updateStatus(newStatus, note);
        this.saveOrders();
        
        return order;
    }

    getStatistics() {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const ordersThisMonth = this.orders.filter(order => 
            new Date(order.date) >= thisMonth
        );

        const totalRevenue = ordersThisMonth
            .filter(order => order.status !== 'cancelled')
            .reduce((sum, order) => sum + order.total, 0);

        const statusCounts = {};
        CONFIG.orders?.statusOptions?.forEach(status => {
            statusCounts[status.value] = this.orders.filter(
                order => order.status === status.value
            ).length;
        });

        return {
            total: this.orders.length,
            thisMonth: ordersThisMonth.length,
            revenue: totalRevenue,
            byStatus: statusCounts,
            pending: statusCounts.pending || 0,
            completed: statusCounts.completed || 0
        };
    }
}

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
    
    const decodedMessage = decodeURIComponent(message);
    const passed = message && 
                   decodedMessage.includes(order.id) && 
                   decodedMessage.includes(testCustomer.name) &&
                   decodedMessage.includes(testCustomer.phone);
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
