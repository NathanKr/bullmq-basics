
/**
 * Interface for the queue status object returned by getQueueCounts.
 */
export interface QueueInfo  {
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
