/**
 * ProgressManager - Gestión centralizada del guardado automático de progreso
 * Guarda el estado de formularios y procesos para permitir recuperación posterior
 */

class ProgressManager {
    constructor() {
        this.autoSaveInterval = 30000;
        this.maxProgressAge = 24 * 60 * 60 * 1000;
        this.activeAutoSaves = new Map();
        this.init();
    }

    init() {
        this.checkForRecoverableProgress();
        this.setupAutoSaveCleanup();
    }

    checkForRecoverableProgress() {
        const calculator = StorageManager.get('calculator_state');
        const quotation = StorageManager.get('quotation_draft');
        const order = StorageManager.get('order_draft');

        const hasRecoverableProgress = calculator || quotation || order;

        if (hasRecoverableProgress) {
            this.showRecoveryPrompt();
        }
    }

    showRecoveryPrompt() {
        const existingPrompt = document.getElementById('progressRecoveryPrompt');
        if (existingPrompt) {
            return;
        }

        const prompt = document.createElement('div');
        prompt.id = 'progressRecoveryPrompt';
        prompt.className = 'progress-recovery-prompt';
        prompt.innerHTML = `
            <div class="recovery-content">
                <div class="recovery-header">
                    <i class="fas fa-history"></i>
                    <h3>Recuperar progreso anterior</h3>
                </div>
                <p>Detectamos que tenías un formulario sin completar. ¿Deseas continuar donde lo dejaste?</p>
                <div class="recovery-actions">
                    <button class="btn-primary btn-recover" onclick="progressManager.recoverProgress()">
                        <i class="fas fa-redo"></i> Recuperar
                    </button>
                    <button class="btn-secondary btn-discard" onclick="progressManager.discardProgress()">
                        <i class="fas fa-trash"></i> Descartar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(prompt);

        setTimeout(() => {
            prompt.classList.add('show');
        }, 100);
    }

    recoverProgress() {
        const calculator = StorageManager.get('calculator_state');
        const quotation = StorageManager.get('quotation_draft');
        const order = StorageManager.get('order_draft');

        if (calculator) {
            const section = document.getElementById('calculadora');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                if (typeof window.calculatorUI !== 'undefined') {
                    window.calculatorUI.loadSavedState();
                }
            }
        } else if (quotation) {
            const section = document.getElementById('quotation-modal');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                if (typeof window.openQuotationModal === 'function') {
                    window.openQuotationModal(quotation);
                }
            }
        } else if (order) {
            const section = document.getElementById('order-form-modal');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                if (typeof window.openOrderForm === 'function') {
                    window.openOrderForm(order);
                }
            }
        }

        this.closeRecoveryPrompt();
        this.showSuccess('Progreso recuperado exitosamente');
    }

    discardProgress() {
        StorageManager.remove('calculator_state');
        StorageManager.remove('quotation_draft');
        StorageManager.remove('order_draft');
        this.closeRecoveryPrompt();
        this.showSuccess('Progreso descartado');
    }

    closeRecoveryPrompt() {
        const prompt = document.getElementById('progressRecoveryPrompt');
        if (prompt) {
            prompt.classList.remove('show');
            setTimeout(() => {
                prompt.remove();
            }, 300);
        }
    }

    startAutoSave(key, getStateFunction, interval = null) {
        const saveInterval = interval || this.autoSaveInterval;

        if (this.activeAutoSaves.has(key)) {
            clearInterval(this.activeAutoSaves.get(key));
        }

        const intervalId = setInterval(() => {
            try {
                const state = getStateFunction();
                if (state) {
                    StorageManager.set(key, {
                        data: state,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.error(`Error en auto-guardado de ${key}:`, error);
            }
        }, saveInterval);

        this.activeAutoSaves.set(key, intervalId);
    }

    stopAutoSave(key) {
        if (this.activeAutoSaves.has(key)) {
            clearInterval(this.activeAutoSaves.get(key));
            this.activeAutoSaves.delete(key);
        }
    }

    stopAllAutoSaves() {
        this.activeAutoSaves.forEach((intervalId) => {
            clearInterval(intervalId);
        });
        this.activeAutoSaves.clear();
    }

    saveFormProgress(formId, formData) {
        const key = `form_${formId}`;
        StorageManager.set(key, {
            data: formData,
            timestamp: new Date().toISOString(),
            formId: formId
        });
    }

    loadFormProgress(formId) {
        const key = `form_${formId}`;
        const saved = StorageManager.get(key);

        if (!saved) {
            return null;
        }

        const hoursSinceLastUse = (Date.now() - new Date(saved.timestamp).getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastUse > 24) {
            StorageManager.remove(key);
            return null;
        }

        return saved.data;
    }

    clearFormProgress(formId) {
        const key = `form_${formId}`;
        StorageManager.remove(key);
    }

    setupAutoSaveCleanup() {
        setInterval(() => {
            this.cleanupOldProgress();
        }, 60 * 60 * 1000);
    }

    cleanupOldProgress() {
        const keys = [
            'calculator_state',
            'quotation_draft',
            'order_draft'
        ];

        keys.forEach(key => {
            const saved = StorageManager.get(key);
            if (saved && saved.timestamp) {
                const age = Date.now() - new Date(saved.timestamp).getTime();
                if (age > this.maxProgressAge) {
                    StorageManager.remove(key);
                }
            }
        });

        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
            if (key.startsWith('ferreteria_form_')) {
                try {
                    const saved = JSON.parse(localStorage.getItem(key));
                    if (saved && saved.timestamp) {
                        const age = Date.now() - new Date(saved.timestamp).getTime();
                        if (age > this.maxProgressAge) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (e) {
                    console.error(`Error al limpiar ${key}:`, e);
                }
            }
        });
    }

    getProgressStats() {
        const calculator = StorageManager.get('calculator_state');
        const quotation = StorageManager.get('quotation_draft');
        const order = StorageManager.get('order_draft');

        return {
            hasCalculatorProgress: !!calculator,
            hasQuotationProgress: !!quotation,
            hasOrderProgress: !!order,
            calculatorAge: calculator ? this.getAgeInMinutes(calculator.timestamp) : null,
            quotationAge: quotation ? this.getAgeInMinutes(quotation.timestamp) : null,
            orderAge: order ? this.getAgeInMinutes(order.timestamp) : null
        };
    }

    getAgeInMinutes(timestamp) {
        const age = Date.now() - new Date(timestamp).getTime();
        return Math.floor(age / (1000 * 60));
    }

    showSuccess(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        }
    }

    showError(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        }
    }

    showInfo(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'info');
        }
    }
}

const progressManager = new ProgressManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressManager;
}

if (typeof window !== 'undefined') {
    window.ProgressManager = ProgressManager;
    window.progressManager = progressManager;
}
