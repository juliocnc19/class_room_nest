# Usa una imagen base con Node.js
FROM node:22

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

COPY .env .env

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar la carpeta prisma al contenedor antes de ejecutar las migraciones
COPY prisma ./prisma

# Ejecutar las migraciones de Prisma y generar el cliente
RUN npx prisma generate

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación NestJS
RUN npm run build

# Exponer el puerto de la aplicación
EXPOSE 3000


