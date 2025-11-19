/**
 * Sistema de Gestión de Pedidos
 * Maneja la creación, actualización y seguimiento de pedidos
 */

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
        
        if (this.customer.paymentMethod) {
            const paymentMethods = {
                'cash': 'Efectivo',
                'transfer': 'Transferencia',
                'card': 'Tarjeta'
            };
            const paymentLabel = paymentMethods[this.customer.paymentMethod] || this.customer.paymentMethod;
            message += `\n*Método de Pago Preferido:* ${paymentLabel}`;
        }
        
        message += `\n\n*Total: ${this.formatCurrency(this.total)}*`;
        
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

    getStatusInfo() {
        const statusOptions = CONFIG.orders?.statusOptions || [];
        const statusInfo = statusOptions.find(s => s.value === this.status);
        
        return statusInfo || {
            value: this.status,
            label: this.status,
            color: '#666666',
            icon: 'info-circle'
        };
    }

    isEditable() {
        return this.status === 'pending' || this.status === 'confirmed';
    }

    canBeCancelled() {
        return this.status !== 'completed' && this.status !== 'cancelled';
    }

    getDaysSinceCreation() {
        const now = new Date();
        const diffTime = Math.abs(now - this.date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    getLastStatusUpdate() {
        if (this.statusHistory.length === 0) return null;
        return this.statusHistory[this.statusHistory.length - 1];
    }
}

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
            
            if (error.name === 'QuotaExceededError') {
                throw new Error('Espacio de almacenamiento insuficiente. Elimina pedidos antiguos.');
            }
            
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

    getOrdersByStatus(status) {
        return this.orders.filter(order => order.status === status);
    }

    getOrdersByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return this.orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= start && orderDate <= end;
        });
    }

    getOrdersByCustomer(customerPhone) {
        return this.orders.filter(order => 
            order.customer.phone === customerPhone
        );
    }

    deleteOrder(orderId) {
        const index = this.orders.findIndex(order => order.id === orderId);
        
        if (index === -1) {
            throw new Error(`Pedido no encontrado: ${orderId}`);
        }

        this.orders.splice(index, 1);
        this.saveOrders();
        
        return true;
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

    exportToCSV() {
        const headers = ['ID', 'Fecha', 'Cliente', 'Teléfono', 'Email', 'Total', 'Estado'];
        const rows = this.orders.map(order => [
            order.id,
            order.formatDate(order.date),
            order.customer.name,
            order.customer.phone,
            order.customer.email || '',
            order.total,
            order.status
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        return csv;
    }

    downloadCSV(filename = 'pedidos.csv') {
        const csv = this.exportToCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    cleanOldOrders(daysOld = 365) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const initialCount = this.orders.length;
        
        this.orders = this.orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= cutoffDate || 
                   order.status === 'pending' || 
                   order.status === 'in_progress';
        });

        const removed = initialCount - this.orders.length;
        
        if (removed > 0) {
            this.saveOrders();
        }

        return removed;
    }
}

