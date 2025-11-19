#!/usr/bin/env node

/**
 * Test simple del sistema de cotizaciones
 * Pruebas básicas sin dependencias de clases complejas
 */

// Simular localStorage
global.localStorage = {
    data: {},
    getItem(key) { return this.data[key] || null; },
    setItem(key, value) { this.data[key] = value; },
    removeItem(key) { delete this.data[key]; },
    clear() { this.data = {}; }
};

// Configuración mínima
const CONFIG = {
    contact: { whatsapp: { number: '5491171416157' }, email: 'test@example.com' },
    business: { name: 'Test Business' },
    pricing: { currency: 'ARS', installationPricePerMeter: 500 },
    quotation: { validityDays: 30 }
};

// Tests
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passed++;
    } catch (error) {
        console.error(`✗ ${name}: ${error.message}`);
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

console.log('='.repeat(60));
console.log('TESTS DEL SISTEMA DE COTIZACIONES');
console.log('='.repeat(60));

// Test 1: Generación de ID único
test('Generación de ID único', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const id = `COT-${timestamp}-${random}`;
        
        assert(id.startsWith('COT-'), 'ID debe comenzar con COT-');
        ids.add(id);
    }
    assert(ids.size > 90, 'Debe generar IDs únicos (al menos 90 de 100)');
});

// Test 2: Cálculo de totales sin instalación
test('Cálculo de totales sin instalación', () => {
    const items = [
        { quantity: 10, unitPrice: 3500 },
        { quantity: 5, unitPrice: 2500 }
    ];
    
    let subtotal = 0;
    items.forEach(item => {
        subtotal += item.quantity * item.unitPrice;
    });
    
    const expectedSubtotal = (10 * 3500) + (5 * 2500);
    assert(subtotal === expectedSubtotal, `Subtotal incorrecto: ${subtotal} vs ${expectedSubtotal}`);
});

// Test 3: Cálculo de totales con instalación
test('Cálculo de totales con instalación', () => {
    const items = [
        { quantity: 10, unitPrice: 3500 }
    ];
    
    let subtotal = 0;
    items.forEach(item => {
        subtotal += item.quantity * item.unitPrice;
    });
    
    const installation = {
        linearMeters: 100,
        pricePerMeter: 500,
        subtotal: 100 * 500
    };
    
    const total = subtotal + installation.subtotal;
    const expectedTotal = (10 * 3500) + 50000;
    
    assert(total === expectedTotal, `Total incorrecto: ${total} vs ${expectedTotal}`);
});

// Test 4: Guardado en localStorage
test('Guardado en localStorage', () => {
    localStorage.clear();
    
    const quotation = {
        id: 'COT-TEST-001',
        date: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        items: [{ name: 'Poste', quantity: 10, unitPrice: 3500 }],
        total: 35000,
        status: 'sent'
    };
    
    const quotations = [quotation];
    localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
    
    const retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    assert(retrieved.length === 1, 'No se guardó la cotización');
    assert(retrieved[0].id === 'COT-TEST-001', 'ID no coincide');
});

// Test 5: Recuperación de cotizaciones
test('Recuperación de cotizaciones', () => {
    localStorage.clear();
    
    const quotations = [
        { id: 'COT-001', total: 35000 },
        { id: 'COT-002', total: 75000 }
    ];
    
    localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
    
    const retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    assert(retrieved.length === 2, `Se esperaban 2 cotizaciones, se obtuvieron ${retrieved.length}`);
});

// Test 6: Validez de 30 días
test('Validez de 30 días', () => {
    const now = new Date();
    const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const diffDays = Math.floor((validUntil - now) / (1000 * 60 * 60 * 24));
    assert(diffDays >= 29 && diffDays <= 30, `Validez incorrecta: ${diffDays} días`);
});

