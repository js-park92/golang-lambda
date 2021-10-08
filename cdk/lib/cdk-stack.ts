import * as cdk from "@aws-cdk/core";
import { config } from "dotenv";
import { RestApiStack } from "./api-gateway-stack";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    config();

    const { IDENTITY_PROVIDER, IDENTITY_ISSUER_URL, IDENTITY_AUDIENCE } =
      process.env;

    // Create API Stack
    new RestApiStack(this, "app-name", {
      identityProvider: IDENTITY_PROVIDER!,
      identityIssuerUrl: IDENTITY_ISSUER_URL!,
      identityAudience: JSON.parse(IDENTITY_AUDIENCE!),
      ...props,
    });

    // DynamoDB
  }
}
