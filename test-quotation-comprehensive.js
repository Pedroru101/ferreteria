#!/usr/bin/env node

/**
 * Test Comprehensive - Sistema de Cotizaciones
 * Pruebas exhaustivas de todas las funcionalidades del módulo de cotizaciones
 * 
 * Requisitos verificados:
 * - Generación de ID único
 * - Cálculos de totales
 * - Generación de PDF
 * - Formato de mensaje de WhatsApp
 * - Guardado y recuperación de localStorage
 * - Validez de 30 días
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

// Configuración mínima
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

// Tests
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

console.log('='.repeat(70));
console.log('TESTS EXHAUSTIVOS DEL SISTEMA DE COTIZACIONES');
console.log('='.repeat(70));

// ============================================================================
// GRUPO 1: GENERACIÓN DE ID ÚNICO
// ============================================================================
console.