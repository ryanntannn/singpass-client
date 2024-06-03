![alt](./res/btn.svg)

# `singpass-client`

![NPM Version](https://img.shields.io/npm/v/%40ndisg%2Fsingpass-client) [![install size](https://packagephobia.com/badge?p=@ndisg/singpass-client)](https://packagephobia.com/result?p=@ndisg/login-with-singpass-button)

`singpass-client` is a lightweight client that helps your JS/TS backend to perform the Singpass Authentication flow.

## Usage

1. Install the package

```zsh
npm install @ndisg/singpass-client
```

2. Initialize your `SingpassClient`

```TS
// In your backend
import { SingpassClient } from "@ndisg/singpass-client";

const singpassClient = SingpassClient.fromConfig({
	clientId: "<YOUR-CLIENT-ID>",
	clientSecret: "<YOUR-CLIENT-SECRET>",
	redirectUri: "<YOUR-REDIRECT-URI>",
});
```

3. You can now build a client assertion url with ease!

```TS
// In your backend
// URL object to be called to perform client assertion flow.
const clientAssertionUrl = await client.buildClientAssertionURL("test-code");
```
