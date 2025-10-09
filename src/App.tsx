import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListsViewerPage from "./pages/ListsViewerPage";
import Profile from './pages/Profile';
import AddItemsPage from './pages/AddItemsPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/main" element={<ListsViewerPage />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/items" element={<AddItemsPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
