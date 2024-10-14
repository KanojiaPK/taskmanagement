import { Routes, Route } from "react-router-dom";
import Signup from "./Signup/Signup";
import Login from "./Login/Login";
import AdminMain from "./Admin/AdminMain";
import TeamMain from "./Team/TeamMain";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Admin" element={<AdminMain />} />
      <Route path="/Team" element={<TeamMain />} />
    </Routes>
  );
}

export default App;
