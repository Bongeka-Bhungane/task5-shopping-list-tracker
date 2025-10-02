import React from 'react'
import { useAppSelector, useAppDispatch } from "../../reduxHooks";
import LoginForm from '../components/LoginForm';

export default function Login() {
     const email = useAppSelector((state) => state.LoginSlice.email);
     const username = useAppSelector((state) => state.LoginSlice.username);
    //  const dispatch = useAppDispatch();

  return (
    <div>
      <LoginForm/>
    </div>
  )
}
