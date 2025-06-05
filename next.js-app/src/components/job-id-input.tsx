'use client';

import { useId, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack
} from '@mui/material';
import styles from '@/styles/job-id-input.module.css'; // Adjust path if needed
import JobStatusPoller from './job-status-poller';

export default function JobIdInput() {
  const [jobIdInput, setJobIdInput] = useState('');
  const [submittedJobId, setSubmittedJobId] = useState<string | null>(null);
  const inputId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobIdInput.trim()) {
      setSubmittedJobId(jobIdInput.trim());
    }
  };

  const handleClear = () => {
    setJobIdInput('');
    setSubmittedJobId(null);
  };

  return (
    <Paper elevation={3} className={styles.customContainer}>
      <Typography variant="h5" component="h1" align="center" sx={{ mb: 3 }}>
        Track Job Status
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          id={inputId}
          label="Enter Job ID"
          variant="outlined"
          fullWidth
          value={jobIdInput}
          onChange={(e) => setJobIdInput(e.target.value)}
          placeholder="e.g., bullmq-job-123"
          size="small"
        />

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!jobIdInput.trim()}
          >
            Track Job
          </Button>
          <Button
            type="button"
            onClick={handleClear}
            variant="outlined"
            color="secondary"
          >
            Clear
          </Button>
        </Stack>
      </Box>

      {submittedJobId && (
        <Paper
          elevation={1}
          className={styles.pollerWrapper} // <-- Apply the CSS Module class here
        >
          <JobStatusPoller jobId={submittedJobId} />
        </Paper>
      )}
    </Paper>
  );
}
