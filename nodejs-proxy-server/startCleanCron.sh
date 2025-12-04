#!/bin/bash
# 每天凌晨 3 点执行
pm2 start uploadsTempClean.js --name uploadsTemp-cleaner --cron "0 0 * * 0"
