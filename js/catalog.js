/**
 * Gestor del catálogo de productos
 * Maneja la carga de productos desde Google Sheets o datos hardcodeados
 * Gestiona el carrito de cotización
 */

class CatalogManager {
    constructor() {
        this.products = [];
        this.selectedProducts = this.loadCartFromStorage();
        this.isLoading = false;
        this.loadError = null;
    }

    /**
     * Carga productos con fallback automático
     * Intenta cargar desde Google Sheets primero, si falla usa datos hardcodeados
     */
    async loadProducts() {
        if (this.products.length > 0) {
            return this.products;
        }

        this.isLoading = true;
        this.loadError = null;

        try {
            if (CONFIG.products.enableGoogleSheets && typeof productsLoader !== 'undefined') {
                if (typeof loaderManager !== 'undefined') {
                    loaderManager.showOverlay('Cargando catálogo...', 'Conectando con Google Sheets');
                }

                const sheetsData = await productsLoader.loadProductos();
                
                if (sheetsData && sheetsData.length > 0) {
                    this.products = this.normalizeGoogleSheetsData(sheetsData);
                    
                    if (typeof loaderManager !== 'undefined') {
                        loaderManager.hideOverlay();
                    }
                    
                    this.isLoading = false;
                    return this.products;
                }
            }
        } catch (error) {
            console.warn('Error al cargar desde Google Sheets, usando datos hardcodeados:', error);
            this.loadError = error;
            
            if (typeof loaderManager !== 'undefined') {
                loaderManager.hideOverlay();
            }
        }

        this.products = this.loadHardcodedProducts();
        this.isLoading = false;
        return this.products;
    }

    /**
     * Normaliza datos de Google Sheets al formato esperado
     */
    normalizeGoogleSheetsData(sheetsData) {
        return sheetsData.map(item => ({
            id: item.id || this.generateProductId(item.nombre || item.name),
            name: item.nombre || item.name || '',
            category: item.categoria || item.category || 'general',
            subcategory: item.subcategoria || item.subcategory || '',
            description: item.descripcion || item.description || '',
            price: parseFloat(item.precio || item.price || 0),
            stock: parseInt(item.stock || 0),
            image: item.imagen || item.image || '',
            featured: item.destacado === 'true' || item.featured === 'true' || false,
            specs: this.parseSpecs(item.especificaciones || item.specs || ''),
            applications: this.parseArray(item.aplicaciones || item.applications || ''),
            priceUnit: item.unidad_precio || item.price_unit || 'unidad'
        }));
    }

    /**
     * Carga productos hardcodeados
     */
    loadHardcodedProducts() {
        if (typeof PRODUCTS_DATA === 'undefined') {
            console.error('PRODUCTS_DATA no está definido');
            return [];
        }

        if (typeof getAllProducts === 'function') {
            return getAllProducts();
        }

        return [
            ...PRODUCTS_DATA.postes,
            ...PRODUCTS_DATA.tejidos,
            ...PRODUCTS_DATA.alambres,
            ...PRODUCTS_DATA.accesorios
        ];
    }

