import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Room from "./pages/Room"; // ✅ correct case
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Auth />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        <Route path="/room" element={<Room />} />
        {/* <Route
          path="/room"
          element={
            localStorage.getItem("token") ? (
              <Room />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        /> */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
