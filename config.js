/**
 * Configuración centralizada del sitio
 * Este archivo contiene todas las variables de configuración que se pueden modificar
 * sin necesidad de editar el código principal
 */

const CONFIG = {
    // Información de contacto
    contact: {
        whatsapp: {
            number: '5491171416157', // Formato: código país + área + número (sin espacios ni guiones)
            displayNumber: '+54 9 11 7141-6157',
            defaultMessage: '¡Hola! Me interesa conocer más sobre sus productos.'
        },
        phone: {
            number: '(0223) 512-3456',
            href: 'tel:+542235123456'
        },
        email: 'materialesencontruccion@gmail.com',
        address: {
            street: 'Av. Luro 1234',
            city: 'Mar del Plata',
            province: 'Buenos Aires',
            country: 'Argentina',
            postalCode: '7600',
            full: 'Av. Luro 1234, Mar del Plata, Buenos Aires, Argentina'
        }
    },

    // Información de la empresa
    business: {
        name: 'Metales & Hierros Mar del Plata',
        shortName: 'Metales MDP',
        description: 'Distribuidora líder en materiales de construcción y herrería en Mar del Plata',
        founded: '2010',
        hours: {
            weekdays: 'Lunes a Viernes: 8:00 - 18:00',
            saturday: 'Sábados: 8:00 - 13:00',
            sunday: 'Domingos: Cerrado'
        }
    },

    // Redes sociales
    social: {
        facebook: 'https://www.facebook.com/profile.php?id=61584020816125',
        instagram: 'https://www.instagram.com/materialesencontruccion/'
    },

    // Configuración del sitio
    site: {
        url: 'https://www.metalesmdp.com.ar',
        title: 'Metales & Hierros Mar del Plata - Materiales de Construcción',
        description: 'Distribuidora líder en Mar del Plata. Hierros, chapas, caños, tubos y más. Asesoramiento técnico, corte a medida y entrega a domicilio.',
        keywords: 'metales, hierros, construcción, herrería, Mar del Plata, chapas, caños, tubos, ferretería',
        language: 'es',
        locale: 'es_AR'
    },

    // Configuración de análisis
    analytics: {
        googleAnalyticsId: '', // Agregar ID de Google Analytics: G-XXXXXXXXXX
        googleTagManagerId: '', // Agregar ID de GTM: GTM-XXXXXXX
        facebookPixelId: '', // Agregar ID de Facebook Pixel
        enableEventTracking: true,
        events: {
            // Eventos de calculadora
            calculator_open: 'Abrir calculadora',
            calculator_calculate: 'Realizar cálculo',
            calculator_export: 'Exportar cálculo',
            
            // Eventos de cotización
            quotation_create: 'Crear cotización',
            quotation_view: 'Ver cotización',
            quotation_download_pdf: 'Descargar PDF de cotización',
            quotation_send_whatsapp: 'Enviar cotización por WhatsApp',
            quotation_save: 'Guardar cotización',
            
            // Eventos de catálogo
            catalog_view_product: 'Ver detalle de producto',
            catalog_add_to_cart: 'Agregar producto a carrito',
            catalog_remove_from_cart: 'Remover producto de carrito',
            
            // Eventos de pedidos
            order_create: 'Crear pedido',
            order_confirm: 'Confirmar pedido',
            order_track: 'Consultar estado de pedido',
            order_update_status: 'Actualizar estado de pedido',
            
            // Eventos de comparador
            comparator_open: 'Abrir comparador',
            comparator_select_products: 'Seleccionar productos para comparar',
            comparator_use_solution: 'Usar solución del comparador',
            
            // Eventos de administración
            admin_login: 'Login en panel admin',
            admin_logout: 'Logout del panel admin',
            admin_update_price: 'Actualizar precio',
            admin_export_data: 'Exportar datos',
            
            // Eventos generales
            page_view: 'Ver página',
            form_submit: 'Enviar formulario',
            error_occurred: 'Error en la aplicación'
        },
        goals: {
            quotation_created: {
                name: 'Cotización Creada',
                description: 'Usuario creó una cotización',
                value: 1
            },
            order_created: {
                name: 'Pedido Creado',
                description: 'Usuario creó un pedido',
                value: 1
            },
            pdf_downloaded: {
                name: 'PDF Descargado',
                description: 'Usuario descargó un PDF de cotización',
                value: 1
            },
            whatsapp_sent: {
                name: 'Mensaje WhatsApp Enviado',
                description: 'Usuario envió cotización por WhatsApp',
                value: 1
            }
        }
    },

    // Configuración de animaciones
    animations: {
        aos: {
            duration: 800,
            offset: 100,
            easing: 'ease-in-out',
            once: false
        },
        preloaderDelay: 1000
    },

    // Configuración de la galería
    gallery: {
        itemsPerPage: 6,
        enableLightbox: true
    },

    // Configuración del formulario
    form: {
        enableEmailNotifications: false, // Cambiar a true cuando se configure el backend
        emailEndpoint: '/api/contact', // Endpoint del backend para enviar emails
        requiredFields: ['nombre', 'email', 'mensaje']
    },

    // Configuración de productos desde Google Sheets
    products: {
        // Habilitar carga desde Google Sheets
        enableGoogleSheets: false, // Cambiar a true para cargar productos desde Google Sheets

        // ID de la hoja de cálculo (obtenerlo de la URL de Google Sheets)
        spreadsheetId: '', // Ejemplo: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'

        // API Key de Google (obtenerla desde Google Cloud Console)
        apiKey: '', // Ejemplo: 'AIzaSyB...'

        // Nombre de las hojas
        sheets: {
            productos: 'Productos',
            servicios: 'Servicios',
            fabricacion: 'Fabricacion'
        },

        // Duración del cache en minutos
        cacheDuration: 60,

        // Estructura esperada de las columnas en Google Sheets
        // Para la hoja "Productos": Nombre | Descripción | Categoría | Precio | Stock | Imagen
        // Para la hoja "Servicios": Nombre | Descripción | Icono | Orden
        // Para la hoja "Fabricacion": Título | Descripción | Icono | Características
        columnMapping: {
            productos: ['nombre', 'descripcion', 'categoria', 'precio', 'stock', 'imagen'],
            servicios: ['nombre', 'descripcion', 'icono', 'orden'],
            fabricacion: ['titulo', 'descripcion', 'icono', 'caracteristicas']
        }
    },

    // Configuración de la calculadora de materiales
    calculator: {
        defaultPostSpacing: 2.5,
        cornerPosts: 4,
        meshRollLength: 10,
        wireTypes: {
            standard: { strands: 5, name: 'Alambre estándar (5 hilos)' },
            reinforced: { strands: 7, name: 'Alambre reforzado (7 hilos)' },
            olimpo: { strands: 3, name: 'Alambre de púa (3 hilos)', isPua: true }
        },
        meshHeights: [1.00, 1.20, 1.50, 1.80, 2.00]
    },

    // Configuración de precios y moneda
    pricing: {
        installationPricePerMeter: 500,
        marginPercentage: 20,
        currency: 'ARS',
        currencySymbol: '$',
        currencyFormat: {
            locale: 'es-AR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        },
        taxRate: 0
    },

    // Configuración de cotizaciones
    quotation: {
        validityDays: 30,
        pdfEnabled: true,
        whatsappEnabled: true,
        autoSave: true,
        prefix: 'COT',
        includeTermsAndConditions: true,
        termsText: 'Cotización válida por {days} días. Precios sujetos a cambios sin previo aviso. No incluye IVA.'
    },

    // Configuración de pedidos
    orders: {
        prefix: 'ORD',
        statusOptions: [
            { value: 'pending', label: 'Pendiente', color: '#f57c00', icon: 'clock' },
            { value: 'confirmed', label: 'Confirmado', color: '#4caf50', icon: 'check-circle' },
            { value: 'in_progress', label: 'En Proceso', color: '#0288d1', icon: 'cog' },
            { value: 'completed', label: 'Completado', color: '#2d7a3e', icon: 'check-double' },
            { value: 'cancelled', label: 'Cancelado', color: '#d32f2f', icon: 'times-circle' }
        ],
        requireCustomerData: ['name', 'phone'],
        optionalCustomerData: ['email', 'address', 'installationDate'],
        enableTracking: true,
        autoNotifyCustomer: true
    },

    // Configuración de administración
    admin: {
        defaultPassword: 'admin123',
        sessionTimeout: 3600000,
        enablePasswordChange: true,
        dashboardRefreshInterval: 300000,
        maxLoginAttempts: 5,
        lockoutDuration: 900000,
        features: {
            productManagement: true,
            priceManagement: true,
            orderManagement: true,
            quotationManagement: true,
            configManagement: true,
            exportData: true,
            statistics: true
        }
    },

    // Configuración de limpieza automática de datos
    dataCleanup: {
        enabled: true,
        checkInterval: 3600000,
        quotationExpiryDays: 30,
        errorLogRetentionDays: 7,
        maxStorageMB: 5,
        autoCleanupOnInit: true,
        cleanupTasks: {
            expiredQuotations: true,
            oldErrorLogs: true,
            storageQuotaCheck: true
        }
    }
};

// Exportar la configuración (compatible con módulos ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Hacer la configuración disponible globalmente
window.CONFIG = CONFIG;
