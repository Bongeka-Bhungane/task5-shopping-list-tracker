import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ListsViewerPage from "./pages/ListsViewerPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/main" element={<ListsViewerPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