class OrderFormUI {
    constructor() {
        this.modal = null;
        this.form = null;
        this.quotationData = null;
        this.orderManager = new OrderManager();
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div id="orderFormModal" class="order-form-modal">
                <div class="order-form-container">
                    <div class="order-form-header">
                        <h2>
                            <i class="fas fa-shopping-cart"></i>
                            Confirmar Pedido
                        </h2>
                        <p>Complete sus datos para finalizar el pedido</p>
                        <button class="order-form-close" aria-label="Cerrar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="order-form-body">
                        <div id="orderSummary" class="order-summary-box">
                            <!-- Resumen dinámico -->
                        </div>

                        <form id="orderForm" class="order-form">
                            <div class="order-form-section">
                                <h3 class="order-form-section-title">
                                    <i class="fas fa-user"></i>
                                    Datos del Cliente
                                </h3>

                                <div class="form-group">
                                    <label for="customerName" class="form-label required">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        id="customerName" 
                                        name="name" 
                                        class="form-input" 
                                        placeholder="Ej: Juan Pérez"
                                        required
                                    >
                                    <div class="form-error" id="nameError">Por favor ingrese su nombre completo</div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="customerPhone" class="form-label required">Teléfono</label>
                                        <input 
                                            type="tel" 
                                            id="customerPhone" 
                                            name="phone" 
                                            class="form-input" 
                                            placeholder="+54 9 11 1234-5678"
                                            required
                                        >
                                        <div class="form-error" id="phoneError">Ingrese un teléfono válido</div>
                                    </div>

                                    <div class="form-group">
                                        <label for="customerEmail" class="form-label">Email</label>
                                        <input 
                                            type="email" 
                                            id="customerEmail" 
                                            name="email" 
                                            class="form-input" 
                                            placeholder="ejemplo@email.com"
                                        >
                                        <div class="form-error" id="emailError">Ingrese un email válido</div>
                                    </div>
                                </div>
                            </div>

                            <div class="order-form-section">
                                <h3 class="order-form-section-title">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Dirección de Instalación
                                </h3>

                                <div class="form-group">
                                    <label for="customerAddress" class="form-label">Dirección Completa</label>
                                    <textarea 
                                        id="customerAddress" 
                                        name="address" 
                                        class="form-textarea" 
                                        placeholder="Calle, número, localidad, provincia"
                                        rows="3"
                                    ></textarea>
                                    <div class="form-hint">Opcional: Solo si requiere instalación</div>
                                </div>

                                <div class="form-group">
                                    <label for="installationDate" class="form-label">Fecha Preferida de Instalación</label>
                                    <input 
                                        type="date" 
                                        id="installationDate" 
                                        name="installationDate" 
                                        class="form-input"
                                    >
                                    <div class="form-hint">Opcional: Fecha estimada para la instalación</div>
                                </div>
                            </div>

                            <div class="order-form-section">
                                <h3 class="order-form-section-title">
                                    <i class="fas fa-credit-card"></i>
                                    Método de Pago Preferido
                                </h3>

                                <div class="payment-methods">
                                    <div class="payment-method-option">
                                        <input 
                                            type="radio" 
                                            id="paymentCash" 
                                            name="paymentMethod" 
                                            value="cash"
                                            checked
                                        >
                                        <label for="paymentCash" class="payment-method-label">
                                            <i class="fas fa-money-bill-wave"></i>
                                            <span>Efectivo</span>
                                        </label>
                                    </div>

                                    <div class="payment-method-option">
                                        <input 
                                            type="radio" 
                                            id="paymentTransfer" 
                                            name="paymentMethod" 
                                            value="transfer"
                                        >
                                        <label for="paymentTransfer" class="payment-method-label">
                                            <i class="fas fa-exchange-alt"></i>
                                            <span>Transferencia</span>
                                        </label>
                                    </div>

                                    <div class="payment-method-option">
                                        <input 
                                            type="radio" 
                                            id="paymentCard" 
                                            name="paymentMethod" 
                                            value="card"
                                        >
                                        <label for="paymentCard" class="payment-method-label">
                                            <i class="fas fa-credit-card"></i>
                                            <span>Tarjeta</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="order-form-actions">
                                <button type="button" class="btn-cancel-order">
                                    Cancelar
                                </button>
                                <button type="submit" class="btn-submit-order">
                                    <i class="fas fa-check-circle"></i>
                                    Confirmar Pedido
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('orderFormModal');
        this.form = document.getElementById('orderForm');
    }

