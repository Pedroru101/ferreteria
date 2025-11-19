/**
 * ProgressStepper - Componente de indicador de progreso
 * Muestra el flujo: Calculadora → Cotización → Pedido
 * Permite navegación entre pasos completados
 */

class ProgressStepper {
    constructor(options = {}) {
        this.options = {
            containerId: options.containerId || 'progressStepper',
            steps: options.steps || [
                { id: 'calculator', label: 'Calculadora', description: 'Calcula materiales', icon: 'calculator' },
                { id: 'quotation', label: 'Cotización', description: 'Genera presupuesto', icon: 'file-invoice' },
                { id: 'order', label: 'Pedido', description: 'Confirma orden', icon: 'shopping-cart' }
            ],
            currentStep: options.currentStep || 0,
            variant: options.variant || 'horizontal',
            compact: options.compact || false,
            showProgressBar: options.showProgressBar !== false,
            onStepClick: options.onStepClick || null,
            autoAdvance: options.autoAdvance !== false
        };

        this.currentStep = this.options.currentStep;
        this.completedSteps = new Set();
        this.container = null;
        this.init();
    }

    init() {
        this.container = document.getElementById(this.options.containerId);
        
        if (!this.container) {
            console.warn(`Contenedor ${this.options.containerId} no encontrado`);
            return;
        }

        this.loadState();
        this.render();
        this.attachEventListeners();
    }

    render() {
        if (!this.container) return;

        let html = '';

        if (this.options.showProgressBar) {
            const progressPercent = ((this.currentStep + 1) / this.options.steps.length) * 100;
            html += `
                <div class="progress-stepper-bar">
                    <div class="progress-stepper-bar-fill" style="width: ${progressPercent}%"></div>
                </div>
            `;
        }

        const stepperClass = [
            'progress-stepper',
            this.options.variant === 'vertical' ? 'vertical' : '',
            this.options.compact ? 'compact' : ''
        ].filter(c => c).join(' ');

        html += `<div class="${stepperClass}">`;
        html += '<div class="stepper-steps">';

        this.options.steps.forEach((step, index) => {
            const isCompleted = this.completedSteps.has(index);
            const isActive = index === this.currentStep;
            const isDisabled = index > this.currentStep && !isCompleted;

            const stepClass = [
                'stepper-step',
                isActive ? 'active' : '',
                isCompleted ? 'completed' : '',
                isDisabled ? 'disabled' : '',
                step.icon ? 'with-icon' : ''
            ].filter(c => c).join(' ');

            const stepContent = `
                <div class="step-circle" data-step="${index}" title="${step.label}">
                    ${step.icon ? `<i class="fas fa-${step.icon}"></i>` : index + 1}
                </div>
                <div class="step-label">${step.label}</div>
                ${step.description ? `<div class="step-description">${step.description}</div>` : ''}
            `;

            if (this.options.variant === 'vertical') {
                html += `
                    <div class="${stepClass}">
                        ${stepContent}
                    </div>
                `;
            } else {
                html += `
                    <div class="${stepClass}">
                        ${stepContent}
                    </div>
                `;
            }
        });

        html += '</div></div>';

        this.container.innerHTML = html;
    }

    attachEventListeners() {
        if (!this.container) return;

        const stepCircles = this.container.querySelectorAll('.step-circle');
        
        stepCircles.forEach(circle => {
            circle.addEventListener('click', (e) => {
                const stepIndex = parseInt(e.currentTarget.dataset.step);
                this.handleStepClick(stepIndex);
            });

            const stepElement = circle.closest('.stepper-step');
            if (!stepElement.classList.contains('disabled')) {
                circle.style.cursor = 'pointer';
            }
        });
    }

    handleStepClick(stepIndex) {
        const stepElement = this.container.querySelector(
            `.stepper-step:nth-child(${stepIndex + 1})`
        );

        if (stepElement && stepElement.classList.contains('disabled')) {
            this.showInfo('Completa los pasos anteriores primero');
            return;
        }

        if (this.options.onStepClick) {
            const canNavigate = this.options.onStepClick(stepIndex, this.options.steps[stepIndex]);
            if (canNavigate === false) {
                return;
            }
        }

        this.goToStep(stepIndex);
    }

    goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.options.steps.length) {
            console.warn(`Índice de paso inválido: ${stepIndex}`);
            return;
        }

        this.currentStep = stepIndex;
        this.saveState();
        this.render();
        this.attachEventListeners();
    }

    completeStep(stepIndex = this.currentStep) {
        if (stepIndex < 0 || stepIndex >= this.options.steps.length) {
            console.warn(`Índice de paso inválido: ${stepIndex}`);
            return;
        }

        this.completedSteps.add(stepIndex);
        this.saveState();
        this.render();
        this.attachEventListeners();

        if (this.options.autoAdvance && stepIndex < this.options.steps.length - 1) {
            setTimeout(() => {
                this.goToStep(stepIndex + 1);
            }, 600);
        }
    }

    nextStep() {
        if (this.currentStep < this.options.steps.length - 1) {
            this.completeStep(this.currentStep);
            return true;
        }
        return false;
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.goToStep(this.currentStep - 1);
            return true;
        }
        return false;
    }

    reset() {
        this.currentStep = 0;
        this.completedSteps.clear();
        this.saveState();
        this.render();
        this.attachEventListeners();
    }

    getCurrentStep() {
        return {
            index: this.currentStep,
            step: this.options.steps[this.currentStep],
            isCompleted: this.completedSteps.has(this.currentStep),
            isLast: this.currentStep === this.options.steps.length - 1
        };
    }

    getProgress() {
        return {
            current: this.currentStep + 1,
            total: this.options.steps.length,
            percentage: ((this.currentStep + 1) / this.options.steps.length) * 100,
            completed: this.completedSteps.size,
            completedSteps: Array.from(this.completedSteps)
        };
    }

    isStepCompleted(stepIndex) {
        return this.completedSteps.has(stepIndex);
    }

    isStepAccessible(stepIndex) {
        return stepIndex <= this.currentStep || this.completedSteps.has(stepIndex);
    }

    saveState() {
        try {
            const state = {
                currentStep: this.currentStep,
                completedSteps: Array.from(this.completedSteps),
                timestamp: new Date().toISOString()
            };
            StorageManager.set('stepper_state', state);
        } catch (error) {
            console.error('Error al guardar estado del stepper:', error);
        }
    }

    loadState() {
        try {
            const saved = StorageManager.get('stepper_state');
            
            if (saved) {
                this.currentStep = saved.currentStep || 0;
                this.completedSteps = new Set(saved.completedSteps || []);
            }
        } catch (error) {
            console.error('Error al cargar estado del stepper:', error);
        }
    }

    showInfo(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'info');
        }
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
            this.container = null;
        }
    }
}

/**
 * FlowStepper - Gestor del flujo completo calculadora → cotización → pedido
 */
class FlowStepper {
    constructor() {
        this.stepper = null;
        this.flowState = {
            calculator: { completed: false, data: null },
            quotation: { completed: false, data: null },
            order: { completed: false, data: null }
        };
        this.init();
    }

    init() {
        const stepperId = 'progressStepper';
        
        if (!document.getElementById(stepperId)) {
            const container = document.createElement('div');
            container.id = stepperId;
            
            const targetSection = document.querySelector('#calculadora');
            if (targetSection) {
                targetSection.insertAdjacentElement('afterbegin', container);
            } else {
                document.body.insertAdjacentElement('afterbegin', container);
            }
        }

        this.stepper = new ProgressStepper({
            containerId: stepperId,
            steps: [
                { 
                    id: 'calculator', 
                    label: 'Calculadora', 
                    description: 'Calcula materiales',
                    icon: 'calculator'
                },
                { 
                    id: 'quotation', 
                    label: 'Cotización', 
                    description: 'Genera presupuesto',
                    icon: 'file-invoice'
                },
                { 
                    id: 'order', 
                    label: 'Pedido', 
                    description: 'Confirma orden',
                    icon: 'shopping-cart'
                }
            ],
            currentStep: 0,
            variant: 'horizontal',
            compact: false,
            showProgressBar: true,
            onStepClick: (stepIndex, step) => this.handleStepNavigation(stepIndex, step),
            autoAdvance: false
        });

        this.loadFlowState();
    }

    handleStepNavigation(stepIndex, step) {
        const stepId = step.id;
        
        if (stepIndex > 0 && !this.flowState.calculator.completed) {
            this.showWarning('Completa la calculadora primero');
            return false;
        }

        if (stepIndex > 1 && !this.flowState.quotation.completed) {
            this.showWarning('Completa la cotización primero');
            return false;
        }

        this.navigateToStep(stepId);
        return true;
    }

    navigateToStep(stepId) {
        const scrollTargets = {
            'calculator': '#calculadora',
            'quotation': '#cotizacion-modal',
            'order': '#order-form-modal'
        };

        const target = scrollTargets[stepId];
        if (target) {
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    completeCalculator(calculatorData) {
        this.flowState.calculator.completed = true;
        this.flowState.calculator.data = calculatorData;
        this.stepper.completeStep(0);
        this.saveFlowState();
    }

    completeQuotation(quotationData) {
        this.flowState.quotation.completed = true;
        this.flowState.quotation.data = quotationData;
        this.stepper.completeStep(1);
        this.saveFlowState();
    }

    completeOrder(orderData) {
        this.flowState.order.completed = true;
        this.flowState.order.data = orderData;
        this.stepper.completeStep(2);
        this.saveFlowState();
    }

    getFlowState() {
        return {
            ...this.flowState,
            progress: this.stepper.getProgress()
        };
    }

    resetFlow() {
        this.flowState = {
            calculator: { completed: false, data: null },
            quotation: { completed: false, data: null },
            order: { completed: false, data: null }
        };
        this.stepper.reset();
        this.saveFlowState();
    }

    saveFlowState() {
        try {
            StorageManager.set('flow_state', this.flowState);
        } catch (error) {
            console.error('Error al guardar estado del flujo:', error);
        }
    }

    loadFlowState() {
        try {
            const saved = StorageManager.get('flow_state');
            
            if (saved) {
                this.flowState = saved;
                
                if (this.flowState.calculator.completed) {
                    this.stepper.completeStep(0);
                }
                if (this.flowState.quotation.completed) {
                    this.stepper.completeStep(1);
                }
                if (this.flowState.order.completed) {
                    this.stepper.completeStep(2);
                }
            }
        } catch (error) {
            console.error('Error al cargar estado del flujo:', error);
        }
    }

    showWarning(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'warning');
        }
    }
}

let flowStepper = null;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('calculadora')) {
        flowStepper = new FlowStepper();
        window.flowStepper = flowStepper;
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgressStepper, FlowStepper };
}

if (typeof window !== 'undefined') {
    window.ProgressStepper = ProgressStepper;
    window.FlowStepper = FlowStepper;
}
