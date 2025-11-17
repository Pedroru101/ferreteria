/**
 * Cargador de productos desde Google Sheets
 * Este módulo maneja la carga de datos desde Google Sheets API
 */

class ProductsLoader {
    constructor(config) {
        this.config = config;
        this.cache = {
            productos: null,
            servicios: null,
            fabricacion: null
        };
        this.cacheTimestamp = {
            productos: null,
            servicios: null,
            fabricacion: null
        };
    }

    /**
     * Verifica si el cache es válido
     */
    isCacheValid(sheetType) {
        if (!this.cache[sheetType] || !this.cacheTimestamp[sheetType]) {
            return false;
        }

        const now = new Date().getTime();
        const cacheAge = (now - this.cacheTimestamp[sheetType]) / 1000 / 60; // en minutos
        return cacheAge < this.config.products.cacheDuration;
    }

    /**
     * Carga datos desde Google Sheets
     */
    async loadFromGoogleSheets(sheetType) {
        // Verificar si el cache es válido
        if (this.isCacheValid(sheetType)) {
            console.log(`Usando datos en cache para ${sheetType}`);
            return this.cache[sheetType];
        }

        // Verificar configuración
        if (!this.config.products.enableGoogleSheets) {
            console.warn('Google Sheets está deshabilitado en la configuración');
            return null;
        }

        if (!this.config.products.spreadsheetId || !this.config.products.apiKey) {
            console.error('Falta spreadsheetId o apiKey en la configuración');
            return null;
        }

        const sheetName = this.config.products.sheets[sheetType];
        if (!sheetName) {
            console.error(`Tipo de hoja no válido: ${sheetType}`);
            return null;
        }

        try {
            // Construir URL de la API de Google Sheets
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.products.spreadsheetId}/values/${sheetName}?key=${this.config.products.apiKey}`;

            console.log(`Cargando datos de ${sheetType} desde Google Sheets...`);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error al cargar datos: ${response.statusText}`);
            }

            const data = await response.json();
            const rows = data.values;

            if (!rows || rows.length === 0) {
                console.warn(`No hay datos en la hoja ${sheetName}`);
                return [];
            }

            // La primera fila contiene los encabezados, las siguientes son los datos
            const headers = rows[0];
            const dataRows = rows.slice(1);

            // Convertir las filas en objetos
            const items = dataRows.map(row => {
                const item = {};
                headers.forEach((header, index) => {
                    item[header.toLowerCase().replace(/\s+/g, '_')] = row[index] || '';
                });
                return item;
            });

            // Actualizar cache
            this.cache[sheetType] = items;
            this.cacheTimestamp[sheetType] = new Date().getTime();

            console.log(`✓ Cargados ${items.length} elementos de ${sheetType}`);
            return items;

        } catch (error) {
            console.error(`Error al cargar datos de ${sheetType}:`, error);
            return null;
        }
    }

    /**
     * Carga todos los productos
     */
    async loadProductos() {
        return await this.loadFromGoogleSheets('productos');
    }

    /**
     * Carga todos los servicios
     */
    async loadServicios() {
        return await this.loadFromGoogleSheets('servicios');
    }

    /**
     * Carga datos de fabricación
     */
    async loadFabricacion() {
        return await this.loadFromGoogleSheets('fabricacion');
    }

    /**
     * Limpia el cache
     */
    clearCache() {
        this.cache = {
            productos: null,
            servicios: null,
            fabricacion: null
        };
        this.cacheTimestamp = {
            productos: null,
            servicios: null,
            fabricacion: null
        };
        console.log('Cache limpiado');
    }

    /**
     * Recarga todos los datos forzadamente
     */
    async reloadAll() {
        this.clearCache();
        const [productos, servicios, fabricacion] = await Promise.all([
            this.loadProductos(),
            this.loadServicios(),
            this.loadFabricacion()
        ]);
        return { productos, servicios, fabricacion };
    }
}

// Crear instancia global del cargador
const productsLoader = new ProductsLoader(CONFIG);

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsLoader;
}

// Hacer disponible globalmente
window.ProductsLoader = ProductsLoader;
window.productsLoader = productsLoader;

/**
 * Ejemplo de uso:
 *
 * // Cargar productos
 * const productos = await productsLoader.loadProductos();
 * console.log(productos);
 *
 * // Cargar servicios
 * const servicios = await productsLoader.loadServicios();
 * console.log(servicios);
 *
 * // Cargar datos de fabricación
 * const fabricacion = await productsLoader.loadFabricacion();
 * console.log(fabricacion);
 *
 * // Recargar todo
 * const allData = await productsLoader.reloadAll();
 * console.log(allData);
 *
 * // Limpiar cache
 * productsLoader.clearCache();
 */
