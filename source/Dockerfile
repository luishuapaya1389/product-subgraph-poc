# -------- Base de runtime ultra liviana --------
FROM node:20-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

# -------- Etapa de deps (solo prod) --------
FROM base AS deps
# Copiamos solo archivos de deps para aprovechar cache
COPY package.json package-lock.json* ./
# Instala solo dependencias de producción (sin dev)
RUN npm ci --omit=dev

# -------- Etapa final (runtime) --------
FROM base AS runner
# Crea un usuario no root (ya existe 'node' en imagen oficial)
USER node

# Copia node_modules desde deps preservando ownership
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
# Copia el código (solo lo necesario)
COPY --chown=node:node index.js schema.graphql ./

# Puerto del subgrafo product
ENV PORT=4011
EXPOSE 4011

# Opcional: variables de zona horaria/locale (si las necesitas)
# ENV TZ=Etc/UTC

# Arranque
CMD ["node", "index.js"]