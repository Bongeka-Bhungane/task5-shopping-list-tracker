import React from "react";
import { useAppSelector } from "../../reduxHooks";
import LoginForm from "../components/LoginForm";

export default function Login() {
  const user = useAppSelector((state) => state.Login.user);

  const email = user?.email;
  const username = user?.name;

  return (
    <div>
      <LoginForm />
      {user && (
        <div className="mt-3 text-center">
          <p>Welcome back, {username || email}!</p>
        </div>
      )}
    </div>
  );
}
