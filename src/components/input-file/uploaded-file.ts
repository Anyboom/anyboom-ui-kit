export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  buffer: ArrayBuffer
  blob: File
  timestamp: number
  extension: string
}
