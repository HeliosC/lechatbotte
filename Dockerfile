FROM node:22.16.0-alpine3.22

# Canvas dependencies
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    pixman-dev \
    freetype-dev \
    fontconfig \
    ttf-dejavu \
    ttf-freefont

WORKDIR /build

COPY package*.json .

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

CMD ["node", "index.js"]