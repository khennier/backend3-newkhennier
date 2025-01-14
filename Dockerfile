# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY package*.json ./
COPY . .

# Instala las dependencias
RUN npm install

# Exponer el puerto en el que corre tu aplicación
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["node", "src/app.js"]
