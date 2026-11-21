FROM php:8.4-cli-alpine

# Copia o executável do Composer da imagem oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN apk add --no-cache \
    git \
    unzip \
    libzip-dev \
    oniguruma-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install pdo_mysql mbstring bcmath zip gd exif

# A API aceita até 5 fotos de 5 MB e até 6000x6000 px; o padrão do PHP corta em 2 MB e 128 MB de memória
RUN printf "upload_max_filesize=6M\npost_max_size=32M\nmemory_limit=256M\n" > /usr/local/etc/php/conf.d/uploads.ini

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-scripts --no-autoloader

COPY . .
RUN composer dump-autoload --optimize

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]