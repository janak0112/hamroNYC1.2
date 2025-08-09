import authService from "../appwrite/auth";

export const checkUserLoggedIn = async ({ navigate }) => {
  try {
    const user = await authService.getCurrentUser();
    !user && navigate("/login");
    return user || null;
  } catch (error) {
    console.error("Error checking user login:", error);
    navigate("/login");
    return null;
  }
};
