/**
 * Quotation Display - Visualización de cotizaciones guardadas
 * Se carga bajo demanda cuando el usuario accede a la sección de cotizaciones
 */

class QuotationDisplay {
    constructor() {
        this.quotations = [];
        this.init();
    }

    init() {
        this.loadQuotations();
        this.setupEventListeners();
        this.displayQuotations();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('quotationSearch');
        const filterSelect = document.getElementById('quotationFilter');
        const refreshBtn = document.getElementById('refreshQuotations');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterQuotations());
        }

        if (filterSelect) {
            filterSelect.addEventListener('change', () => this.filterQuotations());
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadQuotations());
        }
    }

    loadQuotations() {
        try {
            const data = localStorage.getItem('ferreteria_quotations');
            this.quotations = data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al cargar cotizaciones:', error);
            this.quotations = [];
        }
    }

    displayQuotations() {
        const container = document.getElementById('quotationsContainer');
        if (!container) return;

        if (this.quotations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No hay cotizaciones</h3>
                    <p>Aún no has generado ninguna cotización. 
                       <a href="#calculadora">Comienza aquí</a></p>
                </div>
            `;
            return;
        }

        let html = '<div class="quotations-list">';

        this.quotations.forEach(quotation => {
            const isExpired = new Date(quotation.validUntil) < new Date();
            const statusClass = isExpired ? 'expired' : 'valid';
            const statusText = isExpired ? 'Expirada' : 'Válida';

            html += `
                <div class="quotation-item ${statusClass}">
                    <div class="quotation-header">
                        <div class="quotation-id">
                            <i class="fas fa-file-invoice"></i>
                            <span>${quotation.id}</span>
                        </div>
                        <div class="quotation-status">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                    
                    <div class="quotation-details">
                        <div class="detail-row">
                            <span class="detail-label">Fecha:</span>
                            <span class="detail-value">${new Date(quotation.date).toLocaleDateString('es-AR')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Válida hasta:</span>
                            <span class="detail-value">${new Date(quotation.validUntil).toLocaleDateString('es-AR')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Productos:</span>
                            <span class="detail-value">${quotation.items.length} artículos</span>
                        </div>
                        <div class="detail-row total">
                            <span class="detail-label">Total:</span>
                            <span class="detail-value">$${quotation.total.toLocaleString('es-AR')}</span>
                        </div>
                    </div>
                    
                    <div class="quotation-actions">
                        <button class="btn-secondary" onclick="quotationDisplay.viewQuotation('${quotation.id}')">
                            <i class="fas fa-eye"></i>
                            Ver
                        </button>
                        <button class="btn-outline" onclick="quotationDisplay.downloadPDF('${quotation.id}')">
                            <i class="fas fa-file-pdf"></i>
                            PDF
                        </button>
                        <button class="btn-success" onclick="quotationDisplay.sendWhatsApp('${quotation.id}')">
                            <i class="fab fa-whatsapp"></i>
                            WhatsApp
                        </button>
                        <button class="btn-danger" onclick="quotationDisplay.deleteQuotation('${quotation.id}')">
                            <i class="fas fa-trash"></i>
                            Eliminar
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    filterQuotations() {
        const searchInput = document.getElementById('quotationSearch');
        const filterSelect = document.getElementById('quotationFilter');
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const filterValue = filterSelect?.value || 'all';

        let filtered = this.quotations;

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(q =>
                q.id.toLowerCase().includes(searchTerm) ||
                q.items.some(item => item.name.toLowerCase().includes(searchTerm))
            );
        }

        // Filtrar por estado
        if (filterValue === 'valid') {
            filtered = filtered.filter(q => new Date(q.validUntil) >= new Date());
        } else if (filterValue === 'expired') {
            filtered = filtered.filter(q => new Date(q.validUntil) < new Date());
        }

        // Mostrar resultados filtrados
        const container = document.getElementById('quotationsContainer');
        if (!container) return;

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron cotizaciones</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }

        // Mostrar resultados filtrados
        let html = '<div class="quotations-list">';
        filtered.forEach(quotation => {
            const isExpired = new Date(quotation.validUntil) < new Date();
            const statusClass = isExpired ? 'expired' : 'valid';
            const statusText = isExpired ? 'Expirada' : 'Válida';

            html += `
                <div class="quotation-item ${statusClass}">
                    <div class="quotation-header">
                        <div class="quotation-id">
                            <i class="fas fa-file-invoice"></i>
                            <span>${quotation.id}</span>
                        </div>
                        <div class="quotation-status">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                    
                    <div class="quotation-details">
                        <div class="detail-row">
                            <span class="detail-label">Fecha:</span>
                            <span class="detail-value">${new Date(quotation.date).toLocaleDateString('es-AR')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Válida hasta:</span>
                            <span class="detail-value">${new Date(quotation.validUntil).toLocaleDateString('es-AR')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Productos:</span>
                            <span class="detail-value">${quotation.items.length} artículos</span>
                        </div>
                        <div class="detail-row total">
                            <span class="detail-label">Total:</span>
                            <span class="detail-value">$${quotation.total.toLocaleString('es-AR')}</span>
                        </div>
                    </div>
                    
                    <div class="quotation-actions">
                        <button class="btn-secondary" onclick="quotationDisplay.viewQuotation('${quotation.id}')">
                            <i class="fas fa-eye"></i>
                            Ver
                        </button>
                        <button class="btn-outline" onclick="quotationDisplay.downloadPDF('${quotation.id}')">
                            <i class="fas fa-file-pdf"></i>
                            PDF
                        </button>
                        <button class="btn-success" onclick="quotationDisplay.sendWhatsApp('${quotation.id}')">
                            <i class="fab fa-whatsapp"></i>
                            WhatsApp
                        </button>
                        <button class="btn-danger" onclick="quotationDisplay.deleteQuotation('${quotation.id}')">
                            <i class="fas fa-trash"></i>
                            Eliminar
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    viewQuotation(quotationId) {
        const quotation = this.quotations.find(q => q.id === quotationId);
        if (!quotation) {
            showNotification('Cotización no encontrada', 'error');
            return;
        }

        // Abrir modal con detalles
        if (typeof openQuotationDetailModal === 'function') {
            openQuotationDetailModal(quotation);
        }
    }

    async downloadPDF(quotationId) {
        const quotation = this.quotations.find(q => q.id === quotationId);
        if (!quotation) {
            showNotification('Cotización no encontrada', 'error');
            return;
        }

        try {
            // Cargar jsPDF bajo demanda
            await lazyLoader.loadJsPDF();

            if (typeof QuotationPDFGenerator !== 'undefined') {
                const generator = new QuotationPDFGenerator(quotation, CONFIG);
                const doc = await generator.generate();
                doc.save(`cotizacion-${quotation.id}.pdf`);
                showNotification('PDF descargado correctamente', 'success');
            }
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            showNotification('Error al descargar PDF', 'error');
        }
    }

    sendWhatsApp(quotationId) {
        const quotation = this.quotations.find(q => q.id === quotationId);
        if (!quotation) {
            showNotification('Cotización no encontrada', 'error');
            return;
        }

        let message = `*Cotización ${quotation.id}*\n\n`;
        message += `Fecha: ${new Date(quotation.date).toLocaleDateString('es-AR')}\n`;
        message += `Válida hasta: ${new Date(quotation.validUntil).toLocaleDateString('es-AR')}\n\n`;

        message += `*Productos:*\n`;
        quotation.items.forEach(item => {
            message += `- ${item.name} x${item.quantity} = $${item.subtotal.toLocaleString('es-AR')}\n`;
        });

        if (quotation.installation) {
            message += `\n*Instalación:*\n`;
            message += `${quotation.installation.linearMeters}m x $${quotation.installation.pricePerMeter} = $${quotation.installation.subtotal.toLocaleString('es-AR')}\n`;
        }

        message += `\n*Total: $${quotation.total.toLocaleString('es-AR')}*`;

        const whatsappNumber = CONFIG.contact?.whatsapp?.number || '5491171416157';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
        showNotification('Abriendo WhatsApp...', 'success');
    }

    deleteQuotation(quotationId) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
            return;
        }

        this.quotations = this.quotations.filter(q => q.id !== quotationId);

        try {
            localStorage.setItem('ferreteria_quotations', JSON.stringify(this.quotations));
            this.displayQuotations();
            showNotification('Cotización eliminada', 'success');
        } catch (error) {
            console.error('Error al eliminar cotización:', error);
            showNotification('Error al eliminar cotización', 'error');
        }
    }
}

// Instancia global
let quotationDisplay = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (!quotationDisplay && document.getElementById('consulta-cotizacion')) {
        quotationDisplay = new QuotationDisplay();
    }
});
