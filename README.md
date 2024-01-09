## Descrição

Seu Barriga é um integrador de serviços de pagamento que é utilizado em alguns sites. O objetivo desse projeto é juntar serviços de pagamento como Stripe, Binance ou qualquer outro do que venha a ser conveniente. A necessidade de um projeto como esse se dá devido ao fato de alguns gateways de pagamento terem certas limitações, como: alguns tipos de produtos que são proíbidos dentro das plataformas ou plataformas que são restritos em alguns países (o que se aplica ao binanace pay tem restrições nos EUA, Canadá e UE).
### Como configurar o projeto

```
$ git clone https://github.com/m4theuspereira-maker/seu-barriga
```

```
$ npm run build
```

```
$ npm run i
```

### Para iniciar o da plasta dist

```
$ npm start
```

### Para inicar o projeto em modo desenvolvimento

```
$ npm run dev
```

### Para executar todas as suites de teste

```
$ npm test
```

### Para executar apenas os testes que estão relacionados aos arquivos modificados

(saiba mais em: https://vitest.dev/guide/)

```
$ npm run test:watch
```

### Para executar todas as suites e gerar um arquivo com as informações de cobertura de teste

```
$ npm run test:coverage
```

### Para iniciar o projeto a partir do docker

(saiba mais em: https://docs.docker.com/get-started/ and https://docs.docker.com/compose/gettingstarted/)

```
$ docker-compose up
```