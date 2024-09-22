const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("login", { error: null }); // Render login page
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const base_url = process.env.KEYCLOAK_API_BASE_URL;
  const client_id = process.env.KEYCLOAK_CLIENT_ID;
  const client_secret = process.env.KEYCLOAK_CLIENT_SECRET;
  const grant_type = process.env.KEYCLOAK_GRANT_TYPE;

  try {
    // Request access token from Keycloak
    const params = new URLSearchParams();
    params.append("client_id", client_id);
    params.append("client_secret", client_secret);
    params.append("grant_type", grant_type);
    params.append("username", username);
    params.append("password", password);

    const tokenResponse = await axios.post(`${base_url}/token`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Call the introspection API to get more details about the user
    const introspectParams = new URLSearchParams();
    introspectParams.append("client_id", client_id);
    introspectParams.append("client_secret", client_secret);
    introspectParams.append("token", accessToken);

    const introspectResponse = await axios.post(
      `${base_url}/token/introspect`,
      introspectParams,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const userInfo = introspectResponse.data;

    // On successful login, render the dashboard with the token and user info
    res.render("dashboard", {
      accessToken: accessToken,
      expiresIn: tokenResponse.data.expires_in,
      refreshToken: tokenResponse.data.refresh_token,
      tokenType: tokenResponse.data.token_type,
      userInfo: userInfo, // Pass user information to the dashboard
    });
  } catch (error) {
    console.error(
      "Error during login:",
      error.response ? error.response.data : error.message
    );

    // Handle login errors
    res.render("login", {
      error:
        error.response?.data?.error_description ||
        "Login failed. Please check your credentials.",
    });
  }
});

// Handle logout
app.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  const base_url = process.env.KEYCLOAK_API_BASE_URL;
  const client_id = process.env.KEYCLOAK_CLIENT_ID;
  const client_secret = process.env.KEYCLOAK_CLIENT_SECRET;

  try {
    // Call the Keycloak logout API
    const logoutParams = new URLSearchParams();
    logoutParams.append("client_id", client_id);
    logoutParams.append("client_secret", client_secret);
    logoutParams.append("refresh_token", refreshToken);
    //  "http://localhost:8080/realms/Bluebinaries/protocol/openid-connect/logout",
    await axios.post(`${base_url}/logout`, logoutParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // After successful logout, redirect to the login page with a success message
    res.redirect("/?logout=success");
  } catch (error) {
    console.error(
      "Error during logout:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Logout failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
