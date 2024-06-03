import { SingpassClient } from "../src/client";

describe("SingpassClient", () => {
  test("can be constructed", () => {
    const client = new SingpassClient({
      clientId: "test-client-id",
      clientSecret: {
        kty: "EC",
        d: "0GlHbGc8vSnyiB-Lf4_im_WFwrxM0MJjkk96o1-K3JQ",
        crv: "P-256",
        x: "wg11s6ZpBc0my5gT-mYatTZRDhgStyd_0qARVBwAWa4",
        y: "hlVoYWwlCuTMnm79Ppmf3RslIwDRhqdCCnm01PkhA2s",
      },
      redirectUri: "http://localhost:3000/callback",
    });
    expect(client).toBeTruthy();
  });

  test("can be created from config", () => {
    const client = SingpassClient.fromConfig({
      clientId: "test-client-id",
      clientSecret: {
        kty: "EC",
        d: "0GlHbGc8vSnyiB-Lf4_im_WFwrxM0MJjkk96o1-K3JQ",
        crv: "P-256",
        x: "wg11s6ZpBc0my5gT-mYatTZRDhgStyd_0qARVBwAWa4",
        y: "hlVoYWwlCuTMnm79Ppmf3RslIwDRhqdCCnm01PkhA2s",
      },
      redirectUri: "http://localhost:3000/callback",
    });
    expect(client).toBeTruthy();
  });

  test("can generate a valid assertion JWT", async () => {
    const client = SingpassClient.fromConfig({
      clientId: "test-client-id",
      clientSecret: {
        kty: "EC",
        d: "0GlHbGc8vSnyiB-Lf4_im_WFwrxM0MJjkk96o1-K3JQ",
        crv: "P-256",
        x: "wg11s6ZpBc0my5gT-mYatTZRDhgStyd_0qARVBwAWa4",
        y: "hlVoYWwlCuTMnm79Ppmf3RslIwDRhqdCCnm01PkhA2s",
      },
      redirectUri: "http://localhost:3000/callback",
    });

    const jwt = await client.generateAssertionJWT();
    expect(jwt).toBeTruthy();
  });

  test("can build a valid assertion URL", async () => {
    const client = SingpassClient.fromConfig({
      clientId: "test-client-id",
      clientSecret: {
        kty: "EC",
        d: "0GlHbGc8vSnyiB-Lf4_im_WFwrxM0MJjkk96o1-K3JQ",
        crv: "P-256",
        x: "wg11s6ZpBc0my5gT-mYatTZRDhgStyd_0qARVBwAWa4",
        y: "hlVoYWwlCuTMnm79Ppmf3RslIwDRhqdCCnm01PkhA2s",
      },
      redirectUri: "http://localhost:3000/callback",
    });

    const url = await client.buildClientAssertionURL("test-code");
    expect(url.searchParams.get("client_id")).toBe("test-client-id");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "http://localhost:3000/callback"
    );
    expect(url.hostname).toBe("stg-id.singpass.gov.sg");
    expect(url.searchParams.get("code")).toBe("test-code");
    expect(url.searchParams.get("client_assertion")).toBeTruthy();
    expect(url.searchParams.get("grant_type")).toBe("authorization_code");
    expect(url.searchParams.get("client_assertion_type")).toBe(
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
    );
  });
});
