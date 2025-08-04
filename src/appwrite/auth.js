import conf from "../conf/conf";
import { Client, Account } from "appwrite";

// Initialize Appwrite Client and Account
const client = new Client();
client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId);

const account = new Account(client);

// Create an account
export const createAccount = async ({ userId, email, password, userName }) => {
  try {
    const userAccount = await account.create(userId, email, password, userName);

    if (userAccount) {
      return login({ email, password });
    } else {
      return userAccount;
    }
  } catch (error) {
    throw error;
  }
};

// Login with email/password
export const login = async ({ email, password }) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw error;
  }
};

// Login with Google OAuth2
export const loginWithGoogle = async () => {
  try {
    return await account.createOAuth2Session(
      "google",
      "http://localhost:5173/",
      "http://localhost:5173/login-failed"
    );
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

// Login with Google OAuth2
export const loginWithFacebook = async () => {
  try {
    return await account.createOAuth2Session(
      "facebook",
      "http://localhost:5173/",
      "http://localhost:5173/login-failed"
    );
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.log("currentUser Error:", error);
    return null;
  }
};

// Get user using userId
export const getUserById = async (userId) => {
  try {
    const user = await account.get(userId);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};

// Log out current user
export const logout = async () => {
  try {
    return await account.deleteSessions();
  } catch (error) {
    console.log("logout error :-", error);
  }
};

const authService = {
  createAccount,
  login,
  loginWithGoogle,
  getCurrentUser,
  loginWithFacebook,
  logout,
};

export default authService;
