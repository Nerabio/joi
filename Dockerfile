# Используем официальный образ Node.js
FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Порт, который будет использовать приложение
EXPOSE 8080

# Команда для запуска приложения
CMD ["npm", "dev"]