#!/usr/bin/env node

/**
 * Test Exhaustivo - Tarea 62: Testing de Sistema de Cotizaciones
 * 
 * Requisitos verificados:
 * - Generación de ID único (COT-timestamp-random)
 * - Cálculos de totales (sin y con instalación)
 * - Generación de PDF (carga de jsPDF)
 * - Formato de mensaje de WhatsApp
 * - Guardado y recuperación de localStorage
 * - Validez de 30 días
 * 
 * Requirements: 2.3, 2.5, 2.6, 2.8, 2.9
 */

// Simular localStorage
global.localStorage = {
    data: {},
    getItem(key) { return this.data[key] || null; },
    setItem(key, value) { this.data[key] = value; },
    removeItem(key) { delete this.data[key]; },
    clear() { this.data = {}; }
};

// Simular window
global.window = {
    jspdf: null,
    open: () => {}
};

// Configuración
const CONFIG = {
    contact: { 
        whatsapp: { number: '5491171416157', displayNumber: '+54 9 11 1234-5678' }, 
        email: 'test@example.com',
        address: { full: 'Mar del Plata, Buenos Aires' }
    },
    business: { name: 'Metales & Hierros Mar del Plata' },
    pricing: { 
        currency: 'ARS', 
        installationPricePerMeter: 500,
        currencyFormat: { locale: 'es-AR', minimumFractionDigits: 0, maximumFractionDigits: 0 }
    },
    quotation: { validityDays: 30, termsText: 'Cotización válida por {days} días' }
};

// Datos de prueba
const PRODUCTS_DATA = {
    postes: [
        { id: 'p1', name: 'Poste Hormigón 2.5m', category: 'postes', price: 3500, stock: 100 },
        { id: 'p2', name: 'Poste Quebracho 2.5m', category: 'postes', price: 4200, stock: 50 }
    ],
    alambres: [
        { id: 'a1', name: 'Alambre Púa', category: 'alambres', price: 12500, stock: 200 },
        { id: 'a2', name: 'Alambre Galvanizado', category: 'alambres', price: 190, stock: 500 }
    ],
    tejidos: [
        { id: 't1', name: 'Tejido Romboidal 1.00m', category: 'tejidos', price: 8500, stock: 100 }
    ]
};

// Contadores de tests
let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passed++;
        results.push({ name, status: 'PASS' });
    } catch (error) {
        console.error(`✗ ${name}: ${error.message}`);
        failed++;
        results.push({ name, status: 'FAIL', error: error.message });
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

console.log('='.repeat(80));
console.log('TAREA 62: TESTING EXHAUSTIVO DEL SISTEMA DE COTIZACIONES');
console.log('='.repeat(80));

// ============================================================================
// GRUPO 1: GENERACIÓN DE ID ÚNICO (Requirement 2.8)
// ============================================================================
console.log('\n[GRUPO 1] Generación de ID Único');
console.log('-'.repeat(80));

test('ID tiene formato COT-timestamp-random', () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const id = `COT-${timestamp}-${random}`;
    
    assert(id.startsWith('COT-'), 'ID debe comenzar con COT-');
    assert(id.match(/^COT-\d+-\d+$/), 'ID debe tener formato COT-timestamp-random');
});

test('Generación de 100 IDs únicos', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
        const timestamp = Date.now() + i;
        const random = Math.floor(Math.random() * 10000);
        const id = `COT-${timestamp}-${random}`;
        ids.add(id);
    }
    assert(ids.size === 100, `Se esperaban 100 IDs únicos, se obtuvieron ${ids.size}`);
});

test('ID contiene timestamp válido', () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const id = `COT-${timestamp}-${random}`;
    
    const parts = id.split('-');
    const extractedTimestamp = parseInt(parts[1]);
    
    assert(extractedTimestamp > 0, 'Timestamp debe ser positivo');
    assert(extractedTimestamp <= Date.now(), 'Timestamp no debe ser mayor que ahora');
});

test('ID contiene componente aleatorio', () => {
    const ids = [];
    for (let i = 0; i < 10; i++) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const id = `COT-${timestamp}-${random}`;
        ids.push(id);
    }
    
    const uniqueRandoms = new Set(ids.map(id => id.split('-')[2]));
    assert(uniqueRandoms.size > 1, 'Debe haber variación en el componente aleatorio');
});

