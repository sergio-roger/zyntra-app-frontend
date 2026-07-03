import { Toast } from "@base-ui/react/toast";

/**
 * Global toast manager — can be used outside React components
 * (e.g. in Axios interceptors or plain functions).
 */
export const toastManager = Toast.createToastManager();
