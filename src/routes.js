import { useRoutes, Navigate } from 'react-router-dom';
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from './pages/Dashboard';
import CheckInPage from "./pages/CheckInPage";
import CheckOutPage from "./pages/CheckOutPage";

export default function Router() {
  return useRoutes([
    {
      path: "app",
      element: <DashboardLayout />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "checkin", element: <CheckInPage /> },
        { path: "checkout", element: <CheckOutPage /> },
      ],
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { path: "", element: <Navigate to="/app/dashboard" /> },
        { path: "*", element: <Navigate to="/app/dashboard" /> },
      ],
    },
  ]);
};
