import { QueueInfo, QueueJobType } from "@/types/types";
import { Queue , JobsOptions   } from "bullmq";
import { FFMPEG_QUEUE } from "./constants";

if (!process.env.REDIS_HOST) {
  throw new Error(
    "REDIS_HOST environment variable is not set. It is required."
  );
}
if (!process.env.REDIS_PORT) {
  throw new Error(
    "REDIS_PORT environment variable is not set. It is required."
  );
}

// Convert port to a number, handling potential NaN if input is not a valid number string
const redisPort = parseInt(process.env.REDIS_PORT, 10);
if (isNaN(redisPort)) {
  throw new Error(
    `REDIS_PORT environment variable is not a valid number: ${process.env.REDIS_PORT}`
  );
}

// --- todo nath share this ???????????
const connectionOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS_ENABLED === "true" ? {} : undefined,
};

const queueName = FFMPEG_QUEUE;

const myQueue = new Queue(queueName, { connection: connectionOptions });

export async function getQueueInfo(): Promise<QueueInfo> {
  const waitingCount = await myQueue.getWaitingCount();
  const activeCount = await myQueue.getActiveCount();
  const delayedCount = await myQueue.getDelayedCount();
  const failedCount = await myQueue.getFailedCount();
  const completedCount = await myQueue.getCompletedCount();

  const totalQueueLength = waitingCount + activeCount + delayedCount;

  return {
    queueName: queueName,
    waiting: waitingCount,
    active: activeCount,
    delayed: delayedCount,
    failed: failedCount,
    completed: completedCount,
    totalQueueLength: totalQueueLength,
    isQueueHealthy: true,
  };
}

export async function addTask(
  jobName: QueueJobType,
  data: any,
  options?: JobsOptions  // Use BullMQ's JobsOptions  type
): Promise<{ jobId: string; jobName: string }> {
  try {
    const job = await myQueue.add(jobName, data, options);

    // BullMQ guarantees job.id and job.name are set after a successful add
    console.log(
      `[BullMQ] Added job: ID ${job.id}, Name: ${job.name}, Type: ${jobName}`
    );
    return { jobId: job.id!, jobName: job.name };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[BullMQ] Error adding job '${jobName}':`, errorMessage);
    throw new Error(`Failed to add job '${jobName}': ${errorMessage}`);
  }
}
