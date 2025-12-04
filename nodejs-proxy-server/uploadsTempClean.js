#!/usr/bin/env node
/**
 * 删除 /uploadsTemp 目录下创建时间超过 7 天的文件
 * 用法：
 *   node cleanupUploads.js         # 手动跑
 *   pm2 start cleanupUploads.js --cron "0 3 * * *"  # 每天 03:00 定时
 */
const fs   = require('fs');
const path = require('path');

const TARGET_DIR = path.resolve(__dirname, 'uploadsTemp');
const MAX_AGE_DAY = 7;

function walk(dir, cb) {
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            walk(full, cb);          // 递归
        } else {
            cb(full, stat);
        }
    }
}

function main() {
    if (!fs.existsSync(TARGET_DIR)) {
        console.log('[cleanup] 目录不存在，跳过:', TARGET_DIR);
        return;
    }
    const now = Date.now();
    const maxAgeMs = MAX_AGE_DAY * 24 * 3600 * 1000;
    let count = 0;
    walk(TARGET_DIR, (file, stat) => {
        if (now - stat.birthtimeMs > maxAgeMs) {
            fs.unlinkSync(file);
            console.log('[cleanup] 删除:', path.relative(process.cwd(), file));
            count++;
        }
    });
    console.log(`[cleanup] 共删除 ${count} 个过期文件`);
}

if (require.main === module) main();