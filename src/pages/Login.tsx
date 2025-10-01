import React from 'react'
import { useAppSelector, useAppDispatch } from "../../reduxHooks";

export default function Login() {
     const email = useAppSelector((state) => state.LoginSlice.email);
     const username = useAppSelector((state) => state.LoginSlice.username);
    //  const dispatch = useAppDispatch();

  return (
    <div>
       <h1>{email}</h1>
       <h3>Hello {username}</h3>
    </div>
  )
}
