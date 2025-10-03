import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <div>
      <Link to="/signup" className=''> register</Link>
      <Link to="/login" className=''> Login</Link>
      <Link to="/profile" className=''> Profile</Link>
    </div>
  )
}
