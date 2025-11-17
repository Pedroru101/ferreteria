/**
 * Configuración centralizada del sitio
 * Este archivo contiene todas las variables de configuración que se pueden modificar
 * sin necesidad de editar el código principal
 */

const CONFIG = {
    // Información de contacto
    contact: {
        whatsapp: {
            number: '5492235123456', // Formato: código país + área + número (sin espacios ni guiones)
            displayNumber: '+54 223 512-3456',
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
        facebookPixelId: '' // Agregar ID de Facebook Pixel
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
    }
};

// Exportar la configuración (compatible con módulos ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Hacer la configuración disponible globalmente
window.CONFIG = CONFIG;