    attachEventListeners() {
        const closeBtn = this.modal.querySelector('.order-form-close');
        const cancelBtn = this.modal.querySelector('.btn-cancel-order');

        closeBtn.addEventListener('click', () => this.close());
        cancelBtn.addEventListener('click', () => this.close());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const inputs = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });

        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        const installationDateInput = document.getElementById('installationDate');
        if (installationDateInput) {
            installationDateInput.min = minDate.toISOString().split('T')[0];
        }
    }

    open(quotationData) {
        this.quotationData = quotationData;
        this.renderSummary();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const firstInput = this.form.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.form.reset();
        this.clearErrors();
    }

    renderSummary() {
        const summaryContainer = document.getElementById('orderSummary');
        if (!summaryContainer || !this.quotationData) return;

        const priceManager = new PriceManager();
        let html = `
            <div class="order-summary-title">
                <i class="fas fa-receipt"></i>
                Resumen del Pedido
            </div>
            <div class="order-summary-items">
        `;

        if (this.quotationData.items && this.quotationData.items.length > 0) {
            this.quotationData.items.forEach(item => {
                const subtotal = item.quantity * item.unitPrice;
                html += `
                    <div class="order-summary-item">
                        <span class="order-summary-item-name">${item.name}</span>
                        <span class="order-summary-item-quantity">x${item.quantity}</span>
                        <span class="order-summary-item-price">${priceManager.formatCurrency(subtotal)}</span>
                    </div>
                `;
            });
        }

        if (this.quotationData.installation && this.quotationData.installation.linearMeters > 0) {
            html += `
                <div class="order-summary-item">
                    <span class="order-summary-item-name">Instalación (${this.quotationData.installation.linearMeters}m)</span>
                    <span class="order-summary-item-quantity"></span>
                    <span class="order-summary-item-price">${priceManager.formatCurrency(this.quotationData.installation.subtotal)}</span>
                </div>
            `;
        }

        const total = this.calculateTotal();
        html += `
            </div>
            <div class="order-summary-total">
                <span class="order-summary-total-label">Total:</span>
                <span class="order-summary-total-value">${priceManager.formatCurrency(total)}</span>
            </div>
        `;

        summaryContainer.innerHTML = html;
    }

    calculateTotal() {
        let total = 0;

        if (this.quotationData.items) {
            this.quotationData.items.forEach(item => {
                total += item.quantity * item.unitPrice;
            });
        }

        if (this.quotationData.installation && this.quotationData.installation.subtotal) {
            total += this.quotationData.installation.subtotal;
        }

        return total;
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        } else if (name === 'name' && value && value.length < 3) {
            isValid = false;
            errorMessage = 'El nombre debe tener al menos 3 caracteres';
        } else if (name === 'phone' && value && !this.validatePhone(value)) {
            isValid = false;
            errorMessage = 'Ingrese un teléfono válido';
        } else if (name === 'email' && value && !this.validateEmail(value)) {
            isValid = false;
            errorMessage = 'Ingrese un email válido';
        }

        const errorElement = document.getElementById(`${name}Error`);
        
        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('active');
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.classList.remove('active');
            }
        }

        return isValid;
    }

    validatePhone(phone) {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        const emailField = this.form.querySelector('[name="email"]');
        if (emailField && emailField.value.trim()) {
            if (!this.validateField(emailField)) {
                isValid = false;
            }
        }

        return isValid;
    }

    clearErrors() {
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));

        const errorMessages = this.form.querySelectorAll('.form-error.active');
        errorMessages.forEach(msg => msg.classList.remove('active'));
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }

        return data;
    }

    sendOrderViaWhatsApp(order) {
        try {
            const whatsappNumber = CONFIG.contact?.whatsapp?.number || '';
            
            if (!whatsappNumber) {
                throw new Error('Número de WhatsApp no configurado');
            }

            const message = order.toWhatsAppMessage();
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

            window.open(whatsappUrl, '_blank');
            
            return true;
        } catch (error) {
            console.error('Error al enviar por WhatsApp:', error);
            throw error;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        const submitBtn = this.form.querySelector('.btn-submit-order');
        
        try {
            if (typeof loaderManager !== 'undefined') {
                await loaderManager.withButtonSpinner(submitBtn, async () => {
                    const customerData = this.getFormData();
                    
                    const order = this.orderManager.createOrder(this.quotationData, customerData);

                    if (typeof flowStepper !== 'undefined' && flowStepper) {
                        flowStepper.completeQuotation(this.quotationData);
                        flowStepper.completeOrder(order.toJSON());
                    }

                    this.close();

                    const confirmationUI = new OrderConfirmationUI();
                    confirmationUI.show(order);

                    this.sendOrderViaWhatsApp(order);
                }, 'Procesando...');
            } else {
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

                const customerData = this.getFormData();
                
                const order = this.orderManager.createOrder(this.quotationData, customerData);

                if (typeof flowStepper !== 'undefined' && flowStepper) {
                    flowStepper.completeQuotation(this.quotationData);
                    flowStepper.completeOrder(order.toJSON());
                }

                this.close();

                const confirmationUI = new OrderConfirmationUI();
                confirmationUI.show(order);

                this.sendOrderViaWhatsApp(order);

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }

        } catch (error) {
            console.error('Error al crear pedido:', error);
            
            if (typeof showNotification === 'function') {
                showNotification(error.message || 'Error al crear el pedido', 'error');
            } else {
                alert(error.message || 'Error al crear el pedido');
            }
            
            if (typeof loaderManager !== 'undefined') {
                loaderManager.removeButtonSpinner(submitBtn);
            }
        } finally {
            if (typeof loaderManager === 'undefined') {
                submitBtn.disabled = false;
            }
        }
    }
}

