# loopback-connector-docusign-example

This is an example project using the Docusign Loopback connector. **It doesn't work right now**

## Current problems

I'm basing the design of this connector on the [Sendgrid](https://www.npmjs.com/package/loopback-connector-sendgrid) and [Twilio](https://www.npmjs.com/package/loopback-connector-twilio) connectors. To use them, you add a new `datasource` to [`datasources.json`](https://github.com/castifi/loopback-connector-docusign/blob/master/example/server/datasources.json), and add a `model` to [`model-config.json`](https://github.com/castifi/loopback-connector-docusign/blob/master/example/server/model-config.json). Then, you should be able to access the API Sendgrid using

```typescript
Loopback.Email.send(senderInfo, callback: (err, res) => void);
```

Right now, Loopback is giving an error about not being able to find the Docusign model.

```bash
/Users/DudeOfAwesome/Github/loopback-connector-docusign/node_modules/loopback/lib/registry.js:310
  throw new Error(g.f('Model not found: %s', modelName));
        ^
Error: Model not found: Docusign
    at Registry.getModel (/Users/DudeOfAwesome/Github/loopback-connector-docusign/node_modules/loopback/lib/registry.js:310:9)
    at /Users/DudeOfAwesome/Github/loopback-connector-docusign/node_modules/loopback-boot/lib/executor.js:233:24
    at Array.forEach (native)
    at defineModels (/Users/DudeOfAwesome/Github/loopback-connector-docusign/node_modules/loopback-boot/lib/executor.js:228:23)
    at setupModels (/Users/DudeOfAwesome/Github/loopback-connector-docusign/node_modules/loopback-boot/lib/executor.js:196:3)
    at execute (/Users/DudeOfAwesome/Github/loopback-connector-docusign/node_modules/loopback-boot/lib/executor.js:39:3)
    at bootLoopBackApp (/Users/DudeOfAwesome/Github/loopback-connector-docusign/node_modules/loopback-boot/index.js:154:3)
    at Object.<anonymous> (/Users/DudeOfAwesome/Github/loopback-connector-docusign/example/server/server.js:22:1)
    at Module._compile (module.js:556:32)
    at Object.Module._extensions..js (module.js:565:10)
```

I believe this originates from [`server/model-config.json`](https://github.com/castifi/loopback-connector-docusign/blob/master/example/server/model-config.json#L36). I believe that Loopback is looking for a `Docusign.json` file inside of [`common/models`](https://github.com/castifi/loopback-connector-docusign/blob/master/example/common/models), which of course shouldn't have to exist.

## Running the example for yourself

1. Make sure you have a built copy of the connector in the build folder
1. Install the dependencies for this example

  ```bash
  $ npm install
  ```
1. Add a `.env` file with your Docusign credentials

  ```bash
  DOCUSIGN_INTEGRATOR_KEY=********-****-******-************
  DOCUSIGN_EMAIL=user@test.com
  DOCUSIGN_PASSWORD=*******
  DOCUSIGN_ENV=demo
  ```
1. start the server

  ```bash
  $ foreman run web
  ```
1. POST a `form_template` to the server, including a template ID from Docusign

  ```bash
  $ curl -X POST -H "Content-Type: application/json" -d '{"docusign_template_id": "*********-****-****-****-************", "id": 1}' "http://localhost:5000/api/form_templates/"
  ```
1. POST a user destination to `form_template/:id/send` to send the form

  ```bash
  $ curl -X POST -H "Content-Type: application/json" -d '[{"email":"to@example.com", "name":"John Appleseed", "role": "Signer"}]' "http://localhost:5000/api/form_templates/1/send"
  ```
