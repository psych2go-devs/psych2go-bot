# Psych2Go Bot

Psych2Go Bot (Psi) does useful and fun stuff writen in [TypeScript][typescript-webpage] ([JavaScript][javascript-webpage]) ([NodeJS][nodejs-webpage])

# How does this work?

Clone this project using `git`

```
git clone https://github.com/psych2go-devs/psych2go-bot
```

Change directory to the project (`cd psych2go-bot/`), then run the following command to install dependencies

```
npm i
```

If you are using this project to host a bot, jump to the [Deploying](#deploying)

## Contributing

In [src/](src/) contains the source codes of the bot. They are writen in [TypeScript][typescript-webpage]; it's similar to [JavaScript][javascript-webpage], you can add type to variable, class, etc. You can make change in the directory.

In [dist/](dist/) will contain compiled codes from [src/](src/). Do not make change on this directory hence they will be replaced will new codes after you compile the codes.

### Compile Codes

```
npm run build
```

This will compile TypeScript codes from [src/](src/) into JavaScript codes and save the output to [dist/](dist/), but will not start the bot after the process.

### Start Bot Without Compiling Codes

```
node .
```

or

```
npm start
```

This will run the codes on [dist/](dist/) without compiling the codes on [src/](src/). If you haven't compile/build the codes before, this will throw an error.

### Compile and Start Bot

```
npm run dev
```

This will compile TypeScript codes from [src/](src/) into JavaScript codes and save the output to [dist/](dist/), then run the codes on [dist/](dist/) automatically after the process.

## Deploying

Copy [.env.example](.env.example) to .env and edit variables, then run the following command:

```
npm run build
```

This will compile the source codes. You should run the command at least once. After that, use the following command to start the bot:

```
node .
```

To stop the bot, send a `SIGINT` to the script (press Ctrl - C).

# License

See [LICENSE](LICENSE)

[javascript-webpage]: https://www.javascript.com/
[typescript-webpage]: https://www.typescriptlang.org/
[nodejs-webpage]: https://nodejs.org/en/