    /**
     * Genera un ID único para un producto
     */
    generateProductId(name) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
    }

    /**
     * Parsea especificaciones desde string
     */
    parseSpecs(specsString) {
        if (typeof specsString === 'object') {
            return specsString;
        }

        try {
            return JSON.parse(specsString);
        } catch {
            return {};
        }
    }

    /**
     * Parsea array desde string separado por comas
     */
    parseArray(arrayString) {
        if (Array.isArray(arrayString)) {
            return arrayString;
        }

        if (typeof arrayString === 'string') {
            return arrayString.split(',').map(item => item.trim()).filter(item => item);
        }

        return [];
    }

    /**
     * Obtiene un producto por ID
     */
    getProductById(productId) {
        return this.products.find(p => p.id === productId);
    }

    /**
     * Obtiene productos por categoría
     */
    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category);
    }

    /**
     * Obtiene productos destacados
     */
    getFeaturedProducts() {
        return this.products.filter(p => p.featured);
    }

    /**
     * Busca productos por texto
     */
    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            (p.subcategory && p.subcategory.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Agrega un producto al carrito de cotización
     */
    addToCart(productId, quantity = 1) {
        const product = this.getProductById(productId);
        if (!product) {
            console.error(`Producto no encontrado: ${productId}`);
            return false;
        }

        const existingIndex = this.selectedProducts.findIndex(p => p.id === productId);
        
        if (existingIndex !== -1) {
            this.selectedProducts[existingIndex].quantity += quantity;
        } else {
            this.selectedProducts.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                priceUnit: product.priceUnit || 'unidad',
                quantity: quantity,
                image: product.image
            });
        }

        this.saveCartToStorage();
        this.updateCartUI();
        
        if (typeof showNotification === 'function') {
            showNotification(`${product.name} agregado al carrito`, 'success');
        }

        return true;
    }

    /**
     * Actualiza la cantidad de un producto en el carrito
     */
    updateCartQuantity(productId, quantity) {
        const index = this.selectedProducts.findIndex(p => p.id === productId);
        
        if (index === -1) {
            return false;
        }

        if (quantity <= 0) {
            return this.removeFromCart(productId);
        }

        this.selectedProducts[index].quantity = quantity;
        this.saveCartToStorage();
        this.updateCartUI();
        return true;
    }

    /**
     * Elimina un producto del carrito
     */
    removeFromCart(productId) {
        const index = this.selectedProducts.findIndex(p => p.id === productId);
        
        if (index === -1) {
            return false;
        }

        this.selectedProducts.splice(index, 1);
        this.saveCartToStorage();
        this.updateCartUI();
        
        if (typeof showNotification === 'function') {
            showNotification('Producto eliminado del carrito', 'info');
        }

        return true;
    }

    /**
     * Limpia el carrito
     */
    clearCart() {
        this.selectedProducts = [];
        this.saveCartToStorage();
        this.updateCartUI();
    }

    /**
     * Obtiene el total de productos en el carrito
     */
    getCartCount() {
        return this.selectedProducts.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Obtiene el total del carrito
     */
    getCartTotal() {
        return this.selectedProducts.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Obtiene los productos del carrito
     */
    getCartItems() {
        return [...this.selectedProducts];
    }

    /**
     * Guarda el carrito en localStorage
     */
    saveCartToStorage() {
        try {
            const cartData = {
                items: this.selectedProducts,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('ferreteria_cart', JSON.stringify(cartData));
        } catch (error) {
            console.error('Error al guardar carrito:', error);
        }
    }

    /**
     * Carga el carrito desde localStorage
     */
    loadCartFromStorage() {
        try {
            const data = localStorage.getItem('ferreteria_cart');
            if (!data) {
                return [];
            }

            const cartData = JSON.parse(data);
            return cartData.items || [];
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            return [];
        }
    }

    /**
     * Actualiza la UI del carrito
     */
    updateCartUI() {
        const count = this.getCartCount();
        
        const cartCountElements = document.querySelectorAll('.cart-count, #cartCount');
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'none';
        });

        const cartBadges = document.querySelectorAll('.cart-badge');
        cartBadges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        });

        this.updateCartDropdown();
    }

    /**
     * Actualiza el dropdown del carrito
     */
    updateCartDropdown() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) {
            return;
        }

        if (this.selectedProducts.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>No hay productos en el carrito</p>
                    <small>Agrega productos desde el catálogo</small>
                </div>
            `;
            return;
        }

        const itemsHTML = this.selectedProducts.map(item => {
            const subtotal = item.price * item.quantity;
            return `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-details">
                            <span class="cart-item-unit-price">${this.formatPrice(item.price)} / ${item.priceUnit || 'unidad'}</span>
                            <span class="cart-item-separator">×</span>
                            <span class="cart-item-qty">${item.quantity}</span>
                        </div>
                        <div class="cart-item-subtotal">
                            <strong>${this.formatPrice(subtotal)}</strong>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="btn-icon btn-decrease" onclick="catalogManager.updateCartQuantity('${item.id}', ${item.quantity - 1})" title="Disminuir cantidad" aria-label="Disminuir cantidad">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="btn-icon btn-remove" onclick="catalogManager.removeFromCart('${item.id}')" title="Eliminar producto" aria-label="Eliminar producto">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-icon btn-increase" onclick="catalogManager.updateCartQuantity('${item.id}', ${item.quantity + 1})" title="Aumentar cantidad" aria-label="Aumentar cantidad">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        const total = this.getCartTotal();
        const itemCount = this.getCartCount();
        const summaryHTML = `
            <div class="cart-summary">
                <div class="cart-summary-row">
                    <span class="cart-summary-label">Productos (${itemCount})</span>
                    <span class="cart-summary-value">${this.formatPrice(total)}</span>
                </div>
                <div class="cart-summary-row cart-summary-total">
                    <strong>Total</strong>
                    <strong class="cart-total-amount">${this.formatPrice(total)}</strong>
                </div>
            </div>
        `;

        cartItemsContainer.innerHTML = itemsHTML + summaryHTML;
    }

    /**
     * Formatea precio según configuración
     */
    formatPrice(price) {
        const symbol = CONFIG.pricing?.currencySymbol || '$';
        const locale = CONFIG.pricing?.currencyFormat?.locale || 'es-AR';
        const options = {
            minimumFractionDigits: CONFIG.pricing?.currencyFormat?.minimumFractionDigits || 0,
            maximumFractionDigits: CONFIG.pricing?.currencyFormat?.maximumFractionDigits || 2
        };

        const formatted = new Intl.NumberFormat(locale, options).format(price);
        return `${symbol}${formatted}`;
    }

    /**
     * Recarga productos forzadamente
     */
    async reloadProducts() {
        this.products = [];
        
        if (CONFIG.products.enableGoogleSheets && typeof productsLoader !== 'undefined') {
            productsLoader.clearCache();
        }

        return await this.loadProducts();
    }

    /**
     * Exporta el carrito para cotización
     */
    exportCartForQuotation() {
        return {
            items: this.selectedProducts.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.price,
                priceUnit: item.priceUnit,
                subtotal: item.price * item.quantity
            })),
            subtotal: this.getCartTotal(),
            itemCount: this.getCartCount()
        };
    }
}

