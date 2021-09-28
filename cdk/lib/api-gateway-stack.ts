import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { RestApi, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { Code, Function as Lambda, Runtime } from "@aws-cdk/aws-lambda";
import * as path from "path";

export class RestApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, `${id}-stack`);

    // User endpoint
    const userService = api.root.addResource("users");
    const userServiceLambda = this.GoServiceLambda(
      this,
      "user-service",
      path.join(__dirname, "../../services/users")
    );
    const userServiceIntegration = new LambdaIntegration(userServiceLambda);
    userService.addProxy({
      anyMethod: true,
      defaultIntegration: userServiceIntegration,
    });

    // Organization endpoint
    // const organizationService = api.root.addResource("organizations");
  }

  GoServiceLambda(scope: Construct, id: string, path: string) {
    return new Lambda(scope, id, {
      handler: "main",
      code: Code.fromAsset(path, {
        bundling: {
          image: Runtime.GO_1_X.bundlingImage,
          user: "root",
          environment: {
            CGO_ENABLED: "0",
            GOOS: "linux",
            GOARCH: "amd64",
          },
          command: [
            "bash",
            "-c",
            ["make vendor", "make lambda-build"].join(" && "),
          ],
        },
      }),
      runtime: Runtime.GO_1_X,
    });
  }
}
