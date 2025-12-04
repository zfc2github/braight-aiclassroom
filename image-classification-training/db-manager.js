// IndexedDB 管理器
class DatabaseManager {
    constructor() {
        this.dbName = 'AIClassifierDB';
        this.dbVersion = 1;
        this.db = null;
    }

    // 初始化数据库
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Database initialization failed:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database initialized successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // 创建数据集存储
                if (!db.objectStoreNames.contains('datasets')) {
                    const datasetStore = db.createObjectStore('datasets', { keyPath: 'id', autoIncrement: true });
                    datasetStore.createIndex('className', 'className', { unique: false });
                    datasetStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // 创建模型存储
                if (!db.objectStoreNames.contains('models')) {
                    const modelStore = db.createObjectStore('models', { keyPath: 'id', autoIncrement: true });
                    modelStore.createIndex('name', 'name', { unique: true });
                    modelStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // 创建训练历史存储
                if (!db.objectStoreNames.contains('trainingHistory')) {
                    const historyStore = db.createObjectStore('trainingHistory', { keyPath: 'id', autoIncrement: true });
                    historyStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // 创建应用设置存储
                if (!db.objectStoreNames.contains('settings')) {
                    const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
                }

                console.log('Database upgraded to version', event.newVersion);
            };
        });
    }

    // 保存数据集
    async saveDataset(className, samples) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['datasets'], 'readwrite');
            const store = transaction.objectStore('datasets');

            const dataset = {
                className: className,
                samples: samples,
                timestamp: new Date().toISOString(),
                sampleCount: samples.length
            };

            const request = store.put(dataset);

            request.onsuccess = () => {
                console.log(`Dataset for class "${className}" saved successfully`);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Failed to save dataset:', request.error);
                reject(request.error);
            };
        });
    }

    // 获取所有数据集
    async getAllDatasets() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['datasets'], 'readonly');
            const store = transaction.objectStore('datasets');
            const request = store.getAll();

            request.onsuccess = () => {
                const datasets = {};
                request.result.forEach(item => {
                    datasets[item.className] = item.samples;
                });
                resolve(datasets);
            };

            request.onerror = () => {
                console.error('Failed to get datasets:', request.error);
                reject(request.error);
            };
        });
    }

    // 删除数据集
    async deleteDataset(className) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['datasets'], 'readwrite');
            const store = transaction.objectStore('datasets');
            const index = store.index('className');

            const request = index.getKey(className);

            request.onsuccess = () => {
                if (request.result) {
                    const deleteRequest = store.delete(request.result);
                    deleteRequest.onsuccess = () => {
                        console.log(`Dataset for class "${className}" deleted successfully`);
                        resolve();
                    };
                    deleteRequest.onerror = () => reject(deleteRequest.error);
                } else {
                    resolve();
                }
            };

            request.onerror = () => {
                console.error('Failed to find dataset for deletion:', request.error);
                reject(request.error);
            };
        });
    }

    // 保存模型
    async saveModel(modelData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['models'], 'readwrite');
            const store = transaction.objectStore('models');

            const model = {
                name: modelData.name || 'default_model',
                modelJson: modelData.modelJson,
                weights: modelData.weights,
                classes: modelData.classes,
                timestamp: new Date().toISOString(),
                metadata: modelData.metadata || {}
            };

            const request = store.put(model);

            request.onsuccess = () => {
                console.log('Model saved successfully');
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Failed to save model:', request.error);
                reject(request.error);
            };
        });
    }

    // 获取模型
    async getModel(modelName = 'default_model') {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['models'], 'readonly');
            const store = transaction.objectStore('models');
            const index = store.index('name');

            const request = index.get(modelName);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Failed to get model:', request.error);
                reject(request.error);
            };
        });
    }

    // 保存训练历史
    async saveTrainingHistory(historyData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['trainingHistory'], 'readwrite');
            const store = transaction.objectStore('trainingHistory');

            const history = {
                timestamp: new Date().toISOString(),
                classes: historyData.classes,
                samples: historyData.samples,
                finalLoss: historyData.finalLoss,
                finalAccuracy: historyData.finalAccuracy,
                epochs: historyData.epochs,
                duration: historyData.duration,
                parameters: historyData.parameters || {}
            };

            const request = store.add(history);

            request.onsuccess = () => {
                console.log('Training history saved successfully');
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Failed to save training history:', request.error);
                reject(request.error);
            };
        });
    }

    // 获取训练历史
    async getTrainingHistory(limit = 10) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['trainingHistory'], 'readonly');
            const store = transaction.objectStore('trainingHistory');
            const index = store.index('timestamp');

            const request = index.openCursor(null, 'prev');
            const results = [];

            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor && results.length < limit) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = () => {
                console.error('Failed to get training history:', request.error);
                reject(request.error);
            };
        });
    }

    // 保存设置
    async saveSetting(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');

            const setting = {
                key: key,
                value: value,
                timestamp: new Date().toISOString()
            };

            const request = store.put(setting);

            request.onsuccess = () => {
                console.log(`Setting "${key}" saved successfully`);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Failed to save setting:', request.error);
                reject(request.error);
            };
        });
    }

    // 获取设置
    async getSetting(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');

            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result ? request.result.value : null);
            };

            request.onerror = () => {
                console.error('Failed to get setting:', request.error);
                reject(request.error);
            };
        });
    }

    // 清除所有数据
    async clearAllData() {
        return new Promise((resolve, reject) => {
            const stores = ['datasets', 'models', 'trainingHistory', 'settings'];
            const transaction = this.db.transaction(stores, 'readwrite');

            let completed = 0;
            let hasError = false;

            stores.forEach(storeName => {
                const store = transaction.objectStore(storeName);
                const request = store.clear();

                request.onsuccess = () => {
                    completed++;
                    if (completed === stores.length && !hasError) {
                        console.log('All data cleared successfully');
                        resolve();
                    }
                };

                request.onerror = () => {
                    if (!hasError) {
                        hasError = true;
                        console.error('Failed to clear store:', storeName, request.error);
                        reject(request.error);
                    }
                };
            });
        });
    }

    // 获取数据库统计信息
    async getStats() {
        return new Promise((resolve, reject) => {
            const stores = ['datasets', 'models', 'trainingHistory', 'settings'];
            const transaction = this.db.transaction(stores, 'readonly');

            const stats = {};
            let completed = 0;

            stores.forEach(storeName => {
                const store = transaction.objectStore(storeName);
                const request = store.count();

                request.onsuccess = () => {
                    stats[storeName] = request.result;
                    completed++;

                    if (completed === stores.length) {
                        resolve(stats);
                    }
                };

                request.onerror = () => {
                    console.error('Failed to get stats for store:', storeName, request.error);
                    stats[storeName] = 0;
                    completed++;

                    if (completed === stores.length) {
                        resolve(stats);
                    }
                };
            });
        });
    }
}

// 创建全局数据库管理器实例
const dbManager = new DatabaseManager();

// 导出数据库管理器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DatabaseManager, dbManager };
}