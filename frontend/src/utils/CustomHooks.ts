import { getUser } from "@/api/supabaseAuthApi";
import { setCurrentUser } from "@/store/modules/user";
import { AlertStatus, RootState } from "@/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem("token_key") && !currentUser) {
        const res = await getUser();
        dispatch(setCurrentUser(res));
      }
    };
    fetchUser();
  }, []);
}
