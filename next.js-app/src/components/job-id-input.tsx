'use client'

import  { useId, useState } from 'react';
import styles from '@/styles/job-id-input.module.css'; // Import the CSS Module
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
    <div className={styles.container}>
      <h1 className={styles.heading}>Track Job Status</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor={inputId} className={styles.label}>
            Enter Job ID:
          </label>
          <input
            type="text"
            id={inputId}
            value={jobIdInput}
            onChange={(e) => setJobIdInput(e.target.value)}
            placeholder="e.g., bullmq-job-123"
            className={styles.input}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.primaryButton}
          >
            Track Job
          </button>
          <button
            type="button"
            onClick={handleClear}
            className={styles.secondaryButton}
          >
            Clear
          </button>
        </div>
      </form>

      {submittedJobId && (
        <div className={styles.pollerWrapper}>
          <JobStatusPoller jobId={submittedJobId} />
        </div>
      )}
    </div>
  );
}

