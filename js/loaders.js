/**
 * Sistema de Loaders y Spinners
 * Gestiona la visualización de indicadores de carga en diferentes contextos
 * Soporta: overlay loader, inline loader, button spinner, skeleton loader
 */

class LoaderManager {
    constructor() {
        this.overlayLoader = null;
        this.activeLoaders = new Map();
        this.init();
    }

    /**
     * Inicializa el sistema de loaders
     */
    init() {
        this.createOverlayLoader();
    }

    /**
     * Crea el overlay loader global
     */
    createOverlayLoader() {
        if (this.overlayLoader) return;

        const overlay = document.createElement('div');
        overlay.id = 'loaderOverlay';
        overlay.className = 'loader-overlay';
        overlay.innerHTML = `
            <div class="loader-overlay-content">
                <div class="loader-overlay-spinner"></div>
                <div class="loader-overlay-text" id="loaderText">Cargando...</div>
                <div class="loader-overlay-subtext" id="loaderSubtext"></div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlayLoader = overlay;
    }

    /**
     * Muestra el overlay loader
     * @param {string} text - Texto principal
     * @param {string} subtext - Texto secundario (opcional)
     */
    showOverlay(text = 'Cargando...', subtext = '') {
        if (!this.overlayLoader) {
            this.createOverlayLoader();
        }

        const textEl = this.overlayLoader.querySelector('#loaderText');
        const subtextEl = this.overlayLoader.querySelector('#loaderSubtext');

        if (textEl) textEl.textContent = text;
        if (subtextEl) {
            subtextEl.textContent = subtext;
            subtextEl.style.display = subtext ? 'block' : 'none';
        }

        this.overlayLoader.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Oculta el overlay loader
     */
    hideOverlay() {
        if (this.overlayLoader) {
            this.overlayLoader.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Muestra un loader inline en un elemento
     * @param {HTMLElement|string} container - Elemento o selector
     * @param {string} text - Texto del loader
     * @param {string} type - Tipo de loader: 'spinner', 'dots', 'wave'
     */
    showInline(container, text = 'Cargando...', type = 'spinner') {
        const el = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;

        if (!el) {
            console.warn('Contenedor no encontrado para inline loader');
            return;
        }

        const loaderId = `loader_${Date.now()}_${Math.random()}`;
        const loaderHTML = this.getLoaderHTML(type, text);

        const loaderDiv = document.createElement('div');
        loaderDiv.id = loaderId;
        loaderDiv.className = 'loader-inline';
        loaderDiv.innerHTML = loaderHTML;

        el.innerHTML = '';
        el.appendChild(loaderDiv);

        this.activeLoaders.set(loaderId, { container: el, type });

        return loaderId;
    }

    /**
     * Obtiene el HTML del loader según el tipo
     */
    getLoaderHTML(type, text) {
        const textHTML = `<div class="loader-inline-text">${text}</div>`;

        switch (type) {
            case 'dots':
                return `
                    <div class="dot-loader">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    ${textHTML}
                `;
            case 'wave':
                return `
                    <div class="wave-loader">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    ${textHTML}
                `;
            case 'progress':
                return `
                    <div class="progress-loader">
                        <div class="progress-loader-bar"></div>
                    </div>
                    ${textHTML}
                `;
            case 'spinner':
            default:
                return `
                    <div class="loader-inline-spinner"></div>
                    ${textHTML}
                `;
        }
    }

    /**
     * Oculta un loader inline
     * @param {string} loaderId - ID del loader
     */
    hideInline(loaderId) {
        const loader = this.activeLoaders.get(loaderId);
        if (loader) {
            const loaderEl = document.getElementById(loaderId);
            if (loaderEl) {
                loaderEl.remove();
            }
            this.activeLoaders.delete(loaderId);
        }
    }

    /**
     * Agrega spinner a un botón
     * @param {HTMLElement|string} button - Botón o selector
     * @param {string} text - Texto mientras carga (opcional)
     */
    addButtonSpinner(button, text = null) {
        const btn = typeof button === 'string' 
            ? document.querySelector(button) 
            : button;

        if (!btn) {
            console.warn('Botón no encontrado para spinner');
            return;
        }

        // Guardar estado original
        btn.dataset.originalText = btn.innerHTML;
        btn.dataset.originalDisabled = btn.disabled;

        // Agregar spinner
        btn.disabled = true;
        btn.classList.add('btn-loading');

        const spinnerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        const newText = text || btn.textContent;

        btn.innerHTML = `${spinnerHTML} ${newText}`;
    }

    /**
     * Remueve spinner de un botón
     * @param {HTMLElement|string} button - Botón o selector
     */
    removeButtonSpinner(button) {
        const btn = typeof button === 'string' 
            ? document.querySelector(button) 
            : button;

        if (!btn) {
            console.warn('Botón no encontrado para remover spinner');
            return;
        }

        // Restaurar estado original
        btn.disabled = btn.dataset.originalDisabled === 'true';
        btn.classList.remove('btn-loading');
        btn.innerHTML = btn.dataset.originalText || btn.textContent;

        // Limpiar atributos
        delete btn.dataset.originalText;
        delete btn.dataset.originalDisabled;
    }

    /**
     * Crea un skeleton loader para un elemento
     * @param {HTMLElement|string} container - Contenedor
     * @param {object} options - Opciones de configuración
     */
    createSkeleton(container, options = {}) {
        const el = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;

        if (!el) {
            console.warn('Contenedor no encontrado para skeleton');
            return;
        }

        const {
            lines = 3,
            avatarSize = 48,
            showAvatar = false,
            showCard = false
        } = options;

        let skeletonHTML = '';

        if (showAvatar) {
            skeletonHTML += `<div class="skeleton avatar" style="width: ${avatarSize}px; height: ${avatarSize}px;"></div>`;
        }

        if (showCard) {
            skeletonHTML += '<div class="skeleton card"></div>';
        }

        for (let i = 0; i < lines; i++) {
            const isLarge = i === 0;
            skeletonHTML += `<div class="skeleton text ${isLarge ? 'large' : ''}"></div>`;
        }

        el.innerHTML = skeletonHTML;
    }

    /**
     * Muestra un loader con progreso
     * @param {HTMLElement|string} container - Contenedor
     * @param {string} text - Texto del loader
     */
    showProgress(container, text = 'Procesando...') {
        return this.showInline(container, text, 'progress');
    }

    /**
     * Muestra un loader de puntos
     * @param {HTMLElement|string} container - Contenedor
     * @param {string} text - Texto del loader
     */
    showDots(container, text = 'Cargando...') {
        return this.showInline(container, text, 'dots');
    }

    /**
     * Muestra un loader de onda
     * @param {HTMLElement|string} container - Contenedor
     * @param {string} text - Texto del loader
     */
    showWave(container, text = 'Cargando...') {
        return this.showInline(container, text, 'wave');
    }

    /**
     * Ejecuta una función con loader overlay
     * @param {Function} fn - Función a ejecutar
     * @param {string} text - Texto del loader
     * @param {string} subtext - Subtexto del loader
     */
    async withOverlay(fn, text = 'Cargando...', subtext = '') {
        try {
            this.showOverlay(text, subtext);
            const result = await fn();
            this.hideOverlay();
            return result;
        } catch (error) {
            this.hideOverlay();
            throw error;
        }
    }

    /**
     * Ejecuta una función con loader inline
     * @param {HTMLElement|string} container - Contenedor
     * @param {Function} fn - Función a ejecutar
     * @param {string} text - Texto del loader
     * @param {string} type - Tipo de loader
     */
    async withInline(container, fn, text = 'Cargando...', type = 'spinner') {
        try {
            const loaderId = this.showInline(container, text, type);
            const result = await fn();
            this.hideInline(loaderId);
            return result;
        } catch (error) {
            const loaderEl = document.querySelector(`#${loaderId}`);
            if (loaderEl) loaderEl.remove();
            throw error;
        }
    }

    /**
     * Ejecuta una función con spinner en botón
     * @param {HTMLElement|string} button - Botón
     * @param {Function} fn - Función a ejecutar
     * @param {string} text - Texto mientras carga
     */
    async withButtonSpinner(button, fn, text = null) {
        try {
            this.addButtonSpinner(button, text);
            const result = await fn();
            this.removeButtonSpinner(button);
            return result;
        } catch (error) {
            this.removeButtonSpinner(button);
            throw error;
        }
    }
}

// Crear instancia global
const loaderManager = new LoaderManager();

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoaderManager;
}

// Hacer disponible globalmente
window.LoaderManager = LoaderManager;
window.loaderManager = loaderManager;
