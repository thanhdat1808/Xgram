# Common build stage
FROM node:14.20-alpine as common-build-stage

WORKDIR /node/app

COPY package.json package-lock.json ./
# RUN npm cache clean --force
RUN npm i || npm i

COPY . .

RUN npm run build

EXPOSE 3000

# Development build stage
# FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["npm", "run", "start"]
# CMD ["tail", "-f"]

# # Production build stage
# FROM common-build-stage as production-build-stage

# ENV NODE_ENV production

# CMD ["npm", "run", "start"]
