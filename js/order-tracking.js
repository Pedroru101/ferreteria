/**
 * Order Tracking - Seguimiento de pedidos
 * Se carga bajo demanda cuando el usuario accede a la sección de consulta de pedidos
 */

class OrderTracking {
    constructor() {
        this.orders = [];
        this.init();
    }

    init() {
        this.loadOrders();
        this.setupEventListeners();
        console.log('OrderTracking inicializado');
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('searchOrderBtn');
        const orderIdInput = document.getElementById('orderIdInput');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchOrder());
        }

        if (orderIdInput) {
            orderIdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchOrder();
                }
            });
        }
    }

    loadOrders() {
        try {
            const data = localStorage.getItem('ferreteria_orders');
            this.orders = data ? JSON.parse(data) : [];
            console.log(`${this.orders.length} pedidos cargados`);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            this.orders = [];
        }
    }

    searchOrder() {
        const orderIdInput = document.getElementById('orderIdInput');
        const orderId = orderIdInput?.value.trim().toUpperCase();

        if (!orderId) {
            showNotification('Ingresa un número de orden', 'warning');
            return;
        }

        const order = this.orders.find(o => o.id === orderId);

        if (!order) {
            this.displayOrderNotFound(orderId);
            return;
        }

        this.displayOrderDetails(order);
    }

    displayOrderNotFound(orderId) {
        const resultsDiv = document.getElementById('orderTrackingResults');
        if (!resultsDiv) return;

        resultsDiv.innerHTML = `
            <div class="order-not-found">
                <i class="fas fa-search"></i>
                <h3>Pedido no encontrado</h3>
                <p>No encontramos el pedido <strong>${orderId}</strong></p>
                <p class="help-text">Verifica que el número sea correcto e intenta nuevamente.</p>
            </div>
        `;
    }

    displayOrderDetails(order) {
        const resultsDiv = document.getElementById('orderTrackingResults');
        if (!resultsDiv) return;

        const currentStatus = order.status || 'pending';
        const statusInfo = this.getStatusInfo(currentStatus);

        let html = `
            <div class="order-tracking-card">
                <div class="order-header">
                    <div class="order-id-section">
                        <h2 class="order-id">${order.id}</h2>
                        <p class="order-date">${new Date(order.date).toLocaleDateString('es-AR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                    <div class="order-status-section">
                        <div class="status-badge ${currentStatus}">
                            <i class="fas ${statusInfo.icon}"></i>
                            <span>${statusInfo.label}</span>
                        </div>
                    </div>
                </div>

                <div class="order-timeline">
                    <h3>Historial de Estado</h3>
                    <div class="timeline">
        `;

        // Mostrar historial de estados
        if (order.statusHistory && order.statusHistory.length > 0) {
            order.statusHistory.forEach((history, index) => {
                const historyStatus = this.getStatusInfo(history.status);
                const isLast = index === order.statusHistory.length - 1;

                html += `
                    <div class="timeline-item ${isLast ? 'active' : ''}">
                        <div class="timeline-marker">
                            <i class="fas ${historyStatus.icon}"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>${historyStatus.label}</h4>
                            <p class="timeline-date">${new Date(history.date).toLocaleDateString('es-AR')} 
                               ${new Date(history.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                            ${history.note ? `<p class="timeline-note">${history.note}</p>` : ''}
                        </div>
                    </div>
                `;
            });
        }

        html += `
                    </div>
                </div>

                <div class="order-details">
                    <h3>Información del Cliente</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Nombre:</span>
                            <span class="detail-value">${order.customer?.name || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Teléfono:</span>
                            <span class="detail-value">${order.customer?.phone || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${order.customer?.email || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Dirección:</span>
                            <span class="detail-value">${order.customer?.address || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div class="order-items">
                    <h3>Productos</h3>
                    <div class="items-table">
                        <div class="table-header">
                            <div class="col-name">Producto</div>
                            <div class="col-qty">Cantidad</div>
                            <div class="col-price">Precio Unit.</div>
                            <div class="col-subtotal">Subtotal</div>
                        </div>
        `;

        // Mostrar productos
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                html += `
                    <div class="table-row">
                        <div class="col-name">${item.name}</div>
                        <div class="col-qty">${item.quantity}</div>
                        <div class="col-price">$${item.unitPrice.toLocaleString('es-AR')}</div>
                        <div class="col-subtotal">$${item.subtotal.toLocaleString('es-AR')}</div>
                    </div>
                `;
            });
        }

        html += `
                    </div>
                </div>
        `;

        // Mostrar instalación si aplica
        if (order.installation) {
            html += `
                <div class="order-installation">
                    <h3>Servicio de Instalación</h3>
                    <div class="installation-details">
                        <div class="detail-row">
                            <span class="detail-label">Metros lineales:</span>
                            <span class="detail-value">${order.installation.linearMeters}m</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Precio por metro:</span>
                            <span class="detail-value">$${order.installation.pricePerMeter.toLocaleString('es-AR')}</span>
                        </div>
                        <div class="detail-row total">
                            <span class="detail-label">Costo de instalación:</span>
                            <span class="detail-value">$${order.installation.subtotal.toLocaleString('es-AR')}</span>
                        </div>
                        ${order.customer?.installationDate ? `
                            <div class="detail-row">
                                <span class="detail-label">Fecha preferida:</span>
                                <span class="detail-value">${new Date(order.customer.installationDate).toLocaleDateString('es-AR')}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        html += `
                <div class="order-totals">
                    <div class="total-row">
                        <span class="total-label">Subtotal:</span>
                        <span class="total-value">$${(order.total - (order.installation?.subtotal || 0)).toLocaleString('es-AR')}</span>
                    </div>
                    ${order.installation ? `
                        <div class="total-row">
                            <span class="total-label">Instalación:</span>
                            <span class="total-value">$${order.installation.subtotal.toLocaleString('es-AR')}</span>
                        </div>
                    ` : ''}
                    <div class="total-row final">
                        <span class="total-label">Total:</span>
                        <span class="total-value">$${order.total.toLocaleString('es-AR')}</span>
                    </div>
                </div>

                <div class="order-actions">
                    <button class="btn-secondary" onclick="document.getElementById('orderIdInput').value = ''; document.getElementById('orderTrackingResults').innerHTML = '';">
                        <i class="fas fa-search"></i>
                        Buscar Otro Pedido
                    </button>
                    <button class="btn-success" onclick="orderTracking.contactSupport('${order.id}')">
                        <i class="fab fa-whatsapp"></i>
                        Contactar Soporte
                    </button>
                </div>
            </div>
        `;

        resultsDiv.innerHTML = html;
    }

    getStatusInfo(status) {
        const statusMap = {
            'pending': {
                label: 'Pendiente',
                icon: 'fa-clock',
                color: '#f57c00'
            },
            'confirmed': {
                label: 'Confirmado',
                icon: 'fa-check-circle',
                color: '#4caf50'
            },
            'in_progress': {
                label: 'En Proceso',
                icon: 'fa-spinner',
                color: '#0288d1'
            },
            'completed': {
                label: 'Completado',
                icon: 'fa-check-double',
                color: '#2d7a3e'
            },
            'cancelled': {
                label: 'Cancelado',
                icon: 'fa-times-circle',
                color: '#d32f2f'
            }
        };

        return statusMap[status] || statusMap['pending'];
    }

    contactSupport(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        let message = `Hola, tengo una consulta sobre mi pedido ${orderId}.\n\n`;
        message += `Número de orden: ${order.id}\n`;
        message += `Estado actual: ${this.getStatusInfo(order.status).label}\n`;

        const whatsappNumber = CONFIG.contact?.whatsapp?.number || '5491171416157';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    }
}

// Instancia global
let orderTracking = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (!orderTracking && document.getElementById('consulta-pedido')) {
        orderTracking = new OrderTracking();
    }
});
