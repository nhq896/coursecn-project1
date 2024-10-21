import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function useAuth(): boolean {
  const { user } = useSelector((state: RootState) => state.auth);

  if (user) {
    return true;
  } else {
    return false;
  }
}
