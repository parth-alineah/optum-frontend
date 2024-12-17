export const x = 10

export const CURRENCY_SYMBOL = '₹'
export const limitOfPage = 10

export const enum TOAST_TYPES {
  SUCCESS = 'Success',
  ERROR = 'Error',
  WARN = 'Warning',
  INFO = 'Info',
}

export const enum ALIGN_DIALOG {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
}

export const splitDescription = (description: string, length?: number) => {
  const maxCharac = length ? length : 15
  if (description.length > maxCharac) {
    return description.slice(0, maxCharac).concat('...')
  } else {
    return description
  }
}

export const drawerWidth = 260

export const enum TABLES {
  NEW_REQUEST = 'NEW_REQUEST',
  OPEN_REQUEST = 'OPEN_REQUEST',
  CLOSE_REQUEST = 'CLOSE_REQUEST',
  PERSPECTIVE_PROVIDER = 'PERSPECTIVE_PROVIDER',
  PENDING_FOR_VERIFICATION = 'PENDING_FOR_VERIFICATION',
  VERIFICATION = 'VERIFICATION',
  PROVIDER_SEARCH = 'PROVIDER_SEARCH',
  RETURN_BY_LEGAL = 'RETURN_BY_LEGAL',
  MANAGE_SEARCH = 'MANAGE_SEARCH',
  NETWORK_VERIFICATION = 'NETWORK_VERIFICATION',
}

export enum EUserRole {
  Operation = 'Operation',
  Network = 'Network',
  Legal = 'Legal',
}

export enum EApprovalStatus {
  Approved = 'Approved',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

// export enum EZones {
//   North = 'North',
//   East = 'East',
//   West = 'West',
//   South = 'South',
// }

export enum EZones {
  NorthZone = 'NorthZone',
  EastZone = 'EastZone',
  WestZone = 'WestZone',
  SouthZone = 'SouthZone',
}

export const EZonesArray = Object.keys(EZones).map((key) => {
  return {
    _id: EZones[key],
    label: EZones[key],
  }
})

export enum ERequestType {
  Empanel = 'Empanel',
  Delist = 'Delist',
  Deactivate = 'Deactivate',
  Activate = 'Activate',
}

export enum EFdEmpanelProcessStatus {
  ForwardedToDC = 48,
  DocumentSubmittedByDC = 49,
  ForwardedToLegalAfterQC1 = 50,
  DocumentVerifiedByLegal = 51,
  IssueInDocument = 52,
  EmpanelmentSuccessful = 53,
}

export enum EFdStatus {
  Open = 2,
  Pending = 3,
  Resolved = 4,
  Closed = 5,
  ForwardedToDC = 48,
  DocumentSubmittedByDC = 49,
  ForwardedToLegalAfterQC1 = 50,
  DocumentVerifiedByLegal = 51,
  IssueInDocument = 52,
  EmpanelmentSuccessful = 53,
  ManualEmpanelmentStart = 54,
  ManualEmpanelmentSubmitted = 55,
  IssueInDocumentNw = 56,
  DocusignProcessStarted = 57,
  DocusignProcessCompleted = 58,
  IssueInDocumentByLegalForProvider = 59,
  DetailsUpdatedByTheDc = 60,
}

export enum EFdSource {
  Email = 1,
  Portal = 2,
  Phone = 3,
  Chat = 7,
  FeedbackWidget = 9,
  OutboundEmail = 10,
}

export enum EFdPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4,
}

export enum EFdAssociationType {
  Parent = 1,
  Child = 2,
  Tracker = 3,
  Related = 4,
}
