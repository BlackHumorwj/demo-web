export interface ReviewComment {
  id: string
  pagePath: string
  elementSelector: string
  elementLabel: string
  content: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'resolved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export type LogicType = 'rule' | 'calculation' | 'validation' | 'transformation' | 'formatting'

export interface LogicComment {
  id: string
  pagePath: string
  logicKey: string
  logicType: LogicType
  logicLabel: string
  logicDescription: string
  content: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'resolved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface ReviewState {
  isReviewMode: boolean
  comments: ReviewComment[]
  activeElement: string | null
}

export interface ReviewExportItem {
  pagePath: string
  pageName: string
  comments: ReviewComment[]
}