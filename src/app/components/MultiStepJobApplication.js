"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./MultiStepJobApplication.css";

// Helper function: Upload a file to Cloudinary and return its secure URL.
const uploadFileToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/dn97db9tm/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "resume_upload");

  console.log("Uploading file to Cloudinary:", file.name);
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  console.log("Cloudinary response for", file.name, ":", data);
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.secure_url;
};

const MultiStepJobApplication = () => {
  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    basic: { name: "", email: "", phone: "" },
    resumeUrl: "",
    references: [{ name: "", email: "", phone: "" }],
    writingExamplesUrls: [],
  });

  // Validate the fields in the current step
  const validateStep = () => {
    let valid = true;
    let newErrors = {};
    if (currentStep === 1) {
      if (!formData.basic.name.trim()) {
        newErrors.name = "Name is required";
        valid = false;
      }
      if (!formData.basic.email.trim()) {
        newErrors.email = "Email is required";
        valid = false;
      }
      if (!formData.basic.phone.trim()) {
        newErrors.phone = "Phone number is required";
        valid = false;
      }
    } else if (currentStep === 2) {
      if (!formData.resumeUrl) {
        newErrors.resume = "Resume is required";
        valid = false;
      }
    } else if (currentStep === 3) {
      newErrors.references = [];
      formData.references.forEach((ref, index) => {
        let refErrors = {};
        if (!ref.name.trim()) {
          refErrors.name = "Reference name is required";
          valid = false;
        }
        if (!ref.email.trim()) {
          refErrors.email = "Reference email is required";
          valid = false;
        }
        if (!ref.phone.trim()) {
          refErrors.phone = "Reference phone number is required";
          valid = false;
        }
        newErrors.references[index] = refErrors;
      });
    } else if (currentStep === 4) {
      if (formData.writingExamplesUrls.length === 0) {
        newErrors.writingExamples = "At least one writing example is required";
        valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  };

  // Navigation functions
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Handlers for basic info
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      basic: { ...prev.basic, [name]: value },
    }));
  };

  // Handler for resume upload using Cloudinary.
  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    console.log("Selected resume file:", file);
    if (file) {
      try {
        const uploadedUrl = await uploadFileToCloudinary(file);
        console.log("Uploaded resume URL:", uploadedUrl);
        setFormData((prev) => ({
          ...prev,
          resumeUrl: uploadedUrl,
        }));
      } catch (error) {
        console.error("Resume upload failed:", error);
      }
    }
  };

  // Handler for writing examples upload (multiple files)
  const handleWritingExampleChange = async (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected writing example files:", files);
    if (files.length > 0) {
      try {
        const uploadedUrls = await Promise.all(
          files.map((file) => uploadFileToCloudinary(file))
        );
        console.log("Uploaded writing example URLs:", uploadedUrls);
        setFormData((prev) => ({
          ...prev,
          writingExamplesUrls: uploadedUrls,
        }));
      } catch (error) {
        console.error("Writing examples upload failed:", error);
      }
    }
  };

  // Handler for reference changes
  const handleReferenceChange = (index, e) => {
    const { name, value } = e.target;
    const newReferences = formData.references.map((ref, idx) =>
      idx === index ? { ...ref, [name]: value } : ref
    );
    setFormData((prev) => ({
      ...prev,
      references: newReferences,
    }));
  };

  const addReference = () => {
    setFormData((prev) => ({
      ...prev,
      references: [...prev.references, { name: "", email: "", phone: "" }],
    }));
  };

  // Submit the form using EmailJS, sending the file URLs (not file data)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Optionally, validate all steps before submitting
    if (!validateStep()) return;

    const templateParams = {
      name: formData.basic.name,
      email: formData.basic.email,
      phone: formData.basic.phone,
      resumeUrl: formData.resumeUrl,
      references: formData.references
        .map(
          (ref, index) =>
            `Reference ${index + 1}: ${ref.name} (${ref.email}, ${ref.phone})`
        )
        .join("\n"),
      writingExamplesUrls: formData.writingExamplesUrls.join(", "),
    };

    console.log("Sending EmailJS template parameters:", templateParams);

    emailjs
      .send("service_1nkcxkl", "template_xsk27qa", templateParams, "bQdrcK7Eju1NykCqt")
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setSubmissionStatus("success");
        },
        (error) => {
          console.error("FAILED...", error);
          setSubmissionStatus("error");
        }
      );
  };

  // Render the step indicator
  const renderStepIndicator = () => {
    const steps = [];
    for (let i = 1; i <= totalSteps; i++) {
      steps.push(
        <div
          key={i}
          className={`step-indicator-item ${currentStep === i ? "active" : ""}`}
        >
          {i}
        </div>
      );
    }
    return <div className="step-indicator">{steps}</div>;
  };

  // Render content for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Basic Information</h2>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.basic.name}
                onChange={handleBasicChange}
                placeholder="Your name"
                required
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.basic.email}
                onChange={handleBasicChange}
                placeholder="Your email"
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </label>
            <label>
              Phone Number:
              <input
                type="tel"
                name="phone"
                value={formData.basic.phone}
                onChange={handleBasicChange}
                placeholder="Your phone number"
                required
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </label>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h2>Resume Upload</h2>
            <div className="file-upload-wrapper">
              <span>Upload Resume:</span>
              <label htmlFor="resumeInput" className="custom-file-upload">
                {formData.resumeUrl ? "File Uploaded" : "Choose File"}
              </label>
              <input
                id="resumeInput"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                style={{ display: "none" }}
                required
              />
            </div>
            {errors.resume && <p className="error-message">{errors.resume}</p>}
            {formData.resumeUrl && <p>Uploaded URL: {formData.resumeUrl}</p>}
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2>References</h2>
            {formData.references.map((reference, index) => (
              <div key={index} className="reference-group">
                <h3>Reference {index + 1}</h3>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={reference.name}
                    onChange={(e) => handleReferenceChange(index, e)}
                    placeholder="Reference name"
                    required
                  />
                  {errors.references &&
                    errors.references[index] &&
                    errors.references[index].name && (
                      <p className="error-message">
                        {errors.references[index].name}
                      </p>
                    )}
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={reference.email}
                    onChange={(e) => handleReferenceChange(index, e)}
                    placeholder="Reference email"
                    required
                  />
                  {errors.references &&
                    errors.references[index] &&
                    errors.references[index].email && (
                      <p className="error-message">
                        {errors.references[index].email}
                      </p>
                    )}
                </label>
                <label>
                  Phone Number:
                  <input
                    type="tel"
                    name="phone"
                    value={reference.phone}
                    onChange={(e) => handleReferenceChange(index, e)}
                    placeholder="Reference phone number"
                    required
                  />
                  {errors.references &&
                    errors.references[index] &&
                    errors.references[index].phone && (
                      <p className="error-message">
                        {errors.references[index].phone}
                      </p>
                    )}
                </label>
              </div>
            ))}
            <button type="button" onClick={addReference} className="add-reference-button">
              Add Another Reference
            </button>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h2>Writing Examples</h2>
            <div className="file-upload-wrapper">
              <span>Upload Writing Examples:</span>
              <label htmlFor="writingInput" className="custom-file-upload">
                {formData.writingExamplesUrls.length > 0
                  ? `${formData.writingExamplesUrls.length} file(s) Uploaded`
                  : "Choose File(s)"}
              </label>
              <input
                id="writingInput"
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleWritingExampleChange}
                style={{ display: "none" }}
                required
              />
            </div>
            {errors.writingExamples && (
              <p className="error-message">{errors.writingExamples}</p>
            )}
            {formData.writingExamplesUrls.length > 0 && (
              <div>
                <p>Uploaded URLs:</p>
                <ul>
                  {formData.writingExamplesUrls.map((url, index) => (
                    <li key={index}>{url}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // If submission was successful, show only the success message.
  if (submissionStatus === "success") {
    return (
      <div className="submission-message success">
        Your application has been submitted successfully. Thank you!
      </div>
    );
  }

  return (
    <form className="multi-step-form" onSubmit={handleSubmit}>
      {renderStepIndicator()}
      {renderStepContent()}
      <div className="navigation-buttons">
        {currentStep > 1 && (
          <button type="button" onClick={handleBack} className="back-button">
            Back
          </button>
        )}
        {currentStep < totalSteps && (
          <button type="button" onClick={handleNext} className="next-button">
            Next
          </button>
        )}
        {currentStep === totalSteps && (
          <button type="submit" className="submit-button">
            Submit Application
          </button>
        )}
      </div>
      {submissionStatus === "error" && (
        <div className="submission-message error">
          There was an error submitting your application. Please try again.
        </div>
      )}
    </form>
  );
};

export default MultiStepJobApplication;