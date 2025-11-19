/**
 * Calculator UI - Interfaz de usuario para la calculadora de materiales
 * Se carga bajo demanda cuando el usuario accede a la sección de calculadora
 */

class CalculatorUI {
    constructor() {
        this.calculator = new MaterialCalculator(CONFIG);
        this.currentCalculation = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedProgress();
        console.log('CalculatorUI inicializado');
    }

    setupEventListeners() {
        // Inputs de dimensiones
        const lengthInput = document.getElementById('calculatorLength');
        const widthInput = document.getElementById('calculatorWidth');
        const perimeterInput = document.getElementById('calculatorPerimeter');
        const perimeterTypeSelect = document.getElementById('perimeterType');
        const postTypeSelect = document.getElementById('postType');
        const materialTypeSelect = document.getElementById('materialType');
        const meshHeightSelect = document.getElementById('meshHeight');
        const wireStrandsInput = document.getElementById('wireStrands');

        // Event listeners con debounce
        if (lengthInput) lengthInput.addEventListener('input', () => this.debounceCalculate());
        if (widthInput) widthInput.addEventListener('input', () => this.debounceCalculate());
        if (perimeterInput) perimeterInput.addEventListener('input', () => this.debounceCalculate());
        if (perimeterTypeSelect) perimeterTypeSelect.addEventListener('change', () => this.debounceCalculate());
        if (postTypeSelect) postTypeSelect.addEventListener('change', () => this.debounceCalculate());
        if (materialTypeSelect) materialTypeSelect.addEventListener('change', () => this.debounceCalculate());
        if (meshHeightSelect) meshHeightSelect.addEventListener('change', () => this.debounceCalculate());
        if (wireStrandsInput) wireStrandsInput.addEventListener('input', () => this.debounceCalculate());

        // Botón para agregar segmentos
        const addSegmentBtn = document.getElementById('addSegmentBtn');
        if (addSegmentBtn) {
            addSegmentBtn.addEventListener('click', () => this.addSegment());
        }

        // Botón para generar cotización
        const generateQuoteBtn = document.getElementById('generateQuoteFromCalculator');
        if (generateQuoteBtn) {
            generateQuoteBtn.addEventListener('click', () => this.generateQuotation());
        }
    }

    debounceCalculate() {
        if (this.calculateTimeout) {
            clearTimeout(this.calculateTimeout);
        }
        this.calculateTimeout = setTimeout(() => this.calculate(), 300);
    }

    calculate() {
        try {
            const perimeterType = document.getElementById('perimeterType')?.value || 'simple';
            let perimeter = 0;

            if (perimeterType === 'simple') {
                const length = parseFloat(document.getElementById('calculatorLength')?.value) || 0;
                const width = parseFloat(document.getElementById('calculatorWidth')?.value) || 0;
                perimeter = this.calculator.calculatePerimeter(length, width);
            } else {
                perimeter = parseFloat(document.getElementById('calculatorPerimeter')?.value) || 0;
            }

            if (perimeter <= 0) {
                this.showResults(null);
                return;
            }

            const postType = document.getElementById('postType')?.value || 'hormigon';
            const materialType = document.getElementById('materialType')?.value || 'wire';
            const meshHeight = parseFloat(document.getElementById('meshHeight')?.value) || 1.5;
            const wireStrands = parseInt(document.getElementById('wireStrands')?.value) || 2;

            const posts = this.calculator.calculatePosts(perimeter);
            let materials = {
                perimeter: perimeter,
                posts: posts,
                postType: postType
            };

            if (materialType === 'wire') {
                const wireMeters = this.calculator.calculateWire(perimeter, 'wire', wireStrands);
                materials.wire = {
                    type: 'wire',
                    strands: wireStrands,
                    totalMeters: wireMeters
                };

                // Agregar hilos de púa si es Olimpo
                if (postType === 'olimpo') {
                    materials.wire.barbed = {
                        strands: 3,
                        totalMeters: perimeter * 3
                    };
                }
            } else {
                const rolls = this.calculator.calculateMesh(perimeter, meshHeight);
                materials.mesh = {
                    type: 'mesh',
                    height: meshHeight,
                    rolls: rolls,
                    totalMeters: rolls * 10
                };
            }

            this.currentCalculation = materials;
            this.showResults(materials);
            this.saveProgress(materials);

        } catch (error) {
            console.error('Error en cálculo:', error);
            showNotification('Error al calcular materiales', 'error');
        }
    }

