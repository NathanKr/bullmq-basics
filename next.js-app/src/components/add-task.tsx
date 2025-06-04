"use client"

import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import {
  GenerateReportPayload,
  JobData,
  ProcessImagePayload,
  QueueJobType,
  SendEmailPayload,
} from "@/types/types";
import { addTaskAction } from "@/actions/actions";
import { JobsOptions } from 'bullmq';


const AddTask: FC = () => {
  const [selectedJobType, setSelectedJobType] = useState<QueueJobType>(
    QueueJobType.SendEmail
  );
  const [jobData, setJobData] = useState<string>(
    JSON.stringify(getDefaultJobData(QueueJobType.SendEmail), null, 2) // Initialize with default for initial type
  );
  const [jobOptions, setJobOptions] = useState<string>(""); // Options as JSON string
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);



  const handleJobTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newJobType = event.target.value as QueueJobType;
    setSelectedJobType(newJobType);
    // Pre-fill jobData with a sensible default for the newly selected type
    setJobData(JSON.stringify(getDefaultJobData(newJobType), null, 2));
    setErrorMessage(null); // Clear errors on type change
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    let parsedData: JobData; // Now explicitly typed as JobData union
    let parsedOptions:  JobsOptions | undefined;

    try {
      // Parse the job data. It must conform to one of the JobData types.
      parsedData = jobData ? JSON.parse(jobData) : {};
      // You could add more specific validation here to ensure it matches
      // the selectedJobType's expected payload structure if needed.
    } catch (err) {
      setErrorMessage("Invalid JSON for Job Data.");
      setLoading(false);
      return;
    }

    try {
      parsedOptions = jobOptions ? JSON.parse(jobOptions) : undefined;
    } catch (err) {
      setErrorMessage("Invalid JSON for Job Options.");
      setLoading(false);
      return;
    }

    try {
      // addTask is now called with a correctly typed selectedJobType and parsedData
      const { jobId, jobName } = await addTaskAction(
        selectedJobType,
        parsedData,
        parsedOptions
      );
      setSuccessMessage(
        `Successfully added job! ID: ${jobId}, Name: ${jobName}`
      );
      setJobData(JSON.stringify(getDefaultJobData(selectedJobType), null, 2)); // Reset data to default
      setJobOptions(""); // Clear options
    } catch (error: any) {
      setErrorMessage(error.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Add New Queue Task</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="jobType"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Select Job Type:
          </label>
          <select
            id="jobType"
            value={selectedJobType}
            onChange={handleJobTypeChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            {Object.values(QueueJobType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="jobData"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Job Data (JSON):
          </label>
          <textarea
            id="jobData"
            value={jobData}
            onChange={(e) => setJobData(e.target.value)}
            rows={10} // Increased rows for more visibility of default data
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontFamily: "monospace",
            }}
            placeholder="Enter job-specific data as a JSON object, e.g., {'to': 'email@example.com', 'subject': 'Hello', 'body': '...'}"
          />
          <small style={{ color: "#666" }}>
            Enter job-specific data as a JSON object. The structure depends on
            the selected job type.
          </small>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="jobOptions"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Job Options (JSON, optional):
          </label>
          <textarea
            id="jobOptions"
            value={jobOptions}
            onChange={(e) => setJobOptions(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontFamily: "monospace",
            }}
            placeholder="e.g., {'delay': 5000, 'attempts': 3}"
          />
          <small style={{ color: "#666" }}>
            Enter BullMQ JobsOptions as a JSON object (e.g., `delay`,
            `attempts`, `priority`).
          </small>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Adding Task..." : "Add Task to Queue"}
        </button>
      </form>

      {successMessage && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
          }}
        >
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
          }}
        >
          Error: {errorMessage}
        </div>
      )}
    </div>
  );
};

export default AddTask;

export const getDefaultJobData = (jobType: QueueJobType): JobData => {
  switch (jobType) {
    case QueueJobType.SendEmail:
      return {
        to: "recipient@example.com",
        subject: "Queue Notification",
        body: "This is a test email sent from the queue.",
      } as SendEmailPayload; // Type assertion helps here
    case QueueJobType.ProcessImage:
      return {
        imageUrl:
          "https://cdn.pixabay.com/photo/2023/10/24/09/35/nature-8337775_1280.jpg",
        filters: ["grayscale", "thumbnail"],
      } as ProcessImagePayload;
    case QueueJobType.GenerateReport:
      return {
        reportId: "sales_summary_q2",
        parameters: {
          startDate: "2025-04-01",
          endDate: "2025-06-30",
          region: "North America",
        },
      } as GenerateReportPayload;
    default:
      // Fallback for any unhandled new job types, though the switch should cover all `QueueJobType`
      return {} as JobData;
  }
};