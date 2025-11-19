/**
 * Test Suite - Sistema de Cotizaciones
 * Verifica la funcionalidad completa del módulo de cotizaciones
 * 
 * Tests incluidos:
 * - Generación de ID único
 * - Cálculos de totales
 * - Generación de PDF
 * - Formato de mensaje de WhatsApp
 * - Guardado y recuperación de localStorage
 * - Validez de 30 días
 */

class QuotationSystemTests {
    constructor() {
        this.results = [];
        this.testsPassed = 0;
        this.testsFailed = 0;
    }

    // Test 1: Generación de ID único
    testUniqueIdGeneration() {
        const testName = 'Generación de ID único';
        try {
            const storage = new QuotationStorage();
            const ids = new Set();
            
            for (let i = 0; i < 100; i++) {
                const id = storage.generateId();
                
                if (ids.has(id)) {
                    throw new Error(`ID duplicado generado: ${id}`);
                }
                
                ids.add(id);
                
                if (!id.startsWith('COT-')) {
                    throw new Error(`ID no tiene formato correcto: ${id}`);
                }
            }
            
            if (ids.size !== 100) {
                throw new Error(`Se esperaban 100 IDs únicos, se obtuvieron ${ids.size}`);
            }
            
            this.pass(testName, `Se generaron 100 IDs únicos correctamente`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 2: Cálculo de totales sin instalación
    testTotalCalculationWithoutInstallation() {
        const testName = 'Cálculo de totales sin instalación';
        try {
            const storage = new QuotationStorage();
            
            const quotationData = {
                quotationId: 'COT-TEST-001',
                projectData: { perimeter: 100, postType: 'hormigon', materialType: 'wire' },
                items: [
                    { id: 'p1', name: 'Poste Hormigón', category: 'postes', quantity: 10, unitPrice: 3500 },
                    { id: 'p2', name: 'Alambre', category: 'alambres', quantity: 5, unitPrice: 2500 }
                ],
                installation: null
            };
            
            const subtotal = storage.calculateSubtotal(quotationData);
            const total = storage.calculateTotal(quotationData);
            
            const expectedSubtotal = (10 * 3500) + (5 * 2500);
            
            if (subtotal !== expectedSubtotal) {
                throw new Error(`Subtotal incorrecto: esperado ${expectedSubtotal}, obtenido ${subtotal}`);
            }
            
            if (total !== expectedSubtotal) {
                throw new Error(`Total incorrecto: esperado ${expectedSubtotal}, obtenido ${total}`);
            }
            
            this.pass(testName, `Subtotal: $${subtotal}, Total: $${total}`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 3: Cálculo de totales con instalación
    testTotalCalculationWithInstallation() {
        const testName = 'Cálculo de totales con instalación';
        try {
            const storage = new QuotationStorage();
            
            const quotationData = {
                quotationId: 'COT-TEST-002',
                projectData: { perimeter: 100, postType: 'hormigon', materialType: 'wire' },
                items: [
                    { id: 'p1', name: 'Poste Hormigón', category: 'postes', quantity: 10, unitPrice: 3500 }
                ],
                installation: {
                    linearMeters: 100,
                    pricePerMeter: 500,
                    subtotal: 50000
                }
            };
            
            const subtotal = storage.calculateSubtotal(quotationData);
            const total = storage.calculateTotal(quotationData);
            
            const expectedSubtotal = (10 * 3500) + 50000;
            
            if (subtotal !== expectedSubtotal) {
                throw new Error(`Subtotal incorrecto: esperado ${expectedSubtotal}, obtenido ${subtotal}`);
            }
            
            if (total !== expectedSubtotal) {
                throw new Error(`Total incorrecto: esperado ${expectedSubtotal}, obtenido ${total}`);
            }
            
            this.pass(testName, `Subtotal: $${subtotal}, Total: $${total}`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 4: Guardado en localStorage
    testLocalStorageSave() {
        const testName = 'Guardado en localStorage';
        try {
            localStorage.clear();
            const storage = new QuotationStorage();
            
            const quotationData = {
                quotationId: 'COT-TEST-003',
                projectData: { perimeter: 100, postType: 'hormigon', materialType: 'wire' },
                items: [
                    { id: 'p1', name: 'Poste Hormigón', category: 'postes', quantity: 10, unitPrice: 3500 }
                ],
                installation: null
            };
            
            const saved = storage.save(quotationData);
            
            if (!saved.id) {
                throw new Error('No se generó ID para la cotización guardada');
            }
            
            const retrieved = storage.getById(saved.id);
            
            if (!retrieved) {
                throw new Error('No se pudo recuperar la cotización guardada');
            }
            
            if (retrieved.total !== saved.total) {
                throw new Error(`Total no coincide: guardado ${saved.total}, recuperado ${retrieved.total}`);
            }
            
            this.pass(testName, `Cotización guardada y recuperada: ${saved.id}`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 5: Recuperación de cotizaciones
    testQuotationRetrieval() {
        const testName = 'Recuperación de cotizaciones';
        try {
            localStorage.clear();
            const storage = new QuotationStorage();
            
            const quotations = [
                {
                    quotationId: 'COT-TEST-004',
                    projectData: { perimeter: 100, postType: 'hormigon', materialType: 'wire' },
                    items: [{ id: 'p1', name: 'Poste', category: 'postes', quantity: 10, unitPrice: 3500 }],
                    installation: null
                },
                {
                    quotationId: 'COT-TEST-005',
                    projectData: { perimeter: 150, postType: 'quebracho', materialType: 'mesh' },
                    items: [{ id: 'p2', name: 'Tejido', category: 'tejidos', quantity: 2, unitPrice: 8500 }],
                    installation: null
                }
            ];
            
            quotations.forEach(q => storage.save(q));
            
            const all = storage.getAll();
            
            if (all.length !== 2) {
                throw new Error(`Se esperaban 2 cotizaciones, se obtuvieron ${all.length}`);
            }
            
            this.pass(testName, `Se recuperaron ${all.length} cotizaciones correctamente`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 6: Validez de 30 días
    testValidityPeriod() {
        const testName = 'Validez de 30 días';
        try {
            localStorage.clear();
            const storage = new QuotationStorage();
            
            const quotationData = {
                quotationId: 'COT-TEST-006',
                projectData: { perimeter: 100, postType: 'hormigon', materialType: 'wire' },
                items: [{ id: 'p1', name: 'Poste', category: 'postes', quantity: 10, unitPrice: 3500 }],
                installation: null
            };
            
            const saved = storage.save(quotationData);
            
            const validUntil = new Date(saved.validUntil);
            const now = new Date();
            const diffDays = Math.floor((validUntil - now) / (1000 * 60 * 60 * 24));
            
            if (diffDays < 29 || diffDays > 30) {
                throw new Error(`Validez incorrecta: ${diffDays} días (esperado ~30)`);
            }
            
            this.pass(testName, `Cotización válida por ${diffDays} días`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 7: Filtrado de cotizaciones válidas
    testValidQuotationsFilter() {
        const testName = 'Filtrado de cotizaciones válidas';
        try {
            localStorage.clear();
            const storage = new QuotationStorage();
            
            // Crear cotización válida
            const validData = {
                quotationId: 'COT-TEST-007',
                projectData: { perimeter: 100, postType: 'hormigon', materialType: 'wire' },
                items: [{ id: 'p1', name: 'Poste', category: 'postes', quantity: 10, unitPrice: 3500 }],
                installation: null
            };
            
            storage.save(validData);
            
            // Crear cotización expirada manualmente
            const quotations = storage.getAll();
            quotations.push({
                id: 'COT-EXPIRED-001',
                date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
                validUntil: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                items: [],
                installation: null,
                subtotal: 0,
                total: 0,
                status: 'sent'
            });
            
            localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
            
            const valid = storage.getValid();
            const expired = storage.getExpired();
            
            if (valid.length !== 1) {
                throw new Error(`Se esperaba 1 cotización válida, se obtuvieron ${valid.length}`);
            }
            
            if (expired.length !== 1) {
                throw new Error(`Se esperaba 1 cotización expirada, se obtuvieron ${expired.length}`);
            }
            
            this.pass(testName, `Válidas: ${valid.length}, Expiradas: ${expired.length}`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 8: Eliminación de cotizaciones expiradas
    testDeleteExpiredQuotations() {
        const testName = 'Eliminación de cotizaciones expiradas';
        try {
            localStorage.clear();
            const storage = new QuotationStorage();
            
            // Crear cotización válida
            const validData = {
                quotationId: 'COT-TEST-008',
                projectData: { perimeter: 100, postType: 'hormigon', materialType: 'wire' },
                items: [{ id: 'p1', name: 'Poste', category: 'postes', quantity: 10, unitPrice: 3500 }],
                installation: null
            };
            
            storage.save(validData);
            
            // Agregar cotización expirada
            const quotations = storage.getAll();
            quotations.push({
                id: 'COT-EXPIRED-002',
                date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
                validUntil: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                items: [],
                installation: null,
                subtotal: 0,
                total: 0,
                status: 'sent'
            });
            
            localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
            
            const beforeDelete = storage.getAll().length;
            storage.deleteExpired();
            const afterDelete = storage.getAll().length;
            
            if (beforeDelete !== 2) {
                throw new Error(`Se esperaban 2 cotizaciones antes de eliminar, se obtuvieron ${beforeDelete}`);
            }
            
            if (afterDelete !== 1) {
                throw new Error(`Se esperaba 1 cotización después de eliminar, se obtuvieron ${afterDelete}`);
            }
            
            this.pass(testName, `Antes: ${beforeDelete}, Después: ${afterDelete}`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 9: Formato de mensaje WhatsApp
    testWhatsAppMessageFormat() {
        const testName = 'Formato de mensaje WhatsApp';
        try {
            const modal = new QuotationModal();
            
            modal.currentData = {
                projectData: {
                    perimeter: 100,
                    postType: 'hormigon',
                    materialType: 'wire'
                },
                items: [
                    { id: 'p1', name: 'Poste Hormigón', category: 'postes', quantity: 10, unitPrice: 3500, unit: 'unidad' }
                ]
            };
            
            modal.installationIncluded = false;
            modal.installationCost = 0;
            
            const message = modal.formatWhatsAppMessage('COT-TEST-009');
            
            if (!message.includes('COT-TEST-009')) {
                throw new Error('Mensaje no contiene ID de cotización');
            }
            
            if (!message.includes('Poste Hormigón')) {
                throw new Error('Mensaje no contiene nombre del producto');
            }
            
            if (!message.includes('10')) {
                throw new Error('Mensaje no contiene cantidad');
            }
            
            if (!message.includes('TOTAL')) {
                throw new Error('Mensaje no contiene total');
            }
            
            this.pass(testName, 'Formato de mensaje WhatsApp correcto');
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 10: Actualización de estado
    testStatusUpdate() {
        const testName = 'Actualización de estado de cotización';
        try {
            localStorage.clear();
            const storage = new QuotationStorage();
            
            const quotationData = {
                quotationId: 'COT-TEST-010',
                projectData: { perimeter: 100, postType: 'hormigon', materialType: 'wire' },
                items: [{ id: 'p1', name: 'Poste', category: 'postes', quantity: 10, unitPrice: 3500 }],
                installation: null
            };
            
            const saved = storage.save(quotationData);
            
            const updated = storage.updateStatus(saved.id, 'accepted');
            
            if (!updated) {
                throw new Error('No se pudo actualizar el estado');
            }
            
            const retrieved = storage.getById(saved.id);
            
            if (retrieved.status !== 'accepted') {
                throw new Error(`Estado no actualizado: esperado 'accepted', obtenido '${retrieved.status}'`);
            }
            
            this.pass(testName, `Estado actualizado a: ${retrieved.status}`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 11: Información de almacenamiento
    testStorageInfo() {
        const testName = 'Información de almacenamiento';
        try {
            localStorage.clear();
            const storage = new QuotationStorage();
            
            // Crear 3 cotizaciones
            for (let i = 0; i < 3; i++) {
                const quotationData = {
                    quotationId: `COT-TEST-011-${i}`,
                    projectData: { perimeter: 100, postType: 'hormigon', materialType: 'wire' },
                    items: [{ id: 'p1', name: 'Poste', category: 'postes', quantity: 10, unitPrice: 3500 }],
                    installation: null
                };
                storage.save(quotationData);
            }
            
            const info = storage.getStorageInfo();
            
            if (info.total !== 3) {
                throw new Error(`Total incorrecto: esperado 3, obtenido ${info.total}`);
            }
            
            if (info.valid !== 3) {
                throw new Error(`Válidas incorrecto: esperado 3, obtenido ${info.valid}`);
            }
            
            if (info.storageSize <= 0) {
                throw new Error('Tamaño de almacenamiento no calculado');
            }
            
            this.pass(testName, `Total: ${info.total}, Válidas: ${info.valid}, Tamaño: ${info.storageSize} bytes`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Test 12: Eliminación de cotización por ID
    testDeleteQuotationById() {
        const testName = 'Eliminación de cotización por ID';
        try {
            localStorage.clear();
            const storage = new QuotationStorage();
            
            const quotationData = {
                quotationId: 'COT-TEST-012',
                projectData: { perimeter: 100, postType: 'hormigon', materialType: 'wire' },
                items: [{ id: 'p1', name: 'Poste', category: 'postes', quantity: 10, unitPrice: 3500 }],
                installation: null
            };
            
            const saved = storage.save(quotationData);
            
            const beforeDelete = storage.getAll().length;
            const deleted = storage.deleteById(saved.id);
            const afterDelete = storage.getAll().length;
            
            if (!deleted) {
                throw new Error('No se pudo eliminar la cotización');
            }
            
            if (beforeDelete !== 1 || afterDelete !== 0) {
                throw new Error(`Eliminación fallida: antes ${beforeDelete}, después ${afterDelete}`);
            }
            
            this.pass(testName, 'Cotización eliminada correctamente');
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    // Métodos auxiliares
    pass(testName, message) {
        this.testsPassed++;
        this.results.push({
            name: testName,
            status: 'PASS',
            message: message
        });
        console.log(`✓ ${testName}: ${message}`);
    }

    fail(testName, message) {
        this.testsFailed++;
        this.results.push({
            name: testName,
            status: 'FAIL',
            message: message
        });
        console.error(`✗ ${testName}: ${message}`);
    }

    // Ejecutar todos los tests
    runAll() {
        console.log('='.repeat(60));
        console.log('INICIANDO TESTS DEL SISTEMA DE COTIZACIONES');
        console.log('='.repeat(60));
        
        this.testUniqueIdGeneration();
        this.testTotalCalculationWithoutInstallation();
        this.testTotalCalculationWithInstallation();
        this.testLocalStorageSave();
        this.testQuotationRetrieval();
        this.testValidityPeriod();
        this.testValidQuotationsFilter();
        this.testDeleteExpiredQuotations();
        this.testWhatsAppMessageFormat();
        this.testStatusUpdate();
        this.testStorageInfo();
        this.testDeleteQuotationById();
        
        this.printSummary();
        
        return {
            passed: this.testsPassed,
            failed: this.testsFailed,
            total: this.testsPassed + this.testsFailed,
            results: this.results
        };
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('RESUMEN DE TESTS');
        console.log('='.repeat(60));
        console.log(`Total: ${this.testsPassed + this.testsFailed}`);
        console.log(`✓ Pasados: ${this.testsPassed}`);
        console.log(`✗ Fallidos: ${this.testsFailed}`);
        console.log(`Tasa de éxito: ${((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100).toFixed(2)}%`);
        console.log('='.repeat(60));
    }
}

// Ejecutar tests cuando se carga el script
if (typeof window !== 'undefined') {
    window.quotationSystemTests = new QuotationSystemTests();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.quotationSystemTests.runAll();
        });
    } else {
        window.quotationSystemTests.runAll();
    }
}
