[**seniorlearnfrontend v1.0.0**](../README.md)

***

[seniorlearnfrontend](../README.md) / DoublyLinkedList

# Class: DoublyLinkedList

Defined in: [helper.tsx:22](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/helper.tsx#L22)

## Constructors

### Constructor

> **new DoublyLinkedList**(): `DoublyLinkedList`

#### Returns

`DoublyLinkedList`

## Properties

### head

> **head**: `null` \| [`ListNode`](ListNode.md) = `null`

Defined in: [helper.tsx:23](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/helper.tsx#L23)

***

### length

> **length**: `number` = `0`

Defined in: [helper.tsx:25](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/helper.tsx#L25)

***

### tail

> **tail**: `null` \| [`ListNode`](ListNode.md) = `null`

Defined in: [helper.tsx:24](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/helper.tsx#L24)

## Methods

### buildFromArray()

> **buildFromArray**(`arr`): `void`

Defined in: [helper.tsx:54](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/helper.tsx#L54)

Defines function to build an array.

#### Parameters

##### arr

`object`[]

#### Returns

`void`

***

### getNodeById()

> **getNodeById**(`id`): `null` \| [`ListNode`](ListNode.md)

Defined in: [helper.tsx:67](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/helper.tsx#L67)

Defines function to get a node by its Id.

#### Parameters

##### id

`string`

#### Returns

`null` \| [`ListNode`](ListNode.md)

Null

***

### insertAtEnd()

> **insertAtEnd**(`id`, `title`, `datetime`, `content`): `void`

Defined in: [helper.tsx:35](https://github.com/SeniorLearnSSJ/SLearnMobAppsFrontend/blob/e7fab732a0ff1bf0dfc0d090a0055a951040816f/helper.tsx#L35)

Defines function to insert sets of data at end of DoublyLinkedList.

#### Parameters

##### id

`string`

##### title

`string`

##### datetime

`Date`

##### content

`string`

#### Returns

`void`
