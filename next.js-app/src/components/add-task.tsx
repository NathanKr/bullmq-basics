"use client";

import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import {
  GenerateReportPayload,
  JobData,
  ProcessImagePayload,
  QueueJobType,
  SendEmailPayload,
} from "@/types/types"; // Adjust path if necessary
import { addTaskWithAction } from "@/actions/actions"; // Adjust path if necessary
import { JobsOptions } from "bullmq";

// Import the CSS Module
import styles from "@/styles/add-task.module.css";

const AddTask: FC = () => {
  const [selectedJobType, setSelectedJobType] = useState<QueueJobType>(
    QueueJobType.SendEmail
  );
  const [jobData, setJobData] = useState<string>(
    JSON.stringify(getDefaultJobData(QueueJobType.SendEmail), null, 2)
  );
  const [jobOptions, setJobOptions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // For plain HTML <select>, ChangeEvent<HTMLSelectElement> is the correct type
  const handleJobTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newJobType = event.target.value as QueueJobType;
    setSelectedJobType(newJobType);
    setJobData(JSON.stringify(getDefaultJobData(newJobType), null, 2));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    let parsedData: JobData;
    let parsedOptions: JobsOptions | undefined;

    try {
      parsedData = jobData ? JSON.parse(jobData) : {};
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
      const { jobId, jobName } = await addTaskWithAction(
        selectedJobType,
        parsedData,
        parsedOptions
      );
      setSuccessMessage(
        `Successfully added job! ID: ${jobId}, Name: ${jobName}`
      );
      setJobData(JSON.stringify(getDefaultJobData(selectedJobType), null, 2));
      setJobOptions("");
    } catch (error: any) {
      setErrorMessage(error.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Add New Queue Task</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formControl}>
          <label htmlFor="jobType" className={styles.label}>
            Select Job Type:
          </label>
          <select
            id="jobType"
            value={selectedJobType}
            onChange={handleJobTypeChange}
            className={styles.select}
          >
            {Object.values(QueueJobType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formControl}>
          <label htmlFor="jobData" className={styles.label}>
            Job Data (JSON):
          </label>
          <textarea
            id="jobData"
            value={jobData}
            onChange={(e) => setJobData(e.target.value)}
            rows={10}
            className={styles.textarea}
            placeholder="Enter job-specific data as a JSON object, e.g., {'to': 'email@example.com', 'subject': 'Hello', 'body': '...'}"
          />
          <small className={styles.helperText}>
            Enter job-specific data as a JSON object. The structure depends on
            the selected job type.
          </small>
        </div>

        <div className={styles.formControl}>
          <label htmlFor="jobOptions" className={styles.label}>
            Job Options (JSON, optional):
          </label>
          <textarea
            id="jobOptions"
            value={jobOptions}
            onChange={(e) => setJobOptions(e.target.value)}
            rows={4}
            className={styles.textarea}
            placeholder="e.g., {'delay': 5000, 'attempts': 3}"
          />
          <small className={styles.helperText}>
            Enter BullMQ JobsOptions as a JSON object (e.g., `delay`,
            `attempts`, `priority`).
          </small>
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading && <div className={styles.spinner}></div>}
            {loading ? "Adding Task..." : "Add Task to Queue"}
          </button>
        </div>
      </form>

      {successMessage && (
        <div className={`${styles.message} ${styles.successMessage}`}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className={`${styles.message} ${styles.errorMessage}`}>
          Error: {errorMessage}
        </div>
      )}
    </div>
  );
};

export default AddTask;

// getDefaultJobData remains unchanged as it's pure logic
export const getDefaultJobData = (jobType: QueueJobType): JobData => {
  switch (jobType) {
    case QueueJobType.SendEmail:
      return {
        to: "recipient@example.com",
        subject: "Queue Notification",
        body: "This is a test email sent from the queue.",
      } as SendEmailPayload;
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
      return {} as JobData;
  }
};
