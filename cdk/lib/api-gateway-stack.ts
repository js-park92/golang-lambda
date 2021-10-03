import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { HttpApi, PayloadFormatVersion } from "@aws-cdk/aws-apigatewayv2";
import { LambdaProxyIntegration } from "@aws-cdk/aws-apigatewayv2-integrations";
import { GoFunction } from "@aws-cdk/aws-lambda-go";
import * as path from "path";

export class RestApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new HttpApi(this, `${id}-stack`, {
      corsPreflight: {
        allowOrigins: ["*"],
      },
    });

    // User endpoint
    this.addService(api, "users");

    // Organization endpoint
    // this.addService(api, "organizations");
  }

  addService(api: HttpApi, name: string) {
    const serviceLambda = new GoFunction(this, `${name}-service`, {
      entry: path.join(__dirname, `../../services/${name}`),
    });
    const serviceIntegration = new LambdaProxyIntegration({
      handler: serviceLambda,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
    });
    api.addRoutes({
      path: `/${name}/{proxy+}`,
      integration: serviceIntegration,
    });
    api.addRoutes({
      path: `/${name}`,
      integration: serviceIntegration,
    });
  }
}