class OrderConfirmationUI {
    constructor() {
        this.modal = null;
        this.orderData = null;
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div id="orderConfirmationModal" class="order-confirmation-modal">
                <div class="order-confirmation-container">
                    <div class="order-confirmation-content">
                        <div class="confirmation-icon">
                            <div class="success-checkmark">
                                <div class="check-icon">
                                    <span class="icon-line line-tip"></span>
                                    <span class="icon-line line-long"></span>
                                    <div class="icon-circle"></div>
                                    <div class="icon-fix"></div>
                                </div>
                            </div>
                        </div>

                        <h2 class="confirmation-title">Pedido Confirmado</h2>
                        <p class="confirmation-subtitle">Tu pedido ha sido registrado exitosamente</p>

                        <div class="order-number-box">
                            <div class="order-number-label">Número de Orden</div>
                            <div class="order-number-value" id="confirmationOrderNumber">-</div>
                        </div>

                        <div class="order-summary-section">
                            <div class="summary-section-title">
                                <i class="fas fa-receipt"></i>
                                Resumen del Pedido
                            </div>
                            <div class="confirmation-order-summary" id="confirmationOrderSummary">
                                <!-- Contenido dinámico -->
                            </div>
                        </div>

                        <div class="confirmation-actions">
                            <button class="btn-track-order" id="btnTrackOrder">
                                <i class="fas fa-search"></i>
                                Consultar Estado
                            </button>
                            <button class="btn-home" id="btnBackHome">
                                <i class="fas fa-home"></i>
                                Volver al Inicio
                            </button>
                        </div>

                        <div class="confirmation-info">
                            <i class="fas fa-info-circle"></i>
                            <p>
                                Hemos enviado los detalles de tu pedido por WhatsApp. 
                                Puedes consultar el estado de tu pedido en cualquier momento usando tu número de orden.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('orderConfirmationModal');
    }

