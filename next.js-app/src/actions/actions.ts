"use server";

import { addTask, getJobStatus } from "@/logic/queue-utils";
import { JobStatus, QueueJobType } from "@/types/types";
import { JobsOptions } from "bullmq";

export async function addTaskWithAction(
  jobName: QueueJobType,
  data: any,
  options?: JobsOptions
): Promise<{ jobId: string; jobName: string }> {
  return addTask(jobName, data, options);
}

export async function getJobStatusWithAction(
  jobId: string
): Promise<JobStatus> {
  return getJobStatus(jobId);
}
