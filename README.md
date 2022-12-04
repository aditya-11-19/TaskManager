
# Task-Manager-API

- A REST API that enables to Create User Profile.
- It allows Users to Create, Read, Update and Delete Tasks.
- Only authenticated User would be able to execute various API requests.
- Users are able to upload their Profile Picture.
- When a New user Sign-up , A Welcome Mail is sent using SendGrid API.
- When the user Delete Their Account , A Good-Bye Mail is Sent.  
## Tech Stack

**Server:** `Node` ` Express` 

**Database:** `Mongo DB`

**Tools:** `VS code` ` Postman` ` Git`


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

| Variable |  Description                |
| :-------- | :------------------------- |
| `PORT` | Port number of Hosted Server |
| `MONGODB_URL` | Mongo DB Data-base URL |
| `JWT_SECRET` | Secret used to encrypt JWT |
| `SENDGRID_API_KEY` | API key for sendgrid API |
| `FROM_MAIL` |This mail is used to send e-mails through sendgrid  |


## Run Locally

Clone the project

```bash
  git clone https://github.com/Chaudhary456/Task-manager-api.git
```

Install dependencies

```bash
  npm install
```

**Make sure All Environment variables are defined in .env extension file**

Start the server after setting all the environment variables

```bash
  npm run dev
```
**Test the API through Postman or Browser**

## API Reference

#### Basics
| **Request** | All the requests are `http` request |
| :-------- | :------- |
| **Base URL** | `url` It must be replaced with your localhost URL or Production URL |


#### User Routes

| Mode      |Request   |Autherization   | Parameters                 | Body                       |  Description               |               
| :-------- | :------- | :-------| :------------------------- | :------------------------- | :------------------------- |
| `POST`    | `/users` | Not Required|                             | `name:string` `email:string` `password:string`  | This is to create New User |
| `POST`    | `/users/login` | Not Required |                            | `email:string` `password:string`  | This is to Login Existing User |
| `POST`    | `/users/logout` |   Required                         |  |  | Logs Out the current User |
| `GET`    | `/users/me` |   Required                         |  |  | Returns the current user details |
| `GET`    | `/users/logoutAll` |   Required                         |  |  | Logs Out from all Devices |
| `PATCH`    | `/users/me` |   Required                         |  | `Valid Update Fields` | Allows to update valid User fields  |
| `DELETE`    | `/users/me` |   Required                         |  |  | Delete the current User |

#### Task Routes

- **(All these Routes are for Autherized User Only i.e. These must be used after Login)**
- **(`id` in request must be replaced with task ID)**

| Mode      |Request   |Autherization   | Parameters                 | Body                       |  Description               |               
| :-------- | :------- | :-------| :------------------------- | :------------------------- | :------------------------- |
| `POST`    | `/tasks` |Required|                             | `description:string` `completed:Boolean`  | This is to create New Task |
| `GET`    | `/tasks` | Required | `sortBy` ` limit` `skip`                   |  | This is to Fetch All Tasks |
| `GET`    | `/tasks/` `id` |   Required                         |  |  | Returns Task with given ID |
| `PATCH`    | `/tasks/` `id` |   Required                         |  | `Valid Update Fields` | Allows to update valid Task fields for Given ID |
| `DELETE`    | `/tasks/` `id` |   Required                         |  |  | Delete the Task with given ID |


#### Additional Routes

- **(All these Routes are for Autherized User Only i.e. These must be used after Login)**


| Mode      |Request   |Autherization   | Parameters                 | Body                       |  Description               |               
| :-------- | :------- | :-------| :------------------------- | :------------------------- | :------------------------- |
| `POST`    | `/users/me/avatar` |Required|                             |  `avatar:jpg,png file` | This is to Upload Profile Picture |
| `DELETE`    | `/users/me/avatar` |   Required                         |  |  | Deletes the Profile Picture |


#### Parameters

| Parameter   |Values   |Description|                
| :-------- | :------- | :-------| 
| `sortBy`    | `createdAt:asc`or`createdAt:desc`  | Returns Results in Ascending or Descending Order of Creation date |       
| `limit`    | `Positive Integer`  | Specify number of Tasks in one page |       
| `skip`    | `Positive Integer`  | Specify Page number in pagination |       
