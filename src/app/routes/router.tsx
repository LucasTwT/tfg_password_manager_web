import { createBrowserRouter, Navigate } from "react-router-dom"
import AuthLayout from "@/app/layouts/AuthLayout"
import Login from "@/app/pages/Login"
import Register from "@/app/pages/Register"
import AppView from "@/app/pages/AppView"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/home",
    element: <AppView />,
  },
])
