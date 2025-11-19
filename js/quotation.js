/**
 * Quotation Module - Sistema de cotizaciones
 * Maneja la generación, visualización y gestión de cotizaciones
 * 
 * Funcionalidades de almacenamiento:
 * - Guardado automático en localStorage al enviar por WhatsApp o descargar PDF
 * - Validez configurable (por defecto 30 días)
 * - Precios originales mantenidos en la cotización guardada
 * - Recuperación de cotizaciones por ID
 * - Filtrado de cotizaciones válidas y expiradas
 * - Limpieza automática de cotizaciones expiradas
 * 
 * Uso:
 * - getQuotationById(id): Recuperar cotización por ID
 * - getAllQuotations(): Obtener todas las cotizaciones
 * - getValidQuotations(): Obtener cotizaciones válidas
 * - getExpiredQuotations(): Obtener cotizaciones expiradas
 * - deleteQuotation(id): Eliminar cotización por ID
 * - cleanExpiredQuotations(): Limpiar cotizaciones expiradas
 * - getQuotationStorageInfo(): Información del almacenamiento
 */

class Quotation {
    constructor() {
        this.id = this.generateId();
        this.date = new Date();
        this.validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        this.items = [];
        this.installation = null;
        this.subtotal = 0;
        this.total = 0;
        this.status = 'draft';
    }

    generateId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `COT-${timestamp}-${random}`;
    }

    addItem(product, quantity, unitPrice) {
        this.items.push({
            id: product.id,
            name: product.name,
            category: product.category || 'general',
            quantity: quantity,
            unitPrice: unitPrice,
            subtotal: quantity * unitPrice
        });
        this.recalculate();
    }

    addInstallation(meters, pricePerMeter) {
        this.installation = {
            linearMeters: meters,
            pricePerMeter: pricePerMeter,
            subtotal: meters * pricePerMeter
        };
        this.recalculate();
    }

    recalculate() {
        this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
        if (this.installation) {
            this.subtotal += this.installation.subtotal;
        }
        this.total = this.subtotal;
    }

    toJSON() {
        return {
            id: this.id,
            date: this.date.toISOString(),
            validUntil: this.validUntil.toISOString(),
            items: this.items,
            installation: this.installation,
            subtotal: this.subtotal,
            total: this.total,
            status: this.status
        };
    }
}

class PriceManager {
    constructor() {
        this.products = null;
        this.pricesLoaded = false;
        this.loadingPromise = null;
    }

    async loadPrices() {
        if (this.pricesLoaded && this.products) {
            return this.products;
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this._loadPricesInternal();
        return this.loadingPromise;
    }

    async _loadPricesInternal() {
        try {
            if (CONFIG.products.enableGoogleSheets && typeof productsLoader !== 'undefined') {
                console.log('Intentando cargar precios desde Google Sheets...');
                const sheetsProducts = await productsLoader.loadProductos();
                
                if (sheetsProducts && sheetsProducts.length > 0) {
                    this.products = this._normalizeGoogleSheetsProducts(sheetsProducts);
                    this.pricesLoaded = true;
                    console.log(`✓ Precios cargados desde Google Sheets: ${this.products.length} productos`);
                    return this.products;
                }
            }
        } catch (error) {
            console.warn('Error al cargar desde Google Sheets, usando datos locales:', error);
        }

        if (typeof PRODUCTS_DATA !== 'undefined') {
            this.products = this._normalizeLocalProducts(PRODUCTS_DATA);
            this.pricesLoaded = true;
            console.log(`✓ Precios cargados desde products-data.js: ${this.products.length} productos`);
            return this.products;
        }

        console.error('No se pudieron cargar los precios desde ninguna fuente');
        this.products = [];
        return this.products;
    }

    _normalizeGoogleSheetsProducts(sheetsData) {
        return sheetsData.map(item => ({
            id: item.id || item.codigo || this._generateId(item.nombre),
            name: item.nombre || item.name || '',
            category: item.categoria || item.category || 'general',
            subcategory: item.subcategoria || item.subcategory || '',
            description: item.descripcion || item.description || '',
            price: parseFloat(item.precio || item.price || 0),
            priceUnit: item.unidad || item.unit || 'unidad',
            stock: parseInt(item.stock || 0),
            image: item.imagen || item.image || ''
        }));
    }

    _normalizeLocalProducts(productsData) {
        const allProducts = [];
        
        for (const category in productsData) {
            if (Array.isArray(productsData[category])) {
                productsData[category].forEach(product => {
                    allProducts.push({
                        id: product.id,
                        name: product.name,
                        category: product.category,
                        subcategory: product.subcategory || '',
                        description: product.description || '',
                        price: product.price || 0,
                        priceUnit: product.priceUnit || 'unidad',
                        stock: product.stock || 0,
                        image: product.image || '',
                        specs: product.specs || {}
                    });
                });
            }
        }
        
        return allProducts;
    }

    _generateId(name) {
        return name.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    }

    getProductPrice(productId, productName, category) {
        if (!this.products || this.products.length === 0) {
            return this._getFallbackPrice(productName, category);
        }

        const product = this.products.find(p => 
            p.id === productId || 
            p.name.toLowerCase() === productName.toLowerCase() ||
            p.name.toLowerCase().includes(productName.toLowerCase())
        );

        if (product && product.price > 0) {
            return {
                price: product.price,
                unit: product.priceUnit || 'unidad'
            };
        }

        return this._getFallbackPrice(productName, category);
    }

    _getFallbackPrice(productName, category) {
        const fallbackPrices = {
            'postes': {
                'hormigon': 3500,
                'quebracho': 4200,
                'eucalipto': 2100,
                'olimpo': 4000
            },
            'tejidos': {
                '1.00': 8500,
                '1.20': 10200,
                '1.50': 12800,
                '1.80': 15400,
                '2.00': 17000
            },
            'alambres': {
                'pua': 12500,
                'galvanizado': 190,
                'negro': 150
            },
            'accesorios': {
                'grampa': 850,
                'tensor': 320,
                'varilla': 450,
                'abrazadera': 280
            }
        };

        const nameLower = productName.toLowerCase();
        const categoryPrices = fallbackPrices[category];

        if (categoryPrices) {
            for (const key in categoryPrices) {
                if (nameLower.includes(key)) {
                    return {
                        price: categoryPrices[key],
                        unit: category === 'alambres' ? 'kg' : 'unidad'
                    };
                }
            }
        }

        return { price: 1000, unit: 'unidad' };
    }

    formatCurrency(amount) {
        const config = CONFIG.pricing || {};
        return new Intl.NumberFormat(config.currencyFormat?.locale || 'es-AR', {
            style: 'currency',
            currency: config.currency || 'ARS',
            minimumFractionDigits: config.currencyFormat?.minimumFractionDigits || 0,
            maximumFractionDigits: config.currencyFormat?.maximumFractionDigits || 0
        }).format(amount);
    }
}

class QuotationPDFGenerator {
    constructor(quotationData, config) {
        this.data = quotationData;
        this.config = config || CONFIG;
        this.priceManager = new PriceManager();
    }

