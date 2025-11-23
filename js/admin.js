class AdminAuth {
    constructor() {
        this.sessionKey = 'ferreteria_admin_session';
        this.passwordKey = 'ferreteria_admin_password';
        this.initializePassword();
    }

    initializePassword() {
        if (!localStorage.getItem(this.passwordKey)) {
            localStorage.setItem(this.passwordKey, this.hashPassword(CONFIG.admin.defaultPassword));
        }
    }

    hashPassword(password) {
        return btoa(password);
    }

    login(password) {
        const hash = this.hashPassword(password);
        const storedHash = localStorage.getItem(this.passwordKey);

        if (hash === storedHash) {
            sessionStorage.setItem(this.sessionKey, 'true');
            sessionStorage.setItem('admin_login_time', Date.now().toString());
            return true;
        }
        return false;
    }

    isAuthenticated() {
        const isAuthenticated = sessionStorage.getItem(this.sessionKey) === 'true';

        if (isAuthenticated) {
            const loginTime = parseInt(sessionStorage.getItem('admin_login_time'));
            const elapsed = Date.now() - loginTime;

            if (elapsed > CONFIG.admin.sessionTimeout) {
                this.logout();
                return false;
            }
        }

        return isAuthenticated;
    }

    logout() {
        sessionStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem('admin_login_time');
    }
}

class AdminDashboard {
    constructor() {
        this.auth = new AdminAuth();
        this.currentTab = 'orders';
        this.init();
    }

    init() {
        if (!this.auth.isAuthenticated()) {
            this.showLoginScreen();
        } else {
            this.showDashboard();
            this.setupEventListeners();
            this.loadDashboardData();
            this.loadConfigurationValues();
        }
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
    }

    handleLogin(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;

        if (this.auth.login(password)) {
            this.showDashboard();
            this.setupEventListeners();
            this.loadDashboardData();
            this.loadConfigurationValues();
            document.getElementById('loginForm').reset();
        } else {
            this.showNotification('Contraseña incorrecta', 'error');
        }
    }

    setupEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.tab-btn').dataset.tab));
        });

        const orderStatusFilter = document.getElementById('orderStatusFilter');
        if (orderStatusFilter) {
            orderStatusFilter.addEventListener('change', () => this.loadOrders());
        }

        const orderDateFromFilter = document.getElementById('orderDateFromFilter');
        if (orderDateFromFilter) {
            orderDateFromFilter.addEventListener('change', () => this.loadOrders());
        }

        const orderDateToFilter = document.getElementById('orderDateToFilter');
        if (orderDateToFilter) {
            orderDateToFilter.addEventListener('change', () => this.loadOrders());
        }

        const orderClientFilter = document.getElementById('orderClientFilter');
        if (orderClientFilter) {
            orderClientFilter.addEventListener('input', () => this.loadOrders());
        }

        const clearOrderFilters = document.getElementById('clearOrderFilters');
        if (clearOrderFilters) {
            clearOrderFilters.addEventListener('click', () => this.clearOrderFilters());
        }

        const quotationStatusFilter = document.getElementById('quotationStatusFilter');
        if (quotationStatusFilter) {
            quotationStatusFilter.addEventListener('change', () => this.loadQuotations());
        }

        const quotationDateFromFilter = document.getElementById('quotationDateFromFilter');
        if (quotationDateFromFilter) {
            quotationDateFromFilter.addEventListener('change', () => this.loadQuotations());
        }

        const quotationDateToFilter = document.getElementById('quotationDateToFilter');
        if (quotationDateToFilter) {
            quotationDateToFilter.addEventListener('change', () => this.loadQuotations());
        }

        const quotationMinAmountFilter = document.getElementById('quotationMinAmountFilter');
        if (quotationMinAmountFilter) {
            quotationMinAmountFilter.addEventListener('input', () => this.loadQuotations());
        }

        const quotationMaxAmountFilter = document.getElementById('quotationMaxAmountFilter');
        if (quotationMaxAmountFilter) {
            quotationMaxAmountFilter.addEventListener('input', () => this.loadQuotations());
        }

        const clearQuotationFilters = document.getElementById('clearQuotationFilters');
        if (clearQuotationFilters) {
            clearQuotationFilters.addEventListener('click', () => this.clearQuotationFilters());
        }

        const saveConfigBtn = document.getElementById('saveConfigBtn');
        if (saveConfigBtn) {
            saveConfigBtn.addEventListener('click', () => this.saveConfiguration());
        }

        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => this.openAddProductModal());
        }

        const exportProductsBtn = document.getElementById('exportProductsBtn');
        if (exportProductsBtn) {
            exportProductsBtn.addEventListener('click', () => this.exportProducts());
        }

        const importProductsBtn = document.getElementById('importProductsBtn');
        if (importProductsBtn) {
            importProductsBtn.addEventListener('click', () => {
                document.getElementById('importProductsFile').click();
            });
        }

        const importProductsFile = document.getElementById('importProductsFile');
        if (importProductsFile) {
            importProductsFile.addEventListener('change', (e) => this.importProducts(e));
        }

        const bulkPriceAdjustBtn = document.getElementById('bulkPriceAdjustBtn');
        if (bulkPriceAdjustBtn) {
            bulkPriceAdjustBtn.addEventListener('click', () => this.openBulkPriceAdjustModal());
        }

        const pricesCategoryFilter = document.getElementById('pricesCategoryFilter');
        if (pricesCategoryFilter) {
            pricesCategoryFilter.addEventListener('change', () => this.loadPrices());
        }

        const clearPricesFilters = document.getElementById('clearPricesFilters');
        if (clearPricesFilters) {
            clearPricesFilters.addEventListener('click', () => this.clearPricesFilters());
        }

        const exportOrdersBtn = document.getElementById('exportOrdersBtn');
        if (exportOrdersBtn) {
            exportOrdersBtn.addEventListener('click', () => this.exportOrdersToCSV());
        }

        const exportQuotationsBtn = document.getElementById('exportQuotationsBtn');
        if (exportQuotationsBtn) {
            exportQuotationsBtn.addEventListener('click', () => this.exportQuotationsToCSV());
        }
    }

    handleLogout() {
        this.auth.logout();
        window.location.reload();
    }

    getMonthlyStatistics() {
        const orders = this.getOrders();
        const quotations = this.getQuotations();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });

        const monthlyQuotations = quotations.filter(quotation => {
            const quotationDate = new Date(quotation.date);
            return quotationDate.getMonth() === currentMonth && quotationDate.getFullYear() === currentYear;
        });

        const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const monthlyConversion = monthlyQuotations.length > 0
            ? Math.round((monthlyOrders.length / monthlyQuotations.length) * 100)
            : 0;

        return {
            orders: monthlyOrders.length,
            quotations: monthlyQuotations.length,
            revenue: monthlyRevenue,
            conversion: monthlyConversion,
            averageOrderValue: monthlyOrders.length > 0 ? monthlyRevenue / monthlyOrders.length : 0
        };
    }

    getOrdersByStatus() {
        const orders = this.getOrders();
        const statusCounts = {};

        CONFIG.orders.statusOptions.forEach(status => {
            statusCounts[status.value] = orders.filter(o => o.status === status.value).length;
        });

        return statusCounts;
    }

    getQuotationsByStatus() {
        const quotations = this.getQuotations();
        const statusCounts = {
            draft: 0,
            sent: 0,
            accepted: 0,
            expired: 0
        };

        quotations.forEach(quotation => {
            const isExpired = new Date(quotation.validUntil) < new Date();
            if (isExpired) {
                statusCounts.expired++;
            } else {
                statusCounts[quotation.status] = (statusCounts[quotation.status] || 0) + 1;
            }
        });

        return statusCounts;
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        const activeContent = document.getElementById(`${tabName}Tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        if (tabName === 'orders') {
            this.loadOrders();
        } else if (tabName === 'quotations') {
            this.loadQuotations();
        } else if (tabName === 'products') {
            this.loadProducts();
        } else if (tabName === 'prices') {
            this.loadPricesTab();
        }
    }

    loadDashboardData() {
        this.updateStatistics();
        this.loadOrders();

        if (CONFIG.admin.dashboardRefreshInterval) {
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
            }
            this.refreshInterval = setInterval(() => {
                this.updateStatistics();
            }, CONFIG.admin.dashboardRefreshInterval);
        }
    }

    updateStatistics() {
        const orders = this.getOrders();
        const quotations = this.getQuotations();

        const totalOrders = orders.length;
        const totalQuotations = quotations.length;

        const totalRevenue = orders.reduce((sum, order) => {
            return sum + (order.total || 0);
        }, 0);

        const conversionRate = totalQuotations > 0
            ? Math.round((totalOrders / totalQuotations) * 100)
            : 0;

        const totalOrdersElement = document.getElementById('totalOrders');
        const totalQuotationsElement = document.getElementById('totalQuotations');
        const totalRevenueElement = document.getElementById('totalRevenue');
        const conversionRateElement = document.getElementById('conversionRate');

        if (totalOrdersElement) totalOrdersElement.textContent = totalOrders;
        if (totalQuotationsElement) totalQuotationsElement.textContent = totalQuotations;
        if (totalRevenueElement) totalRevenueElement.textContent = this.formatCurrency(totalRevenue);
        if (conversionRateElement) conversionRateElement.textContent = conversionRate + '%';
    }

    getOrders() {
        const data = localStorage.getItem('ferreteria_orders');
        return data ? JSON.parse(data) : [];
    }

    getQuotations() {
        const data = localStorage.getItem('ferreteria_quotations');
        return data ? JSON.parse(data) : [];
    }

    clearOrderFilters() {
        const statusFilter = document.getElementById('orderStatusFilter');
        const dateFromFilter = document.getElementById('orderDateFromFilter');
        const dateToFilter = document.getElementById('orderDateToFilter');
        const clientFilter = document.getElementById('orderClientFilter');

        if (statusFilter) statusFilter.value = '';
        if (dateFromFilter) dateFromFilter.value = '';
        if (dateToFilter) dateToFilter.value = '';
        if (clientFilter) clientFilter.value = '';

        this.loadOrders();
    }

    loadOrders() {
        const container = document.getElementById('ordersTableContainer');
        const orders = this.getOrders();
        const statusFilter = document.getElementById('orderStatusFilter')?.value || '';
        const dateFromFilter = document.getElementById('orderDateFromFilter')?.value || '';
        const dateToFilter = document.getElementById('orderDateToFilter')?.value || '';
        const clientFilter = document.getElementById('orderClientFilter')?.value.toLowerCase() || '';

        let filteredOrders = orders;

        if (statusFilter) {
            filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
        }

        if (dateFromFilter) {
            const fromDate = new Date(dateFromFilter);
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= fromDate;
            });
        }

        if (dateToFilter) {
            const toDate = new Date(dateToFilter);
            toDate.setHours(23, 59, 59, 999);
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate <= toDate;
            });
        }

        if (clientFilter) {
            filteredOrders = filteredOrders.filter(order => {
                const clientName = (order.customer?.name || '').toLowerCase();
                const clientPhone = (order.customer?.phone || '').toLowerCase();
                return clientName.includes(clientFilter) || clientPhone.includes(clientFilter);
            });
        }

        if (filteredOrders.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay pedidos que coincidan con los filtros</p>';
            return;
        }

        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>ID Pedido</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Teléfono</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        filteredOrders.forEach(order => {
            const statusConfig = CONFIG.orders.statusOptions.find(s => s.value === order.status);
            const statusLabel = statusConfig ? statusConfig.label : order.status;
            const date = new Date(order.date).toLocaleDateString('es-AR');
            const phone = order.customer?.phone || 'N/A';

            html += `
                <tr>
                    <td><strong>${SecurityUtils.escapeHTML(order.id)}</strong></td>
                    <td>${date}</td>
                    <td>${SecurityUtils.escapeHTML(order.customer?.name || 'N/A')}</td>
                    <td>${phone}</td>
                    <td>${this.formatCurrency(order.total)}</td>
                    <td><span class="status-badge status-${order.status}">${statusLabel}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-primary" onclick="adminDashboard.openOrderDetail('${SecurityUtils.escapeHTML(order.id)}')" title="Ver detalles">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                            <button class="btn-sm btn-secondary" onclick="adminDashboard.openUpdateStatusModal('${SecurityUtils.escapeHTML(order.id)}')" title="Actualizar estado">
                                <i class="fas fa-edit"></i> Actualizar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    loadQuotations() {
        const container = document.getElementById('quotationsTableContainer');
        const quotations = this.getQuotations();
        const statusFilter = document.getElementById('quotationStatusFilter')?.value || '';
        const dateFromFilter = document.getElementById('quotationDateFromFilter')?.value || '';
        const dateToFilter = document.getElementById('quotationDateToFilter')?.value || '';
        const minAmountFilter = document.getElementById('quotationMinAmountFilter')?.value || '';
        const maxAmountFilter = document.getElementById('quotationMaxAmountFilter')?.value || '';

        let filteredQuotations = quotations;

        if (statusFilter) {
            filteredQuotations = filteredQuotations.filter(q => {
                const isExpired = new Date(q.validUntil) < new Date();
                if (statusFilter === 'expired') {
                    return isExpired;
                }
                return !isExpired && q.status === statusFilter;
            });
        }

        if (dateFromFilter) {
            const fromDate = new Date(dateFromFilter);
            filteredQuotations = filteredQuotations.filter(q => {
                const quotationDate = new Date(q.date);
                return quotationDate >= fromDate;
            });
        }

        if (dateToFilter) {
            const toDate = new Date(dateToFilter);
            toDate.setHours(23, 59, 59, 999);
            filteredQuotations = filteredQuotations.filter(q => {
                const quotationDate = new Date(q.date);
                return quotationDate <= toDate;
            });
        }

        if (minAmountFilter) {
            const minAmount = parseFloat(minAmountFilter);
            filteredQuotations = filteredQuotations.filter(q => q.total >= minAmount);
        }

        if (maxAmountFilter) {
            const maxAmount = parseFloat(maxAmountFilter);
            filteredQuotations = filteredQuotations.filter(q => q.total <= maxAmount);
        }

        if (filteredQuotations.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay cotizaciones que coincidan con los filtros</p>';
            return;
        }

        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>ID Cotización</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Validez</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        filteredQuotations.forEach(quotation => {
            const date = new Date(quotation.date).toLocaleDateString('es-AR');
            const validUntil = new Date(quotation.validUntil).toLocaleDateString('es-AR');
            const isExpired = new Date(quotation.validUntil) < new Date();
            const displayStatus = isExpired ? 'expired' : quotation.status;
            const displayStatusLabel = isExpired ? 'Expirada' : quotation.status;

            html += `
                <tr>
                    <td><strong>${SecurityUtils.escapeHTML(quotation.id)}</strong></td>
                    <td>${date}</td>
                    <td>${this.formatCurrency(quotation.total)}</td>
                    <td><span class="status-badge status-${displayStatus}">${displayStatusLabel}</span></td>
                    <td>${validUntil}${isExpired ? ' (Expirada)' : ''}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-primary" onclick="adminDashboard.openQuotationDetail('${SecurityUtils.escapeHTML(quotation.id)}')">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    clearQuotationFilters() {
        const statusFilter = document.getElementById('quotationStatusFilter');
        const dateFromFilter = document.getElementById('quotationDateFromFilter');
        const dateToFilter = document.getElementById('quotationDateToFilter');
        const minAmountFilter = document.getElementById('quotationMinAmountFilter');
        const maxAmountFilter = document.getElementById('quotationMaxAmountFilter');

        if (statusFilter) statusFilter.value = '';
        if (dateFromFilter) dateFromFilter.value = '';
        if (dateToFilter) dateToFilter.value = '';
        if (minAmountFilter) minAmountFilter.value = '';
        if (maxAmountFilter) maxAmountFilter.value = '';

        this.loadQuotations();
    }

    loadProducts() {
        const container = document.getElementById('productsTableContainer');

        if (CONFIG.products.enableGoogleSheets) {
            const lastUpdate = localStorage.getItem('ferreteria_sheets_last_update');
            const lastUpdateText = lastUpdate
                ? `Última actualización: ${new Date(lastUpdate).toLocaleString('es-AR')}`
                : 'Nunca actualizado';

            container.innerHTML = `
                <div class="empty-state">
                    <p><i class="fas fa-cloud"></i></p>
                    <p>Los productos se cargan desde Google Sheets</p>
                    <p style="font-size: 12px; margin-top: 10px;">Edita los productos directamente en tu hoja de cálculo</p>
                    <p id="sheetsLastUpdate" style="font-size: 11px; margin-top: 8px; color: var(--text-secondary);">${lastUpdateText}</p>
                    <button class="btn-primary" style="margin-top: 16px;" onclick="adminDashboard.reloadGoogleSheets()">
                        <i class="fas fa-sync"></i> Recargar desde Google Sheets
                    </button>
                </div>
            `;
            return;
        }

        const products = this.getProducts();

        if (products.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay productos registrados</p>';
            return;
        }

        const categories = this.getProductCategories();
        const categoryFilterOptions = categories.map(cat =>
            `<option value="${cat}">${cat}</option>`
        ).join('');

        let html = `
            <div style="margin-bottom: 20px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                <input type="text" id="productSearchInput" class="form-control" placeholder="Buscar producto..." style="flex: 1; min-width: 200px;">
                <select id="productCategoryFilter" class="form-control" style="min-width: 150px;">
                    <option value="">Todas las categorías</option>
                    ${categoryFilterOptions}
                </select>
                <button class="btn-secondary" onclick="adminDashboard.clearProductFilters()">
                    <i class="fas fa-times"></i> Limpiar
                </button>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="productsTableBody">
        `;

        products.forEach(product => {
            html += `
                <tr class="product-row" data-name="${SecurityUtils.escapeHTML(product.name.toLowerCase())}" data-category="${SecurityUtils.escapeHTML((product.category || '').toLowerCase())}">
                    <td><strong>${SecurityUtils.escapeHTML(product.name)}</strong></td>
                    <td><span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; font-size: 12px;">${SecurityUtils.escapeHTML(product.category || 'Sin categoría')}</span></td>
                    <td>${this.formatCurrency(product.price)}</td>
                    <td>
                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; ${product.stock > 10 ? 'background: rgba(76, 175, 80, 0.15); color: #4caf50;' : product.stock > 0 ? 'background: rgba(245, 124, 0, 0.15); color: #f57c00;' : 'background: rgba(211, 47, 47, 0.15); color: #d32f2f;'}">
                            ${product.stock || 0} unidades
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-primary" onclick="adminDashboard.openEditProductModal('${SecurityUtils.escapeHTML(product.id)}')" title="Editar producto">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn-sm btn-danger" onclick="adminDashboard.deleteProduct('${SecurityUtils.escapeHTML(product.id)}')" title="Eliminar producto">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;

        const searchInput = document.getElementById('productSearchInput');
        const categoryFilter = document.getElementById('productCategoryFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterProducts());
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterProducts());
        }
    }

    filterProducts() {
        const searchTerm = document.getElementById('productSearchInput')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('productCategoryFilter')?.value.toLowerCase() || '';
        const rows = document.querySelectorAll('.product-row');

        let visibleCount = 0;

        rows.forEach(row => {
            const name = row.dataset.name || '';
            const category = row.dataset.category || '';

            const matchesSearch = name.includes(searchTerm);
            const matchesCategory = !categoryFilter || category === categoryFilter;

            if (matchesSearch && matchesCategory) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            const tbody = document.getElementById('productsTableBody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-secondary);">No se encontraron productos</td></tr>';
            }
        }
    }

    clearProductFilters() {
        const searchInput = document.getElementById('productSearchInput');
        const categoryFilter = document.getElementById('productCategoryFilter');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';

        this.filterProducts();
    }

    getProducts() {
        const data = localStorage.getItem('ferreteria_products');
        return data ? JSON.parse(data) : (typeof PRODUCTS_DATA !== 'undefined' ? PRODUCTS_DATA : []);
    }

    loadConfigurationValues() {
        const savedConfig = localStorage.getItem('ferreteria_config');
        const config = savedConfig ? JSON.parse(savedConfig) : {};

        const postSpacingInput = document.getElementById('configPostSpacing');
        if (postSpacingInput) {
            postSpacingInput.value = config.calculator?.defaultPostSpacing || CONFIG.calculator.defaultPostSpacing;
        }

        const cornerPostsInput = document.getElementById('configCornerPosts');
        if (cornerPostsInput) {
            cornerPostsInput.value = config.calculator?.cornerPosts || CONFIG.calculator.cornerPosts;
        }

        const installationPriceInput = document.getElementById('configInstallationPrice');
        if (installationPriceInput) {
            installationPriceInput.value = config.pricing?.installationPricePerMeter || CONFIG.pricing.installationPricePerMeter;
        }

        const marginInput = document.getElementById('configMargin');
        if (marginInput) {
            marginInput.value = config.pricing?.marginPercentage || CONFIG.pricing.marginPercentage;
        }

        const validityDaysInput = document.getElementById('configValidityDays');
        if (validityDaysInput) {
            validityDaysInput.value = config.quotation?.validityDays || CONFIG.quotation.validityDays;
        }
    }

    saveConfiguration() {
        try {
            const postSpacingValue = parseFloat(document.getElementById('configPostSpacing').value);
            const cornerPostsValue = parseInt(document.getElementById('configCornerPosts').value);
            const installationPriceValue = parseFloat(document.getElementById('configInstallationPrice').value);
            const marginValue = parseFloat(document.getElementById('configMargin').value);
            const validityDaysValue = parseInt(document.getElementById('configValidityDays').value);

            if (isNaN(postSpacingValue) || postSpacingValue <= 0) {
                this.showNotification('La separación entre postes debe ser un número positivo', 'error');
                return;
            }

            if (isNaN(cornerPostsValue) || cornerPostsValue < 0) {
                this.showNotification('Los postes esquineros deben ser un número válido', 'error');
                return;
            }

            if (isNaN(installationPriceValue) || installationPriceValue < 0) {
                this.showNotification('El costo de instalación debe ser un número válido', 'error');
                return;
            }

            if (isNaN(marginValue) || marginValue < 0) {
                this.showNotification('El margen de ganancia debe ser un número válido', 'error');
                return;
            }

            if (isNaN(validityDaysValue) || validityDaysValue <= 0) {
                this.showNotification('La validez de cotizaciones debe ser un número positivo', 'error');
                return;
            }

            const config = {
                calculator: {
                    defaultPostSpacing: postSpacingValue,
                    cornerPosts: cornerPostsValue
                },
                pricing: {
                    installationPricePerMeter: installationPriceValue,
                    marginPercentage: marginValue
                },
                quotation: {
                    validityDays: validityDaysValue
                }
            };

            Object.assign(CONFIG.calculator, config.calculator);
            Object.assign(CONFIG.pricing, config.pricing);
            Object.assign(CONFIG.quotation, config.quotation);

            localStorage.setItem('ferreteria_config', JSON.stringify(config));

            this.showNotification('Configuración guardada correctamente. La página se recargará en 2 segundos...', 'success');

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            this.showNotification('Error al guardar la configuración', 'error');
        }
    }

    openOrderDetail(orderId) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);

        if (!order) {
            this.showNotification('Pedido no encontrado', 'error');
            return;
        }

        let itemsHtml = '';
        if (order.items && order.items.length > 0) {
            itemsHtml = order.items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${this.formatCurrency(item.unitPrice)}</td>
                    <td>${this.formatCurrency(item.subtotal)}</td>
                </tr>
            `).join('');
        }

        const statusConfig = CONFIG.orders.statusOptions.find(s => s.value === order.status);
        const statusLabel = statusConfig ? statusConfig.label : order.status;

        let historyHtml = '';
        if (order.statusHistory && order.statusHistory.length > 0) {
            historyHtml = order.statusHistory.map(h => {
                const historyDate = new Date(h.date).toLocaleString('es-AR');
                const historyStatusConfig = CONFIG.orders.statusOptions.find(s => s.value === h.status);
                const historyStatusLabel = historyStatusConfig ? historyStatusConfig.label : h.status;
                return `
                    <div style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                        <strong>${historyStatusLabel}</strong> - ${historyDate}
                        ${h.note ? `<div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">${h.note}</div>` : ''}
                    </div>
                `;
            }).join('');
        }

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                <div class="modal-header">
                    <h2>Detalles del Pedido</h2>
                    <p style="font-size: 12px; color: var(--text-secondary); margin: 8px 0 0 0;">
                        Orden: <strong>${order.id}</strong>
                    </p>
                </div>
                <div class="modal-body">
                    <h3>Información del Cliente</h3>
                    <p><strong>Nombre:</strong> ${order.customer?.name || 'N/A'}</p>
                    <p><strong>Teléfono:</strong> ${order.customer?.phone || 'N/A'}</p>
                    <p><strong>Email:</strong> ${order.customer?.email || 'N/A'}</p>
                    <p><strong>Dirección:</strong> ${order.customer?.address || 'N/A'}</p>
                    ${order.customer?.installationDate ? `<p><strong>Fecha Preferida de Instalación:</strong> ${new Date(order.customer.installationDate).toLocaleDateString('es-AR')}</p>` : ''}
                    
                    <h3 style="margin-top: 20px;">Productos</h3>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                                ${order.installation && order.installation.linearMeters > 0 ? `
                                    <tr>
                                        <td>Instalación (${order.installation.linearMeters}m)</td>
                                        <td>1</td>
                                        <td>${this.formatCurrency(order.installation.pricePerMeter)}/m</td>
                                        <td>${this.formatCurrency(order.installation.subtotal)}</td>
                                    </tr>
                                ` : ''}
                            </tbody>
                        </table>
                    </div>
                    
                    <h3 style="margin-top: 20px;">Resumen</h3>
                    <p><strong>Estado:</strong> <span class="status-badge status-${order.status}">${statusLabel}</span></p>
                    <p><strong>Fecha de Creación:</strong> ${new Date(order.date).toLocaleDateString('es-AR')}</p>
                    <p><strong>Subtotal:</strong> ${this.formatCurrency(order.subtotal)}</p>
                    <p style="font-size: 16px; font-weight: 700; color: var(--primary);"><strong>Total:</strong> ${this.formatCurrency(order.total)}</p>
                    
                    ${historyHtml ? `
                        <h3 style="margin-top: 20px;">Historial de Estados</h3>
                        <div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px;">
                            ${historyHtml}
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cerrar</button>
                    <button class="btn-primary" onclick="adminDashboard.openUpdateStatusModal('${order.id}'); this.closest('.modal').remove();">
                        <i class="fas fa-edit"></i> Actualizar Estado
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    openUpdateStatusModal(orderId) {
        try {
            const orders = this.getOrders();
            const order = orders.find(o => o.id === orderId);

            if (!order) {
                this.showNotification('Pedido no encontrado', 'error');
                return;
            }

            const statusOptions = CONFIG.orders.statusOptions.map(s =>
                `<option value="${s.value}" ${s.value === order.status ? 'selected' : ''}>${s.label}</option>`
            ).join('');

            const currentStatusConfig = CONFIG.orders.statusOptions.find(s => s.value === order.status);
            const currentStatusLabel = currentStatusConfig ? currentStatusConfig.label : order.status;

            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                    <div class="modal-header">
                        <h2>
                            <i class="fas fa-edit"></i>
                            Actualizar Estado del Pedido
                        </h2>
                        <p style="font-size: 12px; color: var(--text-secondary); margin: 8px 0 0 0;">
                            Orden: <strong>${order.id}</strong>
                        </p>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label style="font-weight: 600;">Estado Actual</label>
                            <div style="padding: 10px; background: var(--bg-secondary); border-radius: 6px; margin-bottom: 16px;">
                                <span class="status-badge status-${order.status}" style="background-color: ${currentStatusConfig?.color || '#666'}">${currentStatusLabel}</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="newStatus" style="font-weight: 600;">Nuevo Estado</label>
                            <select id="newStatus" class="form-control">
                                ${statusOptions}
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="statusNote" style="font-weight: 600;">Nota o Comentario (opcional)</label>
                            <textarea id="statusNote" class="form-control" rows="4" placeholder="Agrrega una nota sobre el cambio de estado..."></textarea>
                            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 6px;">
                                <i class="fas fa-info-circle"></i>
                                La nota será incluida en el historial del pedido
                            </div>
                        </div>

                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500;">
                                <input type="checkbox" id="notifyWhatsApp" checked>
                                <span>
                                    <i class="fab fa-whatsapp"></i>
                                    Notificar al cliente por WhatsApp
                                </span>
                            </label>
                            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 6px; margin-left: 28px;">
                                Se enviará un mensaje con el nuevo estado y la nota
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-times"></i>
                            Cancelar
                        </button>
                        <button class="btn-primary" onclick="adminDashboard.updateOrderStatus('${order.id}', this.closest('.modal'))">
                            <i class="fas fa-save"></i>
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
        } catch (error) {
            console.error('Error al abrir modal de actualización de estado:', error);
            this.showNotification('Error al abrir el formulario', 'error');
        }
    }

    updateOrderStatus(orderId, modalElement) {
        try {
            const newStatus = document.getElementById('newStatus').value;
            const note = document.getElementById('statusNote').value.trim();
            const notifyWhatsApp = document.getElementById('notifyWhatsApp')?.checked || false;

            if (!newStatus) {
                this.showNotification('Por favor selecciona un estado', 'error');
                return;
            }

            const orders = this.getOrders();
            const order = orders.find(o => o.id === orderId);

            if (!order) {
                this.showNotification('Pedido no encontrado', 'error');
                return;
            }

            const oldStatus = order.status;

            if (oldStatus === newStatus && !note) {
                this.showNotification('No hay cambios para guardar', 'warning');
                return;
            }

            order.status = newStatus;

            if (!order.statusHistory) {
                order.statusHistory = [];
            }

            order.statusHistory.push({
                status: newStatus,
                date: new Date().toISOString(),
                note: note || `Estado actualizado a ${newStatus}`
            });

            localStorage.setItem('ferreteria_orders', JSON.stringify(orders));
            this.showNotification('Estado del pedido actualizado correctamente', 'success');

            if (notifyWhatsApp && order.customer?.phone) {
                this.sendStatusUpdateViaWhatsApp(order, oldStatus, newStatus, note);
            }

            modalElement.remove();
            this.loadOrders();
            this.updateStatistics();
        } catch (error) {
            console.error('Error al actualizar estado del pedido:', error);
            this.showNotification('Error al actualizar el estado del pedido', 'error');
        }
    }

    sendStatusUpdateViaWhatsApp(order, oldStatus, newStatus, note) {
        try {
            const whatsappNumber = CONFIG.contact?.whatsapp?.number || '';

            if (!whatsappNumber) {
                this.showNotification('Número de WhatsApp no configurado', 'warning');
                return;
            }

            const statusConfig = CONFIG.orders.statusOptions.find(s => s.value === newStatus);
            const statusLabel = statusConfig ? statusConfig.label : newStatus;

            let message = `*Actualización de Estado - ${CONFIG.business?.name || 'Metales & Hierros'}*\n\n`;
            message += `Hola ${order.customer.name},\n\n`;
            message += `Tu pedido *${order.id}* ha sido actualizado.\n\n`;
            message += `*Nuevo Estado:* ${statusLabel}\n`;

            if (note) {
                message += `*Nota:* ${note}\n`;
            }

            message += `\n*Detalles del Pedido:*\n`;
            message += `Total: ${this.formatCurrency(order.total)}\n`;
            message += `Fecha: ${new Date(order.date).toLocaleDateString('es-AR')}\n`;

            if (order.customer.address && (newStatus === 'in_progress' || newStatus === 'completed')) {
                message += `Dirección: ${order.customer.address}\n`;
            }

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            this.showNotification('Mensaje de WhatsApp abierto', 'info');
        } catch (error) {
            console.error('Error al enviar notificación por WhatsApp:', error);
            this.showNotification('Error al enviar notificación por WhatsApp', 'error');
        }
    }

    openQuotationDetail(quotationId) {
        const quotations = this.getQuotations();
        const quotation = quotations.find(q => q.id === quotationId);

        if (!quotation) {
            this.showNotification('Cotización no encontrada', 'error');
            return;
        }

        let itemsHtml = '';
        if (quotation.items && quotation.items.length > 0) {
            itemsHtml = quotation.items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${this.formatCurrency(item.unitPrice)}</td>
                    <td>${this.formatCurrency(item.subtotal)}</td>
                </tr>
            `).join('');
        }

        const isExpired = new Date(quotation.validUntil) < new Date();
        const displayStatus = isExpired ? 'Expirada' : quotation.status;
        const daysRemaining = Math.ceil((new Date(quotation.validUntil) - new Date()) / (1000 * 60 * 60 * 24));

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                <div class="modal-header">
                    <h2>Detalles de la Cotización</h2>
                    <p style="font-size: 12px; color: var(--text-secondary); margin: 8px 0 0 0;">
                        ID: <strong>${quotation.id}</strong>
                    </p>
                </div>
                <div class="modal-body">
                    <h3>Información General</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                        <div>
                            <p><strong>Fecha de Creación:</strong></p>
                            <p style="color: var(--text-secondary);">${new Date(quotation.date).toLocaleDateString('es-AR')}</p>
                        </div>
                        <div>
                            <p><strong>Estado:</strong></p>
                            <p><span class="status-badge status-${isExpired ? 'expired' : quotation.status}">${displayStatus}</span></p>
                        </div>
                        <div>
                            <p><strong>Válida hasta:</strong></p>
                            <p style="color: var(--text-secondary);">${new Date(quotation.validUntil).toLocaleDateString('es-AR')}</p>
                        </div>
                        <div>
                            <p><strong>Días Restantes:</strong></p>
                            <p style="color: ${daysRemaining > 0 ? 'var(--text-secondary)' : '#d32f2f'};">${daysRemaining > 0 ? daysRemaining + ' días' : 'Expirada'}</p>
                        </div>
                    </div>

                    <h3>Productos</h3>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                                ${quotation.installation && quotation.installation.linearMeters > 0 ? `
                                    <tr>
                                        <td>Instalación (${quotation.installation.linearMeters}m)</td>
                                        <td>1</td>
                                        <td>${this.formatCurrency(quotation.installation.pricePerMeter)}/m</td>
                                        <td>${this.formatCurrency(quotation.installation.subtotal)}</td>
                                    </tr>
                                ` : ''}
                            </tbody>
                        </table>
                    </div>
                    
                    <h3 style="margin-top: 20px;">Resumen Financiero</h3>
                    <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Subtotal:</span>
                            <strong>${this.formatCurrency(quotation.subtotal)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--border-color); font-size: 16px; font-weight: 700; color: var(--primary);">
                            <span>Total:</span>
                            <strong>${this.formatCurrency(quotation.total)}</strong>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cerrar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    openAddProductModal() {
        const categories = this.getProductCategories();
        const categoryOptions = categories.map(cat =>
            `<option value="${cat}">${cat}</option>`
        ).join('');

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                <div class="modal-header">
                    <h2><i class="fas fa-plus"></i> Agregar Producto</h2>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="productName">Nombre del Producto *</label>
                        <input type="text" id="productName" class="form-control" placeholder="Ej: Poste de Hormigón 2.5m" required>
                    </div>
                    <div class="form-group">
                        <label for="productCategory">Categoría *</label>
                        <select id="productCategory" class="form-control" required>
                            <option value="">Selecciona una categoría</option>
                            ${categoryOptions}
                            <option value="__new__">+ Crear nueva categoría</option>
                        </select>
                        <input type="text" id="productCategoryNew" class="form-control" placeholder="Nombre de la nueva categoría" style="display: none; margin-top: 8px;">
                    </div>
                    <div class="form-group">
                        <label for="productDescription">Descripción</label>
                        <textarea id="productDescription" class="form-control" rows="3" placeholder="Descripción del producto"></textarea>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label for="productPrice">Precio (ARS) *</label>
                            <input type="number" id="productPrice" class="form-control" placeholder="0.00" step="0.01" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="productStock">Stock *</label>
                            <input type="number" id="productStock" class="form-control" placeholder="0" value="0" min="0" required>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button class="btn-primary" onclick="adminDashboard.saveNewProduct(this.closest('.modal'))">
                        <i class="fas fa-save"></i> Guardar Producto
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const categorySelect = document.getElementById('productCategory');
        const categoryNewInput = document.getElementById('productCategoryNew');

        categorySelect.addEventListener('change', (e) => {
            if (e.target.value === '__new__') {
                categoryNewInput.style.display = 'block';
                categoryNewInput.focus();
            } else {
                categoryNewInput.style.display = 'none';
            }
        });
    }

    saveNewProduct(modalElement) {
        const name = document.getElementById('productName').value.trim();
        let category = document.getElementById('productCategory').value;
        const categoryNew = document.getElementById('productCategoryNew').value.trim();
        const description = document.getElementById('productDescription').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);

        if (!name) {
            this.showNotification('El nombre del producto es requerido', 'error');
            return;
        }

        if (category === '__new__') {
            if (!categoryNew) {
                this.showNotification('Por favor ingresa el nombre de la nueva categoría', 'error');
                return;
            }
            category = categoryNew;
        }

        if (!category) {
            this.showNotification('Por favor selecciona una categoría', 'error');
            return;
        }

        if (isNaN(price) || price < 0) {
            this.showNotification('El precio debe ser un número válido', 'error');
            return;
        }

        if (isNaN(stock) || stock < 0) {
            this.showNotification('El stock debe ser un número válido', 'error');
            return;
        }

        const products = this.getProducts();
        const newProduct = {
            id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: name,
            category: category,
            description: description,
            price: price,
            stock: stock,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        products.push(newProduct);
        localStorage.setItem('ferreteria_products', JSON.stringify(products));
        this.showNotification('Producto agregado correctamente', 'success');
        modalElement.remove();
        this.loadProducts();
    }

    openEditProductModal(productId) {
        const products = this.getProducts();
        const product = products.find(p => p.id === productId);

        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return;
        }

        const categories = this.getProductCategories();
        const categoryOptions = categories.map(cat =>
            `<option value="${cat}" ${cat === product.category ? 'selected' : ''}>${cat}</option>`
        ).join('');

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> Editar Producto</h2>
                    <p style="font-size: 12px; color: var(--text-secondary); margin: 8px 0 0 0;">
                        ID: <strong>${product.id}</strong>
                    </p>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="productName">Nombre del Producto *</label>
                        <input type="text" id="productName" class="form-control" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="productCategory">Categoría *</label>
                        <select id="productCategory" class="form-control" required>
                            ${categoryOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="productDescription">Descripción</label>
                        <textarea id="productDescription" class="form-control" rows="3">${product.description || ''}</textarea>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label for="productPrice">Precio (ARS) *</label>
                            <input type="number" id="productPrice" class="form-control" value="${product.price}" step="0.01" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="productStock">Stock *</label>
                            <input type="number" id="productStock" class="form-control" value="${product.stock || 0}" min="0" required>
                        </div>
                    </div>
                    <div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; font-size: 12px; color: var(--text-secondary);">
                        <p style="margin: 0 0 4px 0;"><strong>Creado:</strong> ${new Date(product.createdAt).toLocaleString('es-AR')}</p>
                        <p style="margin: 0;"><strong>Actualizado:</strong> ${new Date(product.updatedAt).toLocaleString('es-AR')}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button class="btn-primary" onclick="adminDashboard.updateProduct('${productId}', this.closest('.modal'))">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    updateProduct(productId, modalElement) {
        const name = document.getElementById('productName').value.trim();
        const category = document.getElementById('productCategory').value;
        const description = document.getElementById('productDescription').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);

        if (!name) {
            this.showNotification('El nombre del producto es requerido', 'error');
            return;
        }

        if (!category) {
            this.showNotification('Por favor selecciona una categoría', 'error');
            return;
        }

        if (isNaN(price) || price < 0) {
            this.showNotification('El precio debe ser un número válido', 'error');
            return;
        }

        if (isNaN(stock) || stock < 0) {
            this.showNotification('El stock debe ser un número válido', 'error');
            return;
        }

        const products = this.getProducts();
        const product = products.find(p => p.id === productId);

        if (product) {
            product.name = name;
            product.category = category;
            product.description = description;
            product.price = price;
            product.stock = stock;
            product.updatedAt = new Date().toISOString();

            localStorage.setItem('ferreteria_products', JSON.stringify(products));
            this.showNotification('Producto actualizado correctamente', 'success');
            modalElement.remove();
            this.loadProducts();
        }
    }

    deleteProduct(productId) {
        const products = this.getProducts();
        const product = products.find(p => p.id === productId);

        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return;
        }

        if (!confirm(`¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        const filtered = products.filter(p => p.id !== productId);
        localStorage.setItem('ferreteria_products', JSON.stringify(filtered));
        this.showNotification('Producto eliminado correctamente', 'success');
        this.loadProducts();
    }

    getProductCategories() {
        const products = this.getProducts();
        const categories = new Set();

        products.forEach(product => {
            if (product.category) {
                categories.add(product.category);
            }
        });

        return Array.from(categories).sort();
    }

    exportProducts() {
        try {
            const products = this.getProducts();

            if (products.length === 0) {
                this.showNotification('No hay productos para exportar', 'warning');
                return;
            }

            const exportData = {
                exportDate: new Date().toISOString(),
                totalProducts: products.length,
                products: products
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `productos_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.showNotification(`${products.length} productos exportados correctamente`, 'success');
        } catch (error) {
            console.error('Error al exportar productos:', error);
            this.showNotification('Error al exportar productos', 'error');
        }
    }

    importProducts(event) {
        try {
            const file = event.target.files[0];

            if (!file) {
                return;
            }

            if (!file.name.endsWith('.json')) {
                this.showNotification('Por favor selecciona un archivo JSON válido', 'error');
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);

                    if (!importedData.products || !Array.isArray(importedData.products)) {
                        this.showNotification('Formato de archivo inválido', 'error');
                        return;
                    }

                    const currentProducts = this.getProducts();
                    let addedCount = 0;
                    let updatedCount = 0;

                    importedData.products.forEach(importedProduct => {
                        const existingIndex = currentProducts.findIndex(p => p.id === importedProduct.id);

                        if (existingIndex >= 0) {
                            currentProducts[existingIndex] = {
                                ...currentProducts[existingIndex],
                                ...importedProduct,
                                updatedAt: new Date().toISOString()
                            };
                            updatedCount++;
                        } else {
                            currentProducts.push({
                                ...importedProduct,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            });
                            addedCount++;
                        }
                    });

                    localStorage.setItem('ferreteria_products', JSON.stringify(currentProducts));

                    let message = `Importación completada: ${addedCount} productos agregados`;
                    if (updatedCount > 0) {
                        message += `, ${updatedCount} actualizados`;
                    }

                    this.showNotification(message, 'success');
                    this.loadProducts();
                } catch (parseError) {
                    console.error('Error al parsear JSON:', parseError);
                    this.showNotification('Error al leer el archivo JSON', 'error');
                }
            };

            reader.onerror = () => {
                this.showNotification('Error al leer el archivo', 'error');
            };

            reader.readAsText(file);

            event.target.value = '';
        } catch (error) {
            console.error('Error al importar productos:', error);
            this.showNotification('Error al importar productos', 'error');
        }
    }

    reloadGoogleSheets() {
        if (!CONFIG.products.enableGoogleSheets) {
            this.showNotification('Google Sheets no está habilitado en la configuración', 'error');
            return;
        }

        if (typeof productsLoader === 'undefined' || !productsLoader.reloadAll) {
            this.showNotification('El cargador de Google Sheets no está disponible', 'error');
            return;
        }

        const reloadBtn = document.querySelector('[onclick="adminDashboard.reloadGoogleSheets()"]');

        if (typeof loaderManager !== 'undefined') {
            loaderManager.withButtonSpinner(reloadBtn, async () => {
                this.showNotification('Recargando productos desde Google Sheets...', 'info');

                try {
                    const data = await productsLoader.reloadAll();

                    const timestamp = new Date().toISOString();
                    localStorage.setItem('ferreteria_sheets_last_update', timestamp);

                    const lastUpdateElement = document.getElementById('sheetsLastUpdate');
                    if (lastUpdateElement) {
                        const formattedDate = new Date(timestamp).toLocaleString('es-AR');
                        lastUpdateElement.textContent = `Última actualización: ${formattedDate}`;
                    }

                    this.showNotification('Productos recargados correctamente desde Google Sheets', 'success');
                } catch (error) {
                    console.error('Error al recargar Google Sheets:', error);
                    this.showNotification('Error al recargar productos: ' + (error.message || 'Error desconocido'), 'error');
                    throw error;
                }
            }, 'Recargando...');
        } else {
            if (reloadBtn) {
                reloadBtn.disabled = true;
                reloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recargando...';
            }

            this.showNotification('Recargando productos desde Google Sheets...', 'info');

            productsLoader.reloadAll()
                .then((data) => {
                    const timestamp = new Date().toISOString();
                    localStorage.setItem('ferreteria_sheets_last_update', timestamp);

                    const lastUpdateElement = document.getElementById('sheetsLastUpdate');
                    if (lastUpdateElement) {
                        const formattedDate = new Date(timestamp).toLocaleString('es-AR');
                        lastUpdateElement.textContent = `Última actualización: ${formattedDate}`;
                    }

                    this.showNotification('Productos recargados correctamente desde Google Sheets', 'success');

                    if (reloadBtn) {
                        reloadBtn.disabled = false;
                        reloadBtn.innerHTML = '<i class="fas fa-sync"></i> Recargar desde Google Sheets';
                    }
                })
                .catch((error) => {
                    console.error('Error al recargar Google Sheets:', error);
                    this.showNotification('Error al recargar productos: ' + (error.message || 'Error desconocido'), 'error');

                    if (reloadBtn) {
                        reloadBtn.disabled = false;
                        reloadBtn.innerHTML = '<i class="fas fa-sync"></i> Recargar desde Google Sheets';
                    }
                });
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat(CONFIG.pricing.currencyFormat.locale, {
            style: 'currency',
            currency: CONFIG.pricing.currency,
            minimumFractionDigits: CONFIG.pricing.currencyFormat.minimumFractionDigits,
            maximumFractionDigits: CONFIG.pricing.currencyFormat.maximumFractionDigits
        }).format(value);
    }

    loadPricesTab() {
        const categoryFilter = document.getElementById('pricesCategoryFilter');
        if (categoryFilter) {
            const categories = this.getProductCategories();
            const currentValue = categoryFilter.value;

            categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categoryFilter.appendChild(option);
            });

            categoryFilter.value = currentValue;
        }

        this.loadPrices();
    }

    loadPrices() {
        const container = document.getElementById('pricesTableContainer');
        const products = this.getProducts();
        const categoryFilter = document.getElementById('pricesCategoryFilter')?.value || '';

        let filteredProducts = products;

        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
        }

        if (filteredProducts.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay productos para mostrar</p>';
            return;
        }

        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio Actual</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        filteredProducts.forEach(product => {
            html += `
                <tr>
                    <td><strong>${product.name}</strong></td>
                    <td><span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; font-size: 12px;">${product.category || 'Sin categoría'}</span></td>
                    <td>${this.formatCurrency(product.price)}</td>
                    <td>
                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; ${product.stock > 10 ? 'background: rgba(76, 175, 80, 0.15); color: #4caf50;' : product.stock > 0 ? 'background: rgba(245, 124, 0, 0.15); color: #f57c00;' : 'background: rgba(211, 47, 47, 0.15); color: #d32f2f;'}">
                            ${product.stock || 0}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-primary" onclick="adminDashboard.openEditPriceModal('${product.id}')" title="Editar precio">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    clearPricesFilters() {
        const categoryFilter = document.getElementById('pricesCategoryFilter');
        if (categoryFilter) categoryFilter.value = '';
        this.loadPrices();
    }

    openEditPriceModal(productId) {
        const products = this.getProducts();
        const product = products.find(p => p.id === productId);

        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> Editar Precio</h2>
                    <p style="font-size: 12px; color: var(--text-secondary); margin: 8px 0 0 0;">
                        Producto: <strong>${product.name}</strong>
                    </p>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Nombre del Producto</label>
                        <input type="text" class="form-control" value="${product.name}" disabled style="background: var(--bg-secondary); cursor: not-allowed;">
                    </div>
                    <div class="form-group">
                        <label>Categoría</label>
                        <input type="text" class="form-control" value="${product.category || 'Sin categoría'}" disabled style="background: var(--bg-secondary); cursor: not-allowed;">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label for="currentPrice">Precio Actual (ARS)</label>
                            <input type="number" id="currentPrice" class="form-control" value="${product.price}" disabled style="background: var(--bg-secondary); cursor: not-allowed;">
                        </div>
                        <div class="form-group">
                            <label for="newPrice">Nuevo Precio (ARS) *</label>
                            <input type="number" id="newPrice" class="form-control" value="${product.price}" step="0.01" min="0" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="priceChange">Cambio</label>
                        <div style="display: flex; gap: 12px; align-items: center;">
                            <input type="number" id="priceChange" class="form-control" value="0" step="0.01" readonly style="background: var(--bg-secondary); cursor: not-allowed;">
                            <span id="priceChangePercent" style="font-weight: 600; color: var(--primary); min-width: 80px;">0%</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button class="btn-primary" onclick="adminDashboard.updateProductPrice('${productId}', this.closest('.modal'))">
                        <i class="fas fa-save"></i> Guardar Precio
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const newPriceInput = document.getElementById('newPrice');
        const currentPrice = parseFloat(product.price);

        newPriceInput.addEventListener('input', () => {
            const newPrice = parseFloat(newPriceInput.value) || 0;
            const change = newPrice - currentPrice;
            const changePercent = currentPrice > 0 ? ((change / currentPrice) * 100).toFixed(2) : 0;

            document.getElementById('priceChange').value = change.toFixed(2);
            const percentElement = document.getElementById('priceChangePercent');
            percentElement.textContent = changePercent + '%';
            percentElement.style.color = changePercent >= 0 ? '#4caf50' : '#d32f2f';
        });
    }

    updateProductPrice(productId, modalElement) {
        const newPrice = parseFloat(document.getElementById('newPrice').value);

        if (isNaN(newPrice) || newPrice < 0) {
            this.showNotification('El precio debe ser un número válido', 'error');
            return;
        }

        const products = this.getProducts();
        const product = products.find(p => p.id === productId);

        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return;
        }

        const oldPrice = product.price;
        product.price = newPrice;
        product.updatedAt = new Date().toISOString();

        localStorage.setItem('ferreteria_products', JSON.stringify(products));

        const changePercent = oldPrice > 0 ? (((newPrice - oldPrice) / oldPrice) * 100).toFixed(2) : 0;
        this.showNotification(`Precio actualizado: ${this.formatCurrency(oldPrice)} → ${this.formatCurrency(newPrice)} (${changePercent}%)`, 'success');

        modalElement.remove();
        this.loadPrices();
    }

    openBulkPriceAdjustModal() {
        const categories = this.getProductCategories();
        const categoryOptions = categories.map(cat =>
            `<option value="${cat}">${cat}</option>`
        ).join('');

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                <div class="modal-header">
                    <h2><i class="fas fa-percentage"></i> Ajuste Masivo de Precios</h2>
                    <p style="font-size: 12px; color: var(--text-secondary); margin: 8px 0 0 0;">
                        Aplica cambios de precio a múltiples productos
                    </p>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="bulkCategory">Categoría *</label>
                        <select id="bulkCategory" class="form-control" required>
                            <option value="">Selecciona una categoría</option>
                            ${categoryOptions}
                            <option value="__all__">Todos los productos</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="adjustmentType">Tipo de Ajuste *</label>
                        <select id="adjustmentType" class="form-control" required>
                            <option value="percentage">Porcentaje (%)</option>
                            <option value="fixed">Cantidad Fija (ARS)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="adjustmentValue">Valor del Ajuste *</label>
                        <div style="display: flex; gap: 12px; align-items: center;">
                            <input type="number" id="adjustmentValue" class="form-control" placeholder="0" step="0.01" required>
                            <span id="adjustmentUnit" style="font-weight: 600; min-width: 40px;">%</span>
                        </div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 6px;">
                            <i class="fas fa-info-circle"></i>
                            Usa valores negativos para reducir precios
                        </div>
                    </div>

                    <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; margin-top: 20px;">
                        <h4 style="margin: 0 0 12px 0; font-size: 14px;">Vista Previa</h4>
                        <div id="bulkPreviewContainer" style="font-size: 13px; color: var(--text-secondary);">
                            <p>Selecciona una categoría y un valor para ver la vista previa</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button class="btn-primary" onclick="adminDashboard.applyBulkPriceAdjustment(this.closest('.modal'))">
                        <i class="fas fa-check"></i> Aplicar Cambios
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const adjustmentTypeSelect = document.getElementById('adjustmentType');
        const adjustmentUnitSpan = document.getElementById('adjustmentUnit');

        adjustmentTypeSelect.addEventListener('change', (e) => {
            adjustmentUnitSpan.textContent = e.target.value === 'percentage' ? '%' : 'ARS';
        });

        const bulkCategorySelect = document.getElementById('bulkCategory');
        const adjustmentValueInput = document.getElementById('adjustmentValue');

        const updatePreview = () => {
            const category = bulkCategorySelect.value;
            const adjustmentType = document.getElementById('adjustmentType').value;
            const adjustmentValue = parseFloat(adjustmentValueInput.value) || 0;

            if (!category) {
                document.getElementById('bulkPreviewContainer').innerHTML = '<p>Selecciona una categoría para ver la vista previa</p>';
                return;
            }

            const products = this.getProducts();
            let targetProducts = products;

            if (category !== '__all__') {
                targetProducts = products.filter(p => p.category === category);
            }

            if (targetProducts.length === 0) {
                document.getElementById('bulkPreviewContainer').innerHTML = '<p>No hay productos en esta categoría</p>';
                return;
            }

            let previewHtml = `<p><strong>Se afectarán ${targetProducts.length} producto(s):</strong></p>`;
            previewHtml += '<div style="max-height: 200px; overflow-y: auto;">';

            targetProducts.slice(0, 5).forEach(product => {
                let newPrice;
                if (adjustmentType === 'percentage') {
                    newPrice = product.price * (1 + adjustmentValue / 100);
                } else {
                    newPrice = product.price + adjustmentValue;
                }
                newPrice = Math.max(0, newPrice);

                const change = newPrice - product.price;
                const changePercent = product.price > 0 ? ((change / product.price) * 100).toFixed(2) : 0;

                previewHtml += `
                    <div style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>${product.name}</span>
                            <span style="color: ${changePercent >= 0 ? '#4caf50' : '#d32f2f'}; font-weight: 600;">
                                ${this.formatCurrency(product.price)} → ${this.formatCurrency(newPrice)} (${changePercent}%)
                            </span>
                        </div>
                    </div>
                `;
            });

            if (targetProducts.length > 5) {
                previewHtml += `<div style="padding: 8px 0; text-align: center; color: var(--text-muted);">... y ${targetProducts.length - 5} más</div>`;
            }

            previewHtml += '</div>';
            document.getElementById('bulkPreviewContainer').innerHTML = previewHtml;
        };

        bulkCategorySelect.addEventListener('change', updatePreview);
        adjustmentValueInput.addEventListener('input', updatePreview);
    }

    applyBulkPriceAdjustment(modalElement) {
        const category = document.getElementById('bulkCategory').value;
        const adjustmentType = document.getElementById('adjustmentType').value;
        const adjustmentValue = parseFloat(document.getElementById('adjustmentValue').value);

        if (!category) {
            this.showNotification('Por favor selecciona una categoría', 'error');
            return;
        }

        if (isNaN(adjustmentValue)) {
            this.showNotification('Por favor ingresa un valor válido', 'error');
            return;
        }

        const products = this.getProducts();
        let targetProducts = products;

        if (category !== '__all__') {
            targetProducts = products.filter(p => p.category === category);
        }

        if (targetProducts.length === 0) {
            this.showNotification('No hay productos para ajustar', 'error');
            return;
        }

        let totalAffected = 0;
        let totalOldValue = 0;
        let totalNewValue = 0;

        targetProducts.forEach(product => {
            const oldPrice = product.price;
            let newPrice;

            if (adjustmentType === 'percentage') {
                newPrice = product.price * (1 + adjustmentValue / 100);
            } else {
                newPrice = product.price + adjustmentValue;
            }

            newPrice = Math.max(0, newPrice);

            if (newPrice !== oldPrice) {
                product.price = newPrice;
                product.updatedAt = new Date().toISOString();
                totalAffected++;
                totalOldValue += oldPrice;
                totalNewValue += newPrice;
            }
        });

        if (totalAffected === 0) {
            this.showNotification('No se realizaron cambios', 'warning');
            return;
        }

        localStorage.setItem('ferreteria_products', JSON.stringify(products));

        const totalChange = totalNewValue - totalOldValue;
        const totalChangePercent = totalOldValue > 0 ? ((totalChange / totalOldValue) * 100).toFixed(2) : 0;

        this.showNotification(
            `${totalAffected} producto(s) actualizado(s). Valor total: ${this.formatCurrency(totalOldValue)} → ${this.formatCurrency(totalNewValue)} (${totalChangePercent}%)`,
            'success'
        );

        modalElement.remove();
        this.loadPrices();
    }

    exportOrdersToCSV() {
        const orders = this.getOrders();

        if (orders.length === 0) {
            this.showNotification('No hay pedidos para exportar', 'warning');
            return;
        }

        const headers = ['ID Pedido', 'Fecha', 'Cliente', 'Teléfono', 'Email', 'Dirección', 'Productos', 'Total', 'Estado'];
        const rows = [];

        orders.forEach(order => {
            const date = new Date(order.date).toLocaleDateString('es-AR');
            const products = order.items?.map(item => `${item.name} (x${item.quantity})`).join('; ') || '';
            const statusConfig = CONFIG.orders.statusOptions.find(s => s.value === order.status);
            const statusLabel = statusConfig ? statusConfig.label : order.status;

            rows.push([
                order.id,
                date,
                order.customer?.name || '',
                order.customer?.phone || '',
                order.customer?.email || '',
                order.customer?.address || '',
                products,
                order.total || 0,
                statusLabel
            ]);
        });

        this.downloadCSV(headers, rows, 'pedidos');
    }

    exportQuotationsToCSV() {
        const quotations = this.getQuotations();

        if (quotations.length === 0) {
            this.showNotification('No hay cotizaciones para exportar', 'warning');
            return;
        }

        const headers = ['ID Cotización', 'Fecha', 'Productos', 'Total', 'Estado', 'Validez Hasta'];
        const rows = [];

        quotations.forEach(quotation => {
            const date = new Date(quotation.date).toLocaleDateString('es-AR');
            const validUntil = new Date(quotation.validUntil).toLocaleDateString('es-AR');
            const products = quotation.items?.map(item => `${item.name} (x${item.quantity})`).join('; ') || '';
            const isExpired = new Date(quotation.validUntil) < new Date();
            const displayStatus = isExpired ? 'Expirada' : quotation.status;

            rows.push([
                quotation.id,
                date,
                products,
                quotation.total || 0,
                displayStatus,
                validUntil
            ]);
        });

        this.downloadCSV(headers, rows, 'cotizaciones');
    }

    downloadCSV(headers, rows, filename) {
        try {
            let csvContent = headers.map(h => this.escapeCSV(h)).join(',') + '\n';

            rows.forEach(row => {
                csvContent += row.map(cell => this.escapeCSV(String(cell))).join(',') + '\n';
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            const timestamp = new Date().toISOString().split('T')[0];
            link.setAttribute('href', url);
            link.setAttribute('download', `${filename}_${timestamp}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showNotification(`Archivo ${filename}_${timestamp}.csv descargado correctamente`, 'success');
        } catch (error) {
            console.error('Error al descargar CSV:', error);
            this.showNotification('Error al descargar el archivo CSV', 'error');
        }
    }

    escapeCSV(value) {
        if (value === null || value === undefined) {
            return '';
        }

        const stringValue = String(value);

        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const iconMap = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        const icon = iconMap[type] || 'info-circle';
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        const timeout = setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);

        notification.addEventListener('click', () => {
            clearTimeout(timeout);
            notification.remove();
        });
    }
}

let adminDashboard;

document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});