const catalogManager = new CatalogManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CatalogManager;
}

if (typeof window !== 'undefined') {
    window.CatalogManager = CatalogManager;
    window.catalogManager = catalogManager;
}


/**
 * Abre el modal de producto detallado
 */
function openProductModal(productId) {
    const product = catalogManager.getProductById(productId);
    
    if (!product) {
        console.error(`Producto no encontrado: ${productId}`);
        if (typeof showNotification === 'function') {
            showNotification('Producto no encontrado', 'error');
        }
        return;
    }

    const modal = document.getElementById('productModal');
    if (!modal) {
        console.error('Modal de producto no encontrado en el DOM');
        return;
    }

    populateProductModal(product);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', handleModalBackdropClick);
}

/**
 * Cierra el modal de producto
 */
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    modal.removeEventListener('click', handleModalBackdropClick);
}

/**
 * Maneja el click en el backdrop del modal
 */
function handleModalBackdropClick(event) {
    if (event.target.id === 'productModal') {
        closeProductModal();
    }
}

/**
 * Puebla el modal con los datos del producto
 */
function populateProductModal(product) {
    document.getElementById('modalProductCategory').textContent = 
        formatCategory(product.category, product.subcategory);
    
    document.getElementById('modalProductName').textContent = product.name;
    
    const priceFormatted = catalogManager.formatPrice(product.price);
    document.getElementById('modalProductPrice').textContent = priceFormatted;
    
    const priceUnit = product.priceUnit || 'unidad';
    document.getElementById('modalProductPriceUnit').textContent = `Precio por ${priceUnit}`;
    
    document.getElementById('modalProductDescription').textContent = 
        product.description || 'Sin descripción disponible';
    
    populateProductImage(product);
    populateProductAvailability(product);
    populateProductSpecs(product);
    populateProductResistance(product);
    populateProductApplications(product);
    populateProductBadge(product);
    
    const modal = document.getElementById('productModal');
    modal.dataset.productId = product.id;
}

/**
 * Puebla la imagen del producto
 */
function populateProductImage(product) {
    const img = document.getElementById('modalProductImage');
    const placeholder = document.getElementById('modalProductImagePlaceholder');
    
    if (product.image && product.image !== '') {
        img.src = product.image;
        img.alt = product.name;
        img.style.display = 'block';
        placeholder.style.display = 'none';
        
        img.onerror = function() {
            img.style.display = 'none';
            placeholder.style.display = 'flex';
        };
    } else {
        img.style.display = 'none';
        placeholder.style.display = 'flex';
    }
}

/**
 * Puebla la disponibilidad del producto
 */
function populateProductAvailability(product) {
    const availabilityEl = document.getElementById('modalProductAvailability');
    const stock = product.stock || 0;
    
    availabilityEl.className = 'product-availability';
    
    if (stock > 20) {
        availabilityEl.classList.add('in-stock');
        availabilityEl.querySelector('span').textContent = 'En Stock';
    } else if (stock > 0) {
        availabilityEl.classList.add('low-stock');
        availabilityEl.querySelector('span').textContent = `Stock Limitado (${stock} unidades)`;
    } else {
        availabilityEl.classList.add('out-of-stock');
        availabilityEl.querySelector('span').textContent = 'Sin Stock';
    }
}

/**
 * Puebla las especificaciones técnicas
 */
