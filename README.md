# golang-lambda

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Golang Gin Lambda Deployed using AWS CDK.

## Prerequisites

- AWS CLI Configuration
- AWS CDK
- GO
- Docker
#
## Getting Started

In order to deploy the stack to AWS, use CDK CLI within `cdk` folder.

```bash
cd cdk
cdk synth
cdk deploy --all
```

All the Go codes are located in services folder. Use `GoServiceLambda` function to add another micro service within `cdk/lib/api-gateway-stack.ts` file.

User Endpoint Example:

```ts
this.addService(api, "SERVICE_NAME");
```

#
## Adding Third Party Authorization
Using thrid party IDP service for authoization. (e.g. Okta, Auth0)

```bash
cd cdk
cp .env.example .env
```

Edit `.env` file according to your IDP setup.

```
# Okta example
IDENTITY_PROVIDER=okta
IDENTITY_ISSUER_URL=dev-1234.okta.com/oauth2/default
IDENTITY_AUDIENCE=["api://default"]
```

Protect specific endpoints using scopes in `cdk/lib/api-gateway-stack.ts` by adding a environment variable. Scopes will default to empty array when no environment variable is provided.

```
# User Service Scopes
USERS_SCOPES=["user:write"]
# Organizations Service Scopes
ORGANIZATIONS_SCOPES=["org:admin"]
```