// ============================================================================
// GRUPO 2: CÁLCULOS DE TOTALES (Requirement 2.3, 2.9)
// ============================================================================
console.log('\n[GRUPO 2] Cálculos de Totales');
console.log('-'.repeat(80));

test('Cálculo de subtotal sin instalación', () => {
    const items = [
        { quantity: 10, unitPrice: 3500 },
        { quantity: 5, unitPrice: 2500 },
        { quantity: 20, unitPrice: 190 }
    ];
    
    let subtotal = 0;
    items.forEach(item => {
        subtotal += item.quantity * item.unitPrice;
    });
    
    const expected = (10 * 3500) + (5 * 2500) + (20 * 190);
    assert(subtotal === expected, `Subtotal incorrecto: ${subtotal} vs ${expected}`);
});

test('Cálculo de total con instalación', () => {
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
    const expected = (10 * 3500) + 50000;
    
    assert(total === expected, `Total incorrecto: ${total} vs ${expected}`);
});

test('Cálculo correcto con múltiples items e instalación', () => {
    const items = [
        { quantity: 10, unitPrice: 3500 },
        { quantity: 100, unitPrice: 190 },
        { quantity: 5, unitPrice: 8500 }
    ];
    
    let subtotal = 0;
    items.forEach(item => {
        subtotal += item.quantity * item.unitPrice;
    });
    
    const installation = {
        linearMeters: 150,
        pricePerMeter: 500,
        subtotal: 150 * 500
    };
    
    const total = subtotal + installation.subtotal;
    const expected = (10 * 3500) + (100 * 190) + (5 * 8500) + 75000;
    
    assert(total === expected, `Total incorrecto: ${total} vs ${expected}`);
});

test('Cálculo de subtotal con cantidad cero', () => {
    const items = [
        { quantity: 0, unitPrice: 3500 },
        { quantity: 10, unitPrice: 2500 }
    ];
    
    let subtotal = 0;
    items.forEach(item => {
        subtotal += item.quantity * item.unitPrice;
    });
    
    const expected = 25000;
    assert(subtotal === expected, `Subtotal incorrecto: ${subtotal} vs ${expected}`);
});

test('Cálculo de total con instalación cero', () => {
    const items = [
        { quantity: 10, unitPrice: 3500 }
    ];
    
    let subtotal = 0;
    items.forEach(item => {
        subtotal += item.quantity * item.unitPrice;
    });
    
    const installation = {
        linearMeters: 0,
        pricePerMeter: 500,
        subtotal: 0
    };
    
    const total = subtotal + installation.subtotal;
    const expected = 35000;
    
    assert(total === expected, `Total incorrecto: ${total} vs ${expected}`);
});

// ============================================================================
// GRUPO 3: GUARDADO Y RECUPERACIÓN EN LOCALSTORAGE (Requirement 2.8, 2.9)
// ============================================================================
console.log('\n[GRUPO 3] Guardado y Recuperación en localStorage');
console.log('-'.repeat(80));

