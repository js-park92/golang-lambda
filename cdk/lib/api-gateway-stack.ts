import { Construct, Stack, StackProps } from "@aws-cdk/core";
import {
  HttpApi,
  IHttpRouteAuthorizer,
  PayloadFormatVersion,
} from "@aws-cdk/aws-apigatewayv2";
import { LambdaProxyIntegration } from "@aws-cdk/aws-apigatewayv2-integrations";
import { GoFunction } from "@aws-cdk/aws-lambda-go";
import * as path from "path";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers";

/**
 * Rest Api Options
 * @extends StackProps
 * @property {string} identityProvider    - Name of the identity provider
 * @property {string} identityIssuerUrl   - URL for the identity issuer
 * @property {string[]} identityAudience  - List of the identity audiences
 */
interface RestApiStackProps extends StackProps {
  /**
   * @example <caption>Name of the identity provider</caption>
   * { identityProvider: "okta" }
   */
  identityProvider?: string;
  /**
   * @example <caption>URL for the identity issuer</caption>
   * { identityIssuerUrl: "https://dev-1234.okta.com/oauth2/default" }
   */
  identityIssuerUrl?: string;
  /**
   * @example <caption>List of the identity audiences</caption>
   * { identityProvider: ["api://default"] }
   */
  identityAudience?: string[];
}

export class RestApiStack extends Stack {
  constructor(scope: Construct, id: string, props: RestApiStackProps) {
    super(scope, id, props);

    const api = new HttpApi(this, `${id}-http-api`, {
      corsPreflight: {
        // Only allow https protocol
        allowOrigins: ["https://*"],
      },
    });

    let authorizer;

    if (
      props.identityAudience &&
      props.identityIssuerUrl &&
      props.identityProvider
    ) {
      authorizer = new HttpJwtAuthorizer({
        authorizerName: props.identityProvider,
        jwtIssuer: props.identityIssuerUrl,
        jwtAudience: props.identityAudience,
      });
    }

    // User endpoint
    this.addService(api, "users", authorizer);

    // Organization endpoint
    // this.addService(api, "organizations");
  }

  addService(api: HttpApi, name: string, auth?: IHttpRouteAuthorizer) {
    const serviceLambda = new GoFunction(this, `${name}-service`, {
      entry: path.join(__dirname, `../../services/${name}`),
    });
    const serviceIntegration = new LambdaProxyIntegration({
      handler: serviceLambda,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
    });
    const scopes = JSON.parse(
      process.env[`${name.toUpperCase()}_SCOPES`] || "[]"
    );
    const props = {
      integration: serviceIntegration,
      authorizer: auth,
      authorizationScopes: scopes,
    };
    // proxy route
    api.addRoutes({
      path: `/${name}/{proxy+}`,
      ...props,
    });
    // root route
    api.addRoutes({
      path: `/${name}`,
      ...props,
    });
  }
}
