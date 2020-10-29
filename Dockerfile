FROM node:alpine

ARG BUILD_DATE
ARG VCS_REF

# Installs latest Chromium package.
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/v3.12/main" >> /etc/apk/repositories \
    && apk upgrade -U -a \
    && apk add \
    libstdc++ \
    chromium \
    harfbuzz \
    nss \
    freetype \
    ttf-freefont \
    font-noto-emoji \
    wqy-zenhei \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

# Add Chrome as a user
#RUN mkdir -p /usr/apps/scraper \ && adduser -D chrome \ && chown -R chrome:chrome /usr/apps/scraper
# Run Chrome as non-privileged

#USER chrome
#ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

#ENV CHROMIUM_PATH /usr/bin/chromium-browser

WORKDIR /usr/apps/scraper

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]
