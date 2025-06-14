[**seniorlearnfrontend v1.0.0**](../README.md)

***

[seniorlearnfrontend](../README.md) / ItemContextType

# Type Alias: ItemContextType

> **ItemContextType** = `object`

Defined in: [types.ts:53](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L53)

This defines the shape of the ItemContextType, which contains constants and functions which were shared throughout the app.

## Properties

### bulletins

> **bulletins**: [`IItem`](../interfaces/IItem.md)[]

Defined in: [types.ts:54](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L54)

***

### deleteBulletin()

> **deleteBulletin**: (`id`) => `void`

Defined in: [types.ts:56](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L56)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### deleteOfficialBulletins()

> **deleteOfficialBulletins**: (`id`) => `void`

Defined in: [types.ts:61](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L61)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### fontSize

> **fontSize**: `number`

Defined in: [types.ts:64](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L64)

***

### loadingMember

> **loadingMember**: `boolean`

Defined in: [types.ts:62](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L62)

***

### loadingOfficial

> **loadingOfficial**: `boolean`

Defined in: [types.ts:63](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L63)

***

### officialBulletinList

> **officialBulletinList**: [`DoublyLinkedList`](../classes/DoublyLinkedList.md)

Defined in: [types.ts:57](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L57)

***

### officialBulletins

> **officialBulletins**: [`IOfficialBulletin`](../interfaces/IOfficialBulletin.md)[]

Defined in: [types.ts:59](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L59)

***

### refreshBulletins()

> **refreshBulletins**: () => `Promise`\<`void`\>

Defined in: [types.ts:66](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L66)

#### Returns

`Promise`\<`void`\>

***

### saveBulletins()

> **saveBulletins**: (`item`) => `void`

Defined in: [types.ts:55](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L55)

#### Parameters

##### item

[`IItem`](../interfaces/IItem.md)

#### Returns

`void`

***

### saveOfficialBulletins()

> **saveOfficialBulletins**: (`item`) => `void`

Defined in: [types.ts:60](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L60)

#### Parameters

##### item

[`IOfficialBulletin`](../interfaces/IOfficialBulletin.md)

#### Returns

`void`

***

### setFontSize()

> **setFontSize**: (`size`) => `void`

Defined in: [types.ts:65](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/types.ts#L65)

#### Parameters

##### size

`number`

#### Returns

`void`
