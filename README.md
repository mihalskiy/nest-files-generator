## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API endpoints

| APIs | VERB | Parameters | Description |
| --- | --- | --- | --- |
| /generate-document | POST | let parameters  | file-generator |

```
parameters = hotel: string,
             formData: {
                 files: {
                   label: string
                   images: Array<string>
                   required: boolean
                 },
                 guestDetails: [
                   label: string
                   value: string
                 ],
                 checkbox: [{
                    id: string,
                    text: string,
                    value: boolean
                 }],
                signature: {
                    value: string,
                    label: string,
                },
             },
             checkedInAt: Date,
             checkedOutAt: Date,
             convertType: string

```