    async loadJsPDF() {
        if (window.jspdf && window.jspdf.jsPDF) {
            return window.jspdf.jsPDF;
        }

        // Usar lazy loader si está disponible
        if (typeof lazyLoader !== 'undefined' && lazyLoader.loadJsPDF) {
            try {
                await lazyLoader.loadJsPDF();
                if (window.jspdf && window.jspdf.jsPDF) {
                    return window.jspdf.jsPDF;
                }
            } catch (error) {
                console.warn('Error con lazy loader, intentando carga directa:', error);
            }
        }

        // Fallback: carga directa
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                if (window.jspdf && window.jspdf.jsPDF) {
                    resolve(window.jspdf.jsPDF);
                } else {
                    reject(new Error('jsPDF no se cargó correctamente'));
                }
            };
            script.onerror = () => reject(new Error('Error al cargar jsPDF'));
            document.head.appendChild(script);
        });
    }

    async generate() {
        try {
            const jsPDF = await this.loadJsPDF();
            const doc = new jsPDF();

            let yPosition = 20;

            yPosition = this.addHeader(doc, yPosition);
            yPosition = this.addQuotationInfo(doc, yPosition);
            yPosition = this.addProjectInfo(doc, yPosition);
            yPosition = this.addItemsTable(doc, yPosition);
            yPosition = this.addTotals(doc, yPosition);
            yPosition = this.addFooter(doc, yPosition);

            return doc;
        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw error;
        }
    }

    addHeader(doc, yPosition) {
        const businessName = this.config.business?.name || 'Metales & Hierros Mar del Plata';
        const businessAddress = this.config.contact?.address?.full || 'Mar del Plata, Buenos Aires';
        const businessPhone = this.config.contact?.whatsapp?.displayNumber || '';
        const businessEmail = this.config.contact?.email || '';

        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 122, 62);
        doc.text(businessName, 105, yPosition, { align: 'center' });

        yPosition += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(74, 95, 74);
        doc.text(businessAddress, 105, yPosition, { align: 'center' });

        yPosition += 5;
        doc.text(`Tel: ${businessPhone} | Email: ${businessEmail}`, 105, yPosition, { align: 'center' });

        yPosition += 10;
        doc.setDrawColor(200, 230, 201);
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition);

        return yPosition + 10;
    }

    addQuotationInfo(doc, yPosition) {
        const quotationId = this.data.quotationId || 'N/A';
        const date = new Date().toLocaleDateString('es-AR');
        const validityDays = this.config.quotation?.validityDays || 30;
        const validUntil = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR');

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 77, 46);
        doc.text('COTIZACIÓN', 105, yPosition, { align: 'center' });

        yPosition += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(26, 26, 26);

        doc.text(`Número: ${quotationId}`, 20, yPosition);
        doc.text(`Fecha: ${date}`, 140, yPosition);

        yPosition += 6;
        doc.text(`Válida hasta: ${validUntil}`, 20, yPosition);

        return yPosition + 10;
    }

    addProjectInfo(doc, yPosition) {
        if (!this.data.projectData) {
            return yPosition;
        }

        const { projectData } = this.data;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 122, 62);
        doc.text('Información del Proyecto', 20, yPosition);

        yPosition += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(26, 26, 26);

        const postTypeNames = {
            'hormigon': 'Hormigón',
            'quebracho': 'Quebracho',
            'eucalipto': 'Eucalipto',
            'olimpo': 'Olimpo'
        };

        const materialTypeNames = {
            'wire': 'Alambre',
            'mesh': 'Tejido Romboidal'
        };

        doc.text(`Perímetro: ${projectData.perimeter?.toFixed(2) || 0} m`, 20, yPosition);
        doc.text(`Tipo de Poste: ${postTypeNames[projectData.postType] || projectData.postType}`, 100, yPosition);

        yPosition += 6;
        doc.text(`Material: ${materialTypeNames[projectData.materialType] || projectData.materialType}`, 20, yPosition);

        return yPosition + 10;
    }

    addItemsTable(doc, yPosition) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 122, 62);
        doc.text('Detalle de Materiales', 20, yPosition);

        yPosition += 8;

        doc.setFillColor(232, 245, 233);
        doc.rect(20, yPosition - 5, 170, 8, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 77, 46);
        doc.text('Producto', 22, yPosition);
        doc.text('Cant.', 120, yPosition);
        doc.text('Precio Unit.', 140, yPosition);
        doc.text('Subtotal', 170, yPosition);

        yPosition += 8;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(26, 26, 26);

        if (this.data.items && this.data.items.length > 0) {
            this.data.items.forEach((item, index) => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }

                const priceInfo = this.priceManager.getProductPrice(
                    item.id,
                    item.name,
                    item.category
                );

                const unitPrice = item.unitPrice || priceInfo.price;
                const subtotal = item.quantity * unitPrice;

                const productName = item.name.length > 45 ? item.name.substring(0, 42) + '...' : item.name;
                doc.text(productName, 22, yPosition);
                doc.text(item.quantity.toString(), 120, yPosition);
                doc.text(this.formatCurrency(unitPrice), 140, yPosition);
                doc.text(this.formatCurrency(subtotal), 170, yPosition);

                yPosition += 6;

                if (index < this.data.items.length - 1) {
                    doc.setDrawColor(200, 230, 201);
                    doc.setLineWidth(0.1);
                    doc.line(20, yPosition, 190, yPosition);
                    yPosition += 2;
                }
            });
        }

        if (this.data.installation && this.data.installation.linearMeters > 0) {
            yPosition += 4;
            doc.setDrawColor(200, 230, 201);
            doc.setLineWidth(0.1);
            doc.line(20, yPosition, 190, yPosition);
            yPosition += 6;

            doc.setFont('helvetica', 'bold');
            doc.text('Servicio de Instalación', 22, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(`${this.data.installation.linearMeters.toFixed(2)} m`, 120, yPosition);
            doc.text(this.formatCurrency(this.data.installation.pricePerMeter), 140, yPosition);
            doc.text(this.formatCurrency(this.data.installation.subtotal), 170, yPosition);

            yPosition += 6;
        }

        return yPosition + 5;
    }

    addTotals(doc, yPosition) {
        let subtotal = 0;

        if (this.data.items && this.data.items.length > 0) {
            this.data.items.forEach(item => {
                const priceInfo = this.priceManager.getProductPrice(
                    item.id,
                    item.name,
                    item.category
                );
                const unitPrice = item.unitPrice || priceInfo.price;
                subtotal += item.quantity * unitPrice;
            });
        }

        if (this.data.installation && this.data.installation.subtotal) {
            subtotal += this.data.installation.subtotal;
        }

        const total = subtotal;

        doc.setDrawColor(45, 122, 62);
        doc.setLineWidth(0.5);
        doc.line(120, yPosition, 190, yPosition);

        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Subtotal:', 140, yPosition);
        doc.text(this.formatCurrency(subtotal), 170, yPosition);

        yPosition += 8;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 122, 62);
        doc.text('TOTAL:', 140, yPosition);
        doc.text(this.formatCurrency(total), 170, yPosition);

        return yPosition + 10;
    }

    addFooter(doc, yPosition) {
        const validityDays = this.config.quotation?.validityDays || 30;
        const termsText = this.config.quotation?.termsText || 
            `Cotización válida por ${validityDays} días. Precios sujetos a cambios sin previo aviso.`;

        const finalTerms = termsText.replace('{days}', validityDays);

        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        yPosition += 10;
        doc.setDrawColor(200, 230, 201);
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition);

        yPosition += 8;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(74, 95, 74);

        const splitTerms = doc.splitTextToSize(finalTerms, 170);
        doc.text(splitTerms, 20, yPosition);

        yPosition += splitTerms.length * 4 + 6;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(45, 122, 62);
        const contactText = `Contacto: ${this.config.contact?.whatsapp?.displayNumber || ''} | ${this.config.contact?.email || ''}`;
        doc.text(contactText, 105, yPosition, { align: 'center' });

        yPosition += 5;
        doc.setFontSize(7);
        doc.setTextColor(107, 124, 107);
        doc.text('Gracias por su confianza', 105, yPosition, { align: 'center' });

        return yPosition;
    }

    formatCurrency(amount) {
        const config = this.config.pricing || {};
        return new Intl.NumberFormat(config.currencyFormat?.locale || 'es-AR', {
            style: 'currency',
            currency: config.currency || 'ARS',
            minimumFractionDigits: config.currencyFormat?.minimumFractionDigits || 0,
            maximumFractionDigits: config.currencyFormat?.maximumFractionDigits || 0
        }).format(amount);
    }

    async download(filename) {
        const doc = await this.generate();
        doc.save(filename || `cotizacion-${Date.now()}.pdf`);
    }
}

