import conf from "../conf/conf";
import { Client, Account } from "appwrite";

// Initialize Appwrite Client and Account
const client = new Client();
const account = new Account(client);

// Set Appwrite configuration
client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId);

// Create an account
export const createAccount = async ({ userId, email, password, userName }) => {
  try {
    const userAccount = await account.create(userId, email, password, userName);

    if (userAccount) {
      // Automatically login after creating an account
      return login({ email, password });
    } else {
      return userAccount;
    }
  } catch (error) {
    throw error;
  }
};

// Login to the account
export const login = async ({ email, password }) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw error;
  }
};

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.log("currentUser Error:-", error);
  }
  return null;
};

// Log out the current user
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
  getCurrentUser,
  logout,
};

export default authService;
