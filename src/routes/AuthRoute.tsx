import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../features/auth/authSlice";

export default function AuthRoute({ children }: { children: JSX.Element }) {
  const user = useAppSelector(selectAuthUser);
  if (user) return <Navigate to="/" replace />;
  return children;
}
