import { toast } from "react-toastify";

export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showErrorToast = (error) => {
  const msg =
    typeof error === "string"
      ? error
      : error?.message || "Something went wrong.";
  toast.error(`❌ ${msg}`);
};
