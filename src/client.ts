import { JWK, JWTHeaderParameters, KeyLike, SignJWT, importJWK } from "jose";

/**
 * SingpassClientConfig is a configuration object for SingpassClient
 */
export type SingpassClientConfig = {
  /**
   * The client ID provided by the Singpass Developer Portal
   */
  clientId: string;
  /**
   * Private key from your JWKS key pair. **Note:** This is a secret and should not be shared. Generate a new key pair if you suspect a leak.
   */
  clientSecret: string | JWK;
  /**
   * The redirect URI that Singpass will redirect back to after the user has authenticated
   */
  redirectUri: string;
  /**
   * Whether to use the staging environment. Defaults to `true`.
   */
  stg?: boolean;
  /**
   * The kid of the key in the JWKS key pair.
   */
  kid?: string;
};

/**
 * SingpassClient is a client for Singpass API
 */
export class SingpassClient {
  clientId: string;
  clientSecret: string | JWK;
  redirectUri: string;
  host: string;
  kid?: string;
  /**
   * Create a new SingpassClient instance from a configuration object
   * @param config - The configuration object
   * @returns A new SingpassClient instance
   */
  static fromConfig(config: SingpassClientConfig) {
    return new SingpassClient(config);
  }

  constructor(config: SingpassClientConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.host =
      config.stg === false
        ? "https://id.singpass.gov.sg"
        : "https://stg-id.singpass.gov.sg";
    this.kid = config.kid;
  }

  /**
   * Generate an assertion JWT as part of the JWT Assertion flow.
   */
  async generateAssertionJWT() {
    const header = {
      typ: "JWT",
      alg: "ES256",
      kid: this.kid,
    } satisfies JWTHeaderParameters;

    const secretKey = await importJWK(
      typeof this.clientSecret === "string"
        ? JSON.parse(this.clientSecret)
        : this.clientSecret
    );

    const jwt = await new SignJWT()
      .setProtectedHeader(header)
      .setIssuer(this.clientId)
      .setAudience(this.host)
      .setSubject(this.clientId)
      .setIssuedAt()
      .setExpirationTime("2m")
      .sign(secretKey);

    return jwt;
  }

  /**
   * Builds a client assertion URL using the auth code from
   */
  async buildClientAssertionURL(code: string, state?: string) {
    const token = await this.generateAssertionJWT();
    const url = new URL(this.host);
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("redirect_uri", this.redirectUri);
    url.searchParams.set("code", code);
    url.searchParams.set(
      "client_assertion_type",
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
    );
    url.searchParams.set("grant_type", "authorization_code");
    url.searchParams.set("client_assertion", token);
    if (state) {
      url.searchParams.set("state", state);
    }
    return url;
  }
}
