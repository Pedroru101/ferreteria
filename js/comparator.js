const COMPARISON_DATA = {
    hormigon: {
        name: 'Postes de Hormigón',
        price: 3500,
        durability: 50,
        maintenance: 'Muy bajo',
        resistance: {
            humidity: 10,
            pests: 10,
            fire: 10
        },
        aesthetics: 6,
        applications: ['Rural', 'Industrial', 'Residencial'],
        pros: [
            'Máxima durabilidad',
            'Resistente a humedad y plagas',
            'Sin mantenimiento',
            'Resistente al fuego'
        ],
        cons: [
            'Mayor peso',
            'Instalación más compleja',
            'Estética industrial'
        ]
    },
    quebracho: {
        name: 'Postes de Quebracho',
        price: 4200,
        durability: 40,
        maintenance: 'Bajo',
        resistance: {
            humidity: 9,
            pests: 9,
            fire: 5
        },
        aesthetics: 9,
        applications: ['Rural alta exigencia', 'Estancias'],
        pros: [
            'Extrema dureza natural',
            'Resistencia a putrefacción',
            'Estética natural premium',
            'Larga vida útil'
        ],
        cons: [
            'Precio más alto',
            'Disponibilidad limitada',
            'Peso considerable'
        ]
    },
    eucalipto: {
        name: 'Postes de Eucalipto',
        price: 2100,
        durability: 20,
        maintenance: 'Medio',
        resistance: {
            humidity: 6,
            pests: 6,
            fire: 5
        },
        aesthetics: 8,
        applications: ['Residencial', 'Temporal'],
        pros: [
            'Precio económico',
            'Estética natural',
            'Fácil instalación',
            'Renovable'
        ],
        cons: [
            'Requiere tratamiento',
            'Menor durabilidad',
            'Mantenimiento periódico'
        ]
    },
    olimpo: {
        name: 'Postes Olimpo (Hormigón + Púas)',
        price: 4000,
        durability: 50,
        maintenance: 'Muy bajo',
        resistance: {
            humidity: 10,
            pests: 10,
            fire: 10
        },
        aesthetics: 7,
        applications: ['Seguridad', 'Industrial', 'Perímetros'],
        pros: [
            'Máxima seguridad',
            'Incluye 3 hilos de púas',
            'Durabilidad del hormigón',
            'Listo para instalar'
        ],
        cons: [
            'Precio premium',
            'Estética de seguridad',
            'Mayor peso'
        ]
    }
};

const CONTEXT_RECOMMENDATIONS = {
    'high-demand': {
        title: 'Recomendación para Alta Exigencia',
        description: 'Para uso intensivo y condiciones exigentes, recomendamos materiales de máxima durabilidad y resistencia.',
        recommended: ['quebracho', 'hormigon'],
        reasons: {
            quebracho: [
                'Extrema dureza natural ideal para uso intensivo',
                'Resistencia superior a putrefacción y plagas',
                'Vida útil de 40+ años sin mantenimiento significativo',
                'Perfecto para estancias y campos con alta exigencia'
            ],
            hormigon: [
                'Máxima durabilidad (50+ años)',
                'Resistencia total a humedad, plagas y fuego',
                'Sin necesidad de mantenimiento',
                'Ideal para instalaciones permanentes de alto tráfico'
            ]
        },
        notRecommended: ['eucalipto'],
        prioritySuggestion: { price: 3, durability: 10, aesthetics: 5 }
    },
    'budget': {
        title: 'Recomendación para Presupuesto Económico',
        description: 'Para proyectos con presupuesto ajustado, recomendamos opciones económicas con buena relación precio-calidad.',
        recommended: ['eucalipto'],
        reasons: {
            eucalipto: [
                'Precio más accesible del mercado',
                'Buena durabilidad con tratamiento adecuado (20 años)',
                'Estética natural atractiva',
                'Fácil instalación reduce costos de mano de obra',
                'Ideal para cercados residenciales y temporales'
            ]
        },
        notRecommended: ['quebracho', 'olimpo'],
        prioritySuggestion: { price: 10, durability: 4, aesthetics: 6 }
    },
    'balanced': {
        title: 'Recomendación Equilibrada',
        description: 'Para un balance óptimo entre inversión inicial y durabilidad a largo plazo.',
        recommended: ['hormigon', 'eucalipto'],
        reasons: {
            hormigon: [
                'Excelente relación costo-beneficio a largo plazo',
                'Sin costos de mantenimiento',
                'Durabilidad de 50 años amortiza la inversión',
                'Versatilidad para múltiples aplicaciones'
            ],
            eucalipto: [
                'Inversión inicial baja',
                'Buena durabilidad con mantenimiento básico',
                'Estética natural',
                'Renovable y sustentable'
            ]
        },
        notRecommended: [],
        prioritySuggestion: { price: 6, durability: 7, aesthetics: 6 }
    },
    'security': {
        title: 'Recomendación para Seguridad',
        description: 'Para máxima protección perimetral y disuasión de intrusos.',
        recommended: ['olimpo', 'hormigon'],
        reasons: {
            olimpo: [
                'Sistema completo con 3 hilos de alambre de púa integrados',
                'Máxima disuasión visual',
                'Durabilidad del hormigón (50+ años)',
                'Listo para instalar, sin necesidad de agregar púas',
                'Ideal para perímetros industriales y de seguridad'
            ],
            hormigon: [
                'Base sólida para sistemas de seguridad',
                'Resistencia a intentos de daño',
                'Compatible con alambres de púa y concertinas',
                'Durabilidad garantizada'
            ]
        },
        notRecommended: ['eucalipto'],
        prioritySuggestion: { price: 4, durability: 9, aesthetics: 5 }
    }
};