    attachEventListeners() {
        const trackBtn = document.getElementById('btnTrackOrder');
        const homeBtn = document.getElementById('btnBackHome');

        if (trackBtn) {
            trackBtn.addEventListener('click', () => this.goToTracking());
        }

        if (homeBtn) {
            homeBtn.addEventListener('click', () => this.goToHome());
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    show(order) {
        this.orderData = order;
        this.renderOrderDetails();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    renderOrderDetails() {
        if (!this.orderData) return;

        const orderNumberEl = document.getElementById('confirmationOrderNumber');
        if (orderNumberEl) {
            orderNumberEl.textContent = this.orderData.id;
        }

        const summaryContainer = document.getElementById('confirmationOrderSummary');
        if (!summaryContainer) return;

        const priceManager = new PriceManager();
        const statusInfo = this.orderData.getStatusInfo();

        let html = `
            <div class="confirmation-detail-row">
                <span class="detail-label">
                    <i class="fas fa-calendar"></i>
                    Fecha
                </span>
                <span class="detail-value">${this.orderData.formatDate(this.orderData.date)}</span>
            </div>

            <div class="confirmation-detail-row">
                <span class="detail-label">
                    <i class="fas fa-user"></i>
                    Cliente
                </span>
                <span class="detail-value">${this.orderData.customer.name}</span>
            </div>

            <div class="confirmation-detail-row">
                <span class="detail-label">
                    <i class="fas fa-phone"></i>
                    Teléfono
                </span>
                <span class="detail-value">${this.orderData.customer.phone}</span>
            </div>
        `;

        if (this.orderData.customer.email) {
            html += `
                <div class="confirmation-detail-row">
                    <span class="detail-label">
                        <i class="fas fa-envelope"></i>
                        Email
                    </span>
                    <span class="detail-value">${this.orderData.customer.email}</span>
                </div>
            `;
        }

        if (this.orderData.customer.address) {
            html += `
                <div class="confirmation-detail-row">
                    <span class="detail-label">
                        <i class="fas fa-map-marker-alt"></i>
                        Dirección
                    </span>
                    <span class="detail-value">${this.orderData.customer.address}</span>
                </div>
            `;
        }

        html += `<div class="confirmation-divider"></div>`;

        html += `
            <div class="confirmation-items-title">
                <i class="fas fa-box"></i>
                Productos
            </div>
        `;

        if (this.orderData.items && this.orderData.items.length > 0) {
            this.orderData.items.forEach(item => {
                const subtotal = item.quantity * item.unitPrice;
                html += `
                    <div class="confirmation-item-row">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                        <span class="item-price">${priceManager.formatCurrency(subtotal)}</span>
                    </div>
                `;
            });
        }

        if (this.orderData.installation && this.orderData.installation.linearMeters > 0) {
            html += `
                <div class="confirmation-item-row">
                    <span class="item-name">Instalación (${this.orderData.installation.linearMeters}m)</span>
                    <span class="item-quantity"></span>
                    <span class="item-price">${priceManager.formatCurrency(this.orderData.installation.subtotal)}</span>
                </div>
            `;
        }

        html += `<div class="confirmation-divider"></div>`;

        html += `
            <div class="confirmation-total-row">
                <span class="total-label">Total</span>
                <span class="total-value">${priceManager.formatCurrency(this.orderData.total)}</span>
            </div>

            <div class="confirmation-divider"></div>

            <div class="confirmation-status-row">
                <span class="status-label">Estado</span>
                <span class="status-badge" style="background-color: ${statusInfo.color}">
                    <i class="fas fa-${statusInfo.icon || 'circle'}"></i>
                    ${statusInfo.label}
                </span>
            </div>
        `;

        summaryContainer.innerHTML = html;
    }

    goToTracking() {
        this.close();
        
        const trackingSection = document.getElementById('consulta-pedido');
        if (trackingSection) {
            trackingSection.scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                const orderIdInput = document.getElementById('orderIdInput');
                if (orderIdInput && this.orderData) {
                    orderIdInput.value = this.orderData.id;
                    orderIdInput.focus();
                }
            }, 500);
        }
    }

    goToHome() {
        this.close();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (typeof showNotification === 'function') {
            showNotification('Gracias por tu pedido', 'success');
        }
    }
}

if (typeof window !== 'undefined') {
    window.Order = Order;
    window.OrderManager = OrderManager;
    window.OrderFormUI = OrderFormUI;
    window.OrderConfirmationUI = OrderConfirmationUI;
}


class OrderTrackingUI {
    constructor() {
        this.orderManager = new OrderManager();
        this.init();
    }

