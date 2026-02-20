import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectAuthUser } from "../features/auth/authSlice";
import { clearListsState } from "../features/lists/listsSlice";
import { clearItemsState } from "../features/items/itemsSlice";
import "../styles/Navbar.css";

export default function Navbar() {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    dispatch(clearListsState());
    dispatch(clearItemsState());
    nav("/login");
  };

  return (
    <header className="nav">
      <div className="navInner">
        <Link to="/" className="brand">
          Shopping<span>List</span>
        </Link>

        <nav className="navLinks">
          <Link to="/" className="link">
            Home
          </Link>
          <Link to="/profile" className="link">
            Profile
          </Link>
        </nav>

        <div className="navRight">
          <div className="userChip">
            <div className="dot" />
            <Link to="/profile" className="userName">
              {user ? `${user.name} ${user.surname}` : "Guest"}
            </Link>
          </div>

          <button className="btnNav" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