class QuotationStorage {
    constructor() {
        this.storageKey = 'ferreteria_quotations';
        this.validityDays = CONFIG.quotation?.validityDays || 30;
    }

    save(quotationData) {
        try {
            const quotations = this.getAll();
            
            const quotationToSave = {
                id: quotationData.quotationId || this.generateId(),
                date: new Date().toISOString(),
                validUntil: new Date(Date.now() + this.validityDays * 24 * 60 * 60 * 1000).toISOString(),
                projectData: quotationData.projectData,
                items: quotationData.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    description: item.description || '',
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    unit: item.unit || 'unidad',
                    subtotal: item.quantity * item.unitPrice
                })),
                installation: quotationData.installation ? {
                    linearMeters: quotationData.installation.linearMeters,
                    pricePerMeter: quotationData.installation.pricePerMeter,
                    subtotal: quotationData.installation.subtotal
                } : null,
                subtotal: this.calculateSubtotal(quotationData),
                total: this.calculateTotal(quotationData),
                status: 'sent'
            };

            quotations.push(quotationToSave);
            
            localStorage.setItem(this.storageKey, JSON.stringify(quotations));
            
            console.log(`✓ Cotización guardada: ${quotationToSave.id}`);
            return quotationToSave;
        } catch (error) {
            console.error('Error al guardar cotización:', error);
            throw new Error('No se pudo guardar la cotización en localStorage');
        }
    }

    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al cargar cotizaciones:', error);
            return [];
        }
    }

    getById(quotationId) {
        const quotations = this.getAll();
        return quotations.find(q => q.id === quotationId);
    }

    getValid() {
        const quotations = this.getAll();
        const now = new Date();
        return quotations.filter(q => new Date(q.validUntil) > now);
    }

    getExpired() {
        const quotations = this.getAll();
        const now = new Date();
        return quotations.filter(q => new Date(q.validUntil) <= now);
    }

    deleteById(quotationId) {
        try {
            const quotations = this.getAll();
            const filtered = quotations.filter(q => q.id !== quotationId);
            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error al eliminar cotización:', error);
            return false;
        }
    }

    deleteExpired() {
        try {
            const validQuotations = this.getValid();
            localStorage.setItem(this.storageKey, JSON.stringify(validQuotations));
            return true;
        } catch (error) {
            console.error('Error al limpiar cotizaciones expiradas:', error);
            return false;
        }
    }

    updateStatus(quotationId, newStatus) {
        try {
            const quotations = this.getAll();
            const quotation = quotations.find(q => q.id === quotationId);
            
            if (quotation) {
                quotation.status = newStatus;
                quotation.lastUpdated = new Date().toISOString();
                localStorage.setItem(this.storageKey, JSON.stringify(quotations));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error al actualizar estado de cotización:', error);
            return false;
        }
    }

    generateId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `COT-${timestamp}-${random}`;
    }

    calculateSubtotal(quotationData) {
        let subtotal = 0;
        
        if (quotationData.items) {
            quotationData.items.forEach(item => {
                subtotal += item.quantity * item.unitPrice;
            });
        }
        
        return subtotal;
    }

    calculateTotal(quotationData) {
        let total = this.calculateSubtotal(quotationData);
        
        if (quotationData.installation && quotationData.installation.subtotal) {
            total += quotationData.installation.subtotal;
        }
        
        return total;
    }

    getStorageInfo() {
        const quotations = this.getAll();
        const valid = this.getValid();
        const expired = this.getExpired();
        
        return {
            total: quotations.length,
            valid: valid.length,
            expired: expired.length,
            storageSize: new Blob([JSON.stringify(quotations)]).size
        };
    }

    displayQuotation(quotationId, containerId) {
        const quotation = this.getById(quotationId);
        
        if (!quotation) {
            console.error(`Cotización ${quotationId} no encontrada`);
            return false;
        }

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor ${containerId} no encontrado`);
            return false;
        }

        const priceManager = new PriceManager();
        const html = this.generateQuotationHTML(quotation, priceManager);
        container.innerHTML = html;

        return true;
    }

    generateQuotationHTML(quotation, priceManager) {
        const isExpired = new Date(quotation.validUntil) < new Date();
        const validityClass = isExpired ? 'expired' : 'valid';
        const validityText = isExpired ? 'Expirada' : 'Válida';
        const validityIcon = isExpired ? 'fa-times-circle' : 'fa-check-circle';

        let html = `
            <div class="quotation-display-card ${validityClass}">
                <div class="quotation-header">
                    <div class="quotation-id-section">
                        <i class="fas fa-file-invoice"></i>
                        <div>
                            <h3 class="quotation-id">${quotation.id}</h3>
                            <p class="quotation-date">Fecha: ${new Date(quotation.date).toLocaleDateString('es-AR')}</p>
                        </div>
                    </div>
                    <div class="quotation-status ${validityClass}">
                        <i class="fas ${validityIcon}"></i>
                        <span>${validityText}</span>
                    </div>
                </div>

                <div class="quotation-validity">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Válida hasta: ${new Date(quotation.validUntil).toLocaleDateString('es-AR')}</span>
                </div>
        `;

        if (quotation.projectData) {
            const postTypeNames = {
                'hormigon': 'Hormigón',
                'quebracho': 'Quebracho',
                'eucalipto': 'Eucalipto',
                'olimpo': 'Olimpo'
            };

            const materialTypeNames = {
                'wire': 'Alambre',
                'mesh': 'Tejido Romboidal'
            };

            html += `
                <div class="quotation-project-info">
                    <h4><i class="fas fa-project-diagram"></i> Información del Proyecto</h4>
                    <div class="project-details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Perímetro:</span>
                            <span class="detail-value">${quotation.projectData.perimeter?.toFixed(2) || 0} m</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Tipo de Poste:</span>
                            <span class="detail-value">${postTypeNames[quotation.projectData.postType] || quotation.projectData.postType}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Material:</span>
                            <span class="detail-value">${materialTypeNames[quotation.projectData.materialType] || quotation.projectData.materialType}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `
                <div class="quotation-items-section">
                    <h4><i class="fas fa-list"></i> Materiales</h4>
                    <div class="items-list">
        `;

        quotation.items.forEach(item => {
            const subtotal = item.quantity * item.unitPrice;
            html += `
                <div class="quotation-item">
                    <div class="item-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="item-details">
                        <h5 class="item-name">${item.name}</h5>
                        ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                    </div>
                    <div class="item-quantity">
                        <span class="quantity-value">${item.quantity}</span>
                        <span class="quantity-unit">${item.unit || 'unidad'}</span>
                    </div>
                    <div class="item-pricing">
                        <span class="item-unit-price">${priceManager.formatCurrency(item.unitPrice)} c/u</span>
                        <span class="item-subtotal">${priceManager.formatCurrency(subtotal)}</span>
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
        `;

        if (quotation.installation && quotation.installation.linearMeters > 0) {
            html += `
                <div class="quotation-installation-section">
                    <h4><i class="fas fa-tools"></i> Servicio de Instalación</h4>
                    <div class="installation-details">
                        <div class="detail-item">
                            <span class="detail-label">Metros lineales:</span>
                            <span class="detail-value">${quotation.installation.linearMeters.toFixed(2)} m</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Precio por metro:</span>
                            <span class="detail-value">${priceManager.formatCurrency(quotation.installation.pricePerMeter)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Subtotal instalación:</span>
                            <span class="detail-value">${priceManager.formatCurrency(quotation.installation.subtotal)}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `
                <div class="quotation-totals">
                    <div class="totals-row">
                        <span class="totals-label">Subtotal:</span>
                        <span class="totals-value">${priceManager.formatCurrency(quotation.subtotal)}</span>
                    </div>
                    <div class="totals-row total-row">
                        <span class="totals-label">TOTAL:</span>
                        <span class="totals-value">${priceManager.formatCurrency(quotation.total)}</span>
                    </div>
                </div>

                <div class="quotation-actions">
                    <button class="btn-outline" onclick="quotationStorage.downloadQuotationPDF('${quotation.id}')">
                        <i class="fas fa-download"></i>
                        Descargar PDF
                    </button>
                    <button class="btn-success" onclick="quotationStorage.sendQuotationWhatsApp('${quotation.id}')">
                        <i class="fab fa-whatsapp"></i>
                        Enviar por WhatsApp
                    </button>
                </div>
            </div>
        `;

        return html;
    }

    async downloadQuotationPDF(quotationId) {
        const quotation = this.getById(quotationId);
        
        if (!quotation) {
            if (typeof showNotification === 'function') {
                showNotification('Cotización no encontrada', 'error');
            }
            return;
        }

        try {
            const pdfGenerator = new QuotationPDFGenerator(quotation, CONFIG);
            await pdfGenerator.download(`cotizacion-${quotation.id}.pdf`);
            
            if (typeof showNotification === 'function') {
                showNotification('PDF descargado correctamente', 'success');
            }
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            if (typeof showNotification === 'function') {
                showNotification('Error al generar el PDF', 'error');
            }
        }
    }

    sendQuotationWhatsApp(quotationId) {
        const quotation = this.getById(quotationId);
        
        if (!quotation) {
            if (typeof showNotification === 'function') {
                showNotification('Cotización no encontrada', 'error');
            }
            return;
        }

        const businessName = CONFIG.business?.name || 'Metales & Hierros Mar del Plata';
        const whatsappNumber = CONFIG.contact?.whatsapp?.number || '5491171416157';

        let message = `*${businessName}*\n\n`;
        message += `*Cotización: ${quotation.id}*\n`;
        message += `Fecha: ${new Date(quotation.date).toLocaleDateString('es-AR')}\n`;
        message += `Válida hasta: ${new Date(quotation.validUntil).toLocaleDateString('es-AR')}\n\n`;

        if (quotation.projectData) {
            message += `*Proyecto:*\n`;
            message += `Perímetro: ${quotation.projectData.perimeter?.toFixed(2) || 0} m\n\n`;
        }

        message += `*Materiales:*\n`;
        quotation.items.forEach(item => {
            message += `• ${item.name} x${item.quantity} - ${new PriceManager().formatCurrency(item.quantity * item.unitPrice)}\n`;
        });

        if (quotation.installation && quotation.installation.linearMeters > 0) {
            message += `\n*Instalación:*\n`;
            message += `${quotation.installation.linearMeters.toFixed(2)}m - ${new PriceManager().formatCurrency(quotation.installation.subtotal)}\n`;
        }

        message += `\n*TOTAL: ${new PriceManager().formatCurrency(quotation.total)}*`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        if (typeof showNotification === 'function') {
            showNotification('Abriendo WhatsApp...', 'success');
        }
    }
}

class QuotationModal {
    constructor() {
        this.modal = document.getElementById('quotationModal');
        this.currentData = null;
        this.priceManager = new PriceManager();
        this.storage = new QuotationStorage();
        this.installationIncluded = false;
        this.installationCost = 0;
        this.initializeElements();
        this.attachEventListeners();
        this.loadPrices();
    }

    async loadPrices() {
        try {
            await this.priceManager.loadPrices();
        } catch (error) {
            console.error('Error al cargar precios:', error);
        }
    }

    initializeElements() {
        this.elements = {
            modal: document.getElementById('quotationModal'),
            overlay: this.modal?.querySelector('.modal-overlay'),
            closeBtn: document.getElementById('closeQuotationModal'),
            cancelBtn: document.getElementById('cancelQuotation'),
            continueBtn: document.getElementById('continueQuotation'),
            downloadPDFBtn: document.getElementById('downloadPDFQuotation'),
            sendWhatsAppBtn: document.getElementById('sendWhatsAppQuotation'),
            projectInfo: document.getElementById('quotationProjectInfo'),
            itemsList: document.getElementById('quotationItemsList'),
            subtotal: document.getElementById('quotationSubtotal'),
            total: document.getElementById('quotationTotal'),
            installationCheckbox: document.getElementById('includeInstallation'),
            installationDetails: document.getElementById('installationDetails'),
            installationMeters: document.getElementById('installationMeters'),
            installationPricePerMeter: document.getElementById('installationPricePerMeter'),
            installationTotal: document.getElementById('installationTotal')
        };
    }

    attachEventListeners() {
        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.elements.cancelBtn) {
            this.elements.cancelBtn.addEventListener('click', () => this.close());
        }

        if (this.elements.continueBtn) {
            this.elements.continueBtn.addEventListener('click', () => this.continueToFullQuotation());
        }

        if (this.elements.downloadPDFBtn) {
            this.elements.downloadPDFBtn.addEventListener('click', () => this.downloadPDF());
        }

        if (this.elements.sendWhatsAppBtn) {
            this.elements.sendWhatsAppBtn.addEventListener('click', () => this.sendWhatsApp());
        }

        if (this.elements.overlay) {
            this.elements.overlay.addEventListener('click', () => this.close());
        }

        if (this.elements.installationCheckbox) {
            this.elements.installationCheckbox.addEventListener('change', (e) => {
                this.toggleInstallation(e.target.checked);
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    async open(data) {
        if (!data) {
            console.error('No data provided to quotation modal');
            return;
        }

        this.currentData = data;
        this.installationIncluded = false;
        this.installationCost = 0;

        if (this.elements.installationCheckbox) {
            this.elements.installationCheckbox.checked = false;
        }

        if (this.elements.installationDetails) {
            this.elements.installationDetails.style.display = 'none';
        }

        this.renderProjectInfo(data);
        await this.renderItems(data.items);
        
        this.elements.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.elements.modal.classList.add('active');
        }, 10);
    }

    close() {
        this.elements.modal.classList.remove('active');
        
        setTimeout(() => {
            this.elements.modal.style.display = 'none';
            document.body.style.overflow = '';
            this.currentData = null;
        }, 300);
    }

    isOpen() {
        return this.elements.modal.style.display === 'block';
    }

    renderProjectInfo(data) {
        const { projectData } = data;
        
        const postTypeNames = {
            'hormigon': 'Hormigón',
            'quebracho': 'Quebracho',
            'eucalipto': 'Eucalipto',
            'olimpo': 'Olimpo'
        };

        const materialTypeNames = {
            'wire': 'Alambre',
            'mesh': 'Tejido Romboidal'
        };

        const fenceTypeNames = {
            'simple': 'Perímetro Simple',
            'multiple': 'Múltiples Segmentos'
        };

        const html = `
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Perímetro:</span>
                    <span class="info-value">${projectData.perimeter.toFixed(2)} m</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tipo de Cerca:</span>
                    <span class="info-value">${fenceTypeNames[projectData.fenceType] || projectData.fenceType}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tipo de Poste:</span>
                    <span class="info-value">${postTypeNames[projectData.postType] || projectData.postType}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Material:</span>
                    <span class="info-value">${materialTypeNames[projectData.materialType] || projectData.materialType}</span>
                </div>
            </div>
        `;

        this.elements.projectInfo.innerHTML = html;
    }

    async renderItems(items) {
        if (!items || items.length === 0) {
            this.elements.itemsList.innerHTML = '<p class="empty-message">No hay items para mostrar</p>';
            return;
        }

        await this.priceManager.loadPrices();

        let subtotal = 0;

        const html = items.map(item => {
            const priceInfo = this.priceManager.getProductPrice(
                item.id,
                item.name,
                item.category
            );
            
            const unitPrice = item.unitPrice || priceInfo.price;
            const unit = item.unit || priceInfo.unit;
            const itemSubtotal = item.quantity * unitPrice;
            subtotal += itemSubtotal;

            return `
                <div class="quotation-item">
                    <div class="item-icon">
                        <i class="fas ${this.getItemIcon(item.category)}"></i>
                    </div>
                    <div class="item-details">
                        <h5 class="item-name">${item.name}</h5>
                        <p class="item-description">${item.description || ''}</p>
                    </div>
                    <div class="item-quantity">
                        <span class="quantity-value">${item.quantity}</span>
                        <span class="quantity-unit">${unit}</span>
                    </div>
                    <div class="item-pricing">
                        <span class="item-unit-price">${this.priceManager.formatCurrency(unitPrice)} / ${unit}</span>
                        <span class="item-subtotal">${this.priceManager.formatCurrency(itemSubtotal)}</span>
                    </div>
                </div>
            `;
        }).join('');

        this.elements.itemsList.innerHTML = html;
        this.updateTotals(subtotal, subtotal);
    }

    getItemIcon(category) {
        const icons = {
            'postes': 'fa-columns',
            'alambres': 'fa-grip-lines',
            'tejidos': 'fa-th-large',
            'accesorios': 'fa-tools'
        };
        return icons[category] || 'fa-box';
    }



    toggleInstallation(isChecked) {
        this.installationIncluded = isChecked;

        if (this.elements.installationDetails) {
            this.elements.installationDetails.style.display = isChecked ? 'block' : 'none';
        }

        if (isChecked && this.currentData) {
            this.calculateInstallation();
        } else {
            this.installationCost = 0;
        }

        this.recalculateTotals();
    }

    calculateInstallation() {
        if (!this.currentData || !this.currentData.projectData) {
            return;
        }

        const perimeter = this.currentData.projectData.perimeter || 0;
        const pricePerMeter = CONFIG.pricing?.installationPricePerMeter || 500;

        this.installationCost = perimeter * pricePerMeter;

        if (this.elements.installationMeters) {
            this.elements.installationMeters.textContent = `${perimeter.toFixed(2)} m`;
        }

        if (this.elements.installationPricePerMeter) {
            this.elements.installationPricePerMeter.textContent = this.priceManager.formatCurrency(pricePerMeter);
        }

        if (this.elements.installationTotal) {
            this.elements.installationTotal.textContent = this.priceManager.formatCurrency(this.installationCost);
        }
    }

    recalculateTotals() {
        if (!this.currentData || !this.currentData.items) {
            return;
        }

        let materialsSubtotal = 0;

        this.currentData.items.forEach(item => {
            const priceInfo = this.priceManager.getProductPrice(
                item.id,
                item.name,
                item.category
            );
            const unitPrice = item.unitPrice || priceInfo.price;
            materialsSubtotal += item.quantity * unitPrice;
        });

        const total = materialsSubtotal + (this.installationIncluded ? this.installationCost : 0);

        this.updateTotals(materialsSubtotal, total);
    }

    updateTotals(subtotal, total) {
        const subtotalElement = document.getElementById('quotationSubtotal');
        const totalElement = document.getElementById('quotationTotal');

        if (subtotalElement) {
            subtotalElement.textContent = this.priceManager.formatCurrency(subtotal);
        }

        if (totalElement) {
            totalElement.textContent = this.priceManager.formatCurrency(total || subtotal);
        }
    }

    sendWhatsApp() {
        if (!this.currentData) {
            if (typeof showNotification === 'function') {
                showNotification('No hay datos de cotización disponibles', 'error');
            }
            return;
        }

        try {
            const quotationId = this.storage.generateId();
            
            const quotationDataToSave = this.prepareQuotationData(quotationId);
            
            const savedQuotation = this.storage.save(quotationDataToSave);
            
            const message = this.formatWhatsAppMessage(savedQuotation.id);
            const whatsappNumber = CONFIG.contact?.whatsapp?.number || '5491171416157';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

            window.open(whatsappUrl, '_blank');

            if (typeof showNotification === 'function') {
                showNotification(`Cotización ${savedQuotation.id} guardada y enviada por WhatsApp`, 'success');
            }
        } catch (error) {
            console.error('Error al enviar por WhatsApp:', error);
            if (typeof showNotification === 'function') {
                showNotification('Error al procesar la cotización', 'error');
            }
        }
    }

    formatWhatsAppMessage(quotationId) {
        const businessName = CONFIG.business?.name || 'Metales & Hierros Mar del Plata';
        let message = `*Solicitud de Cotización - ${businessName}*\n\n`;
        message += `*Número de Cotización:* ${quotationId}\n`;
        message += `*Fecha:* ${new Date().toLocaleDateString('es-AR')}\n\n`;

        if (this.currentData.projectData) {
            const { projectData } = this.currentData;
            
            const postTypeNames = {
                'hormigon': 'Hormigón',
                'quebracho': 'Quebracho',
                'eucalipto': 'Eucalipto',
                'olimpo': 'Olimpo'
            };

            const materialTypeNames = {
                'wire': 'Alambre',
                'mesh': 'Tejido Romboidal'
            };

            message += `*Información del Proyecto:*\n`;
            message += `• Perímetro: ${projectData.perimeter?.toFixed(2) || 0} m\n`;
            message += `• Tipo de Poste: ${postTypeNames[projectData.postType] || projectData.postType}\n`;
            message += `• Material: ${materialTypeNames[projectData.materialType] || projectData.materialType}\n\n`;
        }

        message += `*Materiales Solicitados:*\n`;
        
        if (this.currentData.items && this.currentData.items.length > 0) {
            let subtotal = 0;

            this.currentData.items.forEach((item, index) => {
                const priceInfo = this.priceManager.getProductPrice(
                    item.id,
                    item.name,
                    item.category
                );
                
                const unitPrice = item.unitPrice || priceInfo.price;
                const unit = item.unit || priceInfo.unit;
                const itemSubtotal = item.quantity * unitPrice;
                subtotal += itemSubtotal;

                message += `${index + 1}. ${item.name}\n`;
                message += `   Cantidad: ${item.quantity} ${unit}\n`;
                message += `   Precio unitario: ${this.priceManager.formatCurrency(unitPrice)}\n`;
                message += `   Subtotal: ${this.priceManager.formatCurrency(itemSubtotal)}\n\n`;
            });

            if (this.installationIncluded && this.installationCost > 0) {
                const perimeter = this.currentData.projectData?.perimeter || 0;
                const pricePerMeter = CONFIG.pricing?.installationPricePerMeter || 500;
                
                message += `*Servicio de Instalación:*\n`;
                message += `• Metros lineales: ${perimeter.toFixed(2)} m\n`;
                message += `• Precio por metro: ${this.priceManager.formatCurrency(pricePerMeter)}\n`;
                message += `• Subtotal instalación: ${this.priceManager.formatCurrency(this.installationCost)}\n\n`;
                
                subtotal += this.installationCost;
            }

            message += `*TOTAL: ${this.priceManager.formatCurrency(subtotal)}*\n\n`;
        }

        const validityDays = CONFIG.quotation?.validityDays || 30;
        message += `_Cotización válida por ${validityDays} días_\n\n`;
        message += `Espero su respuesta. ¡Gracias!`;

        return encodeURIComponent(message);
    }

    prepareQuotationData(quotationId) {
        const itemsWithPrices = this.currentData.items.map(item => {
            const priceInfo = this.priceManager.getProductPrice(
                item.id,
                item.name,
                item.category
            );
            
            return {
                id: item.id,
                name: item.name,
                category: item.category,
                description: item.description || '',
                quantity: item.quantity,
                unitPrice: item.unitPrice || priceInfo.price,
                unit: item.unit || priceInfo.unit
            };
        });

        return {
            quotationId: quotationId,
            projectData: this.currentData.projectData,
            items: itemsWithPrices,
            installation: this.installationIncluded ? {
                linearMeters: this.currentData.projectData?.perimeter || 0,
                pricePerMeter: CONFIG.pricing?.installationPricePerMeter || 500,
                subtotal: this.installationCost
            } : null
        };
    }

    async downloadPDF() {
        if (!this.currentData) {
            if (typeof showNotification === 'function') {
                showNotification('No hay datos de cotización disponibles', 'error');
            }
            return;
        }

        try {
            if (typeof showNotification === 'function') {
                showNotification('Generando PDF...', 'info');
            }

            const quotationId = this.storage.generateId();
            
            const quotationDataToSave = this.prepareQuotationData(quotationId);
            
            const savedQuotation = this.storage.save(quotationDataToSave);

            const pdfGenerator = new QuotationPDFGenerator(quotationDataToSave, CONFIG);
            await pdfGenerator.download(`cotizacion-${savedQuotation.id}.pdf`);

            if (typeof showNotification === 'function') {
                showNotification(`PDF descargado. Cotización ${savedQuotation.id} guardada`, 'success');
            }
        } catch (error) {
            console.error('Error al generar PDF:', error);
            if (typeof showNotification === 'function') {
                showNotification('Error al generar el PDF. Por favor, intenta nuevamente.', 'error');
            }
        }
    }

    continueToFullQuotation() {
        if (typeof showNotification === 'function') {
            showNotification('El módulo completo de cotizaciones estará disponible próximamente', 'info');
        }
        
        console.log('Quotation data ready:', this.currentData);
        
        this.close();
    }
}

window.openQuotationModal = async function(data) {
    if (!window.quotationModal) {
        window.quotationModal = new QuotationModal();
    }
    await window.quotationModal.open(data);
};

window.getQuotationStorage = function() {
    return new QuotationStorage();
};

window.getQuotationById = function(quotationId) {
    const storage = new QuotationStorage();
    return storage.getById(quotationId);
};

window.getAllQuotations = function() {
    const storage = new QuotationStorage();
    return storage.getAll();
};

window.getValidQuotations = function() {
    const storage = new QuotationStorage();
    return storage.getValid();
};

window.getExpiredQuotations = function() {
    const storage = new QuotationStorage();
    return storage.getExpired();
};

window.deleteQuotation = function(quotationId) {
    const storage = new QuotationStorage();
    return storage.deleteById(quotationId);
};

window.cleanExpiredQuotations = function() {
    const storage = new QuotationStorage();
    const result = storage.deleteExpired();
    if (result) {
        console.log('✓ Cotizaciones expiradas eliminadas');
    }
    return result;
};

window.getQuotationStorageInfo = function() {
    const storage = new QuotationStorage();
    return storage.getStorageInfo();
};

document.addEventListener('DOMContentLoaded', async () => {
    window.quotationModal = new QuotationModal();
    
    const pendingQuotation = StorageManager.get('pending_quotation');
    if (pendingQuotation && window.location.hash === '#quotation') {
        await window.quotationModal.open(pendingQuotation);
        StorageManager.remove('pending_quotation');
    }
    
    const storage = new QuotationStorage();
    const info = storage.getStorageInfo();
    console.log(`Sistema de Cotizaciones inicializado: ${info.valid} válidas, ${info.expired} expiradas`);
});


// Instancia global de QuotationStorage
const quotationStorage = new QuotationStorage();

// Función para buscar cotización
function searchQuotation() {
    const input = document.getElementById('quotationIdInput');
    const container = document.getElementById('quotationDisplayContainer');
    const notFound = document.getElementById('quotationNotFound');
    
    if (!input || !container || !notFound) {
        console.error('Elementos de búsqueda no encontrados');
        return;
    }

    const quotationId = input.value.trim();
    
    if (!quotationId) {
        if (typeof showNotification === 'function') {
            showNotification('Por favor ingresa un ID de cotización', 'warning');
        }
        return;
    }

    container.innerHTML = '';
    notFound.style.display = 'none';

    const success = quotationStorage.displayQuotation(quotationId, 'quotationDisplayContainer');
    
    if (!success) {
        notFound.style.display = 'block';
        if (typeof showNotification === 'function') {
            showNotification('Cotización no encontrada', 'error');
        }
    } else {
        if (typeof showNotification === 'function') {
            showNotification('Cotización cargada correctamente', 'success');
        }
        
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Función para cargar cotizaciones recientes
function loadRecentQuotations() {
    const container = document.getElementById('recentQuotationsList');
    
    if (!container) {
        return;
    }

    const quotations = quotationStorage.getAll();
    
    if (quotations.length === 0) {
        container.innerHTML = `
            <div class="empty-recent-quotations">
                <i class="fas fa-inbox"></i>
                <p>No hay cotizaciones guardadas</p>
            </div>
        `;
        return;
    }

    const sortedQuotations = quotations.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    ).slice(0, 5);

    const priceManager = new PriceManager();
    
    container.innerHTML = sortedQuotations.map(quotation => {
        const isExpired = new Date(quotation.validUntil) < new Date();
        const statusClass = isExpired ? 'expired' : 'valid';
        const statusText = isExpired ? 'Expirada' : 'Válida';
        
        return `
            <div class="recent-quotation-item" onclick="loadQuotationById('${quotation.id}')">
                <div class="recent-quotation-info">
                    <div class="recent-quotation-id">${quotation.id}</div>
                    <div class="recent-quotation-date">${new Date(quotation.date).toLocaleDateString('es-AR')}</div>
                </div>
                <div class="recent-quotation-total">${priceManager.formatCurrency(quotation.total)}</div>
                <div class="recent-quotation-status ${statusClass}">${statusText}</div>
            </div>
        `;
    }).join('');
}

// Función para cargar cotización por ID
function loadQuotationById(quotationId) {
    const input = document.getElementById('quotationIdInput');
    const container = document.getElementById('quotationDisplayContainer');
    const notFound = document.getElementById('quotationNotFound');
    
    if (!input || !container || !notFound) {
        return;
    }

    input.value = quotationId;
    
    container.innerHTML = '';
    notFound.style.display = 'none';

    const success = quotationStorage.displayQuotation(quotationId, 'quotationDisplayContainer');
    
    if (success) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadRecentQuotations();
        
        const input = document.getElementById('quotationIdInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchQuotation();
                }
            });
        }
    });
} else {
    loadRecentQuotations();
    
    const input = document.getElementById('quotationIdInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchQuotation();
            }
        });
    }
}
