/**
 * MaterialCalculator - Calculadora de materiales para alambrados
 * Calcula la cantidad de postes, alambres, tejidos y accesorios necesarios
 * para un proyecto de cercado basado en las dimensiones del terreno
 */

class MaterialCalculator {
    constructor(config = {}) {
        this.config = config || window.CONFIG?.calculator || {};
        this.postSpacing = this.config.defaultPostSpacing || 2.5;
        this.cornerPosts = this.config.cornerPosts || 4;
        this.meshRollLength = this.config.meshRollLength || 10;
        this.wireTypes = this.config.wireTypes || {
            standard: { strands: 5, name: 'Alambre estándar (5 hilos)' },
            reinforced: { strands: 7, name: 'Alambre reforzado (7 hilos)' },
            olimpo: { strands: 3, name: 'Alambre de púa (3 hilos)', isPua: true }
        };
    }

    calculatePerimeter(length, width) {
        if (!length || !width || length <= 0 || width <= 0) {
            throw new Error('Las dimensiones deben ser valores positivos');
        }
        return 2 * (parseFloat(length) + parseFloat(width));
    }

    calculatePosts(perimeter, spacing = null) {
        if (!perimeter || perimeter <= 0) {
            throw new Error('El perímetro debe ser un valor positivo');
        }

        const effectiveSpacing = spacing || this.postSpacing;
        
        if (effectiveSpacing <= 0) {
            throw new Error('La separación entre postes debe ser un valor positivo');
        }

        const totalPosts = Math.ceil(perimeter / effectiveSpacing);
        const intermediatePosts = Math.max(0, totalPosts - this.cornerPosts);

        return {
            corner: this.cornerPosts,
            intermediate: intermediatePosts,
            total: totalPosts,
            spacing: effectiveSpacing
        };
    }

    calculateWire(perimeter, strands) {
        if (!perimeter || perimeter <= 0) {
            throw new Error('El perímetro debe ser un valor positivo');
        }

        if (!strands || strands <= 0) {
            throw new Error('El número de hilos debe ser un valor positivo');
        }

        const totalMeters = perimeter * strands;
        const kgPerMeter = 0.15;
        const totalKg = Math.ceil(totalMeters * kgPerMeter);

        return {
            strands: strands,
            metersPerStrand: perimeter,
            totalMeters: totalMeters,
            estimatedKg: totalKg
        };
    }

    calculateMesh(perimeter, height) {
        if (!perimeter || perimeter <= 0) {
            throw new Error('El perímetro debe ser un valor positivo');
        }

        if (!height || height <= 0) {
            throw new Error('La altura debe ser un valor positivo');
        }

        const rollsNeeded = Math.ceil(perimeter / this.meshRollLength);
        const totalMeters = perimeter;

        return {
            height: height,
            rollLength: this.meshRollLength,
            rollsNeeded: rollsNeeded,
            totalMeters: totalMeters,
            coverage: rollsNeeded * this.meshRollLength
        };
    }

    calculateOlimpoSpecial(perimeter) {
        const puaStrands = 3;
        const wireData = this.calculateWire(perimeter, puaStrands);
        
        return {
            ...wireData,
            wireType: 'Alambre de púa',
            isOlimpo: true,
            note: 'Los postes Olimpo incluyen 3 hilos de alambre de púa incorporados'
        };
    }

    calculateAccessories(posts, perimeter, materialType) {
        const accessories = {};

        if (materialType === 'wire') {
            accessories.grampas = Math.ceil(posts.total * 10);
            accessories.tensores = Math.ceil(perimeter / 25);
            accessories.alambreAtar = Math.ceil(perimeter / 50);
        } else if (materialType === 'mesh') {
            accessories.abrazaderas = Math.ceil(posts.total * 4);
            accessories.tensores = Math.ceil(perimeter / 20);
            accessories.alambreAtar = Math.ceil(perimeter / 30);
        }

        accessories.esquineros = 4;
        accessories.varillasAnclaje = posts.corner;

        return accessories;
    }

    calculateComplete(params) {
        try {
            const {
                length,
                width,
                perimeter: customPerimeter,
                postType,
                postSpacing,
                materialType,
                wireStrands,
                meshHeight
            } = params;

            const perimeter = customPerimeter || this.calculatePerimeter(length, width);
            const posts = this.calculatePosts(perimeter, postSpacing);

            const result = {
                perimeter: perimeter,
                posts: posts,
                postType: postType || 'hormigon'
            };

            if (postType === 'olimpo') {
                result.wire = this.calculateOlimpoSpecial(perimeter);
                result.materialType = 'wire';
            } else if (materialType === 'wire') {
                result.wire = this.calculateWire(perimeter, wireStrands || 5);
                result.materialType = 'wire';
            } else if (materialType === 'mesh') {
                result.mesh = this.calculateMesh(perimeter, meshHeight || 1.5);
                result.materialType = 'mesh';
            }

            result.accessories = this.calculateAccessories(
                posts,
                perimeter,
                result.materialType
            );

            return result;
        } catch (error) {
            console.error('Error en cálculo completo:', error);
            throw error;
        }
    }

    validateInput(value, min = 0, max = Infinity) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return { valid: false, error: 'Debe ingresar un número válido' };
        }
        if (num <= min) {
            return { valid: false, error: `El valor debe ser mayor a ${min}` };
        }
        if (num > max) {
            return { valid: false, error: `El valor debe ser menor o igual a ${max}` };
        }
        return { valid: true, value: num };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaterialCalculator;
}

if (typeof window !== 'undefined') {
    window.MaterialCalculator = MaterialCalculator;
}
