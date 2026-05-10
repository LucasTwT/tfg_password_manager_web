export interface ClipboardAPI {
  write(text: string): Promise<void>
  read(): Promise<string>
}
