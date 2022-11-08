export type ReportState = {
  dataCount: number,
  reportFunc: (page: number) => Promise<void>
}