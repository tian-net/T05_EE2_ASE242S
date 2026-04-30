# Usamos una imagen ligera de Nginx
FROM nginx:stable-alpine

# Copiamos el contenido de tu carpeta dist a la carpeta que Nginx usa para servir archivos
COPY dist /usr/share/nginx/html

# Copiamos una configuración personalizada de Nginx (opcional pero recomendada para rutas)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]