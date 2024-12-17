import { EZones } from '@/utils/constants'

export type EmpanelmentAddFields = {
  basicDetails: {
    providerName: string
    pincodeId: string
    pincode: string
    state: string
    city: string
    zone: EZones
    addressLineOne: string
    addressLineTwo: string
    landmark: string
    telephone: string
    website: string
    fax: string
    longitude: string
    latitude: string
    gmapLink: string
  }
  contactDetails: {
    primaryContactName: string
    primaryContactEmail: string
    secondaryContactName: string
    secondaryContactEmail: string
  }
  ownershipDetails: {
    ownershipTypeId: EOwnershipTypes
    ownershipName: string
    cuin: string
    panName: string
    panNo: string
    aadharName: string
    aadharNo: string
    officeAddressLineOne: string
    officeAddressLineTwo: string
    officeState: string
    officeCity: string
    authorizedSignatoryName: string
    authorizedSignatoryDesignation: string
    authorizedSignatoryEmail: string
    ownerContactNo: string
  }
  bankDetails: {
    bankAccName: string
    bankAccNo: string
    bankAccIFSC: string
    bankName: string
    bankBranch: string
    bankAccType: EBankAccTypes
  }
}

export enum EOwnershipTypes {
  'Sole Proprietorship' = 'Sole Proprietorship',
  'LLP/Partnership' = 'LLP/Partnership',
  'Private Limited' = 'Private Limited',
}

export const EOwnershipTypesArray = Object.keys(EOwnershipTypes).map((key) => {
  return {
    _id: EOwnershipTypes[key],
    label: EOwnershipTypes[key],
  }
})

export enum EBankAccTypes {
  Savings = 'Savings',
  Current = 'Current',
}

export const EBankAccTypesArray = Object.keys(EBankAccTypes).map((key) => {
  return {
    _id: EBankAccTypes[key],
    label: EBankAccTypes[key],
  }
})

export enum EStaffType {
  Pathologist = 'Pathologist',
  Cardiologist = 'Cardiologist',
  Radiologist = 'Radiologist',
  Gynecologist = 'Gynecologist',
  MBBS = 'MBBS',
}

export const staffTypes = [
  EStaffType.Pathologist,
  EStaffType.Cardiologist,
  EStaffType.Radiologist,
  EStaffType.Gynecologist,
  EStaffType.MBBS,
]

export type VerifyEmpanelment = {
  status: string
  remark: string
  id: string
  legalUnverifiedFields?: string[]
  nwUnverifiedFields?:string[]
}

export enum EGender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export const EGenderArray = Object.keys(EGender).map((key) => {
  return {
    _id: EGender[key],
    label: EGender[key],
  }
})
