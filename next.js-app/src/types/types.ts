/**
 * Interface for the queue status object returned by getQueueCounts.
 */
export interface QueueInfo {
  queueName: string;
  waiting: number; // Jobs waiting to be processed
  active: number; // Jobs currently being processed by a worker
  delayed: number; // Jobs scheduled to be processed at a future time
  failed: number; // Jobs that failed to complete
  completed: number; // Jobs that completed successfully
  totalQueueLength: number; // Sum of waiting, active, and delayed jobs
  isQueueHealthy: boolean; // Simple indicator of whether counts could be retrieved
  error?: string; // Error message if retrieval failed
}

export enum QueueJobType {
  SendEmail = "sendEmail",
  ProcessImage = "processImage",
  GenerateReport = "generateReport",
}

// Define interfaces for the different job payloads
export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface ProcessImagePayload {
  imageUrl: string;
  filters: string[];
}

export interface GenerateReportPayload {
  reportId: string;
  parameters: {
    startDate: string;
    endDate: string;
    [key: string]: any; // Allow for additional, flexible parameters
  };
}

// Union type for all possible job data payloads
export type JobData =
  | SendEmailPayload
  | ProcessImagePayload
  | GenerateReportPayload;

export interface JobStatus {
  jobId: string;
  status:
    | "active"
    | "completed"
    | "failed"
    | "waiting"
    | "delayed"
    | "stuck"
    | "paused"
    | "not-found"
    | "error";
  result?: any; // You might want to make this more specific later
  failedReason?: string;
  progress?: number;
  error?: string; // For explicit error returns from the action
}
