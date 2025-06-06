"use client";

import { FC, FormEvent, useState } from "react";
import {
  GenerateReportPayload,
  JobData,
  ProcessImagePayload,
  QueueJobType,
  SendEmailPayload,
} from "@/types/types";
import { addTaskWithAction } from "@/actions/actions";
import { JobsOptions } from "bullmq";
import styles from "@/styles/add-task.module.css";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select"; // Specific type for MUI Select onChange

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

  const handleJobTypeChange = (event: SelectChangeEvent<QueueJobType>) => {
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
    <Paper
      elevation={3} // Provides a subtle shadow
      className={styles.addTaskContainer}
    >
      <Typography variant="h5" component="h1" sx={{ mb: 2.5 }}>
        {" "}
        Add New Queue Task
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {" "}
        <FormControl fullWidth sx={{ mb: 2 }}>
          {" "}
          <InputLabel id="job-type-select-label" size="small">
            Select Job Type
          </InputLabel>
          <Select
            labelId="job-type-select-label"
            id="jobType"
            value={selectedJobType}
            label="Select Job Type" // Required when using InputLabel
            onChange={handleJobTypeChange}
            size="small" // Compact size
          >
            {Object.values(QueueJobType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            id="jobData"
            label="Job Data (JSON)"
            multiline
            rows={10} // Matches original rows
            value={jobData}
            onChange={(e) => setJobData(e.target.value)}
            variant="outlined" // Standard Material-UI input style
            fullWidth
            placeholder="Enter job-specific data as a JSON object, e.g., {'to': 'email@example.com', 'subject': 'Hello', 'body': '...'}"
            size="small"
          />
          <FormHelperText sx={{ mt: 0.5 }}>
            {" "}
            Enter job-specific data as a JSON object. The structure depends on
            the selected job type.
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            id="jobOptions"
            label="Job Options (JSON, optional)"
            multiline
            rows={4} // Matches original rows
            value={jobOptions}
            onChange={(e) => setJobOptions(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder="e.g., {'delay': 5000, 'attempts': 3}"
            size="small"
          />
          <FormHelperText sx={{ mt: 0.5 }}>
            Enter BullMQ JobsOptions as a JSON object (e.g., `delay`,
            `attempts`, `priority`).
          </FormHelperText>
        </FormControl>
        <Box sx={{ mt: 2.5, mb: 2 }}>
          {" "}
          <Button
            type="submit"
            variant="contained" // Solid background button
            color="primary" // Uses primary theme color
            fullWidth // Spans the full width
            disabled={loading} // Disables button when loading
            startIcon={
              loading ? <CircularProgress size={16} color="inherit" /> : null
            } // MUI spinner
            sx={{ py: 1.25 }} // Custom padding for height (10px * 2 original)
          >
            {loading ? "Adding Task..." : "Add Task to Queue"}
          </Button>
        </Box>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mt: 2, fontSize: "0.875rem" }}>
          {" "}
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2, fontSize: "0.875rem" }}>
          {" "}
          {/* mt: 20px */}
          Error: {errorMessage}
        </Alert>
      )}
    </Paper>
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
