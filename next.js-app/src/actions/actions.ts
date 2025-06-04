"use server";

import { addTask } from "@/logic/queue-utils";
import { QueueJobType } from "@/types/types";
import { JobsOptions } from "bullmq";

export async function addTaskAction(
  jobName: QueueJobType,
  data: any,
  options?: JobsOptions
): Promise<{ jobId: string; jobName: string }> {
  return addTask(jobName, data, options);
}
