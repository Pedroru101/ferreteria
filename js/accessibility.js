/**
 * Accessibility Module - Mejoras de accesibilidad WCAG 2.1 AA
 * Implementa navegación por teclado, ARIA labels, focus management y focus traps
 */

class AccessibilityManager {
    constructor() {
        this.focusTrapStack = [];
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupFocusManagement();
        this.setupFocusTraps();
        this.setupSkipLinks();
        this.setupLiveRegions();
        console.log('AccessibilityManager inicializado');
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
            
            if (e.key === 'Tab') {
                this.handleTabKey(e);
            }
        });
    }

    handleEscapeKey() {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            const closeBtn = activeModal.querySelector('[aria-label="Cerrar"]');
            if (closeBtn) {
                closeBtn.click();
            }
        }
    }

    handleTabKey(e) {
        const focusTrap = this.focusTrapStack[this.focusTrapStack.length - 1];
        if (focusTrap) {
            this.manageFocusTrap(focusTrap, e);
        }
    }

    setupAriaLabels() {
        const elementsNeedingLabels = [
            { selector: '.modal-close', label: 'Cerrar' },
            { selector: '.cart-toggle', label: 'Abrir carrito de cotización' },
            { selector: '.add-to-quote', label: 'Agregar a cotización' },
            { selector: '.remove-from-cart', label: 'Eliminar del carrito' },
            { selector: '.generate-quote', label: 'Generar cotización' },
            { selector: '.download-pdf', label: 'Descargar cotización en PDF' },
            { selector: '.send-whatsapp', label: 'Enviar cotización por WhatsApp' },
            { selector: '.confirm-order', label: 'Confirmar pedido' },
            { selector: '.track-order', label: 'Consultar estado del pedido' },
            { selector: '.compare-products', label: 'Comparar productos' },
            { selector: '.use-solution', label: 'Usar esta solución' },
            { selector: '.admin-login', label: 'Iniciar sesión en administración' },
            { selector: '.update-status', label: 'Actualizar estado del pedido' },
            { selector: '.export-data', label: 'Exportar datos a CSV' }
        ];

        elementsNeedingLabels.forEach(({ selector, label }) => {
            document.querySelectorAll(selector).forEach(element => {
                if (!element.getAttribute('aria-label')) {
                    element.setAttribute('aria-label', label);
                }
            });
        });
    }

    setupFocusManagement() {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, [href], input, select, textarea, [tabindex]');
            if (target) {
                target.focus();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const target = document.activeElement;
                if (target && target.tagName === 'BUTTON') {
                    target.click();
                }
            }
        });
    }

    setupFocusTraps() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('modal') && node.classList.contains('active')) {
                            this.createFocusTrap(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    createFocusTrap(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const trapData = {
            element: element,
            firstElement: firstElement,
            lastElement: lastElement,
            focusableElements: focusableElements
        };

        this.focusTrapStack.push(trapData);

        firstElement.focus();

        const keydownHandler = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        element.addEventListener('keydown', keydownHandler);

        const closeObserver = new MutationObserver(() => {
            if (!element.classList.contains('active')) {
                this.focusTrapStack = this.focusTrapStack.filter(t => t.element !== element);
                element.removeEventListener('keydown', keydownHandler);
                closeObserver.disconnect();
            }
        });

        closeObserver.observe(element, { attributes: true, attributeFilter: ['class'] });
    }

    manageFocusTrap(trapData, e) {
        if (e.key !== 'Tab') return;

        const { firstElement, lastElement } = trapData;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    setupSkipLinks() {
        const skipLinksHTML = `
            <div class="skip-links">
                <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
                <a href="#calculadora" class="skip-link">Ir a calculadora</a>
                <a href="#comparador" class="skip-link">Ir a comparador</a>
                <a href="#consulta-pedido" class="skip-link">Consultar pedido</a>
            </div>
        `;

        if (!document.querySelector('.skip-links')) {
            document.body.insertAdjacentHTML('afterbegin', skipLinksHTML);
        }
    }

    setupLiveRegions() {
        const liveRegionHTML = `
            <div id="a11y-live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
            <div id="a11y-alert-region" class="sr-only" aria-live="assertive" aria-atomic="true"></div>
        `;

        if (!document.getElementById('a11y-live-region')) {
            document.body.insertAdjacentHTML('afterbegin', liveRegionHTML);
        }
    }

    announceToScreenReader(message, isAlert = false) {
        const region = isAlert 
            ? document.getElementById('a11y-alert-region')
            : document.getElementById('a11y-live-region');

        if (region) {
            region.textContent = message;
        }
    }

    enhanceFormAccessibility() {
        document.querySelectorAll('input, select, textarea').forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            
            if (!input.getAttribute('aria-label') && !label) {
                const placeholder = input.getAttribute('placeholder');
                if (placeholder) {
                    input.setAttribute('aria-label', placeholder);
                }
            }

            if (input.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
            }

            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                const errorMsg = input.validationMessage || 'Campo inválido';
                input.setAttribute('aria-invalid', 'true');
                this.announceToScreenReader(errorMsg, true);
            });

            input.addEventListener('change', () => {
                if (input.validity.valid) {
                    input.setAttribute('aria-invalid', 'false');
                }
            });
        });
    }

    enhanceModalAccessibility(modal) {
        if (!modal) return;

        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');

        const title = modal.querySelector('.modal-title');
        if (title && !title.id) {
            title.id = `modal-title-${Date.now()}`;
            modal.setAttribute('aria-labelledby', title.id);
        }

        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn && !closeBtn.getAttribute('aria-label')) {
            closeBtn.setAttribute('aria-label', 'Cerrar');
        }

        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.setAttribute('aria-hidden', 'true');
        }
    }

    enhanceTableAccessibility(table) {
        if (!table) return;

        table.setAttribute('role', 'table');

        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            header.setAttribute('scope', 'col');
        });

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.setAttribute('role', 'row');
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, cellIndex) => {
                if (cellIndex === 0) {
                    cell.setAttribute('scope', 'row');
                }
            });
        });
    }

    enhanceButtonAccessibility(button) {
        if (!button) return;

        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            const icon = button.querySelector('i');
            if (icon) {
                const iconClass = icon.className;
                const label = this.getIconLabel(iconClass);
                if (label) {
                    button.setAttribute('aria-label', label);
                }
            }
        }

        if (button.hasAttribute('disabled')) {
            button.setAttribute('aria-disabled', 'true');
        }
    }

    getIconLabel(iconClass) {
        const iconLabels = {
            'fa-times': 'Cerrar',
            'fa-close': 'Cerrar',
            'fa-trash': 'Eliminar',
            'fa-edit': 'Editar',
            'fa-download': 'Descargar',
            'fa-print': 'Imprimir',
            'fa-search': 'Buscar',
            'fa-plus': 'Agregar',
            'fa-minus': 'Quitar',
            'fa-check': 'Confirmar',
            'fa-times-circle': 'Cancelar',
            'fa-arrow-left': 'Atrás',
            'fa-arrow-right': 'Adelante',
            'fa-menu': 'Menú',
            'fa-bars': 'Menú',
            'fa-shopping-cart': 'Carrito',
            'fa-file-pdf': 'PDF',
            'fa-whatsapp': 'WhatsApp'
        };

        for (const [key, label] of Object.entries(iconLabels)) {
            if (iconClass.includes(key)) {
                return label;
            }
        }

        return null;
    }

    setupTabOrder() {
        const mainNav = document.querySelector('nav');
        const mainContent = document.getElementById('main-content') || document.querySelector('main');
        const footer = document.querySelector('footer');

        if (mainNav) mainNav.setAttribute('tabindex', '-1');
        if (mainContent) mainContent.setAttribute('tabindex', '-1');
        if (footer) footer.setAttribute('tabindex', '-1');

        const focusableElements = document.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach((element, index) => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
        });
    }

    setupFocusVisibility() {
        const focusVisibilityCSS = `
            :focus-visible {
                outline: 3px solid var(--primary, #2d7a3e);
                outline-offset: 2px;
                border-radius: 2px;
            }

            button:focus-visible,
            a:focus-visible,
            input:focus-visible,
            select:focus-visible,
            textarea:focus-visible {
                outline: 3px solid var(--primary, #2d7a3e);
                outline-offset: 2px;
            }

            .modal:focus-visible {
                outline: none;
            }
        `;

        const style = document.createElement('style');
        style.textContent = focusVisibilityCSS;
        document.head.appendChild(style);
    }

    setupColorContrastEnforcement() {
        const contrastCSS = `
            :root {
                --text-primary: #1a1a1a;
                --text-secondary: #4a5f4a;
                --bg-primary: #f8faf9;
                --bg-secondary: #e8f5e9;
                --primary: #2d7a3e;
            }

            [data-theme="dark"] {
                --text-primary: #e8f5e9;
                --text-secondary: #a5d6a7;
                --bg-primary: #0d1f0d;
                --bg-secondary: #1a2e1a;
                --primary: #4caf50;
            }

            body {
                color: var(--text-primary);
                background-color: var(--bg-primary);
            }

            a {
                color: var(--primary);
            }

            button, input, select, textarea {
                color: var(--text-primary);
                background-color: var(--bg-secondary);
                border-color: var(--primary);
            }
        `;

        const style = document.createElement('style');
        style.textContent = contrastCSS;
        document.head.appendChild(style);
    }

    setupResponsiveTextScaling() {
        const textScalingCSS = `
            html {
                font-size: 16px;
            }

            @media (max-width: 768px) {
                html {
                    font-size: 14px;
                }
            }

            @media (min-width: 1200px) {
                html {
                    font-size: 18px;
                }
            }

            h1 {
                font-size: 2.5rem;
                line-height: 1.2;
            }

            h2 {
                font-size: 2rem;
                line-height: 1.3;
            }

            h3 {
                font-size: 1.5rem;
                line-height: 1.4;
            }

            p, li, label {
                font-size: 1rem;
                line-height: 1.6;
            }

            button, input, select, textarea {
                font-size: 1rem;
                padding: 0.75rem;
                min-height: 44px;
                min-width: 44px;
            }
        `;

        const style = document.createElement('style');
        style.textContent = textScalingCSS;
        document.head.appendChild(style);
    }

    setupScreenReaderOnlyContent() {
        const srOnlyCSS = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }

            .skip-links {
                position: absolute;
                top: -40px;
                left: 0;
                background: var(--primary, #2d7a3e);
                color: white;
                padding: 8px;
                text-decoration: none;
                z-index: 100;
            }

            .skip-link {
                display: block;
                color: white;
                text-decoration: none;
                padding: 8px;
            }

            .skip-link:focus {
                top: 0;
                position: relative;
            }
        `;

        const style = document.createElement('style');
        style.textContent = srOnlyCSS;
        document.head.appendChild(style);
    }

    validateAccessibility() {
        const issues = [];

        document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('alt')) {
                issues.push(`Imagen sin atributo alt: ${img.src}`);
            }
        });

        document.querySelectorAll('button').forEach(btn => {
            if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
                issues.push(`Botón sin aria-label ni texto: ${btn.className}`);
            }
        });

        document.querySelectorAll('input').forEach(input => {
            if (!input.getAttribute('aria-label') && !document.querySelector(`label[for="${input.id}"]`)) {
                issues.push(`Input sin aria-label ni label: ${input.id || input.name}`);
            }
        });

        if (issues.length > 0) {
            console.warn('Problemas de accesibilidad encontrados:', issues);
        }

        return issues;
    }
}

const accessibilityManager = new AccessibilityManager();

document.addEventListener('DOMContentLoaded', () => {
    accessibilityManager.setupFocusVisibility();
    accessibilityManager.setupColorContrastEnforcement();
    accessibilityManager.setupResponsiveTextScaling();
    accessibilityManager.setupScreenReaderOnlyContent();
    accessibilityManager.enhanceFormAccessibility();
    accessibilityManager.setupTabOrder();
    accessibilityManager.validateAccessibility();
});