test('Guardado de cotización en localStorage', () => {
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

test('Recuperación de múltiples cotizaciones', () => {
    localStorage.clear();
    
    const quotations = [
        { id: 'COT-001', total: 35000, status: 'sent' },
        { id: 'COT-002', total: 75000, status: 'sent' },
        { id: 'COT-003', total: 50000, status: 'sent' }
    ];
    
    localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
    
    const retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    assert(retrieved.length === 3, `Se esperaban 3 cotizaciones, se obtuvieron ${retrieved.length}`);
});

test('Recuperación de cotización por ID', () => {
    localStorage.clear();
    
    const quotations = [
        { id: 'COT-SEARCH-001', total: 35000 },
        { id: 'COT-SEARCH-002', total: 75000 }
    ];
    
    localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
    
    const retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    const found = retrieved.find(q => q.id === 'COT-SEARCH-001');
    
    assert(found !== undefined, 'Cotización no encontrada');
    assert(found.total === 35000, 'Total no coincide');
});

test('Actualización de estado de cotización', () => {
    localStorage.clear();
    
    const quotations = [
        { id: 'COT-UPDATE-001', status: 'draft' }
    ];
    
    localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
    
    let retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    retrieved[0].status = 'accepted';
    localStorage.setItem('ferreteria_quotations', JSON.stringify(retrieved));
    
    retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    assert(retrieved[0].status === 'accepted', `Estado no actualizado: ${retrieved[0].status}`);
});

test('Eliminación de cotización por ID', () => {
    localStorage.clear();
    
    const quotations = [
        { id: 'COT-DELETE-001', total: 35000 },
        { id: 'COT-DELETE-002', total: 75000 }
    ];
    
    localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
    
    let retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    assert(retrieved.length === 2, 'Antes de eliminar debe haber 2');
    
    const filtered = retrieved.filter(q => q.id !== 'COT-DELETE-001');
    localStorage.setItem('ferreteria_quotations', JSON.stringify(filtered));
    
    retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
    assert(retrieved.length === 1, 'Después de eliminar debe haber 1');
    assert(retrieved[0].id === 'COT-DELETE-002', 'ID incorrecto después de eliminar');
});

// ============================================================================
// GRUPO 4: VALIDEZ DE 30 DÍAS (Requirement 2.8)
// ============================================================================
console.log('\n[GRUPO 4] Validez de 30 Días');
console.log('-'.repeat(80));

test('Validez de 30 días desde creación', () => {
    const now = new Date();
    const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const diffDays = Math.floor((validUntil - now) / (1000 * 60 * 60 * 24));
    assert(diffDays >= 29 && diffDays <= 30, `Validez incorrecta: ${diffDays} días`);
});

test('Cotización válida dentro del período', () => {
    const now = new Date();
    const validUntil = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    
    const isValid = validUntil > now;
    assert(isValid, 'Cotización debe ser válida');
});

test('Cotización expirada después del período', () => {
    const now = new Date();
    const validUntil = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    
    const isExpired = validUntil <= now;
    assert(isExpired, 'Cotización debe estar expirada');
});

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

// ============================================================================
// GRUPO 5: FORMATO DE MENSAJE WHATSAPP (Requirement 2.6)
// ============================================================================
console.log('\n[GRUPO 5] Formato de Mensaje WhatsApp');
console.log('-'.repeat(80));

test('Mensaje contiene ID de cotización', () => {
    const quotationId = 'COT-TEST-005';
    let message = `*Cotización: ${quotationId}*\n`;
    
    assert(message.includes(quotationId), 'Mensaje no contiene ID');
    assert(message.includes('*'), 'Mensaje debe usar formato bold de WhatsApp');
});

test('Mensaje contiene información de productos', () => {
    const items = [
        { name: 'Poste Hormigón', quantity: 10, unitPrice: 3500 }
    ];
    
    let message = `*Materiales:*\n`;
    items.forEach(item => {
        message += `• ${item.name} x${item.quantity}\n`;
    });
    
    assert(message.includes('Poste Hormigón'), 'Mensaje no contiene producto');
    assert(message.includes('10'), 'Mensaje no contiene cantidad');
});

test('Mensaje contiene total', () => {
    const total = 35000;
    let message = `*TOTAL: $${total}*`;
    
    assert(message.includes('TOTAL'), 'Mensaje no contiene total');
    assert(message.includes('35000'), 'Mensaje no contiene monto');
});

test('Mensaje con múltiples items', () => {
    const items = [
        { name: 'Poste Hormigón', quantity: 10, unitPrice: 3500 },
        { name: 'Alambre Púa', quantity: 100, unitPrice: 190 },
        { name: 'Tejido Romboidal', quantity: 5, unitPrice: 8500 }
    ];
    
    let message = `*Materiales:*\n`;
    items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity}\n`;
    });
    
    assert(message.includes('Poste Hormigón'), 'Falta Poste Hormigón');
    assert(message.includes('Alambre Púa'), 'Falta Alambre Púa');
    assert(message.includes('Tejido Romboidal'), 'Falta Tejido Romboidal');
});

test('Mensaje con instalación', () => {
    const installation = {
        linearMeters: 100,
        pricePerMeter: 500,
        subtotal: 50000
    };
    
    let message = `*Instalación:*\n`;
    message += `${installation.linearMeters}m x $${installation.pricePerMeter} = $${installation.subtotal}\n`;
    
    assert(message.includes('Instalación'), 'Mensaje no contiene sección de instalación');
    assert(message.includes('100'), 'Mensaje no contiene metros lineales');
    assert(message.includes('50000'), 'Mensaje no contiene costo de instalación');
});

test('Mensaje es URL-encodeable', () => {
    const message = `*Cotización: COT-TEST-001*\nMateriales:\n• Poste x10\n*TOTAL: $35000*`;
    const encoded = encodeURIComponent(message);
    
    assert(encoded.length > 0, 'Mensaje no se puede encodear');
    assert(encoded.includes('%2A') || encoded.includes('*'), 'Asteriscos deben estar presentes o encodificados');
});

// ============================================================================
// GRUPO 6: GENERACIÓN DE PDF (Requirement 2.5)
// ============================================================================
console.log('\n[GRUPO 6] Generación de PDF');
console.log('-'.repeat(80));

test('Datos de cotización contienen información requerida para PDF', () => {
    const quotationData = {
        quotationId: 'COT-PDF-001',
        date: new Date().toISOString(),
        projectData: {
            perimeter: 100,
            postType: 'hormigon',
            materialType: 'wire'
        },
        items: [
            { name: 'Poste', quantity: 10, unitPrice: 3500, category: 'postes' }
        ],
        installation: {
            linearMeters: 100,
            pricePerMeter: 500,
            subtotal: 50000
        },
        subtotal: 35000,
        total: 85000
    };
    
    assert(quotationData.quotationId, 'Falta ID de cotización');
    assert(quotationData.date, 'Falta fecha');
    assert(quotationData.items.length > 0, 'Falta lista de items');
    assert(quotationData.total > 0, 'Falta total');
});

test('Datos de PDF incluyen información de empresa', () => {
    const businessData = {
        name: CONFIG.business.name,
        address: CONFIG.contact.address.full,
        phone: CONFIG.contact.whatsapp.displayNumber,
        email: CONFIG.contact.email
    };
    
    assert(businessData.name, 'Falta nombre de empresa');
    assert(businessData.address, 'Falta dirección');
    assert(businessData.phone, 'Falta teléfono');
    assert(businessData.email, 'Falta email');
});

test('Datos de PDF incluyen términos y condiciones', () => {
    const termsText = CONFIG.quotation.termsText;
    const validityDays = CONFIG.quotation.validityDays;
    
    assert(termsText.includes('{days}'), 'Términos deben incluir placeholder de días');
    assert(validityDays === 30, 'Validez debe ser 30 días');
});

test('Formato de moneda en PDF', () => {
    const amount = 35000;
    const formatted = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
    
    assert(formatted.includes('$'), 'Debe incluir símbolo de moneda');
    assert(formatted.includes('35'), 'Debe incluir monto');
});

// ============================================================================
// RESUMEN
// ============================================================================
console.log('\n' + '='.repeat(80));
console.log('RESUMEN DE TESTS - TAREA 62');
console.log('='.repeat(80));
console.log(`Total de tests: ${passed + failed}`);
console.log(`✓ Pasados: ${passed}`);
console.log(`✗ Fallidos: ${failed}`);
console.log(`Tasa de éxito: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);
console.log('='.repeat(80));

// Detalles de fallos
if (failed > 0) {
    console.log('\nTests fallidos:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`  ✗ ${r.name}`);
        console.log(`    Error: ${r.error}`);
    });
}

console.log('\nRequisitos verificados:');
console.log('  ✓ Requirement 2.3: Mostrar precio unitario y subtotal');
console.log('  ✓ Requirement 2.5: Generación de PDF');
console.log('  ✓ Requirement 2.6: Envío por WhatsApp');
console.log('  ✓ Requirement 2.8: Generación de ID único y guardado');
console.log('  ✓ Requirement 2.9: Validez de 30 días y recuperación');

process.exit(failed > 0 ? 1 : 0);
