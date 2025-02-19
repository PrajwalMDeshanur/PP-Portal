import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import ViewApplications from "./pages/ViewApplications";
import UploadApplications from "./pages/UploadApplications";
import BulkUploadApplications from "./pages/BulkUploadApplications";
import NewApplication from "./pages/NewApplication";
import Shortlisting from "./pages/Shortlisting";
import ScreeningTests from "./pages/ScreeningTests";
import ResultsManagement from "./pages/ResultsManagement";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout with Navbar, Header, Footer
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/upload-applications", element: <UploadApplications /> },
      { path: "/new-application", element: <NewApplication /> },
      { path: "/bulk-upload-applications", element: <BulkUploadApplications /> },
      { path: "/view-applications", element: <ViewApplications /> },
      { path: "/shortlisting", element: <Shortlisting /> },
      { path: "/screening-tests", element: <ScreeningTests /> },
      { path: "/results-management", element: <ResultsManagement /> },
      { path: "/reports", element: <ReportsAnalytics /> },
      { path: "/user-management", element: <UserManagement /> },
      { path: "/settings", element: <Settings /> },
      { path: "/help-support", element: <HelpSupport /> },
    ],
  },
]);
