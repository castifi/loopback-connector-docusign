# loopback-connector-docusign-example

This is an example project using the Docusign Loopback connector. **It doesn't work right now**

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
