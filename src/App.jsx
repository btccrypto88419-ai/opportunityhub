import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import { ProtectedRoute, AdminRoute } from "./components/ui/ProtectedRoute";

import Home from "./pages/Home";
import Opportunities from "./pages/Opportunities";
import OpportunityDetails from "./pages/OpportunityDetails";
import SavedOpportunities from "./pages/SavedOpportunities";
import ApplicationTracker from "./pages/ApplicationTracker";
import CvBuilder from "./pages/CvBuilder";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import SubmitOpportunity from "./pages/SubmitOpportunity";
import PaymentCenter from "./pages/PaymentCenter";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Refund from "./pages/legal/Refund";
import Disclaimer from "./pages/legal/Disclaimer";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOpportunities from "./pages/admin/AdminOpportunities";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetails />} />

        <Route path="/jobs" element={<Opportunities fixedCategory="jobs" pageTitle="Jobs" />} />
        <Route
          path="/scholarships"
          element={<Opportunities fixedCategory="scholarships" pageTitle="Scholarships" />}
        />
        <Route
          path="/internships"
          element={<Opportunities fixedCategory="internships" pageTitle="Internships" />}
        />
        <Route
          path="/fellowships"
          element={<Opportunities fixedCategory="fellowships" pageTitle="Fellowships" />}
        />
        <Route path="/grants" element={<Opportunities fixedCategory="grants" pageTitle="Grants" />} />
        <Route
          path="/competitions"
          element={<Opportunities fixedCategory="competitions" pageTitle="Competitions" />}
        />
        <Route
          path="/training"
          element={<Opportunities fixedCategory="training" pageTitle="Training Programs" />}
        />
        <Route
          path="/remote-jobs"
          element={<Opportunities fixedCategory="remote-jobs" pageTitle="Remote Jobs" />}
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedOpportunities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationTracker />
            </ProtectedRoute>
          }
        />
        <Route path="/cv-builder" element={<CvBuilder />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/submit-opportunity" element={<SubmitOpportunity />} />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/support" element={<Support />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="opportunities" element={<AdminOpportunities />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
