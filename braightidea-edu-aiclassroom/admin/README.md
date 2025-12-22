# mongodb 安装部署
> 以下操作均使用 root 用户操作
## 更新系统包
```shell
yum update -y
```

## 导入 MongoDB 的 GPG 密钥
```shell
rpm --import https://www.mongodb.org/static/pgp/server-7.0.asc
```

## 添加 MongoDB 的官方仓库
创建一个 MongoDB 的仓库文件 /etc/yum.repos.d/mongodb-org-7.0.repo，并添加以下内容：
```shell
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
```

## 安装 MongoDB
```shell
yum install -y mongodb-org
```

## 启动 MongoDB 服务
```shell
systemctl start mongod
```

## 验证安装
```shell
systemctl status mongod
```

## 配置 MongoDB
> 配置文件通常为 /etc/mongod.conf

### 允许远程访问
默认情况下，MongoDB 只允许本地访问。如果需要允许远程访问，需要修改配置文件中的 bindIp 参数：
```yaml
net:
    port: 27017
    bindIp: 0.0.0.0
storage:
  dbPath: /var/lib/mongo
  wiredTiger:
    engineConfig:
      cacheSizeGB: 4
```

### 启用身份验证
1. 创建管理员用户
```javascript
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "admin123",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})
```

2. 启用身份验证
编辑 /etc/mongod.conf 文件：
```yaml
security:
  authorization: enabled
# admin/admin123
```
重启 MongoDB 服务：
```shell
systemctl restart mongod
```

### 创建数据中台数据库与用户
```javascript
mongosh --username admin
use braight_dc
db.createUser({
  user: "braight",
  pwd: "luckytable910",
  roles: [ { role: "readWrite", db: "braight_dc" } ]
})
```
### 初始化数据
上传数据中台 mongodb 初始化数据 dump 目录（install/braight_dc-20250208.zip）至 /home/braightidea/braight-dc/
```shell
cd /home/braightidea/braight-dc
# 解压 braight_dc-20250208.zip
unzip braight_dc-20250208.zip
# 使用 dump 文件初始化 braight 库
mongorestore --username braight --password luckytable910 --authenticationDatabase braight_dc /home/braightidea/braight-dc/braight_dc-20250208
```

# mysql 安装部署
## [安装部署](https://blog.csdn.net/d905133872/article/details/128129599)
> 以 root 用户操作
```shell
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum clean all
yum makecache
wget http://dev.mysql.com/get/mysql57-community-release-el7-8.noarch.rpm
yum localinstall mysql57-community-release-el7-8.noarch.rpm
rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
yum install mysql-community-server

# 启动 mysql
systemctl start mysqld
# 配置 mysql 
vim /etc/my.cnf
# 查看 root 初始密码
grep 'temporary password' /var/log/mysqld.log
# 登录 mysql
mysql -uroot -p
# 修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'LuckyTable910!@#';

# 允许远程登录
use mysql;
update user set Host='%' where User='root';
exit

# 重启 mysql
systemctl restart mysqld
```

## 初始化数据库
上传 install/qcpl.sql 文件至 /home/braightidea/braight-dc
```shell
mysql -uroot -p
# 创建数据库 qcpl
CREATE DATABASE `qcpl` CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci';
use qcpl;
source /home/braightidea/braight-dc/qcpl.sql;
exit
```

# nginx 安装部署
> 使用 root 用户操作
```shell
yum update -y
yum install -y yum-utils
yum-config-manager --add-repo https://nginx.org/packages/centos/nginx.repo
yum install -y nginx
# 启动 nginx
systemctl start nginx
# 设置开机自启
systemctl enable nginx
# 检查 nginx 状态
systemctl status nginx
# 配置 nginx
vim /etc/nginx/nginx.conf
# 对于 SELinux，可以尝试运行以下命令来允许 Nginx 访问目标端口：
sudo setsebool -P httpd_can_network_connect 1
```

# 数据中台后端服务安装部署
## 创建用户并自动创建家目录
```shell
sudo useradd -m braight
```

## 设置用户密码
```shell
sudo passwd braight
# 系统会提示你输入两次密码，确保密码输入正确，如 luckytable910
```

## 以 braight 用户登录，进入 braight 家目录

## 初始化目录
```shell
cd ~
mkdir braight-dc
mkdir uploadPath
```

## 上传 install 目录下的 apache-tomcat-9.0.29_https.zip 文件到 /home/braightidea/braight-dc

## 解压 apache-tomcat-9.0.29_https.zip
```shell
cd /home/braightidea/braight-dc
unzip apache-tomcat-9.0.29_https.zip
```

## 上传 install 目录下的 dc-admin.war 文件至 /home/braightidea/braight-dc/apache-tomcat-9.0.29_https/webapps

## 给 /home/braightidea/braight-dc/apache-tomcat-9.0.29_https/bin 下的 sh 文件赋可执行权限
```shell
cd /home/braightidea/braight-dc/apache-tomcat-9.0.29_https/bin
chmod +x *.sh
```

## 安装 JDK17
方法一：使用 Adoptium 仓库安装 OpenJDK 17
更新系统包：
```shell
sudo yum update -y
```
添加 Adoptium 仓库：
导入 GPG 密钥：
```shell
sudo rpm --import https://packages.adoptium.net/artifactory/api/gpg/key/public
```
创建仓库配置文件：
```shell
sudo tee /etc/yum.repos.d/adoptium.repo <<EOF
[Adoptium]
name=Adoptium
baseurl=https://packages.adoptium.net/artifactory/rpm/rhel/7/$(uname -m)
enabled=1
gpgcheck=1
gpgkey=https://packages.adoptium.net/artifactory/api/gpg/key/public
EOF
```
安装 OpenJDK 17：
```shell
sudo yum install -y temurin-17-jdk
```
验证安装：
```shell
java -version
```

## 启动 tomcat（数据中台后端服务）
```shell
cd /home/braightidea/braight-dc/apache-tomcat-9.0.29_https/bin
sh startup.sh
# 修改startup.sh脚本，指定JDK
# vim startup.sh
# export JAVA_HOME=/usr/lib/jvm/temurin-17-jdk
# export PATH=$JAVA_HOME/bin:$PATH

# 查看日志
tail -f ../logs/catalina.out
```

## 防火墙配置
### 关闭防火墙或开放指定端口
```shell
# 如需关闭防火墙，可操作如下
sudo systemctl disable firewalld
sudo systemctl stop firewalld
# 如需开放指定端口，可操作如下（使用firewalld）
sudo firewall-cmd --zone=public --add-port=25165/tcp --permanent
sudo firewall-cmd --reload
# 如需开放指定端口，可操作如下（使用iptables）
sudo iptables -I INPUT -p tcp --dport 25165 -s 192.168.18.1 -j ACCEPT
```

# 数据中台前端服务安装部署
## 上传 install/dist.zip 至 /home/braightidea/braight-dc
```shell
cd /home/braightidea/braight-dc
# 解压 dist.zip
unzip dist.zip
# 配置SELinux允许Nginx访问dist目录
chcon -R -t httpd_sys_content_t /home/braightidea/braight-dc/dist
```

## 上传 install/nginx.conf 至 /etc/nginx/，替换掉 nginx.conf

## 重启 nginx
```shell
# 使用 root 用户启动 nginx
systemctl restart nginx
```