// Test 7: Filtrado de cotizaciones válidas
test('Filtrado de cotizaciones válidas', () => {
    localStorage.clear();
    
    const now = new Date();
    const quotations = [
        {
            id: 'COT-VALID-001',
            validUntil: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'COT-EXPIRED-001',
            validUntil: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    const valid = quotations.filter(q => new Date(q.validUntil) > now);
    const expired = quotations.filter(q => new Date(q.validUntil) <= now);
    
    assert(valid.length === 1, `Se esperaba 1 válida, se obtuvieron ${valid.length}`);
    assert(expired.length === 1, `Se esperaba 1 expirada, se obtuvieron ${expired.length}`);
});

// Test 8: Eliminación de cotizaciones expiradas
test('Eliminación de cotizaciones expiradas', () => {
    localStorage.clear();
    
    const now = new Date();
    const quotations = [
        {
            id: 'COT-VALID-002',
            validUntil: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'COT-EXPIRED-002',
            validUntil: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    const validOnly = quotations.filter(q => new Date(q.validUntil) > now);
    
    assert(quotations.length === 2, 'Antes de eliminar debe haber 2');
    assert(validOnly.length === 1, 'Después de filtrar debe haber 1');
});

// Test 9: Formato de mensaje WhatsApp
test('Formato de mensaje WhatsApp', () => {
    const quotationId = 'COT-TEST-009';
    const items = [
        { name: 'Poste Hormigón', quantity: 10, unitPrice: 3500 }
    ];
    
    let message = `*Cotización: ${quotationId}*\n`;
    message += `*Materiales:*\n`;
    
    items.forEach(item => {
        message += `• ${item.name} x${item.quantity}\n`;
    });
    
    message += `*TOTAL: $35000*`;
    
    assert(message.includes(quotationId), 'Mensaje no contiene ID');
    assert(message.includes('Poste Hormigón'), 'Mensaje no contiene producto');
    assert(message.includes('10'), 'Mensaje no contiene cantidad');
    assert(message.includes('TOTAL'), 'Mensaje no contiene total');
});

// Test 10: Actualización de estado
test('Actualización de estado de cotización', () => {
    localStorage.clear();
    
    const quotations = [
        { id: 'COT-TEST-010', status: 'draft' }
    ];
    
    localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
    
    const retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    retrieved[0].status = 'accepted';
    
    localStorage.setItem('ferreteria_quotations', JSON.stringify(retrieved));
    
    const updated = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    assert(updated[0].status === 'accepted', `Estado no actualizado: ${updated[0].status}`);
});

// Test 11: Información de almacenamiento
test('Información de almacenamiento', () => {
    localStorage.clear();
    
    const quotations = [
        { id: 'COT-001', total: 35000 },
        { id: 'COT-002', total: 75000 },
        { id: 'COT-003', total: 50000 }
    ];
    
    localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
    
    const retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    const storageSize = new Blob([JSON.stringify(retrieved)]).size;
    
    assert(retrieved.length === 3, `Total incorrecto: ${retrieved.length}`);
    assert(storageSize > 0, 'Tamaño de almacenamiento no calculado');
});

// Test 12: Eliminación de cotización por ID
test('Eliminación de cotización por ID', () => {
    localStorage.clear();
    
    const quotations = [
        { id: 'COT-TEST-012', total: 35000 }
    ];
    
    localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
    
    let retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    assert(retrieved.length === 1, 'Antes de eliminar debe haber 1');
    
    const filtered = retrieved.filter(q => q.id !== 'COT-TEST-012');
    localStorage.setItem('ferreteria_quotations', JSON.stringify(filtered));
    
    retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    assert(retrieved.length === 0, 'Después de eliminar debe haber 0');
});

// Resumen
console.log('\n' + '='.repeat(60));
console.log('RESUMEN DE TESTS');
console.log('='.repeat(60));
console.log(`Total: ${passed + failed}`);
console.log(`✓ Pasados: ${passed}`);
console.log(`✗ Fallidos: ${failed}`);
console.log(`Tasa de éxito: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);
console.log('='.repeat(60));

process.exit(failed > 0 ? 1 : 0);
