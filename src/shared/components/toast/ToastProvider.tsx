import React from "react";
import { Toast } from "@base-ui/react/toast";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { toastManager } from "./toastManager";
import "./toast.css";

/** Re-usable Toast viewport — renders all stacked toasts. */
function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className={`toast-root toast-${String(toast.type ?? "info")}`}
    >
      <Toast.Content className="toast-content">
        <span className="toast-icon" aria-hidden>
          {toast.type === "error" && <AlertCircle size={18} />}
          {toast.type === "success" && <CheckCircle size={18} />}
          {toast.type === "warning" && <AlertTriangle size={18} />}
          {(!toast.type || toast.type === "info") && <Info size={18} />}
        </span>

        <div className="toast-text">
          <Toast.Title className="toast-title" />
          <Toast.Description className="toast-description" />
        </div>

        <Toast.Close className="toast-close" aria-label="Cerrar">
          <X size={14} />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}

/**
 * App-level Toast provider.
 * Wrap your app with this to enable toasts globally.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Toast.Provider toastManager={toastManager} timeout={5000}>
      {children}

      <Toast.Portal>
        <Toast.Viewport className="toast-viewport">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
};
