export interface ProcessResponse {
  success: true;
  url: string;
  publicId: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse = ProcessResponse | ErrorResponse;

export interface DeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export type ProcessingStatus =
  | 'idle'
  | 'uploading'
  | 'removing-bg'
  | 'flipping'
  | 'hosting'
  | 'done'
  | 'error';
