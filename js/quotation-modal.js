/**
 * QuotationModal - Modal interactivo para mostrar y gestionar cotizaciones
 * Permite descargar PDF, enviar por WhatsApp y confirmar pedidos
 */

class QuotationModal {
    constructor() {
        this.modal = null;
        this.currentQuotation = null;
        this.priceManager = new PriceManager();
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div id="quotationModal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <i class="fas fa-file-invoice"></i>
                            Cotización
                        </h2>
                        <button class="modal-close" aria-label="Cerrar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div id="quotationModalContent">
                            <!-- Contenido dinámico -->
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn-outline" id="downloadPDFBtn">
                            <i class="fas fa-file-pdf"></i>
                            Descargar PDF
                        </button>
                        <button class="btn-success" id="sendWhatsAppBtn">
                            <i class="fab fa-whatsapp"></i>
                            Enviar por WhatsApp
                        </button>
                        <button class="btn-primary" id="confirmOrderBtn">
                            <i class="fas fa-shopping-cart"></i>
                            Confirmar Pedido
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('quotationModal');
    }

    attachEventListeners() {
        const closeBtn = this.modal.querySelector('.modal-close');
        const overlay = this.modal.querySelector('.modal-overlay');
        const pdfBtn = document.getElementById('downloadPDFBtn');
        const whatsappBtn = document.getElementById('sendWhatsAppBtn');
        const confirmOrderBtn = document.getElementById('confirmOrderBtn');

        closeBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());

