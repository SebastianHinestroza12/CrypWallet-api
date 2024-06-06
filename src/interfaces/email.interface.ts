export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{ filename: string; path: string }>;
}
