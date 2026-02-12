import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Teams from "./pages/team/Teams";
import Tasks from "./pages/task/Tasks";
import Users from "./pages/auth/Users";

function App() {
  
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* dashboard */}
        <Route path="/" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />

        {/* users */}
        <Route path="/users" element={ <ProtectedRoute> <Users /> </ProtectedRoute> }/>

        {/* teams */}
        <Route path="/teams" element={ <ProtectedRoute> <Teams /> </ProtectedRoute> } />

        {/* task */}
        <Route path="/tasks" element={ <ProtectedRoute> <Tasks /> </ProtectedRoute> }/>

      </Routes>
    </AuthProvider>
  );
}

export default App;
