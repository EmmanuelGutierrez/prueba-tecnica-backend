## Description

Prueba tecnica backend con nest de Emmanuel Gutierrez

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentacion con swagger

```bash
localhost:3000/api
```

## Levantar con docker

```bash
# 1-Buildear el proyecto
$ docker build -t prueba-tecnica-backend .

# 2-Levantar el proyecto
$ docker run --rm -p 3000:3000 prueba-tecnica-backend
```

## Importante.

```bash
# El endpoint usuario/getAllSecure hace lo mismo que usuario/getAll pero para usarlo hay que hacer login en auth/login con los siguientes datos
{
    "correo_electronico":"emma.g2705@gmail.com",
    "password":"123456"
}

```