        pdfBtn.addEventListener('click', () => this.downloadPDF());
        whatsappBtn.addEventListener('click', () => this.sendWhatsApp());
        confirmOrderBtn.addEventListener('click', () => this.confirmOrder());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    async open(quotationData) {
        this.currentQuotation = quotationData;
        
        await this.priceManager.loadPrices();
        
        this.renderContent(quotationData);
        
        this.modal.style.display = 'block';
        setTimeout(() => {
            this.modal.classList.add('active');
        }, 10);
        
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    renderContent(quotationData) {
        const container = document.getElementById('quotationModalContent');
        
        let html = '';

        if (quotationData.projectData) {
            html += this.renderProjectInfo(quotationData.projectData);
        }

        html += this.renderItems(quotationData.items);

        if (quotationData.installation) {
            html += this.renderInstallation(quotationData.installation);
        }

        html += this.renderTotals(quotationData);

        html += this.renderNote();

        container.innerHTML = html;

        const installCheckbox = document.getElementById('includeInstallation');
        if (installCheckbox) {
            installCheckbox.addEventListener('change', (e) => {
                this.toggleInstallation(e.target.checked);
            });
        }
    }

    renderProjectInfo(projectData) {
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

        return `
            <div class="quotation-summary">
                <h4>Información del Proyecto</h4>
                <div class="project-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Perímetro</span>
                            <span class="info-value">${projectData.perimeter?.toFixed(2) || 0} m</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Tipo de Poste</span>
                            <span class="info-value">${postTypeNames[projectData.postType] || projectData.postType}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Material</span>
                            <span class="info-value">${materialTypeNames[projectData.materialType] || projectData.materialType}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderItems(items) {
        if (!items || items.length === 0) {
            return '<div class="empty-message">No hay productos en esta cotización</div>';
        }

        let html = `
            <div class="quotation-items">
                <h4>Materiales Necesarios</h4>
                <div class="items-list">
        `;

        items.forEach(item => {
            const priceInfo = this.priceManager.getProductPrice(item.id, item.name, item.category);
            const unitPrice = item.unitPrice || priceInfo.price;
            const subtotal = item.quantity * unitPrice;

            item.unitPrice = unitPrice;

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
                        <span class="item-unit-price">${this.priceManager.formatCurrency(unitPrice)} c/u</span>
                        <span class="item-subtotal">${this.priceManager.formatCurrency(subtotal)}</span>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    renderInstallation(installation) {
        const isIncluded = installation && installation.linearMeters > 0;
        const perimeter = this.currentQuotation.projectData?.perimeter || 0;
        const pricePerMeter = CONFIG.pricing?.installationPricePerMeter || 500;

        return `
            <div class="installation-option">
                <div class="installation-header">
                    <label class="checkbox-container">
                        <input type="checkbox" id="includeInstallation" ${isIncluded ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        <span class="checkbox-label">Incluir Servicio de Instalación</span>
                    </label>
                </div>
                <div class="installation-details" style="display: ${isIncluded ? 'block' : 'none'};">
                    <div class="installation-info">
                        <div class="info-row">
                            <span class="info-label">Metros lineales:</span>
                            <span class="info-value">${perimeter.toFixed(2)} m</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Precio por metro:</span>
                            <span class="info-value">${this.priceManager.formatCurrency(pricePerMeter)}</span>
                        </div>
                        <div class="info-row total-row">
                            <span class="info-label">Subtotal Instalación:</span>
                            <span class="info-value">${this.priceManager.formatCurrency(perimeter * pricePerMeter)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTotals(quotationData) {
        let subtotal = 0;

        if (quotationData.items) {
            quotationData.items.forEach(item => {
                const priceInfo = this.priceManager.getProductPrice(item.id, item.name, item.category);
                const unitPrice = item.unitPrice || priceInfo.price;
                subtotal += item.quantity * unitPrice;
            });
        }

        let installationCost = 0;
        if (quotationData.installation && quotationData.installation.linearMeters > 0) {
            installationCost = quotationData.installation.subtotal || 
                (quotationData.installation.linearMeters * quotationData.installation.pricePerMeter);
        }

        const total = subtotal + installationCost;

        return `
            <div class="quotation-totals">
                <div class="totals-row">
                    <span class="totals-label">Subtotal Materiales:</span>
                    <span class="totals-value">${this.priceManager.formatCurrency(subtotal)}</span>
                </div>
                ${installationCost > 0 ? `
                <div class="totals-row">
                    <span class="totals-label">Instalación:</span>
                    <span class="totals-value">${this.priceManager.formatCurrency(installationCost)}</span>
                </div>
                ` : ''}
                <div class="totals-row total-row">
                    <span class="totals-label">TOTAL:</span>
                    <span class="totals-value">${this.priceManager.formatCurrency(total)}</span>
                </div>
            </div>
        `;
    }

    renderNote() {
        const validityDays = CONFIG.quotation?.validityDays || 30;
        return `
            <div class="quotation-note">
                <i class="fas fa-info-circle"></i>
                <p>Esta cotización tiene una validez de ${validityDays} días. Los precios están sujetos a cambios sin previo aviso.</p>
            </div>
        `;
    }

    toggleInstallation(include) {
        const details = document.querySelector('.installation-details');
        if (details) {
            details.style.display = include ? 'block' : 'none';
        }

        const perimeter = this.currentQuotation.projectData?.perimeter || 0;
        const pricePerMeter = CONFIG.pricing?.installationPricePerMeter || 500;

        if (include) {
            this.currentQuotation.installation = {
                linearMeters: perimeter,
                pricePerMeter: pricePerMeter,
                subtotal: perimeter * pricePerMeter
            };
        } else {
            this.currentQuotation.installation = null;
        }

        const totalsContainer = document.querySelector('.quotation-totals');
        if (totalsContainer) {
            totalsContainer.outerHTML = this.renderTotals(this.currentQuotation);
        }
    }

    async downloadPDF() {
        try {
            const pdfBtn = document.getElementById('downloadPDFBtn');

            if (typeof loaderManager !== 'undefined') {
                await loaderManager.withButtonSpinner(pdfBtn, async () => {
                    const quotationId = `COT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                    this.currentQuotation.quotationId = quotationId;

                    const pdfGenerator = new QuotationPDFGenerator(this.currentQuotation, CONFIG);
                    await pdfGenerator.download(`cotizacion-${quotationId}.pdf`);

                    const storage = new QuotationStorage();
                    storage.save(this.currentQuotation);

                    if (typeof showNotification === 'function') {
                        showNotification('PDF descargado exitosamente', 'success');
                    }
                }, 'Generando...');
            } else {
                pdfBtn.disabled = true;
                pdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';

                const quotationId = `COT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                this.currentQuotation.quotationId = quotationId;

                const pdfGenerator = new QuotationPDFGenerator(this.currentQuotation, CONFIG);
                await pdfGenerator.download(`cotizacion-${quotationId}.pdf`);

                const storage = new QuotationStorage();
                storage.save(this.currentQuotation);

                if (typeof showNotification === 'function') {
                    showNotification('PDF descargado exitosamente', 'success');
                }

                pdfBtn.disabled = false;
                pdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Descargar PDF';
            }
        } catch (error) {
            console.error('Error al generar PDF:', error);
            if (typeof showNotification === 'function') {
                showNotification('Error al generar el PDF', 'error');
            }

            const pdfBtn = document.getElementById('downloadPDFBtn');
            if (typeof loaderManager !== 'undefined') {
                loaderManager.removeButtonSpinner(pdfBtn);
            } else {
                pdfBtn.disabled = false;
                pdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Descargar PDF';
            }
        }
    }

    sendWhatsApp() {
        try {
            const quotationId = `COT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            this.currentQuotation.quotationId = quotationId;

            const whatsappNumber = CONFIG.contact?.whatsapp?.number || '';
            const businessName = CONFIG.business?.name || 'Metales & Hierros';

            let message = `*Solicitud de Cotización - ${businessName}*\n\n`;
            message += `*ID de Referencia:* ${quotationId}\n\n`;

            if (this.currentQuotation.projectData) {
                message += `*Proyecto:*\n`;
                message += `Perímetro: ${this.currentQuotation.projectData.perimeter?.toFixed(2) || 0} m\n`;
                message += `Tipo de Poste: ${this.currentQuotation.projectData.postType}\n`;
                message += `Material: ${this.currentQuotation.projectData.materialType}\n\n`;
            }

            message += `*Materiales:*\n`;
            this.currentQuotation.items.forEach((item, index) => {
                message += `${index + 1}. ${item.name} x${item.quantity}\n`;
            });

            if (this.currentQuotation.installation && this.currentQuotation.installation.linearMeters > 0) {
                message += `\n*Instalación:* ${this.currentQuotation.installation.linearMeters.toFixed(2)} m\n`;
            }

            message += `\nEstoy interesado en recibir una cotización formal con precios.`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            const storage = new QuotationStorage();
            storage.save(this.currentQuotation);

            window.open(whatsappURL, '_blank');

            if (typeof showNotification === 'function') {
                showNotification('Abriendo WhatsApp...', 'success');
            }
        } catch (error) {
            console.error('Error al enviar por WhatsApp:', error);
            if (typeof showNotification === 'function') {
                showNotification('Error al abrir WhatsApp', 'error');
            }
        }
    }

    confirmOrder() {
        try {
            const quotationId = this.currentQuotation.quotationId || `COT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            this.currentQuotation.quotationId = quotationId;

            const storage = new QuotationStorage();
            storage.save(this.currentQuotation);

            if (typeof window.orderFormUI !== 'undefined' && window.orderFormUI) {
                this.close();
                
                setTimeout(() => {
                    window.orderFormUI.open(this.currentQuotation);
                }, 300);
            } else {
                if (typeof showNotification === 'function') {
                    showNotification('El módulo de pedidos no está disponible', 'error');
                }
            }
        } catch (error) {
            console.error('Error al confirmar pedido:', error);
            if (typeof showNotification === 'function') {
                showNotification('Error al abrir el formulario de pedido', 'error');
            }
        }
    }
}

window.openQuotationModal = function(quotationData) {
    if (!window.quotationModal) {
        window.quotationModal = new QuotationModal();
    }
    window.quotationModal.open(quotationData);
};

document.addEventListener('DOMContentLoaded', () => {
    window.quotationModal = new QuotationModal();
});