function populateProductSpecs(product) {
    const specsGrid = document.getElementById('modalSpecsGrid');
    const specsSection = document.getElementById('modalProductSpecs');
    
    if (!product.specs || Object.keys(product.specs).length === 0) {
        specsSection.style.display = 'none';
        return;
    }
    
    specsSection.style.display = 'block';
    specsGrid.innerHTML = '';
    
    const specs = product.specs;
    const specsToShow = {};
    
    for (const [key, value] of Object.entries(specs)) {
        if (key !== 'resistance' && typeof value !== 'object') {
            specsToShow[key] = value;
        }
    }
    
    for (const [key, value] of Object.entries(specsToShow)) {
        const specItem = document.createElement('div');
        specItem.className = 'spec-item';
        
        const label = document.createElement('div');
        label.className = 'spec-label';
        label.textContent = formatSpecLabel(key);
        
        const valueEl = document.createElement('div');
        valueEl.className = 'spec-value';
        valueEl.textContent = value;
        
        specItem.appendChild(label);
        specItem.appendChild(valueEl);
        specsGrid.appendChild(specItem);
    }
}

/**
 * Puebla las barras de resistencia
 */
function populateProductResistance(product) {
    const resistanceSection = document.getElementById('modalProductResistance');
    const resistanceBars = document.getElementById('modalResistanceBars');
    
    if (!product.specs || !product.specs.resistance) {
        resistanceSection.style.display = 'none';
        return;
    }
    
    resistanceSection.style.display = 'block';
    resistanceBars.innerHTML = '';
    
    const resistance = product.specs.resistance;
    const resistanceLabels = {
        humidity: 'Humedad',
        pests: 'Plagas',
        fire: 'Fuego'
    };
    
    for (const [key, value] of Object.entries(resistance)) {
        const item = document.createElement('div');
        item.className = 'resistance-item';
        
        const label = document.createElement('div');
        label.className = 'resistance-label';
        label.innerHTML = `
            <span>${resistanceLabels[key] || key}</span>
            <span class="resistance-value">${value}/10</span>
        `;
        
        const bar = document.createElement('div');
        bar.className = 'resistance-bar';
        
        const fill = document.createElement('div');
        fill.className = 'resistance-fill';
        fill.style.width = '0%';
        
        bar.appendChild(fill);
        item.appendChild(label);
        item.appendChild(bar);
        resistanceBars.appendChild(item);
        
        setTimeout(() => {
            fill.style.width = `${(value / 10) * 100}%`;
        }, 100);
    }
}

/**
 * Puebla las aplicaciones recomendadas
 */
function populateProductApplications(product) {
    const applicationsSection = document.getElementById('modalProductApplications');
    const applicationsList = document.getElementById('modalApplicationsList');
    
    if (!product.applications || product.applications.length === 0) {
        applicationsSection.style.display = 'none';
        return;
    }
    
    applicationsSection.style.display = 'block';
    applicationsList.innerHTML = '';
    
    product.applications.forEach(app => {
        const tag = document.createElement('span');
        tag.className = 'application-tag';
        tag.textContent = app;
        applicationsList.appendChild(tag);
    });
}

/**
 * Puebla el badge del producto
 */
