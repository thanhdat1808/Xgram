# Xgram
# Clone project
...
# Dependencies
- Node >= 16
# Run project
- Install package
```
npm i
```
- Copy .env
```
cp .env.example .env.local // for run local

cp .env.example .env.dev // for run docker
```
- Build src
```
npm run build
```
- Run local:
```
docker-compose up -D mongo //create DB
npm run start:local
```
- Run docker:
```
docker-compose up
```
# Test
```
curl localhost:3000 //response example: OK!
```
# Structure
```
src
├── app.ts
├── config
│   └── index.ts
├── controllers
│   ├── auth.controller.ts
│   ├── conversations.controller.ts
│   ├── index.controller.ts
│   ├── notifications.controller.ts
│   ├── posts.controller.ts
│   ├── stories.controller.ts
│   ├── uploads.controller.ts
│   └── users.controller.ts
├── databases
│   └── index.ts
├── dtos
│   ├── conversations.dto.ts
│   ├── posts.dto.ts
│   ├── stories.dto.ts
│   └── users.dto.ts
├── exceptions
│   └── HttpException.ts
├── http
│   ├── auth.http
│   └── users.http
├── interfaces
│   ├── auth.interface.ts
│   ├── conversations.interface.ts
│   ├── messages.interface.ts
│   ├── notifications.interface.ts
│   ├── posts.interface.ts
│   ├── routes.interface.ts
│   ├── stories.interface.ts
│   ├── token.interface.ts
│   └── users.interface.ts
├── logs
│   ├── debug
│   │   └── 2023-09-26.log
│   └── error
│       └── 2023-09-26.log
├── middlewares
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validation.middleware.ts
├── models
│   ├── comments.model.ts
│   ├── conversations.model.ts
│   ├── message.model.ts
│   ├── notif.model.ts
│   ├── posts.model.ts
│   ├── resetpassword.model.ts
│   ├── stories.model.ts
│   ├── token.model.ts
│   └── users.model.ts
├── routes
│   ├── auth.route.ts
│   ├── conversations.route.ts
│   ├── index.route.ts
│   ├── notifications.router.ts
│   ├── posts.route.ts
│   ├── stories.route.ts
│   ├── upload.route.ts
│   └── users.route.ts
├── server.ts
├── services
│   ├── auth.service.ts
│   ├── conversations.service.ts
│   ├── notifications.service.ts
│   ├── posts.service.ts
│   ├── stories.service.ts
│   ├── uploads.service.ts
│   └── users.service.ts
├── socket
│   ├── events.ts
│   ├── index.socket.ts
│   └── socketTypes.ts
├── tests
│   ├── auth.test.ts
│   ├── index.test.ts
│   └── users.test.ts
└── utils
    ├── custom-error.ts
    ├── custom-response.ts
    ├── formatData.ts
    ├── logger.ts
    ├── sendMail.ts
    ├── statuscode.ts
    ├── util.ts
    └── validateEnv.ts
```