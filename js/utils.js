/**
 * ErrorHandler - Manejo centralizado de errores
 */
class ErrorHandler {
    static handle(error, context = '') {
        console.error(`Error en ${context}:`, error);
        
        let message = 'Ocurrió un error inesperado';
        let type = 'error';
        
        if (error.name === 'NetworkError') {
            message = 'Error de conexión. Verifica tu internet.';
        } else if (error.name === 'ValidationError') {
            message = error.message;
        } else if (error.name === 'StorageError') {
            message = 'Error al guardar datos. Verifica el espacio disponible.';
        } else if (error.message) {
            message = error.message;
        }
        
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        }
        
        this.logError(error, context);
    }
    
    static logError(error, context) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            context: context,
            message: error.message,
            stack: error.stack
        };
        
        try {
            const logs = JSON.parse(localStorage.getItem('ferreteria_error_logs') || '[]');
            logs.push(errorLog);
            
            const maxLogs = 50;
            if (logs.length > maxLogs) {
                logs.splice(0, logs.length - maxLogs);
            }
            
            localStorage.setItem('ferreteria_error_logs', JSON.stringify(logs));
        } catch (e) {
            console.error('No se pudo guardar el log de error:', e);
        }
    }
    
    static clearOldLogs(daysOld = 7) {
        try {
            const logs = JSON.parse(localStorage.getItem('ferreteria_error_logs') || '[]');
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            
            const filteredLogs = logs.filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate > cutoffDate;
            });
            
            localStorage.setItem('ferreteria_error_logs', JSON.stringify(filteredLogs));
        } catch (e) {
            console.error('Error al limpiar logs antiguos:', e);
        }
    }
}

/**
 * Validator - Métodos de validación
 */
class Validator {
    static isRequired(value) {
        return value !== null && value !== undefined && value !== '';
    }
    
    static isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
    
    static isPositiveNumber(value) {
        return this.isNumber(value) && parseFloat(value) > 0;
    }
    
    static isInteger(value) {
        return this.isNumber(value) && Number.isInteger(parseFloat(value));
    }
    
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static isPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
    }
    
    static minLength(value, min) {
        return value && value.length >= min;
    }
    
    static maxLength(value, max) {
        return value && value.length <= max;
    }
    
    static inRange(value, min, max) {
        const num = parseFloat(value);
        return this.isNumber(value) && num >= min && num <= max;
    }
    
    static validateField(value, rules) {
        const errors = [];
        
        if (rules.required && !this.isRequired(value)) {
            errors.push('Este campo es requerido');
            return errors;
        }
        
        if (value && rules.type === 'email' && !this.isEmail(value)) {
            errors.push('Email inválido');
        }
        
        if (value && rules.type === 'phone' && !this.isPhone(value)) {
            errors.push('Teléfono inválido');
        }
        
        if (value && rules.type === 'number' && !this.isNumber(value)) {
            errors.push('Debe ser un número');
        }
        
        if (value && rules.positive && !this.isPositiveNumber(value)) {
            errors.push('Debe ser un número positivo');
        }
        
        if (value && rules.integer && !this.isInteger(value)) {
            errors.push('Debe ser un número entero');
        }
        
        if (value && rules.minLength && !this.minLength(value, rules.minLength)) {
            errors.push(`Mínimo ${rules.minLength} caracteres`);
        }
        
        if (value && rules.maxLength && !this.maxLength(value, rules.maxLength)) {
            errors.push(`Máximo ${rules.maxLength} caracteres`);
        }
        
        if (value && rules.min !== undefined && rules.max !== undefined) {
            if (!this.inRange(value, rules.min, rules.max)) {
                errors.push(`Debe estar entre ${rules.min} y ${rules.max}`);
            }
        }
        
        return errors;
    }
}

/**
 * StorageManager - Gestión de localStorage
 */
class StorageManager {
    static prefix = 'ferreteria_';
    
    static set(key, value) {
        try {
            const fullKey = this.prefix + key;
            const serialized = JSON.stringify(value);
            localStorage.setItem(fullKey, serialized);
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                const error = new Error('Espacio de almacenamiento lleno');
                error.name = 'StorageError';
                ErrorHandler.handle(error, 'StorageManager.set');
            } else {
                ErrorHandler.handle(e, 'StorageManager.set');
            }
            return false;
        }
    }
    
    static get(key, defaultValue = null) {
        try {
            const fullKey = this.prefix + key;
            const item = localStorage.getItem(fullKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            ErrorHandler.handle(e, 'StorageManager.get');
            return defaultValue;
        }
    }
    
    static remove(key) {
        try {
            const fullKey = this.prefix + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (e) {
            ErrorHandler.handle(e, 'StorageManager.remove');
            return false;
        }
    }
    
    static clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            ErrorHandler.handle(e, 'StorageManager.clear');
            return false;
        }
    }
    
    static has(key) {
        const fullKey = this.prefix + key;
        return localStorage.getItem(fullKey) !== null;
    }
    
    static getSize() {
        let total = 0;
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                total += localStorage.getItem(key).length;
            }
        });
        return total;
    }
    
    static getSizeInMB() {
        return (this.getSize() / (1024 * 1024)).toFixed(2);
    }
    
    static isQuotaExceeded() {
        const maxSize = 5 * 1024 * 1024;
        return this.getSize() > maxSize;
    }
}

/**
 * PerformanceUtils - Utilidades de performance
 */
class PerformanceUtils {
    static debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static measurePerformance(name, func) {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${name} tomó ${(end - start).toFixed(2)}ms`);
        return result;
    }
    
    static async measureAsyncPerformance(name, asyncFunc) {
        const start = performance.now();
        const result = await asyncFunc();
        const end = performance.now();
        console.log(`${name} tomó ${(end - start).toFixed(2)}ms`);
        return result;
    }
    
    static memoize(func) {
        const cache = new Map();
        return function(...args) {
            const key = JSON.stringify(args);
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = func(...args);
            cache.set(key, result);
            return result;
        };
    }
}
