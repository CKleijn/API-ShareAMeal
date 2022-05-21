
# API - Share A Meal

In this repository I recreate the Share A Meal API that I've used in my previous project [Share A Meal App](https://github.com/CKleijn/ShareAMeal).

## Features

#### Authentication
- Login as user
#### User
- Get all users
- Get all users with filters
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
- Unsubscribe from meal

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

#### Get all users with filters

```http
  GET /api/user?parameterOne=Value1&parameterTwo=Value2
```
It's possible to filter on **MAX 2** parameters in the same URL. 
It's also possible to only filter on 1 parameter. The available parameters are written down under below.
| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `firstName` | `string` | **Optional** |
| `lastName` | `string` | **Optional** |
| `isActive` | `boolean / number` | **Optional** |
| `street` | `string` | **Optional** |
| `city` | `string` | **Optional** |
| `emailAdress` | `string` | **Optional** |
| `phoneNumber` | `string` | **Optional** |
| `limit` | `number` | **Optional** |

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
| `password` | `string` | **Required / Match regex** |
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
| `firstName` | `string` | **Optional** |
| `lastName` | `string` | **Optional** |
| `street` | `string` | **Optional** |
| `city` | `string` | **Optional** |
| `password` | `string` | **Optional / Match regex** |
| `emailAdress` | `string` | **Required / Match regex** |
| `phoneNumber` | `string` | **Optional / Match regex** |

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
| `description` | `string` | **Optional** |
| `isVega` | `boolean / number` | **Optional** |
| `isVegan` | `boolean / number` | **Optional** |
| `isToTakeHome` | `boolean / number` | **Optional** |
| `dateTime` | `string` | **Optional** |
| `imageUrl` | `string` | **Optional** |
| `allergenes` | `object` | **Optional** |
| `maxAmountOfParticipants` | `number` | **Required** |
| `price` | `number` | **Required** |

#### Delete meal

```http
  DELETE /api/meal/:mealId
```
| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mealId` | `number` | **Required in URL** |

#### Participate meal

```http
  GET /api/meal/:mealId/participate
```

| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mealId` | `number` | **Required in URL** |

#### Unsubscribe meal

```http
  GET /api/meal/:mealId/participate
```

| Header | Type     | Description                |
| :----- | :------- | :------------------------- |
| `token` | `bearer` | **Required** |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mealId` | `number` | **Required in URL** |

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`JWT_SECRET`
`DB_HOST`
`DB_PORT`
`DB_USER`
`DB_PASSWORD`
`DB_DATABASE`

## Installation

In order for the application to work you'll need to create a MySQL database. The script *(share-a-meal.create.sql)* is needed to create the database. The script *(share-a-meal.sql)* is needed to fill your database with the fitting tables is given in the project.

Clone the project

```bash
  git clone https://github.com/CKleijn/API-ShareAMeal
```

Go to the project directory

```bash
  cd API-ShareAMeal
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## FAQ

#### Why are *emailAdress* and *allergenes* misspelled?

This is because our teacher made a mistake in his test tool, so now we have to use the current words instead of emailAddress and allergens.


## Authors

- [@CKleijn](https://www.github.com/CKleijn)

