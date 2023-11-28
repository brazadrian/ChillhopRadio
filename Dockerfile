# Use a imagem mais recente do Node.js
FROM node:20.9.0

# Instala o ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Cria o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copia os arquivos necessários para o contêiner
COPY package*.json ./
COPY . .

# Instala as dependências
RUN npm install

# Comando para iniciar o bot
CMD ["node", "index.js"]