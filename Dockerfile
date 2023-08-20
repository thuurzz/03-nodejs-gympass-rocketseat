# Usa a imagem base do Node.js
FROM node:18


# ARG database_url
# ENV DATABASE_URL=$database_url


# Define o diretório de trabalho no container
WORKDIR /usr/src/app

RUN  chown node:node /usr/src/app

# Copia o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia os arquivos restantes da aplicação para o diretório de trabalho
COPY . .


# Compila o TypeScript para JavaScript
RUN npm run build


# Expor a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "npm", "run", "start"]