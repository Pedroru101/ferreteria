/**
 * DataCleanupManager - Gestión automática de limpieza de datos antiguos
 * Limpia cotizaciones expiradas, logs de errores antiguos y verifica cuota de almacenamiento
 */
class DataCleanupManager {
    constructor(config = {}) {
        this.config = {
            enabled: true,
            checkInterval: 3600000,
            quotationExpiryDays: 30,
            errorLogRetentionDays: 7,
            maxStorageMB: 5,
            autoCleanupOnInit: true,
            cleanupTasks: {
                expiredQuotations: true,
                oldErrorLogs: true,
                storageQuotaCheck: true
            },
            ...config
        };
        
        this.cleanupTimer = null;
        this.lastCleanupTime = null;
        this.cleanupStats = {
            quotationsRemoved: 0,
            logsRemoved: 0,
            storageWarnings: 0,
            lastRun: null
        };
    }

    init() {
        if (!this.config.enabled) {
            console.log('DataCleanupManager deshabilitado');
            return;
        }

        if (this.config.autoCleanupOnInit) {
            this.runCleanup();
        }

        this.scheduleCleanup();
    }

    scheduleCleanup() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }

        this.cleanupTimer = setInterval(() => {
            this.runCleanup();
        }, this.config.checkInterval);
    }

    runCleanup() {
        try {
            const startTime = performance.now();
            const stats = {
                quotationsRemoved: 0,
                logsRemoved: 0,
                storageWarnings: 0
            };

            if (this.config.cleanupTasks.expiredQuotations) {
                stats.quotationsRemoved = this.cleanupExpiredQuotations();
            }

            if (this.config.cleanupTasks.oldErrorLogs) {
                stats.logsRemoved = this.cleanupOldErrorLogs();
            }

            if (this.config.cleanupTasks.storageQuotaCheck) {
                stats.storageWarnings = this.checkStorageQuota();
            }

            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);

            this.lastCleanupTime = new Date();
            this.cleanupStats = {
                ...stats,
                lastRun: this.lastCleanupTime.toISOString()
            };

            if (stats.quotationsRemoved > 0 || stats.logsRemoved > 0) {
                console.log(`DataCleanup completado en ${duration}ms:`, stats);
            }

            return stats;
        } catch (error) {
            console.error('Error durante limpieza de datos:', error);
            if (typeof ErrorHandler !== 'undefined') {
                ErrorHandler.handle(error, 'DataCleanupManager.runCleanup');
            }
            return null;
        }
    }

    cleanupExpiredQuotations() {
        try {
            const quotations = StorageManager.get('quotations', []);
            if (!Array.isArray(quotations) || quotations.length === 0) {
                return 0;
            }

            const now = new Date();
            const initialCount = quotations.length;

            const filtered = quotations.filter(quotation => {
                if (!quotation.validUntil) {
                    return true;
                }

                const expiryDate = new Date(quotation.validUntil);
                return expiryDate > now;
            });

            const removedCount = initialCount - filtered.length;

            if (removedCount > 0) {
                StorageManager.set('quotations', filtered);
                console.log(`Se eliminaron ${removedCount} cotizaciones expiradas`);
            }

            return removedCount;
        } catch (error) {
            console.error('Error al limpiar cotizaciones expiradas:', error);
            return 0;
        }
    }

    cleanupOldErrorLogs() {
        try {
            const logs = StorageManager.get('error_logs', []);
            if (!Array.isArray(logs) || logs.length === 0) {
                return 0;
            }

            const now = new Date();
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - this.config.errorLogRetentionDays);

            const initialCount = logs.length;

            const filtered = logs.filter(log => {
                if (!log.timestamp) {
                    return false;
                }

                const logDate = new Date(log.timestamp);
                return logDate > cutoffDate;
            });

            const removedCount = initialCount - filtered.length;

            if (removedCount > 0) {
                StorageManager.set('error_logs', filtered);
                console.log(`Se eliminaron ${removedCount} logs de error antiguos`);
            }

            return removedCount;
        } catch (error) {
            console.error('Error al limpiar logs de error:', error);
            return 0;
        }
    }

    checkStorageQuota() {
        try {
            const currentSizeMB = StorageManager.getSizeInMB();
            const maxSizeMB = this.config.maxStorageMB;
            const usagePercentage = (currentSizeMB / maxSizeMB) * 100;

            let warningCount = 0;

            if (usagePercentage >= 90) {
                console.warn(`Almacenamiento crítico: ${currentSizeMB}MB / ${maxSizeMB}MB (${usagePercentage.toFixed(1)}%)`);
                warningCount = 1;

                if (typeof showNotification === 'function') {
                    showNotification(
                        `Almacenamiento casi lleno: ${currentSizeMB}MB / ${maxSizeMB}MB`,
                        'warning'
                    );
                }

                this.attemptEmergencyCleanup();
            } else if (usagePercentage >= 75) {
                console.warn(`Almacenamiento alto: ${currentSizeMB}MB / ${maxSizeMB}MB (${usagePercentage.toFixed(1)}%)`);
                warningCount = 1;
            }

            return warningCount;
        } catch (error) {
            console.error('Error al verificar cuota de almacenamiento:', error);
            return 0;
        }
    }

    attemptEmergencyCleanup() {
        try {
            console.log('Iniciando limpieza de emergencia...');

            const quotations = StorageManager.get('quotations', []);
            if (Array.isArray(quotations) && quotations.length > 0) {
                const sorted = quotations.sort((a, b) => {
                    const dateA = new Date(a.date || 0);
                    const dateB = new Date(b.date || 0);
                    return dateA - dateB;
                });

                const toKeep = Math.max(10, Math.floor(sorted.length * 0.5));
                const cleaned = sorted.slice(-toKeep);

                StorageManager.set('quotations', cleaned);
                console.log(`Limpieza de emergencia: se mantuvieron ${toKeep} cotizaciones recientes`);
            }

            const logs = StorageManager.get('error_logs', []);
            if (Array.isArray(logs) && logs.length > 0) {
                const cleaned = logs.slice(-20);
                StorageManager.set('error_logs', cleaned);
                console.log('Limpieza de emergencia: se mantuvieron 20 logs recientes');
            }
        } catch (error) {
            console.error('Error durante limpieza de emergencia:', error);
        }
    }

    getCleanupStats() {
        return {
            ...this.cleanupStats,
            currentStorageMB: StorageManager.getSizeInMB(),
            maxStorageMB: this.config.maxStorageMB,
            nextCleanupTime: this.getNextCleanupTime()
        };
    }

    getNextCleanupTime() {
        if (!this.lastCleanupTime) {
            return new Date(Date.now() + this.config.checkInterval);
        }

        return new Date(this.lastCleanupTime.getTime() + this.config.checkInterval);
    }

    forceCleanup() {
        console.log('Limpieza forzada iniciada...');
        return this.runCleanup();
    }

    destroy() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
        console.log('DataCleanupManager destruido');
    }
}

// Instancia global del gestor de limpieza
let dataCleanupManager = null;

function initDataCleanup(customConfig = {}) {
    if (typeof CONFIG === 'undefined' || !CONFIG.dataCleanup) {
        console.warn('CONFIG.dataCleanup no está disponible');
        return null;
    }

    const config = {
        ...CONFIG.dataCleanup,
        ...customConfig
    };

    dataCleanupManager = new DataCleanupManager(config);
    dataCleanupManager.init();

    return dataCleanupManager;
}