function populateProductBadge(product) {
    const badge = document.getElementById('modalProductBadge');
    
    if (product.featured) {
        badge.textContent = 'Destacado';
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

/**
 * Formatea la categoría para mostrar
 */
function formatCategory(category, subcategory) {
    const categories = {
        postes: 'Postes',
        tejidos: 'Tejidos',
        alambres: 'Alambres',
        accesorios: 'Accesorios'
    };
    
    let formatted = categories[category] || category;
    
    if (subcategory) {
        formatted += ` - ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`;
    }
    
    return formatted;
}

/**
 * Formatea las etiquetas de especificaciones
 */
function formatSpecLabel(key) {
    const labels = {
        material: 'Material',
        height: 'Altura',
        diameter: 'Diámetro',
        weight: 'Peso',
        durability: 'Durabilidad',
        caliber: 'Calibre',
        mesh_size: 'Tamaño de Malla',
        roll_length: 'Largo del Rollo',
        wire_type: 'Tipo de Alambre',
        presentation: 'Presentación'
    };
    
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
}

/**
 * Agrega el producto actual del modal al carrito
 */
function addProductToQuoteFromModal() {
    const modal = document.getElementById('productModal');
    const productId = modal.dataset.productId;
    
    if (!productId) {
        console.error('No hay producto seleccionado');
        return;
    }
    
    const quantityInput = document.getElementById('modalProductQuantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    
    if (quantity < 1) {
        if (typeof showNotification === 'function') {
            showNotification('La cantidad debe ser mayor a 0', 'warning');
        }
        return;
    }
    
    const success = catalogManager.addToCart(productId, quantity);
    
    if (success) {
        if (quantityInput) {
            quantityInput.value = 1;
        }
        closeProductModal();
    }
}

/**
 * Aumenta la cantidad en el modal de producto
 */
function increaseModalQuantity() {
    const input = document.getElementById('modalProductQuantity');
    if (!input) return;
    
    const currentValue = parseInt(input.value) || 1;
    const maxValue = parseInt(input.max) || 9999;
    
    if (currentValue < maxValue) {
        input.value = currentValue + 1;
    }
}

/**
 * Disminuye la cantidad en el modal de producto
 */
function decreaseModalQuantity() {
    const input = document.getElementById('modalProductQuantity');
    if (!input) return;
    
    const currentValue = parseInt(input.value) || 1;
    const minValue = parseInt(input.min) || 1;
    
    if (currentValue > minValue) {
        input.value = currentValue - 1;
    }
}

/**
 * Maneja el evento de tecla ESC para cerrar el modal
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('productModal');
        if (modal && modal.classList.contains('active')) {
            closeProductModal();
        }
    }
});

if (typeof window !== 'undefined') {
    window.openProductModal = openProductModal;
    window.closeProductModal = closeProductModal;
    window.addProductToQuoteFromModal = addProductToQuoteFromModal;
    window.increaseModalQuantity = increaseModalQuantity;
    window.decreaseModalQuantity = decreaseModalQuantity;
}


/**
 * Inicialización del carrito flotante
 */
function initializeFloatingCart() {
    const cartToggle = document.getElementById('cartToggle');
    const cartDropdown = document.getElementById('cartDropdown');
    const cartClose = document.getElementById('cartClose');
    const generateQuoteBtn = document.getElementById('generateQuoteBtn');

    if (!cartToggle || !cartDropdown) {
        console.warn('Elementos del carrito flotante no encontrados');
        return;
    }

    cartToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCartDropdown();
    });

    if (cartClose) {
        cartClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeCartDropdown();
        });
    }

    document.addEventListener('click', function(event) {
        const quoteCart = document.getElementById('quoteCart');
        if (quoteCart && !quoteCart.contains(event.target)) {
            closeCartDropdown();
        }
    });

    if (generateQuoteBtn) {
        const count = catalogManager.getCartCount();
        generateQuoteBtn.disabled = count === 0;
    }

    catalogManager.updateCartUI();
}

/**
 * Abre el dropdown del carrito
 */
function openCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) {
        cartDropdown.classList.add('active');
        catalogManager.updateCartDropdown();
    }
}

/**
 * Cierra el dropdown del carrito
 */
function closeCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) {
        cartDropdown.classList.remove('active');
    }
}

/**
 * Alterna la visibilidad del dropdown del carrito
 */
function toggleCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) {
        if (cartDropdown.classList.contains('active')) {
            closeCartDropdown();
        } else {
            openCartDropdown();
        }
    }
}

/**
 * Abre el modal de cotización con los productos del carrito
 */
function openQuotationFromCart() {
    const cartData = catalogManager.exportCartForQuotation();
    
    if (cartData.itemCount === 0) {
        if (typeof showNotification === 'function') {
            showNotification('El carrito está vacío', 'warning');
        }
        return;
    }

    closeCartDropdown();

    if (typeof openQuotationModal === 'function') {
        openQuotationModal(cartData);
    } else {
        console.error('Función openQuotationModal no está disponible');
        if (typeof showNotification === 'function') {
            showNotification('Error al abrir cotización. Módulo no cargado.', 'error');
        }
    }
}

/**
 * Actualiza el estado del botón de generar cotización
 */
function updateGenerateQuoteButton() {
    const generateQuoteBtn = document.getElementById('generateQuoteBtn');
    if (generateQuoteBtn) {
        const count = catalogManager.getCartCount();
        generateQuoteBtn.disabled = count === 0;
    }
}

/**
 * Override del método updateCartUI para incluir el botón
 */
const originalUpdateCartUI = CatalogManager.prototype.updateCartUI;
CatalogManager.prototype.updateCartUI = function() {
    originalUpdateCartUI.call(this);
    updateGenerateQuoteButton();
};

if (typeof window !== 'undefined') {
    window.initializeFloatingCart = initializeFloatingCart;
    window.openCartDropdown = openCartDropdown;
    window.closeCartDropdown = closeCartDropdown;
    window.toggleCartDropdown = toggleCartDropdown;
    window.openQuotationFromCart = openQuotationFromCart;
    window.updateGenerateQuoteButton = updateGenerateQuoteButton;
}

document.addEventListener('DOMContentLoaded', function() {
    initializeFloatingCart();
});
