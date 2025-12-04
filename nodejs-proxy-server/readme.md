# 安装 nodejs 依赖
sh install.sh

# 安装 pm2
npm i -g pm2

# 启动项目
pm2 start app
pm2 stop app
pm2 restart app

# 启动定时临时文件删除
sh startCleanCron.sh

