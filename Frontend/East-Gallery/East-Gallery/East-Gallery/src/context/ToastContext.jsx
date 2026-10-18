import { createContext, useContext, useState } from "react";

import Toast from "../components/componentShareds/Toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });

    setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </ToastContext.Provider>
  );
}
