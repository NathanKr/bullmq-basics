import { Worker, Job, JobData } from "bullmq";
import {
  GenerateReportPayload,
  ProcessImagePayload,
  QueueJobType,
  SendEmailPayload,
} from "../types/types";
import {
  FFMPEG_QUEUE,
  REDIS_CONCURRENCY,
  REDIS_HOST,
  REDIS_PORT,
} from "./constants";
import { generateReport, processImage, sendEmail } from "./tasks-handlers";

const queueName = FFMPEG_QUEUE;

// Define the processor function type for clarity, though BullMQ infers it well
// The 'job' parameter is typed as Job<JobData> to ensure type safety when accessing job.data
const myWorker = new Worker<JobData>(
  queueName,
  async (job: Job<JobData>) => {
    // This is your processor function
    // The 'job' object contains all the information about the task
    console.log(`Processing job ${job.id} with name: ${job.name}`);

    // Access the payload (data)
    // We use type assertions here to narrow down the type of taskPayload
    // based on the job.name, ensuring type safety for specific properties.
    const taskPayload = job.data;
    console.log("Task Payload:", taskPayload);

    // Now, based on the job.name and/or the taskPayload,
    // you execute the appropriate code.

    if (job.name === QueueJobType.SendEmail) {
      const emailPayload = taskPayload as unknown as SendEmailPayload;
      await sendEmail(emailPayload.to, emailPayload.subject, emailPayload.body);
    } else if (job.name === QueueJobType.ProcessImage) {
      const imagePayload = taskPayload as unknown as ProcessImagePayload;
      await processImage(imagePayload.imageUrl, imagePayload.filters);
    } else if (job.name === QueueJobType.GenerateReport) {
      const reportPayload = taskPayload as unknown as GenerateReportPayload;
      await generateReport(reportPayload.reportId, reportPayload.parameters);
    } else {
      console.warn(`Unknown job name: ${job.name}`);
    }

    // You can also update job progress
    await job.updateProgress(50);

    // You can return a value from the job, which can be accessed later
    // The return type of the processor function is inferred, but can also be explicitly typed
    return { status: "success", message: "Job completed!" };
  },
  {
    connection: {
      host: REDIS_HOST,
      port: REDIS_PORT, 
    },
    concurrency: REDIS_CONCURRENCY, 
  }
);

myWorker.on("ready", () => {
  console.log(`Worker instance ID: ${myWorker.id}`);
  console.log(`Node.js Process ID (PID): ${process.pid}`);
  console.log("Worker ready and waiting for jobs..."); // Adjust your existing log
});

// Event listeners also benefit from strong typing for the 'job' object
myWorker.on("completed", (job: Job<JobData>, result: any) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

myWorker.on("failed", (job: Job<JobData> | undefined, err: Error) => {
  // job can be undefined in some error scenarios, so we check
  console.error(`Job ${job?.id} failed with error:`, err.message);
});

myWorker.on("error", (err: Error) => {
  console.error("Worker error:", err);
});

