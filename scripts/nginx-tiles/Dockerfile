# Build context esperado (montado pelo scripts/gerar-tiles-dhn.sh, NUNCA commitado):
#   Dockerfile, nginx.conf, styles/  <- deste diretório do repo (público, sem imagem de carta)
#   tiles/dhn-guanabara/{z}/{x}/{y}.png  <- gerado localmente, fora do git (dado sob restrição da DHN)
FROM nginx:1.27-alpine

ARG TILES_HOST
ARG BASIC_AUTH_USER
ARG BASIC_AUTH_PASS

RUN apk add --no-cache apache2-utils \
    && htpasswd -cb /etc/nginx/.htpasswd "${BASIC_AUTH_USER}" "${BASIC_AUTH_PASS}"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY styles/seamark.json /usr/share/nginx/html/styles/seamark.json
COPY styles/dhn-guanabara.json.template /tmp/dhn-guanabara.json.template
COPY tiles/dhn-guanabara /usr/share/nginx/html/tiles/dhn-guanabara

RUN mkdir -p /usr/share/nginx/html/styles \
    && sed "s#__TILES_HOST__#${TILES_HOST}#g" /tmp/dhn-guanabara.json.template > /usr/share/nginx/html/styles/dhn-guanabara.json \
    && rm /tmp/dhn-guanabara.json.template
