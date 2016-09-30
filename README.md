# loopback-connector-docusign

## Usage

1. Add the following to your `.env`

  ```bash
  DOCUSIGN_INTEGRATOR_KEY=********-****-******-************
  DOCUSIGN_EMAIL=user@test.com
  DOCUSIGN_PASSWORD=*******
  DOCUSIGN_ENV=demo
  ```

1. Call `sendTemplatedDocument` from somewhere (models maybe?)

  ```typescript
  interface IRecipient {
    email: string;
    name: string;
    role: string;
  }

  Loopback.Docusign.sendTemplatedDocument(template: {id: string}, recipient: IRecipient, message: {subject: string}): Promise<void>;
  ```
