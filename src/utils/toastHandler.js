import { toast } from "react-toastify";

/**
 * Show a success message and optionally navigate after a delay.
 * @param {string} message - Message to show in toast.
 * @param {function} navigate - React Router navigate function.
 * @param {string} [path] - Optional path to redirect after success.
 * @param {number} [delay=1000] - Delay before redirect in ms.
 */
export const showSuccessToast = (
  message,
  navigate,
  path = "",
  delay = 1000
) => {
  toast.success(message);
  if (navigate && path) {
    setTimeout(() => {
      navigate(path);
    }, delay);
  }
};

/**
 * Show an error toast from string or error object.
 * @param {string | object} error - Error message or object.
 */
export const showErrorToast = (error) => {
  const msg =
    typeof error === "string"
      ? error
      : error?.message || "Something went wrong.";
  toast.error(`❌ ${msg}`);
};
