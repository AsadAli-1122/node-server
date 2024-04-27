# Node Server

Before running the server, make sure to install the required dependencies.

`npm install`
or
`yarn`

To start the server in development mode, use the following command:

`npm install`
or
`yarn`

Now, you can test the API endpoints as described below.

## Register User

#### Request

- **Method:** POST
- **Endpoint:** /api/auth/register
- **Headers:** None
- **Body:**
  ```
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
####  Response
- **Success (200):**
``` 
{
  "message": "User registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isVerified": false,
    "role": "user"
  }
}
```
- **Error (404):** User not found
```
{
  "message": "User not found"
}
```
- **Error (500):** Failed to fetch user details
```
{
  "message": "Failed to fetch user details"
}
```
## Update User Details
#### Request

- **Method:** PUT
- **Endpoint:** /api/auth/user
- **Headers:** 
    - Authorization: Bearer [token] 
- **Body:**
  ```
  {
  "firstName": "John",
  "lastName": "Doe",
  "oldPassword": "password123",
  "newPassword": "newPassword456"
  }
  ```
####  Response
- **Success (200):**
``` 
{
  "message": "User details updated successfully",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isVerified": false,
    "role": "user"
  }
}

```
- **Error (400):** No fields to update
```
{
  "message": "User not found"
}
```
- **Error (400):** For Change password old and new passwords are required
```
{
  "message": "For Change password old and new passwords are required"
}
```
- **Error (400):** New password must be different from old password
```
{
  "message": "New password must be different from old password"
}
```
- **Error (401):** Invalid old password
```
{
  "message": "Invalid old password"
}
```
- **Error (500):** Failed to update user details
```
{
  "message": "Failed to update user details"
}
```
## Login User

#### Request

- **Method:** POST
- **Endpoint:** /api/auth/register
- **Headers:** None
- **Body:**
  ```
  {
  "email": "john.doe@example.com",
  "password": "password123"
  }
  ```
####  Response
- **Success (200):**

``` 
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

```
- **Error (401):** Invalid email or password
```
{
  "message": "Invalid email or password"
}
```
- **Error (500):** Failed to login
```
{
  "message": "Failed to login"
}
```
## Get User Details
#### Request

- **Method:** GET
- **Endpoint:** /api/auth/user
- **Headers:** 
    - Authorization: Bearer [token] 

####  Response
- **Success (200):**
``` 
{
  "message": "User details retrieved successfully",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isVerified": false,
    "role": "user"
  }
}
```
- **Error (404):** User not found
```
{
  "message": "User not found"
}
```
- **Error (500):** Failed to fetch user details
```
{
  "message": "Failed to fetch user details"
}
```