    init() {
        const orderIdInput = document.getElementById('orderIdInput');
        if (orderIdInput) {
            orderIdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.trackOrder();
                }
            });
        }
    }

    trackOrder() {
        const orderIdInput = document.getElementById('orderIdInput');
        if (!orderIdInput) return;

        const orderId = orderIdInput.value.trim();

        if (!orderId) {
            if (typeof showNotification === 'function') {
                showNotification('Por favor ingresa un número de orden', 'warning');
            }
            orderIdInput.focus();
            return;
        }

        const order = this.orderManager.getOrderById(orderId);

        const displayContainer = document.getElementById('orderStatusDisplay');
        const notFoundContainer = document.getElementById('orderNotFound');

        if (order) {
            this.displayOrderStatus(order);
            if (displayContainer) displayContainer.style.display = 'block';
            if (notFoundContainer) notFoundContainer.style.display = 'none';

            setTimeout(() => {
                displayContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } else {
            if (displayContainer) displayContainer.style.display = 'none';
            if (notFoundContainer) {
                notFoundContainer.style.display = 'block';
                setTimeout(() => {
                    notFoundContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        }
    }

    displayOrderStatus(order) {
        const container = document.getElementById('orderStatusDisplay');
        if (!container) return;

        const statusInfo = order.getStatusInfo();
        const priceManager = new PriceManager();

        let html = `
            <div class="order-status-header">
                <div class="order-status-title">
                    <h3>
                        <i class="fas fa-receipt"></i>
                        Estado del Pedido
                    </h3>
                    <div class="order-number-display">
                        Orden: <strong>${order.id}</strong>
                    </div>
                </div>
                <div class="order-current-status">
                    <div class="order-current-status-label">Estado Actual</div>
                    <div class="status-badge-large" style="background-color: ${statusInfo.color}">
                        <i class="fas fa-${statusInfo.icon || 'circle'}"></i>
                        ${statusInfo.label}
                    </div>
                </div>
            </div>

            <div class="order-details-grid">
                <div class="order-detail-item">
                    <div class="order-detail-icon">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <div class="order-detail-content">
                        <div class="order-detail-label">Fecha del Pedido</div>
                        <div class="order-detail-value">${order.formatDate(order.date)}</div>
                    </div>
                </div>

                <div class="order-detail-item">
                    <div class="order-detail-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="order-detail-content">
                        <div class="order-detail-label">Cliente</div>
                        <div class="order-detail-value">${order.customer.name}</div>
                    </div>
                </div>

                <div class="order-detail-item">
                    <div class="order-detail-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="order-detail-content">
                        <div class="order-detail-label">Teléfono</div>
                        <div class="order-detail-value">${order.customer.phone}</div>
                    </div>
                </div>
        `;

        if (order.customer.email) {
            html += `
                <div class="order-detail-item">
                    <div class="order-detail-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="order-detail-content">
                        <div class="order-detail-label">Email</div>
                        <div class="order-detail-value">${order.customer.email}</div>
                    </div>
                </div>
            `;
        }

        if (order.customer.address) {
            html += `
                <div class="order-detail-item">
                    <div class="order-detail-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="order-detail-content">
                        <div class="order-detail-label">Dirección</div>
                        <div class="order-detail-value">${order.customer.address}</div>
                    </div>
                </div>
            `;
        }

        html += `</div>`;

        html += `
            <div class="order-items-section">
                <div class="order-items-title">
                    <i class="fas fa-box"></i>
                    Productos del Pedido
                </div>
                <div class="order-items-list">
        `;

        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                const subtotal = item.quantity * item.unitPrice;
                html += `
                    <div class="order-item-row">
                        <div class="order-item-info">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-quantity">Cantidad: ${item.quantity}</div>
                        </div>
                        <div class="order-item-price">${priceManager.formatCurrency(subtotal)}</div>
                    </div>
                `;
            });
        }

        if (order.installation && order.installation.linearMeters > 0) {
            html += `
                <div class="order-item-row">
                    <div class="order-item-info">
                        <div class="order-item-name">Servicio de Instalación</div>
                        <div class="order-item-quantity">${order.installation.linearMeters} metros lineales</div>
                    </div>
                    <div class="order-item-price">${priceManager.formatCurrency(order.installation.subtotal)}</div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        html += `
            <div class="order-total-section">
                <div class="order-total-label">Total del Pedido</div>
                <div class="order-total-value">${priceManager.formatCurrency(order.total)}</div>
            </div>
        `;

        if (order.statusHistory && order.statusHistory.length > 0) {
            html += `
                <div class="order-history-section">
                    <div class="order-history-title">
                        <i class="fas fa-history"></i>
                        Historial de Estados
                    </div>
                    <div class="order-history-timeline">
            `;

            const sortedHistory = [...order.statusHistory].reverse();
            
            sortedHistory.forEach((historyItem, index) => {
                const historyStatusInfo = this.getStatusInfo(historyItem.status);
                const isActive = index === 0;
                const activeClass = isActive ? 'active' : '';

                html += `
                    <div class="history-item ${activeClass}">
                        <div class="history-status" style="background-color: ${historyStatusInfo.color}">
                            <i class="fas fa-${historyStatusInfo.icon || 'circle'}"></i>
                            ${historyStatusInfo.label}
                        </div>
                        <div class="history-date">
                            <i class="fas fa-clock"></i>
                            ${this.formatDateTime(historyItem.date)}
                        </div>
                        ${historyItem.note ? `<div class="history-note">${historyItem.note}</div>` : ''}
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    getStatusInfo(status) {
        const statusOptions = CONFIG.orders?.statusOptions || [];
        const statusInfo = statusOptions.find(s => s.value === status);
        
        return statusInfo || {
            value: status,
            label: status,
            color: '#666666',
            icon: 'info-circle'
        };
    }

    formatDateTime(date) {
        const d = new Date(date);
        return d.toLocaleString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

function trackOrder() {
    if (!window.orderTrackingUI) {
        window.orderTrackingUI = new OrderTrackingUI();
    }
    window.orderTrackingUI.trackOrder();
}

if (typeof window !== 'undefined') {
    window.OrderTrackingUI = OrderTrackingUI;
    window.trackOrder = trackOrder;

    document.addEventListener('DOMContentLoaded', () => {
        window.orderTrackingUI = new OrderTrackingUI();
    });
}