    showResults(materials) {
        const resultsDiv = document.getElementById('calculatorResults');
        if (!resultsDiv) return;

        if (!materials) {
            resultsDiv.innerHTML = '<p class="no-results">Ingresa las dimensiones para ver los resultados</p>';
            return;
        }

        let html = `
            <div class="results-header">
                <h3>Desglose de Materiales</h3>
                <p class="perimeter-info">Perímetro: ${materials.perimeter.toFixed(2)} metros</p>
            </div>
            
            <div class="results-grid">
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-cube"></i>
                    </div>
                    <div class="result-content">
                        <h4>Postes</h4>
                        <div class="result-value">${materials.posts.total}</div>
                        <div class="result-detail">
                            ${materials.posts.corner} esquineros + ${materials.posts.intermediate} intermedios
                        </div>
                        <div class="result-type">${this.getPostTypeLabel(materials.postType)}</div>
                    </div>
                </div>
        `;

        if (materials.wire) {
            html += `
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-link"></i>
                    </div>
                    <div class="result-content">
                        <h4>Alambre</h4>
                        <div class="result-value">${materials.wire.totalMeters.toFixed(0)} m</div>
                        <div class="result-detail">
                            ${materials.wire.strands} hilos de ${materials.wire.totalMeters.toFixed(0)}m c/u
                        </div>
                        ${materials.wire.barbed ? `
                            <div class="result-extra">
                                + 3 hilos de púa (${materials.wire.barbed.totalMeters.toFixed(0)}m)
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        if (materials.mesh) {
            html += `
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-th"></i>
                    </div>
                    <div class="result-content">
                        <h4>Tejido Romboidal</h4>
                        <div class="result-value">${materials.mesh.rolls}</div>
                        <div class="result-detail">
                            Rollos de ${materials.mesh.height}m x 10m
                        </div>
                        <div class="result-extra">
                            Total: ${materials.mesh.totalMeters.toFixed(0)}m²
                        </div>
                    </div>
                </div>
            `;
        }

        html += `
                <div class="result-card">
                    <div class="result-icon">
                        <i class="fas fa-tools"></i>
                    </div>
                    <div class="result-content">
                        <h4>Accesorios Estimados</h4>
                        <div class="result-value">${Math.ceil(materials.posts.total * 2)}</div>
                        <div class="result-detail">
                            Grampas, tensores y fijaciones
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="results-actions">
                <button class="btn-primary" id="generateQuoteFromCalculator">
                    <i class="fas fa-file-invoice"></i>
                    Generar Cotización
                </button>
            </div>
        `;

        resultsDiv.innerHTML = html;

        // Re-agregar event listener al botón
        const generateBtn = document.getElementById('generateQuoteFromCalculator');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateQuotation());
        }
    }

    getPostTypeLabel(postType) {
        const labels = {
            'hormigon': 'Hormigón Armado',
            'quebracho': 'Quebracho',
            'eucalipto': 'Eucalipto',
            'olimpo': 'Olimpo (Hormigón + Púas)'
        };
        return labels[postType] || postType;
    }

    addSegment() {
        const segmentsContainer = document.getElementById('segmentsContainer');
        if (!segmentsContainer) return;

        const segmentCount = segmentsContainer.querySelectorAll('.segment-input').length + 1;
        const segmentHTML = `
            <div class="segment-input" data-segment="${segmentCount}">
                <label>Segmento ${segmentCount}</label>
                <div class="segment-controls">
                    <input type="number" placeholder="Longitud (m)" class="segment-length" min="0" step="0.1">
                    <button class="btn-remove-segment" onclick="calculatorUI.removeSegment(${segmentCount})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        segmentsContainer.insertAdjacentHTML('beforeend', segmentHTML);

        // Agregar event listener al nuevo input
        const newInput = segmentsContainer.querySelector(`[data-segment="${segmentCount}"] .segment-length`);
        if (newInput) {
            newInput.addEventListener('input', () => this.debounceCalculate());
        }

        this.debounceCalculate();
    }

    removeSegment(segmentNumber) {
        const segment = document.querySelector(`[data-segment="${segmentNumber}"]`);
        if (segment) {
            segment.remove();
            this.debounceCalculate();
        }
    }

    generateQuotation() {
        if (!this.currentCalculation) {
            showNotification('Completa el cálculo primero', 'warning');
            return;
        }

        // Guardar cálculo en sessionStorage para la cotización
        sessionStorage.setItem('calculatorData', JSON.stringify(this.currentCalculation));

        // Abrir modal de cotización
        if (typeof openQuotationModal === 'function') {
            openQuotationModal(this.currentCalculation);
        } else {
            showNotification('Error al abrir cotización', 'error');
        }
    }

    saveProgress(materials) {
        try {
            localStorage.setItem('ferreteria_calculator_progress', JSON.stringify(materials));
        } catch (error) {
            console.error('Error al guardar progreso:', error);
        }
    }

    loadSavedProgress() {
        try {
            const saved = localStorage.getItem('ferreteria_calculator_progress');
            if (saved) {
                const materials = JSON.parse(saved);
                // Mostrar notificación de recuperación
                showNotification('Progreso anterior recuperado', 'info');
            }
        } catch (error) {
            console.error('Error al cargar progreso:', error);
        }
    }
}

// Instancia global
let calculatorUI = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (!calculatorUI && document.getElementById('calculadora')) {
        calculatorUI = new CalculatorUI();
    }
});
