import conf from "../conf/conf";
import { Client, Account } from "appwrite";
import { ID } from "appwrite";

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

/* --------------------  Phone Verification -------------------- */
// Start phone verification (sends OTP via SMS)
export const startPhoneVerification = async (phoneNumber) => {
  try {
    // phoneNumber format: +11234567890
    const token = await account.createPhoneToken(ID.unique(), phoneNumber);
    return res; // contains userId for OTP verification
  } catch (error) {
    console.error("Phone verification error:", error);
    throw error;
  }
};

// Verify OTP code
export const verifyPhoneCode = async (userId, otpCode) => {
  try {
    return await account.updatePhoneSession(userId, otpCode);
  } catch (error) {
    console.error("OTP verification error:", error);
    throw error;
  }
};

// Check if current user is phone verified
export const isPhoneVerified = async () => {
  try {
    const me = await account.get();
    return !!me.phoneVerification;
  } catch (error) {
    console.error("isPhoneVerified error:", error);
    return false;
  }
};

const authService = {
  createAccount,
  login,
  loginWithGoogle,
  loginWithFacebook,
  getCurrentUser,
  getUserById,
  logout,
  startPhoneVerification,
  verifyPhoneCode,
  isPhoneVerified,
};

export default authService;
