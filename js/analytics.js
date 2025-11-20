/**
 * Módulo de Analytics y Tracking
 * Gestiona eventos personalizados para Google Analytics, GTM y Facebook Pixel
 */

class AnalyticsManager {
    constructor(config = {}) {
        this.config = config;
        this.isEnabled = config.enableEventTracking !== false;
        this.hasGA = typeof gtag !== 'undefined';
        this.hasFBQ = typeof fbq !== 'undefined';
        this.eventQueue = [];
        this.sessionStartTime = new Date();
        this.initializeSession();
    }

    /**
     * Inicializa la sesión de analytics
     */
    initializeSession() {
        if (!this.isEnabled) return;

        // Registrar página view
        this.trackPageView();

        // Registrar información de sesión
        this.trackSessionInfo();

        // Procesar eventos en cola
        this.processEventQueue();
    }

    /**
     * Registra una página view
     */
    trackPageView() {
        if (!this.isEnabled) return;

        const pageData = {
            page_title: document.title,
            page_path: window.location.pathname,
            page_location: window.location.href,
            referrer: document.referrer
        };

        this.trackEvent('page_view', pageData);
    }

    /**
     * Registra información de la sesión
     */
    trackSessionInfo() {
        if (!this.isEnabled) return;

        const sessionData = {
            session_start: this.sessionStartTime.toISOString(),
            user_agent: navigator.userAgent,
            language: navigator.language,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        if (this.hasGA) {
            gtag('set', sessionData);
        }
    }

    /**
     * Registra un evento personalizado
     * @param {string} eventName - Nombre del evento
     * @param {object} eventData - Datos del evento
     */
    trackEvent(eventName, eventData = {}) {
        if (!this.isEnabled) return;

        // Validar que el evento esté configurado
        if (this.config.events && !this.config.events[eventName]) {
            console.warn(`Evento no configurado: ${eventName}`);
        }

        const enrichedData = {
            ...eventData,
            timestamp: new Date().toISOString(),
            page_title: document.title,
            page_path: window.location.pathname
        };

        // Enviar a Google Analytics
        if (this.hasGA) {
            gtag('event', eventName, enrichedData);
        }

        // Enviar a Google Tag Manager
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: eventName,
                ...enrichedData
            });
        }

        // Log para debugging
        console.log(`[Analytics] Evento: ${eventName}`, enrichedData);
    }

    /**
     * Registra un evento de cotización creada
     * @param {object} quotationData - Datos de la cotización
     */
    trackQuotationCreated(quotationData = {}) {
        this.trackEvent('quotation_create', {
            quotation_id: quotationData.id || '',
            quotation_total: quotationData.total || 0,
            items_count: quotationData.items?.length || 0,
            has_installation: !!quotationData.installation,
            event_category: 'quotation',
            event_label: 'Cotización creada'
        });

        // Registrar goal en GA
        this.trackGoal('quotation_created', quotationData.total || 0);

        // Enviar a Facebook Pixel
        if (this.hasFBQ) {
            fbq('track', 'Lead', {
                content_name: 'Quotation Created',
                value: quotationData.total || 0,
                currency: 'ARS'
            });
        }
    }

    /**
     * Registra un evento de pedido creado
     * @param {object} orderData - Datos del pedido
     */
    trackOrderCreated(orderData = {}) {
        this.trackEvent('order_create', {
            order_id: orderData.id || '',
            order_total: orderData.total || 0,
            items_count: orderData.items?.length || 0,
            customer_name: orderData.customer?.name || 'Unknown',
            has_installation: !!orderData.installation,
            event_category: 'order',
            event_label: 'Pedido creado'
        });

        // Registrar goal en GA
        this.trackGoal('order_created', orderData.total || 0);

        // Enviar a Facebook Pixel
        if (this.hasFBQ) {
            fbq('track', 'Purchase', {
                content_name: 'Order Created',
                value: orderData.total || 0,
                currency: 'ARS',
                content_type: 'product'
            });
        }
    }

    /**
     * Registra un evento de descarga de PDF
     * @param {object} quotationData - Datos de la cotización
     */
    trackPDFDownload(quotationData = {}) {
        this.trackEvent('quotation_download_pdf', {
            quotation_id: quotationData.id || '',
            quotation_total: quotationData.total || 0,
            event_category: 'quotation',
            event_label: 'PDF descargado'
        });

        // Registrar goal
        this.trackGoal('pdf_downloaded', 1);

        // Enviar a Facebook Pixel
        if (this.hasFBQ) {
            fbq('track', 'ViewContent', {
                content_name: 'PDF Download',
                content_type: 'document'
            });
        }
    }

    /**
     * Registra un evento de envío por WhatsApp
     * @param {object} quotationData - Datos de la cotización
     */
    trackWhatsAppSend(quotationData = {}) {
        this.trackEvent('quotation_send_whatsapp', {
            quotation_id: quotationData.id || '',
            quotation_total: quotationData.total || 0,
            event_category: 'quotation',
            event_label: 'Enviado por WhatsApp'
        });

        // Registrar goal
        this.trackGoal('whatsapp_sent', 1);

        // Enviar a Facebook Pixel
        if (this.hasFBQ) {
            fbq('track', 'Contact', {
                content_name: 'WhatsApp Send'
            });
        }
    }

    /**
     * Registra un evento de producto agregado al carrito
     * @param {object} productData - Datos del producto
     */
    trackAddToCart(productData = {}) {
        this.trackEvent('catalog_add_to_cart', {
            product_id: productData.id || '',
            product_name: productData.name || '',
            product_category: productData.category || '',
            product_price: productData.price || 0,
            quantity: productData.quantity || 1,
            event_category: 'catalog',
            event_label: 'Producto agregado al carrito'
        });

        // Enviar a Facebook Pixel
        if (this.hasFBQ) {
            fbq('track', 'AddToCart', {
                content_name: productData.name || '',
                content_type: 'product',
                value: productData.price || 0,
                currency: 'ARS'
            });
        }
    }

    /**
     * Registra un evento de vista de producto
     * @param {object} productData - Datos del producto
     */
    trackViewProduct(productData = {}) {
        this.trackEvent('catalog_view_product', {
            product_id: productData.id || '',
            product_name: productData.name || '',
            product_category: productData.category || '',
            product_price: productData.price || 0,
            event_category: 'catalog',
            event_label: 'Producto visto'
        });

        // Enviar a Facebook Pixel
        if (this.hasFBQ) {
            fbq('track', 'ViewContent', {
                content_name: productData.name || '',
                content_type: 'product',
                value: productData.price || 0,
                currency: 'ARS'
            });
        }
    }

    /**
     * Registra un evento de cálculo en la calculadora
     * @param {object} calculationData - Datos del cálculo
     */
    trackCalculation(calculationData = {}) {
        this.trackEvent('calculator_calculate', {
            perimeter: calculationData.perimeter || 0,
            post_type: calculationData.postType || '',
            material_type: calculationData.materialType || '',
            total_posts: calculationData.totalPosts || 0,
            event_category: 'calculator',
            event_label: 'Cálculo realizado'
        });
    }

    /**
     * Registra un evento de comparación de productos
     * @param {array} selectedProducts - Productos seleccionados
     */
    trackComparison(selectedProducts = []) {
        this.trackEvent('comparator_select_products', {
            products_count: selectedProducts.length,
            products: selectedProducts.map(p => p.name || '').join(', '),
            event_category: 'comparator',
            event_label: 'Productos comparados'
        });
    }

    /**
     * Registra un evento de login en admin
     * @param {string} adminName - Nombre del administrador
     */
    trackAdminLogin(adminName = 'Unknown') {
        this.trackEvent('admin_login', {
            admin_name: adminName,
            event_category: 'admin',
            event_label: 'Login en panel admin'
        });
    }

    /**
     * Registra un evento de error
     * @param {string} errorMessage - Mensaje de error
     * @param {string} errorContext - Contexto del error
     */
    trackError(errorMessage = '', errorContext = '') {
        this.trackEvent('error_occurred', {
            error_message: errorMessage,
            error_context: errorContext,
            error_url: window.location.href,
            event_category: 'error',
            event_label: 'Error en la aplicación'
        });

        // Log en consola
        console.error(`[Analytics Error] ${errorContext}: ${errorMessage}`);
    }

    /**
     * Registra un goal en Google Analytics
     * @param {string} goalName - Nombre del goal
     * @param {number} value - Valor del goal
     */
    trackGoal(goalName = '', value = 0) {
        if (!this.hasGA) return;

        const goalConfig = this.config.goals?.[goalName];
        if (!goalConfig) {
            console.warn(`Goal no configurado: ${goalName}`);
            return;
        }

        gtag('event', 'goal_' + goalName, {
            value: value || goalConfig.value,
            goal_name: goalConfig.name,
            goal_description: goalConfig.description
        });

        console.log(`[Analytics] Goal registrado: ${goalName}`, { value });
    }

    /**
     * Registra tiempo de sesión
     */
    trackSessionDuration() {
        const duration = Math.round((new Date() - this.sessionStartTime) / 1000);
        
        this.trackEvent('session_duration', {
            duration_seconds: duration,
            duration_minutes: Math.round(duration / 60)
        });
    }

    /**
     * Registra un evento de formulario enviado
     * @param {string} formName - Nombre del formulario
     * @param {object} formData - Datos del formulario
     */
    trackFormSubmit(formName = '', formData = {}) {
        this.trackEvent('form_submit', {
            form_name: formName,
            form_fields: Object.keys(formData).length,
            event_category: 'form',
            event_label: `Formulario enviado: ${formName}`
        });

        // Enviar a Facebook Pixel
        if (this.hasFBQ) {
            fbq('track', 'Lead', {
                content_name: formName
            });
        }
    }

    /**
     * Agrega un evento a la cola para procesamiento posterior
     * @param {string} eventName - Nombre del evento
     * @param {object} eventData - Datos del evento
     */
    queueEvent(eventName = '', eventData = {}) {
        this.eventQueue.push({
            name: eventName,
            data: eventData,
            timestamp: new Date()
        });
    }

    /**
     * Procesa todos los eventos en la cola
     */
    processEventQueue() {
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            this.trackEvent(event.name, event.data);
        }
    }

    /**
     * Obtiene información de la sesión actual
     */
    getSessionInfo() {
        return {
            startTime: this.sessionStartTime,
            duration: Math.round((new Date() - this.sessionStartTime) / 1000),
            pageTitle: document.title,
            pageUrl: window.location.href,
            referrer: document.referrer
        };
    }

    /**
     * Reinicia la sesión
     */
    resetSession() {
        this.sessionStartTime = new Date();
        this.eventQueue = [];
        this.initializeSession();
    }
}

// Crear instancia global de analytics
let analyticsManager = null;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof CONFIG !== 'undefined' && CONFIG.analytics) {
            analyticsManager = new AnalyticsManager(CONFIG.analytics);
        }
    });
} else {
    if (typeof CONFIG !== 'undefined' && CONFIG.analytics) {
        analyticsManager = new AnalyticsManager(CONFIG.analytics);
    }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsManager;
}
