export interface Medicine {
  id: number
  name: string
  timeTags: string[]
  purposeTag: string
  level: "enough" | "half" | "empty"
  amountLeft: number
  unitPrice: number
  dailyNeeded: number
}

export interface Tag {
  id: number
  name: string
}

export interface MedicineSearchResult {
  title: string
  content: string
  error?: string
}

