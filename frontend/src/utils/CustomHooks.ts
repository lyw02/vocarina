import { getUser } from "@/api/supabaseAuthApi";
import { setCurrentUser } from "@/store/modules/user";
import { AlertStatus, RootState } from "@/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * Deprecated
 * 
 * Use `@/Alert/AutoDismissAlert` raiseAlert()
 */
export const useAlert = () => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<AlertStatus>({
    severity: "error",
    message: "",
  });
  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  const raiseAlert = (severity: AlertStatus["severity"], message: string) => {
    setAlertStatus({
      severity: severity,
      message: message,
    });
    setIsAlertOpen(true);
  };

  return { isAlertOpen, alertStatus, handleAlertClose, raiseAlert };
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem("token_key") && !currentUser) {
        setIsLoading(true)
        const res = await getUser();
        if (!res.error) {
          dispatch(setCurrentUser(res));
        }
        setIsLoading(false)
      }
    };
    fetchUser();
  }, []);
  return isLoading
}
