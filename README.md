# golang-lambda

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Golang Gin Lambda Deployed using AWS CDK.

## Prerequisites

- AWS CLI Configuration
- AWS CDK
- GO
- Docker

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
