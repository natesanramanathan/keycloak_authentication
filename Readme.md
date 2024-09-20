# Keycloak Authentication Example with Express.js

This project demonstrates how to integrate **Keycloak** authentication into a **Node.js** application using **Express.js**. The application allows users to log in using Keycloak, retrieve user information, and handle logout functionality securely. This project utilizes the Keycloak API for token handling and user introspection.

## Features

- User login using Keycloak's OAuth2/OpenID Connect protocol.
- Securely handles `access_token`, `refresh_token`, and user session management.
- Displays user details on the dashboard after successful login.
- Implements logout functionality via Keycloak's logout API.
- Uses environment variables for sensitive configurations such as `api_base_url`, `client_id`, `client_secret`, and `grant_type`.

## Technologies

- Node.js
- Express.js
- Axios for HTTP requests
- Keycloak for authentication
- EJS for rendering dynamic views
- dotenv for managing environment variables

## Prerequisites

Before running this project, you need the following installed:

- [Node.js](https://nodejs.org/en/) (v12.x or higher)
- Keycloak server (set up with a realm, client, and credentials)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd keycloak-auth-example
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file at the root of your project and add the following:

   ```bash
   KEYCLOAK_API_BASE_URL=your-keycloak-api-base-url
   KEYCLOAK_CLIENT_ID=your-client-id
   KEYCLOAK_CLIENT_SECRET=your-client-secret
   KEYCLOAK_GRANT_TYPE=password
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

## Application Structure

### 1. `app.js` - Main Application File

The core of the application. This file sets up routes, handles API calls to Keycloak for login, and manages the user session. Key features include:

- **Login Route (`/login`)**: Handles user authentication by calling Keycloak's token endpoint.
- **Logout Route (`/logout`)**: Invalidates the user session by calling Keycloak's logout endpoint.
- **Dashboard View**: Displays user information and allows the user to logout.

### 2. `views/`

- **`login.ejs`**: The login page where users enter their credentials.
- **`dashboard.ejs`**: The page that displays after a successful login, showing user details and providing a logout option.

### 3. `public/` - Static Assets

Holds any static files (CSS, JS, images, etc.) used in the application.

### 4. `.env` - Environment Variables

Used to store sensitive information like Keycloak credentials. This file should not be committed to version control.

## Key Features

### 1. **Login**

When a user submits their credentials on the login page, the app sends a request to Keycloak's token endpoint with the user's `username` and `password`, along with the app's `client_id` and `client_secret`.

### 2. **Dashboard**

Upon successful login, the user is redirected to the dashboard where the following details are displayed:

- **Access Token**
- **Token Type**
- **Expires In**
- **Refresh Token**
- **User Information** (fetched using the token introspection API)

### 3. **Logout**

The logout functionality sends a request to Keycloak’s logout API, using the `refresh_token` to terminate the session.

## API Endpoints

- **Login (POST `/login`)**

  - Sends user credentials to Keycloak to receive an access token.
  - Calls Keycloak's token endpoint: `/realms/{realm}/protocol/openid-connect/token`

- **Logout (POST `/logout`)**

  - Logs the user out by sending the `refresh_token` to Keycloak’s logout API.
  - Endpoint: `/realms/{realm}/protocol/openid-connect/logout`

- **Token Introspection (POST `/token/introspect`)**
  - Fetches detailed user information using the access token.
  - Endpoint: `/realms/{realm}/protocol/openid-connect/token/introspect`

## Environment Variables

The following environment variables are required for this application:

| Variable                 | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `KEYCLOAK_API_BASE_URL`  | Keycloak API BASE URL.                               |
| `KEYCLOAK_CLIENT_ID`     | The client ID of your Keycloak client.               |
| `KEYCLOAK_CLIENT_SECRET` | The client secret of your Keycloak client.           |
| `KEYCLOAK_GRANT_TYPE`    | The grant type used for authentication (`password`). |

## Running the Application

1. Start the server using the following command:

   ```bash
   npm start
   ```

2. Navigate to `http://localhost:3000/` in your browser to access the login page.

3. After successful login, you will be redirected to the dashboard, where you can see your user details.

## Logout Functionality

When the user clicks the logout button, a request is made to Keycloak's `/logout` endpoint using the `refresh_token`, `client_id`, and `client_secret` to properly terminate the session.

---

## License

This project is open-source and free to use.