class ComparatorManager {
    constructor() {
        this.selectedProducts = new Set();
        this.maxSelection = 3;
        this.priorities = {
            price: 5,
            durability: 5,
            aesthetics: 5
        };
        this.selectedContext = null;
        this.init();
    }

    init() {
        try {
            this.setupEventListeners();
            this.updateComparison();
        } catch (error) {
            console.error('Error inicializando ComparatorManager:', error);
            this.showError('Error al inicializar el comparador');
        }
    }

    setupEventListeners() {
        try {
            const contextButtons = document.querySelectorAll('.context-btn');
            contextButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleContextSelection(e));
            });

            const checkboxes = document.querySelectorAll('.product-checkbox input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => this.handleProductSelection(e));
            });

            const sliders = document.querySelectorAll('.slider-input');
            sliders.forEach(slider => {
                slider.addEventListener('input', (e) => this.handlePriorityChange(e));
            });
        } catch (error) {
            console.error('Error configurando event listeners:', error);
        }
    }

    handleContextSelection(event) {
        try {
            const button = event.currentTarget;
            const context = button.dataset.context;
            
            document.querySelectorAll('.context-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            this.selectedContext = context;
            this.applyContextRecommendation(context);
        } catch (error) {
            console.error('Error seleccionando contexto:', error);
            this.showError('Error al seleccionar contexto');
        }
    }

    applyContextRecommendation(context) {
        const recommendation = CONTEXT_RECOMMENDATIONS[context];
        if (!recommendation) return;

        const recommendationContainer = document.querySelector('.context-recommendation');
        recommendationContainer.innerHTML = `
            <div class="recommendation-card">
                <div class="recommendation-header">
                    <i class="fas fa-lightbulb"></i>
                    <h4>${recommendation.title}</h4>
                </div>
                <p class="recommendation-description">${recommendation.description}</p>
                
                <div class="recommended-products">
                    <h5><i class="fas fa-star"></i> Productos Recomendados:</h5>
                    ${recommendation.recommended.map(productId => {
                        const product = COMPARISON_DATA[productId];
                        const reasons = recommendation.reasons[productId] || [];
                        return `
                            <div class="recommended-product">
                                <div class="product-header">
                                    <strong>${product.name}</strong>
                                    <span class="product-price">${product.price.toLocaleString('es-AR')}</span>
                                </div>
                                <ul class="product-reasons">
                                    ${reasons.map(reason => `
                                        <li><i class="fas fa-check"></i> ${reason}</li>
                                    `).join('')}
                                </ul>
                                <button class="quick-select-btn" data-product="${productId}">
                                    <i class="fas fa-plus-circle"></i> Seleccionar para comparar
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${recommendation.notRecommended.length > 0 ? `
                    <div class="not-recommended-note">
                        <i class="fas fa-info-circle"></i>
                        <span>No recomendado para este contexto: ${recommendation.notRecommended.map(id => COMPARISON_DATA[id].name).join(', ')}</span>
                    </div>
                ` : ''}
            </div>
        `;

        const quickSelectButtons = recommendationContainer.querySelectorAll('.quick-select-btn');
        quickSelectButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.product;
                this.quickSelectProduct(productId);
            });
        });

        this.applySuggestedPriorities(recommendation.prioritySuggestion);
    }

    quickSelectProduct(productId) {
        const checkbox = document.querySelector(`input[value="${productId}"]`);
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
        }
    }

    applySuggestedPriorities(priorities) {
        Object.keys(priorities).forEach(key => {
            const slider = document.querySelector(`.slider-input[data-priority="${key}"]`);
            if (slider) {
                slider.value = priorities[key];
                this.priorities[key] = priorities[key];
                const valueDisplay = slider.parentElement.querySelector('.slider-value');
                if (valueDisplay) {
                    valueDisplay.textContent = priorities[key];
                }
            }
        });
        
        this.updateComparison();
    }

    handleProductSelection(event) {
        try {
            const checkbox = event.target;
            const productId = checkbox.value;
            const errorElement = document.querySelector('.selection-error');

            if (checkbox.checked) {
                if (this.selectedProducts.size >= this.maxSelection) {
                    checkbox.checked = false;
                    if (errorElement) {
                        errorElement.textContent = `Solo puedes seleccionar hasta ${this.maxSelection} productos para comparar`;
                        errorElement.classList.add('show');
                        setTimeout(() => errorElement.classList.remove('show'), 3000);
                    }
                    return;
                }
                this.selectedProducts.add(productId);
                const productCheckbox = checkbox.closest('.product-checkbox');
                if (productCheckbox) {
                    productCheckbox.classList.add('selected');
                }
            } else {
                this.selectedProducts.delete(productId);
                const productCheckbox = checkbox.closest('.product-checkbox');
                if (productCheckbox) {
                    productCheckbox.classList.remove('selected');
                }
            }

            if (errorElement) {
                errorElement.classList.remove('show');
            }
            this.updateComparison();
        } catch (error) {
            console.error('Error seleccionando producto:', error);
            this.showError('Error al seleccionar producto');
        }
    }

    handlePriorityChange(event) {
        try {
            const slider = event.target;
            const priority = slider.dataset.priority;
            const value = parseInt(slider.value);
            
            this.priorities[priority] = value;
            
            const valueDisplay = slider.parentElement.querySelector('.slider-value');
            if (valueDisplay) {
                valueDisplay.textContent = value;
            }

            this.updateComparison();
        } catch (error) {
            console.error('Error cambiando prioridad:', error);
            this.showError('Error al cambiar prioridades');
        }
    }

    calculateScore(productId) {
        const product = COMPARISON_DATA[productId];
        if (!product) return 0;

        const priceScore = (1 - (product.price / 5000)) * 10;
        const durabilityScore = (product.durability / 50) * 10;
        const aestheticsScore = product.aesthetics;

        const weightedScore = 
            (priceScore * this.priorities.price) +
            (durabilityScore * this.priorities.durability) +
            (aestheticsScore * this.priorities.aesthetics);

        const totalWeight = this.priorities.price + this.priorities.durability + this.priorities.aesthetics;
        
        return weightedScore / totalWeight;
    }

    updateComparison() {
        try {
            const container = document.querySelector('.comparison-table-container');
            if (!container) return;
            
            if (this.selectedProducts.size === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>Selecciona productos para comparar</h3>
                        <p>Elige hasta ${this.maxSelection} productos para ver una comparación detallada</p>
                    </div>
                `;
                return;
            }

            const productsArray = Array.from(this.selectedProducts);
            const scores = productsArray.map(id => ({
                id,
                score: this.calculateScore(id)
            }));
            scores.sort((a, b) => b.score - a.score);
            const recommendedId = scores[0].id;

            container.innerHTML = this.generateComparisonTable(productsArray, recommendedId);
            this.attachTableEventListeners();
        } catch (error) {
            console.error('Error actualizando comparación:', error);
            this.showError('Error al actualizar comparación');
        }
    }

    generateComparisonTable(productIds, recommendedId) {
        const products = productIds.map(id => ({ id, ...COMPARISON_DATA[id] }));
        const contextRecommendation = this.selectedContext ? CONTEXT_RECOMMENDATIONS[this.selectedContext] : null;

        return `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Característica</th>
                        ${products.map(p => {
                            const isContextRecommended = contextRecommendation && contextRecommendation.recommended.includes(p.id);
                            const isNotRecommended = contextRecommendation && contextRecommendation.notRecommended.includes(p.id);
                            
                            return `
                            <th>
                                ${p.id === recommendedId ? '<div><span class="recommended-badge"><i class="fas fa-star"></i> Mejor Score</span></div>' : ''}
                                ${isContextRecommended ? '<div><span class="context-recommended-badge"><i class="fas fa-thumbs-up"></i> Recomendado para tu contexto</span></div>' : ''}
                                ${isNotRecommended ? '<div><span class="not-recommended-badge"><i class="fas fa-exclamation-triangle"></i> No ideal para tu contexto</span></div>' : ''}
                                <div>${p.name}</div>
                            </th>
                        `}).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Precio</th>
                        ${products.map(p => `
                            <td class="price-cell">$${p.price.toLocaleString('es-AR')}</td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>Durabilidad (años)</th>
                        ${products.map(p => `
                            <td>
                                <strong>${p.durability}</strong> años
                                <div class="rating-stars">
                                    ${this.generateStars(p.durability / 10)}
                                </div>
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>Mantenimiento</th>
                        ${products.map(p => `<td>${p.maintenance}</td>`).join('')}
                    </tr>
                    <tr>
                        <th>Resistencia a Humedad</th>
                        ${products.map(p => `
                            <td>
                                <i class="fas fa-circle feature-icon ${this.getResistanceClass(p.resistance.humidity)}"></i>
                                ${p.resistance.humidity}/10
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>Resistencia a Plagas</th>
                        ${products.map(p => `
                            <td>
                                <i class="fas fa-circle feature-icon ${this.getResistanceClass(p.resistance.pests)}"></i>
                                ${p.resistance.pests}/10
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>Resistencia al Fuego</th>
                        ${products.map(p => `
                            <td>
                                <i class="fas fa-circle feature-icon ${this.getResistanceClass(p.resistance.fire)}"></i>
                                ${p.resistance.fire}/10
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>Estética</th>
                        ${products.map(p => `
                            <td>
                                <div class="rating-stars">
                                    ${this.generateStars(p.aesthetics)}
                                </div>
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>Ventajas</th>
                        ${products.map(p => `
                            <td class="pros-cons-list">
                                <ul>
                                    ${p.pros.map(pro => `
                                        <li class="pro">
                                            <i class="fas fa-check-circle"></i>
                                            <span>${pro}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </td>
                        `).join('')}
                    </tr>
                    ${contextRecommendation ? `
                    <tr class="context-advantages-row">
                        <th>Ventajas para tu contexto</th>
                        ${products.map(p => {
                            const reasons = contextRecommendation.reasons[p.id];
                            if (reasons && reasons.length > 0) {
                                return `
                                    <td class="pros-cons-list context-specific">
                                        <ul>
                                            ${reasons.map(reason => `
                                                <li class="context-pro">
                                                    <i class="fas fa-star"></i>
                                                    <span>${reason}</span>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </td>
                                `;
                            } else {
                                return `
                                    <td class="pros-cons-list">
                                        <p class="no-context-match">
                                            <i class="fas fa-minus-circle"></i>
                                            No es la opción ideal para este contexto
                                        </p>
                                    </td>
                                `;
                            }
                        }).join('')}
                    </tr>
                    ` : ''}
                    <tr>
                        <th>Desventajas</th>
                        ${products.map(p => `
                            <td class="pros-cons-list">
                                <ul>
                                    ${p.cons.map(con => `
                                        <li class="con">
                                            <i class="fas fa-times-circle"></i>
                                            <span>${con}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>Acción</th>
                        ${products.map(p => `
                            <td>
                                <button class="use-solution-btn" data-product="${p.id}">
                                    <i class="fas fa-calculator"></i> Usar esta solución
                                </button>
                            </td>
                        `).join('')}
                    </tr>
                </tbody>
            </table>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const emptyStars = 10 - fullStars;
        
        let html = '';
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="fas fa-star"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            html += '<i class="far fa-star empty"></i>';
        }
        return html;
    }

    getResistanceClass(value) {
        if (value >= 8) return 'good';
        if (value >= 5) return 'medium';
        return 'low';
    }

    attachTableEventListeners() {
        try {
            const buttons = document.querySelectorAll('.use-solution-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.currentTarget.dataset.product;
                    this.useSolution(productId);
                });
            });
        } catch (error) {
            console.error('Error adjuntando event listeners a tabla:', error);
        }
    }

    useSolution(productId) {
        try {
            const calculatorSection = document.querySelector('#calculadora');
            if (!calculatorSection) {
                this.showError('La sección de calculadora no está disponible');
                return;
            }

            const postTypeSelect = document.querySelector('#postType');
            if (!postTypeSelect) {
                this.showError('No se encontró el selector de tipo de poste');
                return;
            }

            postTypeSelect.value = productId;
            postTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            
            this.showSuccess(`Tipo de poste "${COMPARISON_DATA[productId].name}" seleccionado en la calculadora`);
            
            calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            setTimeout(() => {
                const firstInput = calculatorSection.querySelector('input[type="number"]');
                if (firstInput) {
                    firstInput.focus();
                    firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 800);
        } catch (error) {
            console.error('Error usando solución:', error);
            this.showError('Error al usar esta solución');
        }
    }

    showError(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            console.error(message);
        }
    }

    showSuccess(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#comparador')) {
        window.comparatorInstance = new ComparatorManager();
    }
});
