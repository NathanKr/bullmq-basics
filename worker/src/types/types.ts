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
export type JobData = SendEmailPayload | ProcessImagePayload | GenerateReportPayload;

export enum QueueJobType{
   SendEmail  = 'sendEmail',
   ProcessImage = 'processImage',
   GenerateReport = 'generateReport'
}