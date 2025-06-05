import { GenerateReportPayload } from "../types/types";

// Example dummy functions that your worker might call
export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<void> {
  console.log(`Sending email to ${to} with subject: ${subject}`);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async work
  console.log("Email sent!");
}

export async function processImage(
  imageUrl: string,
  filters: string[]
): Promise<void> {
  console.log(`Processing image ${imageUrl} with filters: ${filters}`);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("Image processed!");
}

export async function generateReport(
  reportId: string,
  parameters: GenerateReportPayload["parameters"]
): Promise<void> {
  console.log(`Generating report ${reportId} with parameters:`, parameters);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Report generated!");
}
