[**seniorlearnfrontend v1.0.0**](../README.md)

***

[seniorlearnfrontend](../README.md) / ApiLogin

# Function: ApiLogin()

> **ApiLogin**(`username`, `password`): `Promise`\<\{ `message?`: `string`; `role?`: `string`; `success`: `boolean`; `token?`: `string`; \}\>

Defined in: [api.ts:143](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/api.ts#L143)

Defines ApiLogin function.  Sends login request to backend via sign-in endpoint.

## Parameters

### username

`string`

### password

`string`

## Returns

`Promise`\<\{ `message?`: `string`; `role?`: `string`; `success`: `boolean`; `token?`: `string`; \}\>

An object with succcess (Boolean), token (string), role (string), message (string)
