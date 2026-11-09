# EC2 deployment

This guide describes the deployment that was validated on Amazon Linux 2023.
The application package is built locally and copied to the EC2 instance; the
source repository is not cloned on the server.

## 1. Build the deployment package locally

From the repository root:

```bash
export JAVA_HOME=/path/to/java-21
export PATH="$JAVA_HOME/bin:/usr/bin:$PATH"

mvn -f backend/pom.xml clean package -DskipTests

rm -rf deploy
mkdir -p deploy/frontend/views deploy/frontend/services
cp backend/target/catalog-api-0.0.1-SNAPSHOT.jar deploy/
cp -r frontend/views/. deploy/frontend/views/
cp -r frontend/services/. deploy/frontend/services/
tar -czf catalog-api-deploy.tar.gz -C deploy .
rm -rf deploy
```

The archive contains the Spring Boot JAR and the static frontend only.

## 2. Copy the package to EC2

Replace the key path and public IP with the values for the instance:

```bash
scp -i ~/Downloads/KEY.pem \
  catalog-api-deploy.tar.gz \
  ec2-user@PUBLIC_IP:/home/ec2-user/

ssh -i ~/Downloads/KEY.pem ec2-user@PUBLIC_IP
```

The Amazon Linux user is `ec2-user`.

## 3. Install and start services

On the EC2 instance:

```bash
sudo dnf update -y
sudo dnf install -y docker httpd tar
sudo systemctl enable --now docker
sudo systemctl enable --now httpd
```

Extract the package:

```bash
mkdir -p ~/catalog-deploy
tar -xzf ~/catalog-api-deploy.tar.gz -C ~/catalog-deploy
```

## 4. Start PostgreSQL and Spring Boot with Docker

```bash
sudo docker network create catalog-net
sudo docker volume create catalog-postgres-data
```

If either resource already exists, continue.

```bash
sudo docker run -d \
  --name catalog-postgres \
  --network catalog-net \
  --restart unless-stopped \
  -e POSTGRES_DB=catalog \
  -e POSTGRES_USER=catalog \
  -e POSTGRES_PASSWORD=catalog \
  -v catalog-postgres-data:/var/lib/postgresql/data \
  postgres:16-alpine
```

```bash
sudo docker run -d \
  --name catalog-api \
  --network catalog-net \
  --restart unless-stopped \
  -p 127.0.0.1:8080:8080 \
  -e DB_URL=jdbc:postgresql://catalog-postgres:5432/catalog \
  -e DB_USERNAME=catalog \
  -e DB_PASSWORD=catalog \
  -e SERVER_PORT=8080 \
  -v "$HOME/catalog-deploy/catalog-api-0.0.1-SNAPSHOT.jar:/app/catalog-api.jar:ro" \
  eclipse-temurin:21-jre \
  java -jar /app/catalog-api.jar
```

Validate the containers and API:

```bash
sudo docker ps
curl http://localhost:8080/api/health
curl http://localhost:8080/api/products
```

## 5. Configure Apache

Copy the frontend files one command at a time:

```bash
sudo rm -rf /var/www/html/*
sudo mkdir -p /var/www/html/services
sudo cp ~/catalog-deploy/frontend/views/index.html /var/www/html/index.html
sudo cp ~/catalog-deploy/frontend/views/api.html /var/www/html/api.html
sudo cp ~/catalog-deploy/frontend/services/api.service.js /var/www/html/services/
sudo cp ~/catalog-deploy/frontend/services/catalog.service.js /var/www/html/services/
```

Create `/etc/httpd/conf.d/catalog-api.conf` with:

```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        AllowOverride None
        Require all granted
    </Directory>

    ProxyPreserveHost On
    ProxyPass /api http://127.0.0.1:8080/api
    ProxyPassReverse /api http://127.0.0.1:8080/api
</VirtualHost>
```

Validate and restart Apache:

```bash
sudo apachectl configtest
sudo systemctl restart httpd
```

## 6. Final checks

```bash
curl http://localhost/api/health
curl http://localhost/api/products
```

Open the frontend at:

```text
http://PUBLIC_IP/
```

The `/api/products` URL intentionally returns JSON. The frontend is served
from `/`.

## Important notes

- Do not commit `.pem` files, passwords, or public deployment archives.
- The frontend must use the relative API URL `/api/products`.
- This setup uses one PostgreSQL container on the EC2 instance.
- Before using multiple EC2 instances behind a load balancer, move PostgreSQL to
  a shared database such as Amazon RDS. Separate PostgreSQL containers would
  create independent data stores.
