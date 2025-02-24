"use client";

import React from "react";
import Layout from "../components/Layout/Layout"; // Import Layout
import MultiStepJobApplication from "../components/MultiStepJobApplication"
import "./MultiStepJobApplication.css"; // Ensure your form styles are imported

export default function ApplyForThisPosition() {
  return (
    <Layout>
      <div className="form-container">
        <div className="multi-step-form">
          <MultiStepJobApplication />
        </div>
      </div>

    </Layout>
  );
}