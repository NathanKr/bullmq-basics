"use client";

import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import {
  GenerateReportPayload,
  JobData,
  ProcessImagePayload,
  QueueJobType,
  SendEmailPayload,
} from "@/types/types"; // Adjust path if necessary
import { addTaskAction } from "@/actions/actions"; // Adjust path if necessary
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
      const { jobId, jobName } = await addTaskAction(
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
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
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

// "use client";

// import React, { FC, FormEvent, useState } from "react";
// import {
//   GenerateReportPayload,
//   JobData,
//   ProcessImagePayload,
//   QueueJobType,
//   SendEmailPayload,
// } from "@/types/types"; // Adjust path if necessary
// import { addTaskAction } from "@/actions/actions"; // Adjust path if necessary
// import { JobsOptions } from "bullmq";

// // MUI Imports (these remain as they are for structured components)
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Alert,
//   Paper,
//   CircularProgress,
// } from "@mui/material";
// import { SelectChangeEvent } from '@mui/material/Select'; // Specific import for Select event type

// // Import the CSS Module
// import styles from "./AddTask.module.css"; // IMPORTANT: Import your CSS module

// const AddTask: FC = () => {
//   const [selectedJobType, setSelectedJobType] = useState<QueueJobType>(
//     QueueJobType.SendEmail
//   );
//   const [jobData, setJobData] = useState<string>(
//     JSON.stringify(getDefaultJobData(QueueJobType.SendEmail), null, 2)
//   );
//   const [jobOptions, setJobOptions] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   // Use SelectChangeEvent for the MUI Select component
//   const handleJobTypeChange = (event: SelectChangeEvent<QueueJobType>) => {
//     const newJobType = event.target.value as QueueJobType;
//     setSelectedJobType(newJobType);
//     setJobData(JSON.stringify(getDefaultJobData(newJobType), null, 2));
//     setErrorMessage(null);
//     setSuccessMessage(null);
//   };

//   const handleSubmit = async (event: FormEvent) => {
//     event.preventDefault();
//     setLoading(true);
//     setSuccessMessage(null);
//     setErrorMessage(null);

//     let parsedData: JobData;
//     let parsedOptions: JobsOptions | undefined;

//     try {
//       parsedData = jobData ? JSON.parse(jobData) : {};
//     } catch (err) {
//       setErrorMessage("Invalid JSON for Job Data.");
//       setLoading(false);
//       return;
//     }

//     try {
//       parsedOptions = jobOptions ? JSON.parse(jobOptions) : undefined;
//     } catch (err) {
//       setErrorMessage("Invalid JSON for Job Options.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const { jobId, jobName } = await addTaskAction(
//         selectedJobType,
//         parsedData,
//         parsedOptions
//       );
//       setSuccessMessage(
//         `Successfully added job! ID: ${jobId}, Name: ${jobName}`
//       );
//       setJobData(JSON.stringify(getDefaultJobData(selectedJobType), null, 2));
//       setJobOptions("");
//     } catch (error: any) {
//       setErrorMessage(error.message || "An unknown error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Paper
//       elevation={3}
//       className={styles.container} // Apply CSS Module class
//       // sx props are still useful for MUI spacing system if you want to mix
//       // sx={{ mt: 4 }} // Example: add top margin using MUI spacing
//     >
//       <Typography variant="h5" component="h2" gutterBottom>
//         Add New Queue Task
//       </Typography>
//       <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
//         <FormControl fullWidth margin="normal">
//           <InputLabel id="job-type-select-label">Select Job Type</InputLabel>
//           <Select
//             labelId="job-type-select-label"
//             id="jobType"
//             value={selectedJobType}
//             label="Select Job Type"
//             onChange={handleJobTypeChange}
//             // You could apply a class here if needed, but MUI's styling is usually enough
//             // className={styles.select}
//           >
//             {Object.values(QueueJobType).map((type) => (
//               <MenuItem key={type} value={type}>
//                 {type}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <TextField
//           id="jobData"
//           label="Job Data (JSON)"
//           multiline
//           rows={10}
//           fullWidth
//           margin="normal"
//           value={jobData}
//           onChange={(e) => setJobData(e.target.value)}
//           placeholder="Enter job-specific data as a JSON object, e.g., {'to': 'email@example.com', 'subject': 'Hello', 'body': '...'}"
//           helperText="Enter job-specific data as a JSON object. The structure depends on the selected job type."
//           // className={styles.textarea} // Apply if you need to override TextField's internal styles
//         />

//         <TextField
//           id="jobOptions"
//           label="Job Options (JSON, optional)"
//           multiline
//           rows={4}
//           fullWidth
//           margin="normal"
//           value={jobOptions}
//           onChange={(e) => setJobOptions(e.target.value)}
//           placeholder="e.g., {'delay': 5000, 'attempts': 3}"
//           helperText="Enter BullMQ JobsOptions as a JSON object (e.g., `delay`, `attempts`, `priority`)."
//           // className={styles.textarea} // Apply if you need to override TextField's internal styles
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           disabled={loading}
//           sx={{ mt: 3, mb: 2 }}
//           startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
//         >
//           {loading ? "Adding Task..." : "Add Task to Queue"}
//         </Button>
//       </Box>

//       {successMessage && (
//         <Alert severity="success" className={styles.successMessage}>
//           {successMessage}
//         </Alert>
//       )}

//       {errorMessage && (
//         <Alert severity="error" className={styles.errorMessage}>
//           Error: {errorMessage}
//         </Alert>
//       )}
//     </Paper>
//   );
// };

// export default AddTask;

// export const getDefaultJobData = (jobType: QueueJobType): JobData => {
//   switch (jobType) {
//     case QueueJobType.SendEmail:
//       return {
//         to: "recipient@example.com",
//         subject: "Queue Notification",
//         body: "This is a test email sent from the queue.",
//       } as SendEmailPayload;
//     case QueueJobType.ProcessImage:
//       return {
//         imageUrl:
//           "https://cdn.pixabay.com/photo/2023/10/24/09/35/nature-8337775_1280.jpg",
//         filters: ["grayscale", "thumbnail"],
//       } as ProcessImagePayload;
//     case QueueJobType.GenerateReport:
//       return {
//         reportId: "sales_summary_q2",
//         parameters: {
//           startDate: "2025-04-01",
//           endDate: "2025-06-30",
//           region: "North America",
//         },
//       } as GenerateReportPayload;
//     default:
//       return {} as JobData;
//   }
// };

// // "use client"

// // import React, { ChangeEvent, FC, FormEvent, useState } from "react";
// // import {
// //   GenerateReportPayload,
// //   JobData,
// //   ProcessImagePayload,
// //   QueueJobType,
// //   SendEmailPayload,
// // } from "@/types/types";
// // import { addTaskAction } from "@/actions/actions";
// // import { JobsOptions } from 'bullmq';


// // const AddTask: FC = () => {
// //   const [selectedJobType, setSelectedJobType] = useState<QueueJobType>(
// //     QueueJobType.SendEmail
// //   );
// //   const [jobData, setJobData] = useState<string>(
// //     JSON.stringify(getDefaultJobData(QueueJobType.SendEmail), null, 2) // Initialize with default for initial type
// //   );
// //   const [jobOptions, setJobOptions] = useState<string>(""); // Options as JSON string
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [successMessage, setSuccessMessage] = useState<string | null>(null);
// //   const [errorMessage, setErrorMessage] = useState<string | null>(null);



// //   const handleJobTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
// //     const newJobType = event.target.value as QueueJobType;
// //     setSelectedJobType(newJobType);
// //     // Pre-fill jobData with a sensible default for the newly selected type
// //     setJobData(JSON.stringify(getDefaultJobData(newJobType), null, 2));
// //     setErrorMessage(null); // Clear errors on type change
// //     setSuccessMessage(null);
// //   };

// //   const handleSubmit = async (event: FormEvent) => {
// //     event.preventDefault();
// //     setLoading(true);
// //     setSuccessMessage(null);
// //     setErrorMessage(null);

// //     let parsedData: JobData; // Now explicitly typed as JobData union
// //     let parsedOptions:  JobsOptions | undefined;

// //     try {
// //       // Parse the job data. It must conform to one of the JobData types.
// //       parsedData = jobData ? JSON.parse(jobData) : {};
// //       // You could add more specific validation here to ensure it matches
// //       // the selectedJobType's expected payload structure if needed.
// //     } catch (err) {
// //       setErrorMessage("Invalid JSON for Job Data.");
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       parsedOptions = jobOptions ? JSON.parse(jobOptions) : undefined;
// //     } catch (err) {
// //       setErrorMessage("Invalid JSON for Job Options.");
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       // addTask is now called with a correctly typed selectedJobType and parsedData
// //       const { jobId, jobName } = await addTaskAction(
// //         selectedJobType,
// //         parsedData,
// //         parsedOptions
// //       );
// //       setSuccessMessage(
// //         `Successfully added job! ID: ${jobId}, Name: ${jobName}`
// //       );
// //       setJobData(JSON.stringify(getDefaultJobData(selectedJobType), null, 2)); // Reset data to default
// //       setJobOptions(""); // Clear options
// //     } catch (error: any) {
// //       setErrorMessage(error.message || "An unknown error occurred.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div
// //       style={{
// //         padding: "20px",
// //         maxWidth: "600px",
// //         margin: "auto",
// //         border: "1px solid #ccc",
// //         borderRadius: "8px",
// //         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
// //       }}
// //     >
// //       <h2>Add New Queue Task</h2>
// //       <form onSubmit={handleSubmit}>
// //         <div style={{ marginBottom: "15px" }}>
// //           <label
// //             htmlFor="jobType"
// //             style={{
// //               display: "block",
// //               marginBottom: "5px",
// //               fontWeight: "bold",
// //             }}
// //           >
// //             Select Job Type:
// //           </label>
// //           <select
// //             id="jobType"
// //             value={selectedJobType}
// //             onChange={handleJobTypeChange}
// //             style={{
// //               width: "100%",
// //               padding: "8px",
// //               borderRadius: "4px",
// //               border: "1px solid #ddd",
// //             }}
// //           >
// //             {Object.values(QueueJobType).map((type) => (
// //               <option key={type} value={type}>
// //                 {type}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div style={{ marginBottom: "15px" }}>
// //           <label
// //             htmlFor="jobData"
// //             style={{
// //               display: "block",
// //               marginBottom: "5px",
// //               fontWeight: "bold",
// //             }}
// //           >
// //             Job Data (JSON):
// //           </label>
// //           <textarea
// //             id="jobData"
// //             value={jobData}
// //             onChange={(e) => setJobData(e.target.value)}
// //             rows={10} // Increased rows for more visibility of default data
// //             style={{
// //               width: "100%",
// //               padding: "8px",
// //               borderRadius: "4px",
// //               border: "1px solid #ddd",
// //               fontFamily: "monospace",
// //             }}
// //             placeholder="Enter job-specific data as a JSON object, e.g., {'to': 'email@example.com', 'subject': 'Hello', 'body': '...'}"
// //           />
// //           <small style={{ color: "#666" }}>
// //             Enter job-specific data as a JSON object. The structure depends on
// //             the selected job type.
// //           </small>
// //         </div>

// //         <div style={{ marginBottom: "20px" }}>
// //           <label
// //             htmlFor="jobOptions"
// //             style={{
// //               display: "block",
// //               marginBottom: "5px",
// //               fontWeight: "bold",
// //             }}
// //           >
// //             Job Options (JSON, optional):
// //           </label>
// //           <textarea
// //             id="jobOptions"
// //             value={jobOptions}
// //             onChange={(e) => setJobOptions(e.target.value)}
// //             rows={4}
// //             style={{
// //               width: "100%",
// //               padding: "8px",
// //               borderRadius: "4px",
// //               border: "1px solid #ddd",
// //               fontFamily: "monospace",
// //             }}
// //             placeholder="e.g., {'delay': 5000, 'attempts': 3}"
// //           />
// //           <small style={{ color: "#666" }}>
// //             Enter BullMQ JobsOptions as a JSON object (e.g., `delay`,
// //             `attempts`, `priority`).
// //           </small>
// //         </div>

// //         <button
// //           type="submit"
// //           disabled={loading}
// //           style={{
// //             padding: "10px 20px",
// //             backgroundColor: "#007bff",
// //             color: "white",
// //             border: "none",
// //             borderRadius: "4px",
// //             cursor: loading ? "not-allowed" : "pointer",
// //             fontSize: "16px",
// //             opacity: loading ? 0.7 : 1,
// //           }}
// //         >
// //           {loading ? "Adding Task..." : "Add Task to Queue"}
// //         </button>
// //       </form>

// //       {successMessage && (
// //         <div
// //           style={{
// //             marginTop: "20px",
// //             padding: "10px",
// //             backgroundColor: "#d4edda",
// //             color: "#155724",
// //             border: "1px solid #c3e6cb",
// //             borderRadius: "4px",
// //           }}
// //         >
// //           {successMessage}
// //         </div>
// //       )}

// //       {errorMessage && (
// //         <div
// //           style={{
// //             marginTop: "20px",
// //             padding: "10px",
// //             backgroundColor: "#f8d7da",
// //             color: "#721c24",
// //             border: "1px solid #f5c6cb",
// //             borderRadius: "4px",
// //           }}
// //         >
// //           Error: {errorMessage}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AddTask;

// // export const getDefaultJobData = (jobType: QueueJobType): JobData => {
// //   switch (jobType) {
// //     case QueueJobType.SendEmail:
// //       return {
// //         to: "recipient@example.com",
// //         subject: "Queue Notification",
// //         body: "This is a test email sent from the queue.",
// //       } as SendEmailPayload; // Type assertion helps here
// //     case QueueJobType.ProcessImage:
// //       return {
// //         imageUrl:
// //           "https://cdn.pixabay.com/photo/2023/10/24/09/35/nature-8337775_1280.jpg",
// //         filters: ["grayscale", "thumbnail"],
// //       } as ProcessImagePayload;
// //     case QueueJobType.GenerateReport:
// //       return {
// //         reportId: "sales_summary_q2",
// //         parameters: {
// //           startDate: "2025-04-01",
// //           endDate: "2025-06-30",
// //           region: "North America",
// //         },
// //       } as GenerateReportPayload;
// //     default:
// //       // Fallback for any unhandled new job types, though the switch should cover all `QueueJobType`
// //       return {} as JobData;
// //   }
// // };