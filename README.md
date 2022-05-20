
# API - Share A Meal

In this repository I tried to recreate the Share A Meal API that I've used in my previous project [Share A Meal App](https://github.com/CKleijn/ShareAMeal).


## Features

#### Authentication
- Login as user
#### User
- Get all users
- Register new user
- Get user profile
- Get single user
- Update user
- Delete user
#### Meal
- Get all meals
- Register new meal
- Get single meal
- Update meal
- Delete meal
- Participate in meal
## API Reference

#### Login as user

```http
  GET /api/auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `emailAdress` | `string` | **Required** |
| `password` | `string` | **Required** |

#### Get all users

```http
  GET /api/user
```
| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

#### Register new user

```http
  POST /api/user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `firstName` | `string` | **Required** |
| `lastName` | `string` | **Required** |
| `street` | `string` | **Required** |
| `city` | `string` | **Required** |
| `password` | `string` | **Required** |
| `emailAdress` | `string` | **Required / Match regex** |
| `phoneNumber` | `string` | **Required / Match regex** |

#### Get user profile

```http
  GET /api/user/:userId/profile
```
| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `number` | **Required in URL** |

#### Get single user

```http
  GET /api/user/:userId
```
| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `number` | **Required in URL** |

#### Update user

```http
  PUT /api/user/:userId
```
| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `number` | **Required in URL** |
| `firstName` | `string` |  |
| `lastName` | `string` |  |
| `street` | `string` | |
| `city` | `string` |  |
| `password` | `string` | **Match regex** |
| `emailAdress` | `string` | **Required / Match regex** |
| `phoneNumber` | `string` | **Match regex** |

#### Delete user

```http
  DELETE /api/user/:userId
```
| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `number` | **Required in URL** |

#### Get all meals

```http
  GET /api/meal
```

#### Register new meal

```http
  POST /api/meal
```
| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required** |
| `description` | `string` | **Required** |
| `isVega` | `boolean / number` | **Required** |
| `isVegan` | `boolean / number` | **Required** |
| `isToTakeHome` | `boolean / number` | **Required** |
| `dateTime` | `string` | **Required** |
| `imageUrl` | `string` | **Required** |
| `allergenes` | `object` | **Required** |
| `maxAmountOfParticipants` | `number` | **Required** |
| `price` | `number` | **Required** |

#### Get single meal

```http
  GET /api/meal/:mealId
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mealId` | `number` | **Required in URL** |

#### Update meal

```http
  PUT /api/meal/:mealId
```
| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mealId` | `number` | **Required in URL** |
| `name` | `string` | **Required** |
| `description` | `string` | |
| `isVega` | `boolean / number` | |
| `isVegan` | `boolean / number` | |
| `isToTakeHome` | `boolean / number` | |
| `dateTime` | `string` | |
| `imageUrl` | `string` | |
| `allergenes` | `object` | |
| `maxAmountOfParticipants` | `number` | **Required** |
| `price` | `number` | **Required** |

```http
  DELETE /api/meal/:mealId
```
| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mealId` | `number` | **Required in URL** |

```http
  GET /api/meal/:mealId/participate
```

| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mealId` | `number` | **Required in URL** |


## Tech Stack

**Server:** Node, Express


## FAQ

#### Why are emailAdress and allergenes misspelled?

This is because our teacher made a mistake in his test tool, so now we have to use the current words instead of emailAddress and allergens.


## Authors

- [@CKleijn](https://www.github.com/CKleijn)

