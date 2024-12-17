import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
} from '@mui/material'
import {
  ErrorOption,
  Field,
  FieldArray,
  FieldArrayPath,
  FieldError,
  FieldErrors,
  FieldName,
  FieldRefs,
  FieldValues,
  FormState,
  InternalFieldName,
  RegisterOptions,
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormRegisterReturn,
} from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import { Controls, HandleControls, HeadCell, SearchDDL } from '@/types/common'
import { limitOfPage, TABLES } from '@/utils/constants'
import React, { useEffect, useState } from 'react'
import {
  acDefaultValue,
  dateAndTimeSelectValidation,
  numberFieldValidation,
  searchSelectValidation,
  txtFieldValidation,
} from '@/utils/form.validation'
import TxtInput from '@/components/TxtInput'
import { theme } from '@/context/ThemeProvider'
import NumInput from '@/components/NumInput'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SelectInput from '@/components/SelectInput'
import {
  EBankAccTypesArray,
  EGenderArray,
  EOwnershipTypesArray,
  EStaffType,
  staffTypes,
} from '@/types/empanelmentAdd'
import {
  dropdownCategory,
  dropdownCouncil,
  dropdownOwnership,
  dropdownQualification,
  getLabTests,
} from '@/lib/dropdown'
import {
  createManualEmpanelment,
  createPartialManualEmpanelment,
  getDataFromId,
} from '@/lib/manualEmpanelment'
import { searchPincode } from '@/lib/empanelmentRequest'
import { createAutoEmpanelment } from '@/lib/autoEmpanelment'
import CheckInput from '@/components/CheckInput'
import ProgressBar from '@/components/ProgressBar'
import { EEmpanelmentType } from '@/types/perspectiveProvider'
import { verifyBankDetailsFrs, verifyPancardDetailsFrs } from '@/lib/verifyData'
import { DateInput } from '@/components/DateInput'
import { format } from 'date-fns'
import Table from '@/components/Table'
import { useNotFound } from '@/context/NotFound'
import _ from 'lodash'
import HoverIcon from 'src/components/HoverIcon'

type Props = {}

const ManualEmpanelmentPage = (props: Props) => {
  const nav = useNavigate()
  const state = useLocation()
  const { setLoading } = useLoading()
  const showToast = useToast()
  const [data, setData] = useState(null)

  //default controls
  const defaultControls = {
    search: '',
    currentPage: 1,
    limitPerPage: limitOfPage,
    sortParam: 'createdAt',
    sortOrder: -1,
  }

  // Record and Control States
  const [councilData, setCouncilData] = useState<SearchDDL[]>([])
  const [qualificationData, setQualificationData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<SearchDDL[]>([])
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [labTestData, setLabTestData] = useState<any[]>([])
  const [ownershipData, setOwnershipData] = useState<SearchDDL[]>([])
  const [accordionExpand, setAccordionExpand] = useState({
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
  })
  const [validate, setValidate] = useState(null)
  const [isFinalSave, setIsFinalSave] = useState(false)
  const [validateForm, setValidateForm] = useState(true)
  const [progress, setProgress] = useState(0)
  const [aadharVerify, setAadharVerify] = useState(false)
  const [panVerify, setPanVerify] = useState(false)
  const [bankVerify, setBankVerify] = useState(false)

  const { pathname } = useLocation()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]

  const getExpanded = (panel: string) => {
    return accordionExpand?.[panel] ?? false
  }

  const setExpanded = (panel: string, isExpanded: boolean) => {
    setAccordionExpand({
      ...accordionExpand,
      [panel]: isExpanded,
    })
  }

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    reset,
    getValues,
    formState,
    watch,
  } = useForm({
    defaultValues: {
      basicDetails: {
        providerName: '',
        pincodeId: '',
        pincode: '',
        state: '',
        city: '',
        zone: '',
        addressLineOne: '',
        addressLineTwo: '',
        landmark: '',
        telephone: '',
        website: '',
        fax: '',
        longitude: '',
        latitude: '',
        googlePlusCode: '',
      },
      contactDetails: {
        primaryContactName: '',
        primaryContactEmail: '',
        reenterPrimaryContactEmail: '',
        secondaryContactName: '',
        secondaryContactEmail: '',
        reenterSecondaryContactEmail: '',
      },
      ownershipDetails: {
        ownershipTypeId: acDefaultValue,
        ownershipName: '',
        cuin: '',
        panName: '',
        panNo: '',
        panDob: null,
        aadharName: '',
        aadharNo: '',
        officeAddressLineOne: '',
        officeAddressLineTwo: '',
        officeState: '',
        officeCity: '',
        officePincode: '',
        authorizedSignatoryName: '',
        authorizedSignatoryDesignation: '',
        authorizedSignatoryEmail: '',
        ownerContactNo: '',
      },
      bankDetails: {
        bankAccName: '',
        bankAccNo: '',
        bankAccIFSC: '',
        bankName: '',
        bankBranch: '',
        bankAccType: acDefaultValue,
        bankBranchCity: '',
      },
      documents: [],
      availableTestIds: [],
      tempProspectiveProviderId: lastSegment,
      staff: [...Array(5)].map(() => ({
        isAvailable: false,
        type: '',
        name: '',
        qualificationId: acDefaultValue,
        otherQualification: '',
        registrationNo: '',
        councilId: acDefaultValue,
        otherCouncil: '',
        gender: acDefaultValue,
      })),
      isFinalSave: true,
    },
  })

  const getData = async () => {
    const response = await getDataFromId(setLoading, showToast, lastSegment)
    if (response) {
      setData(response?.data)
      if (response?.data?.partialEmpanelmentStarted) {
        setValue('basicDetails.zone', response?.data?.partialEmpanelment?.basicDetails?.zone)
        setValue(
          'basicDetails.pincodeId',
          response?.data?.partialEmpanelment?.basicDetails?.pincodeId,
        )
        setValue('basicDetails.pincode', response?.data?.partialEmpanelment?.basicDetails?.pincode)
        setValue('basicDetails.state', response?.data?.partialEmpanelment?.basicDetails?.state)
        setValue('basicDetails.city', response?.data?.partialEmpanelment?.basicDetails?.city)
        setValue(
          'basicDetails.providerName',
          response?.data?.partialEmpanelment?.basicDetails?.providerName,
        )
        setValue(
          'basicDetails.addressLineOne',
          response?.data?.partialEmpanelment?.basicDetails?.addressLineOne,
        )
        setValue(
          'basicDetails.addressLineTwo',
          response?.data?.partialEmpanelment?.basicDetails?.addressLineTwo,
        )
        setValue(
          'basicDetails.landmark',
          response?.data?.partialEmpanelment?.basicDetails?.landmark,
        )
        setValue(
          'basicDetails.telephone',
          response?.data?.partialEmpanelment?.basicDetails?.telephone,
        )
        setValue('basicDetails.website', response?.data?.partialEmpanelment?.basicDetails?.website)
        setValue('basicDetails.fax', response?.data?.partialEmpanelment?.basicDetails?.fax)
        setValue(
          'basicDetails.longitude',
          response?.data?.partialEmpanelment?.basicDetails?.longitude,
        )
        setValue(
          'basicDetails.latitude',
          response?.data?.partialEmpanelment?.basicDetails?.latitude,
        )
        setValue(
          'basicDetails.googlePlusCode',
          response?.data?.partialEmpanelment?.basicDetails?.googlePlusCode,
        )

        setValue(
          'contactDetails.primaryContactName',
          response?.data?.partialEmpanelment?.contactDetails?.primaryContactName,
        )
        setValue(
          'contactDetails.primaryContactEmail',
          response?.data?.partialEmpanelment?.contactDetails?.primaryContactEmail,
        )
        setValue(
          'contactDetails.reenterPrimaryContactEmail',
          response?.data?.partialEmpanelment?.contactDetails?.primaryContactEmail,
        )
        setValue(
          'contactDetails.secondaryContactName',
          response?.data?.partialEmpanelment?.contactDetails?.secondaryContactName,
        )
        setValue(
          'contactDetails.secondaryContactEmail',
          response?.data?.partialEmpanelment?.contactDetails?.secondaryContactEmail,
        )
        setValue(
          'contactDetails.reenterSecondaryContactEmail',
          response?.data?.partialEmpanelment?.contactDetails?.secondaryContactEmail,
        )

        setValue(
          'ownershipDetails.ownershipTypeId',
          response?.data?.partialEmpanelment?.ownershipDetails?.ownershipType
            ? {
                _id: response?.data?.partialEmpanelment?.ownershipDetails?.ownershipType?._id,
                label: response?.data?.partialEmpanelment?.ownershipDetails?.ownershipType?.name,
              }
            : acDefaultValue,
        )
        setValue(
          'ownershipDetails.ownershipName',
          response?.data?.partialEmpanelment?.ownershipDetails?.ownershipName,
        )
        setValue(
          'ownershipDetails.cuin',
          response?.data?.partialEmpanelment?.ownershipDetails?.cuin,
        )
        setValue(
          'ownershipDetails.panName',
          response?.data?.partialEmpanelment?.ownershipDetails?.panName,
        )
        setValue(
          'ownershipDetails.panNo',
          response?.data?.partialEmpanelment?.ownershipDetails?.panNo,
        )
        setValue(
          'ownershipDetails.panDob',
          response?.data?.partialEmpanelment?.ownershipDetails?.panDob,
        )
        setValue(
          'ownershipDetails.aadharName',
          response?.data?.partialEmpanelment?.ownershipDetails?.aadharName,
        )
        setValue(
          'ownershipDetails.aadharNo',
          response?.data?.partialEmpanelment?.ownershipDetails?.aadharNo,
        )
        setValue(
          'ownershipDetails.ownerContactNo',
          response?.data?.partialEmpanelment?.ownershipDetails?.ownerContactNo,
        )
        setValue(
          'ownershipDetails.officeAddressLineOne',
          response?.data?.partialEmpanelment?.ownershipDetails?.officeAddressLineOne,
        )
        setValue(
          'ownershipDetails.officeAddressLineTwo',
          response?.data?.partialEmpanelment?.ownershipDetails?.officeAddressLineTwo,
        )
        setValue(
          'ownershipDetails.officeState',
          response?.data?.partialEmpanelment?.ownershipDetails?.officeState,
        )
        setValue(
          'ownershipDetails.officeCity',
          response?.data?.partialEmpanelment?.ownershipDetails?.officeCity,
        )
        setValue(
          'ownershipDetails.officePincode',
          response?.data?.partialEmpanelment?.ownershipDetails?.officePincode,
        )
        setValue(
          'ownershipDetails.authorizedSignatoryName',
          response?.data?.partialEmpanelment?.ownershipDetails?.authorizedSignatoryName,
        )
        setValue(
          'ownershipDetails.authorizedSignatoryDesignation',
          response?.data?.partialEmpanelment?.ownershipDetails?.authorizedSignatoryDesignation,
        )
        setValue(
          'ownershipDetails.authorizedSignatoryEmail',
          response?.data?.partialEmpanelment?.ownershipDetails?.authorizedSignatoryEmail,
        )

        setValue(
          'bankDetails.bankAccIFSC',
          response?.data?.partialEmpanelment?.bankDetails?.bankAccIFSC,
        )
        setValue(
          'bankDetails.bankAccName',
          response?.data?.partialEmpanelment?.bankDetails?.bankAccName,
        )
        setValue(
          'bankDetails.bankAccNo',
          response?.data?.partialEmpanelment?.bankDetails?.bankAccNo,
        )
        setValue(
          'bankDetails.bankBranch',
          response?.data?.partialEmpanelment?.bankDetails?.bankBranch,
        )
        setValue('bankDetails.bankName', response?.data?.partialEmpanelment?.bankDetails?.bankName)
        setValue(
          'bankDetails.bankBranchCity',
          response?.data?.partialEmpanelment?.bankDetails?.bankBranchCity,
        )
        setValue(
          'bankDetails.bankAccType',
          response?.data?.partialEmpanelment?.bankDetails?.bankAccType
            ? {
                _id: response?.data?.partialEmpanelment?.bankDetails?.bankAccType,
                label: response?.data?.partialEmpanelment?.bankDetails?.bankAccType,
              }
            : acDefaultValue,
        )

        response?.data?.partialEmpanelment?.staff?.forEach((x, i) => {
          const index = staffTypes.findIndex((y) => x.staffType === y)
          if (index >= 0) {
            setValue(`staff.${index}.isAvailable`, x?.isAvailable || false)
            setValue(`staff.${index}.type`, x?.type || '')
            setValue(`staff.${index}.name`, x?.name || '')
            setValue(
              `staff.${index}.qualificationId`,
              x?.qualificationId && x?.qualification
                ? { _id: x?.qualificationId, label: x?.qualification?.displayName }
                : acDefaultValue,
            )
            setValue(`staff.${index}.otherQualification`, x?.otherQualification || '')
            setValue(`staff.${index}.registrationNo`, x?.registrationNo || '')
            setValue(
              `staff.${index}.councilId`,
              x?.councilId && x?.council
                ? { _id: x?.councilId, label: x?.council?.displayName }
                : acDefaultValue,
            )
            setValue(`staff.${index}.otherCouncil`, x?.otherCouncil || '')
            setValue(
              `staff.${index}.gender`,
              x?.gender ? { _id: x?.gender, label: x?.gender } : acDefaultValue,
            )
          } else {
            setValue(`staff.${i}.isAvailable`, false)
            setValue(`staff.${i}.type`, '')
            setValue(`staff.${i}.name`, '')
            setValue(`staff.${i}.qualificationId`, acDefaultValue)
            setValue(`staff.${i}.otherQualification`, '')
            setValue(`staff.${i}.registrationNo`, '')
            setValue(`staff.${i}.councilId`, acDefaultValue)
            setValue(`staff.${i}.otherCouncil`, '')
            setValue(`staff.${i}.gender`, acDefaultValue)
          }
        })
      } else {
        setValue('basicDetails.zone', response?.data?.zone)
        setValue('basicDetails.pincodeId', response?.data?.pincodeId)
        setValue('basicDetails.pincode', response?.data?.pincode?.pincode)
        setValue('basicDetails.state', response?.data?.pincode?.state)
        setValue('basicDetails.city', response?.data?.pincode?.city)
        setValue('basicDetails.providerName', response?.data?.providerName)
      }
    }
  }

  const getCouncilData = async () => {
    const res = await dropdownCouncil(setLoading, showToast)
    if (res) {
      setCouncilData(res)
    }
  }

  const getQualificationData = async () => {
    const res = await dropdownQualification(setLoading, showToast)
    if (res) {
      setQualificationData(res)
    }
  }

  const getCategoryData = async () => {
    const res = await dropdownCategory(setLoading, showToast, true)
    if (res) {
      setCategoryData(res)
      getLabTestData(res[0]?._id)
      setSelectedCategory(res[0])
    }
  }

  const getOwnershipData = async () => {
    const res = await dropdownOwnership(setLoading, showToast)
    if (res) {
      setOwnershipData(res)
    }
  }

  useEffect(() => {
    getCouncilData()
    getQualificationData()
    getOwnershipData()
    getCategoryData()
  }, [])

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    const calculateProgressInner = () => {
      const totalFields = requiredFields.length
      const filledFields = requiredFields.filter((fieldName: any) => getValues(fieldName)).length
      return (filledFields / totalFields) * 100
    }
    const progressPercentage = calculateProgressInner()
    setProgress(progressPercentage)
    if (data?.partialEmpanelmentStarted) {
      if (
        data?.partialEmpanelment?.ownershipDetails &&
        data?.partialEmpanelment?.ownershipDetails?.aadharNo &&
        data?.partialEmpanelment?.ownershipDetails?.aadharNo !== ''
      ) {
        setAadharVerify(true)
      }
      if (
        data?.partialEmpanelment?.ownershipDetails &&
        data?.partialEmpanelment?.ownershipDetails?.panNo &&
        data?.partialEmpanelment?.ownershipDetails?.panNo !== ''
      ) {
        setPanVerify(true)
      }
      if (
        data?.partialEmpanelment?.bankDetails &&
        data?.partialEmpanelment?.bankDetails?.bankAccNo &&
        data?.partialEmpanelment?.bankDetails?.bankAccNo !== ''
      ) {
        setBankVerify(true)
      }
    }
  }, [data])

  const onSubmitHandle: SubmitHandler<any> = async (data) => {
    console.log('enter')

    // const { reenterPrimaryContactEmail, reenterSecondaryContactEmail, ...updateContactDetails } =
    //   data.contactDetails

    // const newData = {
    //   staff: data?.staff
    //     ?.map((s, index) => {
    //       if (s?.isAvailable) {
    //         return {
    //           ...s,
    //           staffType: staffTypes[index],
    //           qualificationId: s?.qualificationId?._id,
    //           councilId: s?.councilId?._id,
    //           otherQualification: '',
    //           otherCouncil: '',
    //           gender: s?.gender?._id,
    //         }
    //       }
    //     })
    //     .filter((x) => x && x),
    //   basicDetails: data?.basicDetails,
    //   contactDetails: updateContactDetails,
    //   ownershipDetails: {
    //     ...data?.ownershipDetails,
    //     ownershipTypeId: data?.ownershipDetails?.ownershipTypeId?._id,
    //   },
    //   bankDetails: {
    //     ...data?.bankDetails,
    //     bankAccType: data?.bankDetails?.bankAccType?._id,
    //   },
    //   documents: data?.documents,
    //   availableTestIds: data?.availableTestIds,
    //   tempProspectiveProviderId: data?.tempProspectiveProviderId,
    // }
    if (segments[2] === 'auto-empanelment') {
      const res = await createAutoEmpanelment(setLoading, showToast, {
        tempProspectiveProviderId: data?.tempProspectiveProviderId,
      } as any)
      if (res?.success) {
        // nav('/network-verification')
        nav('/thankyou')
        // reset()
        getData()
      }
    } else {
      const res = await createManualEmpanelment(setLoading, showToast, {
        tempProspectiveProviderId: data?.tempProspectiveProviderId,
      } as any)
      if (res?.success) {
        nav('/dashboard?tab=3')
        // reset()
        // getData()
      }
    }
  }

  const generateRequiredFields = () => {
    const basicDetailsFields = [
      'providerName',
      'pincode',
      'state',
      'city',
      'addressLineOne',
      'addressLineTwo',
      'landmark',
      'telephone',
      'website',
      'latitude',
      'longitude',
      'googlePlusCode',
    ].map((field) => `basicDetails.${field}`)

    const contactDetailsFields = [
      'primaryContactName',
      'primaryContactEmail',
      'reenterPrimaryContactEmail',
      'secondaryContactName',
      'secondaryContactEmail',
      'reenterSecondaryContactEmail',
    ].map((field) => `contactDetails.${field}`)

    const ownershipDetailsFieldsList = [
      'ownershipTypeId',
      'ownershipName',
      'cuin',
      'panName',
      'panNo',
      'panDob',
      'aadharName',
      'aadharNo',
      'officeAddressLineOne',
      'officeAddressLineTwo',
      'officeState',
      'officeCity',
      'officePincode',
      'authorizedSignatoryName',
      'authorizedSignatoryDesignation',
      'authorizedSignatoryEmail',
      'ownerContactNo',
    ].map((field) => `ownershipDetails.${field}`)

    const bankDetailsFieldsList = [
      'bankAccName',
      'bankAccNo',
      'bankAccIFSC',
      'bankName',
      'bankBranch',
      'bankAccType',
      'bankBranchCity',
    ].map((field) => `bankDetails.${field}`)

    return [
      ...basicDetailsFields,
      ...contactDetailsFields,
      ...ownershipDetailsFieldsList,
      ...bankDetailsFieldsList,
    ]
  }

  const requiredFields = generateRequiredFields()

  const onPartialSaveBasicDetails: SubmitHandler<any> = async (data) => {
    requiredFields.forEach((field: any) => {
      setValidate(false)
      clearErrors(field)
    })
    if (segments[2] === 'auto-empanelment') {
      const res = await createPartialManualEmpanelment(setLoading, showToast, {
        basicDetails: data?.basicDetails,
        tempProspectiveProviderId: lastSegment,
        empanelType: EEmpanelmentType.Auto,
      } as any)
      if (res?.success) {
        getData()
      }
    } else {
      const res = await createPartialManualEmpanelment(setLoading, showToast, {
        basicDetails: data?.basicDetails,
        tempProspectiveProviderId: lastSegment,
        empanelType: EEmpanelmentType.Manual,
      } as any)
      if (res?.success) {
        getData()
      }
    }
  }

  const onPartialSaveContact: SubmitHandler<any> = async (data) => {
    const contactDetailsFields = [
      'primaryContactName',
      'primaryContactEmail',
      'reenterPrimaryContactEmail',
      'secondaryContactName',
      'secondaryContactEmail',
      'reenterSecondaryContactEmail',
    ]
    contactDetailsFields.forEach((field: any) => {
      setValidate(false)
      clearErrors(`contactDetails.${field}` as any)
    })
    const { reenterPrimaryContactEmail, reenterSecondaryContactEmail, ...updateContactDetails } =
      data.contactDetails
    if (segments[2] === 'auto-empanelment') {
      const res = await createPartialManualEmpanelment(setLoading, showToast, {
        contactDetails: updateContactDetails,
        tempProspectiveProviderId: lastSegment,
        empanelType: EEmpanelmentType.Auto,
      } as any)
      if (res?.success) {
        getData()
      }
    } else {
      const res = await createPartialManualEmpanelment(setLoading, showToast, {
        contactDetails: updateContactDetails,
        tempProspectiveProviderId: lastSegment,
        empanelType: EEmpanelmentType.Manual,
      } as any)
      if (res?.success) {
        getData()
      }
    }
  }

  const onPartialSaveOwnership: SubmitHandler<any> = async (data) => {
    requiredFields.forEach((field: any) => {
      setValidate(false)
      clearErrors(field)
    })

    const { panName, panNo, panDob, aadharName, aadharNo, ...updateOwnershipDetails } =
      data.ownershipDetails

    if (segments[2] === 'auto-empanelment') {
      const res = await createPartialManualEmpanelment(setLoading, showToast, {
        ownershipDetails: {
          ...data.ownershipDetails,
          ownershipTypeId:
            data?.ownershipDetails?.ownershipTypeId?._id !== '00'
              ? data?.ownershipDetails?.ownershipTypeId?._id
              : undefined,
        },
        tempProspectiveProviderId: lastSegment,
        empanelType: EEmpanelmentType.Auto,
      } as any)
      if (res?.success) {
        getData()
      }
    } else {
      const res = await createPartialManualEmpanelment(setLoading, showToast, {
        ownershipDetails: {
          ...data.ownershipDetails,
          ownershipTypeId:
            data?.ownershipDetails?.ownershipTypeId?._id !== '00'
              ? data?.ownershipDetails?.ownershipTypeId?._id
              : undefined,
        },
        tempProspectiveProviderId: lastSegment,
        empanelType: EEmpanelmentType.Manual,
      } as any)
      if (res?.success) {
        getData()
      }
    }
  }

  const calculateProgress = () => {
    const totalFields = requiredFields.length
    const filledFields = requiredFields.filter((fieldName: any) => getValues(fieldName)).length
    return (filledFields / totalFields) * 100
  }

  const onPartialSaveBanking: SubmitHandler<any> = async (data) => {
    const bankDetailsFieldsList = [
      'bankAccName',
      'bankAccNo',
      'bankAccIFSC',
      'bankName',
      'bankBranch',
      'bankAccType',
      'bankBranchCity',
    ].map((field) => `bankDetails.${field}`)
    bankDetailsFieldsList.forEach((field: any) => {
      clearErrors(field)
    })

    const progressPercentage = calculateProgress()
    setProgress(progressPercentage)
    if (!isFinalSave) {
      if (segments[2] === 'auto-empanelment') {
        const res = await createPartialManualEmpanelment(setLoading, showToast, {
          bankDetails: {
            ...data?.bankDetails,
            bankAccType:
              data?.bankDetails?.bankAccType?._id !== '00'
                ? data?.bankDetails?.bankAccType?._id
                : undefined,
          },
          tempProspectiveProviderId: lastSegment,
          empanelType: EEmpanelmentType.Auto,
        } as any)
        if (res?.success) {
          getData()
        }
      } else {
        const res = await createPartialManualEmpanelment(setLoading, showToast, {
          bankDetails: {
            ...data?.bankDetails,
            bankAccType:
              data?.bankDetails?.bankAccType?._id !== '00'
                ? data?.bankDetails?.bankAccType?._id
                : undefined,
          },
          tempProspectiveProviderId: lastSegment,
          empanelType: EEmpanelmentType.Manual,
        } as any)
        if (res?.success) {
          getData()
        }
      }
    }
  }

  const onPartialSaveStaffPhysicians: SubmitHandler<any> = async (data) => {
    requiredFields.forEach((field: any) => {
      setValidate(false)
      clearErrors(field)
    })
    if (segments[2] === 'auto-empanelment') {
      const res = await createPartialManualEmpanelment(setLoading, showToast, {
        staff: data?.staff
          ?.map((s, index) => {
            if (s?.isAvailable) {
              return {
                ...s,
                staffType: staffTypes[index],
                qualificationId: s?.qualificationId?._id,
                councilId: s?.councilId?._id,
                otherQualification: '',
                otherCouncil: '',
                gender: s?.gender?._id !== '00' ? s?.gender?._id : undefined,
              }
            }
          })
          .filter((x) => x && x),
        tempProspectiveProviderId: lastSegment,
        empanelType: EEmpanelmentType.Auto,
      } as any)
      if (res?.success) {
        getData()
      }
    } else {
      const res = await createPartialManualEmpanelment(setLoading, showToast, {
        staff: data?.staff
          ?.map((s, index) => {
            if (s?.isAvailable) {
              return {
                ...s,
                staffType: staffTypes[index],
                qualificationId: s?.qualificationId?._id,
                councilId: s?.councilId?._id,
                otherQualification: '',
                otherCouncil: '',
                gender: s?.gender?._id !== '00' ? s?.gender?._id : undefined,
              }
            }
          })
          .filter((x) => x && x),
        tempProspectiveProviderId: lastSegment,
        empanelType: EEmpanelmentType.Manual,
      } as any)
      if (res?.success) {
        getData()
      }
    }
  }

  const onPartialSaveAvailableTest: SubmitHandler<any> = async (data) => {
    if (selectedRows?.length > 0) {
      if (segments[2] === 'auto-empanelment') {
        const res = await createPartialManualEmpanelment(setLoading, showToast, {
          availableTestIds: selectedRows?.map((x) => x?._id),
          tempProspectiveProviderId: lastSegment,
          empanelType: EEmpanelmentType.Auto,
        } as any)
        if (res?.success) {
          getData()
        }
      } else {
        const res = await createPartialManualEmpanelment(setLoading, showToast, {
          availableTestIds: selectedRows?.map((x) => x?._id),
          tempProspectiveProviderId: lastSegment,
          empanelType: EEmpanelmentType.Manual,
        } as any)
        if (res?.success) {
          getData()
        }
      }
    }
  }

  const onFinalSave = async () => {
    const generateRequiredFieldsForFinalSave = () => {
      const basicDetailsFields = [
        'providerName',
        'pincode',
        'state',
        'city',
        'addressLineOne',
        'addressLineTwo',
        'landmark',
        'telephone',
        'website',
        getValues('basicDetails.googlePlusCode') ? '' : 'latitude',
        getValues('basicDetails.googlePlusCode') ? '' : 'longitude',
        getValues('basicDetails.latitude') || getValues('basicDetails.longitude')
          ? ''
          : 'googlePlusCode',
      ]
        .filter((x) => x !== '')
        .map((field) => `basicDetails.${field}`)
      const contactDetailsFields = [
        'primaryContactName',
        'primaryContactEmail',
        'reenterPrimaryContactEmail',
        'secondaryContactName',
        'secondaryContactEmail',
        'reenterSecondaryContactEmail',
      ].map((field) => `contactDetails.${field}`)

      const ownershipDetailsFieldsList = [
        'ownershipTypeId',
        'ownershipName',
        'panName',
        'panNo',
        'panDob',
        'aadharName',
        'aadharNo',
        'officeAddressLineOne',
        'officeAddressLineTwo',
        'officeState',
        'officeCity',
        'officePincode',
        'authorizedSignatoryName',
        'authorizedSignatoryDesignation',
        'authorizedSignatoryEmail',
        'ownerContactNo',
      ].map((field) => `ownershipDetails.${field}`)

      const bankDetailsFieldsList = [
        'bankAccName',
        'bankAccNo',
        'bankAccIFSC',
        'bankName',
        'bankBranch',
        'bankAccType',
        'bankBranchCity',
      ].map((field) => `bankDetails.${field}`)

      return [
        ...basicDetailsFields,
        ...contactDetailsFields,
        ...ownershipDetailsFieldsList,
        ...bankDetailsFieldsList,
      ]
    }
    const requiredFieldsForFinalSave = generateRequiredFieldsForFinalSave()
    // eslint-disable-next-line prefer-const
    let a = []
    requiredFieldsForFinalSave.forEach((field: any) => {
      if (!getValues(field)) {
        a.push(field)
        // setIsFinalSave(false)
        // setValue('isFinalSave', false)
        setValidateForm(false)
        setError(field, { message: 'This field is required' })
      } else {
        clearErrors(field)
      }
    })
    if (validateForm && a.length === 0 && data?.partialEmpanelment?.availableTestIds?.length > 0) {
      if (segments[2] === 'auto-empanelment') {
        const res = await createAutoEmpanelment(setLoading, showToast, {
          tempProspectiveProviderId: lastSegment,
        } as any)
        if (res?.success) {
          nav('/thankyou')
          localStorage.removeItem('testIds')
          getData()
        }
      } else {
        const res = await createManualEmpanelment(setLoading, showToast, {
          tempProspectiveProviderId: lastSegment,
        } as any)
        if (res?.success) {
          nav('/dashboard?tab=3')
          localStorage.removeItem('testIds')
        }
      }
    } else {
      showToast('error', `Please validate fields`)
    }
  }

  const { fields } = useFieldArray({
    control: control,
    name: 'staff',
  })

  const validatePincode = async (value: string) => {
    const res = await searchPincode(setLoading, showToast, value)
    if (res?.success) {
      setValidate(res?.data)
      setValue('ownershipDetails.officeState', res?.data?.State)
      setValue('ownershipDetails.officeCity', res?.data?.Block)
    } else {
      setValidate(null)
    }
  }

  const validateAadhar = async () => {
    if (
      !aadharVerify &&
      watch('ownershipDetails.aadharNo') &&
      watch('ownershipDetails.aadharName')
    ) {
      // const res = await verifyAadhaarcardDetails(
      //   setLoading,
      //   showToast,
      //   getValues('ownershipDetails.aadharNo') as string,
      // )
      // if (res?.success) {
      setAadharVerify(true)
      if (segments[2] === 'auto-empanelment') {
        const res = await createPartialManualEmpanelment(setLoading, showToast, {
          ownershipDetails: {
            ...data?.partialEmpanelment?.ownershipDetails,
            ownershipTypeId: data?.partialEmpanelment?.ownershipDetails?.ownershipType?._id,
            aadharNo: getValues('ownershipDetails.aadharNo'),
            aadharName: getValues('ownershipDetails.aadharName'),
          },
          tempProspectiveProviderId: lastSegment,
          empanelType: EEmpanelmentType.Auto,
        } as any)
        if (res?.success) {
          getData()
        }
      } else {
        const res = await createPartialManualEmpanelment(setLoading, showToast, {
          ownershipDetails: {
            ...data?.partialEmpanelment?.ownershipDetails,
            ownershipTypeId: data?.partialEmpanelment?.ownershipDetails?.ownershipType?._id,
            aadharNo: getValues('ownershipDetails.aadharNo'),
            aadharName: getValues('ownershipDetails.aadharName'),
          },
          tempProspectiveProviderId: lastSegment,
          empanelType: EEmpanelmentType.Manual,
        } as any)
        if (res?.success) {
          getData()
        }
      }
      // }
    }
  }

  const validatePan = async () => {
    if (
      !panVerify &&
      watch('ownershipDetails.panName') &&
      watch('ownershipDetails.panNo') &&
      watch('ownershipDetails.panDob')
    ) {
      const res = await verifyPancardDetailsFrs(setLoading, showToast, {
        pan_id: getValues('ownershipDetails.panNo').toUpperCase(),
        name: getValues('ownershipDetails.panName'),
        date_of_birth: format(new Date(getValues('ownershipDetails.panDob') as any), 'dd/MM/yyyy'),
      })
      if (res?.success) {
        showToast('success', 'PAN Verified')
        setPanVerify(true)
        if (segments[2] === 'auto-empanelment') {
          const res = await createPartialManualEmpanelment(
            setLoading,
            showToast,
            {
              ownershipDetails: {
                ...data?.partialEmpanelment?.ownershipDetails,
                ownershipTypeId: data?.partialEmpanelment?.ownershipDetails?.ownershipType?._id,
                panNo: getValues('ownershipDetails.panNo'),
                panName: getValues('ownershipDetails.panName'),
                panDob: format(new Date(getValues('ownershipDetails.panDob') as any), 'yyyy-MM-dd'),
              },
              tempProspectiveProviderId: lastSegment,
              empanelType: EEmpanelmentType.Auto,
            } as any,
            true,
          )
          if (res?.success) {
            getData()
          }
        } else {
          const res = await createPartialManualEmpanelment(
            setLoading,
            showToast,
            {
              ownershipDetails: {
                ...data?.partialEmpanelment?.ownershipDetails,
                ownershipTypeId: data?.partialEmpanelment?.ownershipDetails?.ownershipType?._id,
                panNo: getValues('ownershipDetails.panNo'),
                panName: getValues('ownershipDetails.panName'),
                panDob: format(new Date(getValues('ownershipDetails.panDob') as any), 'yyyy-MM-dd'),
              },
              tempProspectiveProviderId: lastSegment,
              empanelType: EEmpanelmentType.Manual,
            } as any,
            true,
          )
          if (res?.success) {
            getData()
          }
        }
      }
    }
  }

  const validateBank = async () => {
    if (
      !bankVerify &&
      watch('bankDetails.bankAccNo') &&
      watch('bankDetails.bankAccType') &&
      watch('bankDetails.bankAccIFSC')
    ) {
      const res = await verifyBankDetailsFrs(setLoading, showToast, {
        account_number: getValues('bankDetails.bankAccNo'),
        ifsc: getValues('bankDetails.bankAccIFSC'),
      })
      if (res?.success) {
        showToast('success', 'Bank Verified')
        setBankVerify(true)
        if (segments[2] === 'auto-empanelment') {
          const res = await createPartialManualEmpanelment(
            setLoading,
            showToast,
            {
              bankDetails: {
                ...data?.partialEmpanelment?.bankDetails,
                bankAccType: getValues('bankDetails.bankAccType')?._id,
                bankAccNo: getValues('bankDetails.bankAccNo'),
                bankAccIFSC: getValues('bankDetails.bankAccIFSC'),
              },
              tempProspectiveProviderId: lastSegment,
              empanelType: EEmpanelmentType.Auto,
            } as any,
            true,
          )
          if (res?.success) {
            getData()
          }
        } else {
          const res = await createPartialManualEmpanelment(
            setLoading,
            showToast,
            {
              bankDetails: {
                ...data?.partialEmpanelment?.bankDetails,
                bankAccType: getValues('bankDetails.bankAccType')?._id,
                bankAccNo: getValues('bankDetails.bankAccNo'),
                bankAccIFSC: getValues('bankDetails.bankAccIFSC'),
              },
              tempProspectiveProviderId: lastSegment,
              empanelType: EEmpanelmentType.Manual,
            } as any,
            true,
          )
          if (res?.success) {
            getData()
          }
        }
      }
    }
  }

  // Record and Control States
  const { setNotFound, notFound } = useNotFound()
  const [entity, setEntity] = useState<any | undefined>()
  const [controls, setControls] = useState({})
  const [handleControls, setHandleControls] = useState<HandleControls>(defaultControls)

  const getLabTestData = async (categoryId: string) => {
    const response = await getLabTests(setLoading, showToast, setNotFound, notFound, {
      ...handleControls,
      categoryId,
    })
    if (response) {
      const { records, ...rest } = response
      if (records.length === 0) {
        setNotFound([TABLES.CLOSE_REQUEST])
      } else {
        setNotFound([])
        setLabTestData(records)
        setControls(rest)
      }
    } else {
      setLabTestData([])
    }
  }

  const getModifiedData = () => {
    setLabTestData([])
    setHandleControls(defaultControls)
  }

  useEffect(() => {
    getModifiedData()
  }, [])

  useEffect(() => {
    getLabTestData(selectedCategory?._id)
  }, [handleControls])

  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Test Name',
      isSort: false,
      type: 'checkBox',
    },
    {
      id: 'code',
      label: 'Code',
      isSort: false,
    },
    {
      id: 'loincCode',
      label: 'LOINC Code',
      isSort: false,
    },
  ]

  useEffect(() => {
    if (data?.partialEmpanelmentStarted) {
      setSelectedRows(data?.partialEmpanelment?.availableTestIds)
      const exist = localStorage.getItem('testIds')
      if (!exist) {
        localStorage.setItem(
          'testIds',
          JSON.stringify(data?.partialEmpanelment?.availableTestIds?.map((x) => x._id)),
        ) as any
      } else {
        const selected = JSON.parse(exist)
        const diff = _.difference(
          data?.partialEmpanelment?.availableTestIds?.map((x) => x._id),
          selected,
        )
        const combined = [...selected, ...diff]
        localStorage.setItem('testIds', JSON.stringify(combined)) as any
      }
    }
  }, [data])

  return (
    <section
      style={{
        maxHeight: 'calc(100vh - 70px)',
        overflow: 'auto',
      }}
    >
      <div className='mt-3 mb-8'>
        <div className='flex items-center py-2 w-full px-4 bg-white-main shadow rounded-md justify-between gap-5 mb-3'>
          <div className='flex gap-10'>
            <span className='text-base font-semibold italic'>
              {segments[2] !== 'auto-empanelment' ? 'Manual' : 'Self'} Empanelment
            </span>
          </div>
          {segments[2] !== 'auto-empanelment' && (
            <div className='text-center flex items-end justify-end'>
              <Button
                color='mBlue'
                sx={{
                  minWidth: '100px',
                  maxWidth: '100px',
                  maxHeight: '35px',
                  minHeight: '35px',
                  color: theme.palette.mWhite.main,
                }}
                onClick={() => {
                  window.history.go(-1)
                }}
              >
                Back
              </Button>
            </div>
          )}
        </div>
        {data?.alreadySubmitted && (
          <span className='text-orange-main'>*You have already submitted the form</span>
        )}
        <div className='pt-5 sticky top-0 z-50 bg-white-main h-10 rounded-md shadow px-4'>
          <div className='pt-1'>
            <ProgressBar progress={progress} />
          </div>
        </div>
        <div className='w-full pt-5'>
          <form onSubmit={handleSubmit(onPartialSaveBasicDetails)} className='mb-5'>
            <Accordion
              sx={{
                '.MuiAccordionSummary-root.Mui-expanded': {
                  minHeight: '0px',
                  backgroundColor: theme.palette.mLightGray.main,
                },
              }}
              expanded={getExpanded('1')}
              onChange={(event, isExpanded: boolean) => {
                setExpanded('1', isExpanded)
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1-content'
                id='panel1-header'
                sx={{
                  '.MuiAccordionSummary-content.Mui-expanded': {
                    margin: '12px 0px',
                  },
                }}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-base font-semibold italic'>Name & Location</span>
                </div>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <div className='grid lg:lg:grid-cols-4 grid-cols-2 gap-3'>
                  <TxtInput
                    control={control}
                    name='basicDetails.providerName'
                    handleChange={() => {}}
                    placeholder='Enter Provider Name'
                    sx={{ minWidth: 280 }}
                    label={`Provider Name${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                    handleOnChange={(e) => {
                      if (e.target.value !== '') {
                        clearErrors('basicDetails.providerName')
                      }
                    }}
                  />
                  <NumInput
                    control={control}
                    name='basicDetails.pincode'
                    handleChange={() => {}}
                    placeholder='Enter PIN Code'
                    sx={{ minWidth: 280 }}
                    label={`PIN Code${watch('isFinalSave') ? '*' : ''}`}
                    validation={numberFieldValidation(false, undefined, 'Pincode')}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.state'
                    handleChange={() => {}}
                    placeholder='Enter State'
                    sx={{ minWidth: 280 }}
                    label={`State${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.city'
                    handleChange={() => {}}
                    placeholder='Enter City'
                    sx={{ minWidth: 280 }}
                    label={`City${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.addressLineOne'
                    handleChange={() => {}}
                    placeholder='Enter Address Line 1'
                    sx={{ minWidth: 280 }}
                    label={`Address Line 1${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.addressLineTwo'
                    handleChange={() => {}}
                    placeholder='Enter Address Line 2'
                    sx={{ minWidth: 280 }}
                    label={`Address Line 2${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.landmark'
                    handleChange={() => {}}
                    placeholder='Enter Landmarks'
                    sx={{ minWidth: 280 }}
                    label={`Landmarks${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                  />
                  <NumInput
                    control={control}
                    name='basicDetails.telephone'
                    handleChange={() => {}}
                    placeholder='Enter Center Telephone'
                    sx={{ minWidth: 280 }}
                    label={`Center Telephone${watch('isFinalSave') ? '*' : ''}`}
                    validation={numberFieldValidation(false, undefined, 'Phone')}
                    isDisabled={data?.alreadySubmitted}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.website'
                    handleChange={() => {}}
                    placeholder='Enter Website/URL'
                    sx={{ minWidth: 280 }}
                    label={`Website/URL${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.latitude'
                    handleChange={() => {
                      clearErrors('basicDetails.googlePlusCode')
                    }}
                    placeholder='Enter Latitude'
                    sx={{ minWidth: 280 }}
                    label={`Latitude${watch('isFinalSave') && !watch('basicDetails.googlePlusCode') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.longitude'
                    handleChange={() => {
                      clearErrors('basicDetails.googlePlusCode')
                    }}
                    placeholder='Enter Longitude'
                    sx={{ minWidth: 280 }}
                    label={`Longitude${watch('isFinalSave') && !watch('basicDetails.googlePlusCode') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.googlePlusCode'
                    handleChange={() => {
                      clearErrors('basicDetails.latitude')
                      clearErrors('basicDetails.longitude')
                    }}
                    placeholder='Enter Google Plus Code'
                    sx={{ minWidth: 280 }}
                    label={`Google Plus Code${watch('isFinalSave') && (!watch('basicDetails.latitude') || !watch('basicDetails.longitude')) ? '*' : ''}`}
                    validation={txtFieldValidation(false, 'Description')}
                    isDisabled={data?.alreadySubmitted}
                  />
                </div>
                <div className='text-center items-center flex flex-col pt-4'>
                  <Button
                    color='mBlue'
                    sx={{
                      maxHeight: '30px',
                      minHeight: '30px',
                      maxWidth: '100px',
                      minWidth: '100px',
                      color: theme.palette.mWhite.main,
                    }}
                    type='submit'
                    disabled={data?.alreadySubmitted || isFinalSave}
                  >
                    Submit
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </form>
          <form onSubmit={handleSubmit(onPartialSaveContact)} className='mb-5'>
            <Accordion
              sx={{
                '.MuiAccordionSummary-root.Mui-expanded': {
                  minHeight: '0px',
                  backgroundColor: theme.palette.mLightGray.main,
                },
              }}
              expanded={getExpanded('2')}
              onChange={(event, isExpanded: boolean) => {
                setExpanded('2', isExpanded)
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1-content'
                id='panel2-header'
                sx={{
                  '.MuiAccordionSummary-content.Mui-expanded': {
                    margin: '12px 0px',
                  },
                }}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-base font-semibold italic'>Contact</span>
                </div>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <div className='grid lg:grid-cols-3 grid-cols-2 gap-3'>
                  <TxtInput
                    control={control}
                    name='contactDetails.primaryContactName'
                    handleChange={() => {}}
                    placeholder='Enter Primary Contact Name'
                    sx={{ minWidth: 280 }}
                    label={`Primary Contact Name${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                    handleOnChange={(e) => {
                      if (e.target.value !== '') {
                        clearErrors('contactDetails.primaryContactName')
                      }
                    }}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.primaryContactEmail'
                    handleChange={() => {}}
                    placeholder='Enter Primary Contact Email'
                    sx={{ minWidth: 280 }}
                    label={`Primary Contact Email${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                    handleOnChange={(e) => {
                      if (e.target.value !== '') {
                        clearErrors('contactDetails.primaryContactEmail')
                      }
                    }}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.reenterPrimaryContactEmail'
                    handleChange={() => {}}
                    placeholder='Enter Re-enter Primary Contact email'
                    sx={{ minWidth: 280 }}
                    label={`Re-enter Primary Contact email${watch('isFinalSave') ? '*' : ''}`}
                    // validation={txtFieldValidation(false)}
                    validation={
                      getValues('contactDetails.primaryContactEmail')
                        ? {
                            required: 'Required.',
                            validate: (value) =>
                              value === getValues('contactDetails.primaryContactEmail') ||
                              'Primary Contact Email do not match',
                          }
                        : {}
                    }
                    isDisabled={data?.alreadySubmitted}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.secondaryContactName'
                    handleChange={() => {}}
                    placeholder='Enter Secondary Contact Name'
                    sx={{ minWidth: 280 }}
                    label={`Secondary Contact Name${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                    handleOnChange={(e) => {
                      if (e.target.value !== '') {
                        clearErrors('contactDetails.secondaryContactName')
                      }
                    }}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.secondaryContactEmail'
                    handleChange={() => {}}
                    placeholder='Enter Secondary Contact Email'
                    sx={{ minWidth: 280 }}
                    label={`Secondary Contact Email${watch('isFinalSave') ? '*' : ''}`}
                    validation={txtFieldValidation(false)}
                    isDisabled={data?.alreadySubmitted}
                    handleOnChange={(e) => {
                      if (e.target.value !== '') {
                        clearErrors('contactDetails.secondaryContactEmail')
                      }
                    }}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.reenterSecondaryContactEmail'
                    handleChange={() => {}}
                    placeholder='Enter Re-enter Secondary Contact email'
                    sx={{ minWidth: 280 }}
                    label={`Re-enter Secondary Contact email${watch('isFinalSave') ? '*' : ''}`}
                    // validation={txtFieldValidation(false)}
                    validation={
                      getValues('contactDetails.reenterSecondaryContactEmail')
                        ? {
                            required: 'Required.',
                            validate: (value) =>
                              value === getValues('contactDetails.reenterSecondaryContactEmail') ||
                              'Secondary Contact Email do not match',
                          }
                        : {}
                    }
                    isDisabled={data?.alreadySubmitted}
                  />
                </div>
                <div className='text-center items-center flex flex-col pt-4'>
                  <Button
                    color='mBlue'
                    sx={{
                      maxHeight: '30px',
                      minHeight: '30px',
                      maxWidth: '100px',
                      minWidth: '100px',
                      color: theme.palette.mWhite.main,
                    }}
                    type='submit'
                    disabled={data?.alreadySubmitted || isFinalSave}
                  >
                    Submit
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </form>
          <form onSubmit={handleSubmit(onPartialSaveOwnership)} className='mb-5'>
            <Accordion
              sx={{
                '.MuiAccordionSummary-root.Mui-expanded': {
                  minHeight: '0px',
                  backgroundColor: theme.palette.mLightGray.main,
                },
              }}
              expanded={getExpanded('3')}
              onChange={(event, isExpanded: boolean) => {
                setExpanded('3', isExpanded)
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1-content'
                id='panel3-header'
                sx={{
                  '.MuiAccordionSummary-content.Mui-expanded': {
                    margin: '12px 0px',
                  },
                }}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-base font-semibold italic'>Ownership</span>
                </div>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <div className='flex flex-col gap-3'>
                  <div className='grid lg:grid-cols-4 grid-cols-2 gap-3'>
                    <SelectInput
                      clearErrors={clearErrors}
                      control={control}
                      label={`Type of Ownership${watch('isFinalSave') ? '*' : ''}`}
                      name='ownershipDetails.ownershipTypeId'
                      options={ownershipData}
                      setError={setError}
                      setValue={setValue}
                      validation={searchSelectValidation('Type of Ownership', true)}
                      isDisable={data?.alreadySubmitted}
                      handleOnChange={() => {
                        clearErrors('ownershipDetails.cuin')
                      }}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.ownershipName'
                      handleChange={() => {}}
                      placeholder={`Enter Owner's Name`}
                      sx={{ minWidth: 280 }}
                      label={`Owner's Name${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      isDisabled={data?.alreadySubmitted}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.cuin'
                      handleChange={() => {}}
                      placeholder='Enter CUIN'
                      sx={{ minWidth: 280 }}
                      label={`CUIN${watch('ownershipDetails.ownershipTypeId')?.label === 'Private Limited' ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      isDisabled={data?.alreadySubmitted}
                    />
                    <NumInput
                      control={control}
                      name='ownershipDetails.ownerContactNo'
                      handleChange={() => {}}
                      placeholder='Enter Owner Contact No'
                      sx={{ minWidth: 280 }}
                      label={`Owner Contact No${watch('isFinalSave') ? '*' : ''}`}
                      validation={numberFieldValidation(false, undefined, 'Phone')}
                      isDisabled={data?.alreadySubmitted}
                    />
                  </div>
                  <div className='grid lg:grid-cols-4 items-end grid-cols-1 gap-3 bg-lightGray-main p-3'>
                    <div className='flex flex-row mr-3'>
                      <DateInput
                        control={control}
                        name='ownershipDetails.panDob'
                        setError={setError}
                        clearErrors={clearErrors}
                        handleChange={() => {
                          validatePan()
                        }}
                        sx={{ minWidth: 250 }}
                        label={`Date of incorporation/Birth${watch('isFinalSave') ? '*' : ''}`}
                        validation={dateAndTimeSelectValidation('Date of incorporation')}
                        isDisabled={data?.alreadySubmitted || panVerify}
                      />
                      <HoverIcon title='Fill up PAN details!' />
                    </div>
                    <div className='flex flex-row mr-3'>
                      <TxtInput
                        control={control}
                        name='ownershipDetails.panName'
                        handleChange={() => {}}
                        placeholder='Enter PAN Card Name'
                        sx={{ minWidth: 250 }}
                        label={`PAN Card Name${watch('isFinalSave') ? '*' : ''}`}
                        validation={txtFieldValidation(false)}
                        isDisabled={data?.alreadySubmitted || panVerify}
                        handleBlue={() => {
                          validatePan()
                        }}
                      />
                      <HoverIcon title='Fill up PAN details!' />
                    </div>
                    <div className='flex flex-row mr-3'>
                      <TxtInput
                        control={control}
                        name='ownershipDetails.panNo'
                        handleChange={() => {}}
                        placeholder='Enter PAN Card Number'
                        sx={{ minWidth: 250 }}
                        label={`PAN Card Number${watch('isFinalSave') ? '*' : ''}`}
                        validation={txtFieldValidation(false)}
                        isDisabled={data?.alreadySubmitted || panVerify}
                        handleBlue={() => {
                          validatePan()
                        }}
                      />
                      <HoverIcon title='Fill up PAN details!' />
                    </div>
                    <div
                      className={`rounded-md ${panVerify ? 'bg-green-main' : 'bg-orange-main'} h-9 w-24 text-sm text-white-main flex items-center justify-center`}
                    >
                      {panVerify ? 'Verified' : 'Not Verified'}
                    </div>
                  </div>
                  <div className='grid lg:grid-cols-3 items-end grid-cols-1 gap-3 bg-lightGray-main p-3'>
                    <div className='flex flex-row mr-3'>
                      <TxtInput
                        control={control}
                        name='ownershipDetails.aadharNo'
                        handleChange={() => {}}
                        placeholder='Enter Aadhar Card Number'
                        sx={{ minWidth: 345 }}
                        label={`Aadhar Card Number${watch('isFinalSave') ? '*' : ''}`}
                        validation={txtFieldValidation(false)}
                        isDisabled={data?.alreadySubmitted || aadharVerify}
                        handleBlue={() => {
                          validateAadhar()
                        }}
                      />
                      <HoverIcon title={'Fill up aadhar details!'} />
                    </div>
                    <div className='flex flex-row mr-3'>
                      <TxtInput
                        control={control}
                        name='ownershipDetails.aadharName'
                        handleChange={() => {}}
                        placeholder='Enter Aadhar Card Name'
                        sx={{ minWidth: 345 }}
                        label={`Aadhar Card Name${watch('isFinalSave') ? '*' : ''}`}
                        validation={txtFieldValidation(false)}
                        isDisabled={data?.alreadySubmitted || aadharVerify}
                        handleBlue={() => {
                          validateAadhar()
                        }}
                      />
                      <HoverIcon title={'Fill up aadhar details!'} />
                    </div>
                    <div
                      className={`rounded-md ${aadharVerify ? 'bg-green-main' : 'bg-orange-main'} h-9 w-24 text-sm text-white-main flex items-center justify-center`}
                    >
                      {aadharVerify ? 'Verified' : 'Not Verified'}
                    </div>
                  </div>
                  <div className='grid lg:grid-cols-5 grid-cols-2 gap-3'>
                    <TxtInput
                      control={control}
                      name='ownershipDetails.officeAddressLineOne'
                      handleChange={() => {}}
                      placeholder='Enter Regd Office Address Line 1'
                      sx={{ minWidth: 200 }}
                      label={`Regd Office Address Line 1${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      isDisabled={data?.alreadySubmitted}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.officeAddressLineTwo'
                      handleChange={() => {}}
                      placeholder='Enter Regd Office Address Line 2'
                      sx={{ minWidth: 200 }}
                      label={`Regd Office Address Line 2${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      isDisabled={data?.alreadySubmitted}
                    />
                    <NumInput
                      control={control}
                      name='ownershipDetails.officePincode'
                      handleChange={() => {}}
                      placeholder='Enter PIN Code'
                      sx={{ minWidth: 200 }}
                      label={`PIN Code${watch('isFinalSave') ? '*' : ''}`}
                      validation={numberFieldValidation(false, undefined, 'Pincode')}
                      // isDisabled={true}
                      handleBlue={(e) => {
                        validatePincode(e.target.value)
                        clearErrors('ownershipDetails.officeState')
                        clearErrors('ownershipDetails.officeCity')
                      }}
                      isDisabled={data?.alreadySubmitted}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.officeState'
                      handleChange={() => {}}
                      placeholder='Enter State'
                      sx={{ minWidth: 200 }}
                      label={`State${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      isDisabled={true}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.officeCity'
                      handleChange={() => {}}
                      placeholder='Enter City'
                      sx={{ minWidth: 200 }}
                      label={`City${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      isDisabled={true}
                    />
                  </div>
                  <div className='grid lg:grid-cols-3 grid-cols-2 gap-3'>
                    <TxtInput
                      control={control}
                      name='ownershipDetails.authorizedSignatoryName'
                      handleChange={() => {}}
                      placeholder='Enter Full Name of Authorized Signatory'
                      sx={{ minWidth: 280 }}
                      label={`Full Name of Authorized Signatory${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      isDisabled={data?.alreadySubmitted}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.authorizedSignatoryDesignation'
                      handleChange={() => {}}
                      placeholder='Enter Designation of Authorized Signatory'
                      sx={{ minWidth: 280 }}
                      label={`Designation of Authorized Signatory${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      isDisabled={data?.alreadySubmitted}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.authorizedSignatoryEmail'
                      handleChange={() => {}}
                      placeholder='Enter Email of Authorized Signatory'
                      sx={{ minWidth: 280 }}
                      label={`Email of Authorized Signatory${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      isDisabled={data?.alreadySubmitted}
                    />
                  </div>
                  <div className='text-center items-center flex flex-col pt-1'>
                    <Button
                      color='mBlue'
                      sx={{
                        maxHeight: '30px',
                        minHeight: '30px',
                        maxWidth: '100px',
                        minWidth: '100px',
                        color: theme.palette.mWhite.main,
                      }}
                      type='submit'
                      disabled={data?.alreadySubmitted || isFinalSave}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </form>
          <form onSubmit={handleSubmit(onPartialSaveBanking)} className='mb-5'>
            <Accordion
              sx={{
                '.MuiAccordionSummary-root.Mui-expanded': {
                  minHeight: '0px',
                  backgroundColor: theme.palette.mLightGray.main,
                },
              }}
              expanded={getExpanded('4')}
              onChange={(event, isExpanded: boolean) => {
                setExpanded('4', isExpanded)
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1-content'
                id='panel4-header'
                sx={{
                  '.MuiAccordionSummary-content.Mui-expanded': {
                    margin: '12px 0px',
                  },
                }}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-base font-semibold italic'>Banking</span>
                </div>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <div className='flex flex-col gap-3'>
                  <div className='grid lg:grid-cols-4 items-end grid-cols-1 gap-3 bg-lightGray-main p-3 mt-2'>
                    <SelectInput
                      clearErrors={clearErrors}
                      control={control}
                      label={`Type of Account${watch('isFinalSave') ? '*' : ''}`}
                      name='bankDetails.bankAccType'
                      options={EBankAccTypesArray}
                      setError={setError}
                      setValue={setValue}
                      validation={searchSelectValidation('Type of Account', true)}
                      isDisable={data?.alreadySubmitted}
                      handleOnChange={() => {
                        validateBank()
                      }}
                    />
                    <div className='flex flex-row mr-3'>
                      <TxtInput
                        control={control}
                        name='bankDetails.bankAccNo'
                        handleChange={() => {}}
                        placeholder='Enter Account Number'
                        sx={{ minWidth: 230 }}
                        label={`Account Number${watch('isFinalSave') ? '*' : ''}`}
                        validation={txtFieldValidation(false)}
                        isDisabled={data?.alreadySubmitted || bankVerify}
                        handleBlue={() => {
                          validateBank()
                        }}
                      />
                      <HoverIcon title={'Fill up bank details!'} />
                    </div>
                    <div className='flex flex-row mr-3'>
                      <TxtInput
                        control={control}
                        name='bankDetails.bankAccIFSC'
                        handleChange={() => {}}
                        placeholder='Enter IFSC Code'
                        sx={{ minWidth: 230 }}
                        label={`IFSC Code${watch('isFinalSave') ? '*' : ''}`}
                        validation={txtFieldValidation(false)}
                        isDisabled={data?.alreadySubmitted || bankVerify}
                        handleBlue={() => {
                          validateBank()
                        }}
                      />
                      <HoverIcon title={'Fill up bank details!'} />
                    </div>
                    <div
                      className={`rounded-md ${bankVerify ? 'bg-green-main' : 'bg-orange-main'} h-9 w-24 text-sm text-white-main flex items-center justify-center`}
                    >
                      {bankVerify ? 'Verified' : 'Not Verified'}
                    </div>
                  </div>
                  <div className='grid lg:grid-cols-4 grid-cols-2 gap-3'>
                    <TxtInput
                      control={control}
                      name='bankDetails.bankAccName'
                      handleChange={() => {}}
                      placeholder='Enter Account Name'
                      sx={{ minWidth: 280 }}
                      label={`Account Name${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      isDisabled={data?.alreadySubmitted}
                    />
                    <TxtInput
                      control={control}
                      name='bankDetails.bankName'
                      handleChange={() => {}}
                      placeholder='Enter Bank Name'
                      sx={{ minWidth: 280 }}
                      label={`Bank Name${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      // isDisabled={true}
                      isDisabled={data?.alreadySubmitted}
                    />
                    <TxtInput
                      control={control}
                      name='bankDetails.bankBranch'
                      handleChange={() => {}}
                      placeholder='Enter Branch'
                      sx={{ minWidth: 280 }}
                      label={`Branch${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      // isDisabled={true}
                      isDisabled={data?.alreadySubmitted}
                    />
                    <TxtInput
                      control={control}
                      name='bankDetails.bankBranchCity'
                      handleChange={() => {}}
                      placeholder='Enter City'
                      sx={{ minWidth: 280 }}
                      label={`City${watch('isFinalSave') ? '*' : ''}`}
                      validation={txtFieldValidation(false)}
                      // isDisabled={true}
                      isDisabled={data?.alreadySubmitted}
                    />
                  </div>
                  <div className='text-center items-center flex flex-col pt-1'>
                    <Button
                      color='mBlue'
                      sx={{
                        maxHeight: '30px',
                        minHeight: '30px',
                        maxWidth: '100px',
                        minWidth: '100px',
                        color: theme.palette.mWhite.main,
                      }}
                      type='submit'
                      disabled={data?.alreadySubmitted || isFinalSave}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </form>
          <form onSubmit={handleSubmit(onPartialSaveAvailableTest)} className='mb-5'>
            <Accordion
              sx={{
                '.MuiAccordionSummary-root.Mui-expanded': {
                  minHeight: '0px',
                  backgroundColor: theme.palette.mLightGray.main,
                },
              }}
              expanded={getExpanded('5')}
              onChange={(event, isExpanded: boolean) => {
                setExpanded('5', isExpanded)
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1-content'
                id='panel5-header'
                sx={{
                  '.MuiAccordionSummary-content.Mui-expanded': {
                    margin: '12px 0px',
                  },
                }}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-base font-semibold italic'>Tests Available</span>
                </div>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <div className='flex flex-wrap gap-2 mt-1 mb-3'>
                  {categoryData?.map((x) => (
                    <div
                      role='button'
                      onClick={() => {
                        getLabTestData(x?._id as string)
                        setSelectedCategory(x)
                        setHandleControls(defaultControls)
                      }}
                      className={`border-[1px] rounded-md px-2 ${selectedCategory?._id === x?._id ? 'bg-blue-main text-white-main' : ''} `}
                    >
                      {x?.label}
                    </div>
                  ))}
                </div>
                <Box>
                  <Table
                    handleOpen={() => {}}
                    setType={undefined}
                    setEntity={setEntity}
                    rows={labTestData}
                    headCells={headCells}
                    controls={controls as Controls}
                    handleControls={handleControls}
                    setHandleControls={setHandleControls}
                    actions={[]}
                    tableHeading={{
                      tableId: TABLES.CLOSE_REQUEST,
                      tableName: selectedCategory?.label,
                    }}
                    notFound={notFound.includes(TABLES.CLOSE_REQUEST)}
                    btnTxtArray={[]}
                    viewNotRequired={true}
                    isTableWithOutAction={true}
                    setSelectedRows={setSelectedRows}
                    selectedRows={selectedRows}
                  />
                </Box>
                <div className='text-center items-center flex flex-col pt-4'>
                  <Button
                    color='mBlue'
                    sx={{
                      maxHeight: '30px',
                      minHeight: '30px',
                      maxWidth: '100px',
                      minWidth: '100px',
                      color: theme.palette.mWhite.main,
                    }}
                    type='submit'
                    disabled={data?.alreadySubmitted || isFinalSave}
                  >
                    Submit
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </form>
          <form onSubmit={handleSubmit(onPartialSaveStaffPhysicians)} className='mb-5'>
            <Accordion
              sx={{
                '.MuiAccordionSummary-root.Mui-expanded': {
                  minHeight: '0px',
                  backgroundColor: theme.palette.mLightGray.main,
                },
              }}
              expanded={getExpanded('6')}
              onChange={(event, isExpanded: boolean) => {
                setExpanded('6', isExpanded)
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1-content'
                id='panel6-header'
                sx={{
                  '.MuiAccordionSummary-content.Mui-expanded': {
                    margin: '12px 0px',
                  },
                }}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-base font-semibold italic'>Staff Physicians</span>
                </div>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <div className='grid lg:grid-cols-5 grid-cols-2 gap-3'>
                  {[...Array(5)].map((_, i) => {
                    const x: any = fields[i] || {}
                    const isAvailable = watch(`staff.${i}.isAvailable`)
                    const staffType = staffTypes[i]
                    const showAsterisk =
                      isAvailable &&
                      staffType !== EStaffType.Pathologist &&
                      staffType !== EStaffType.Cardiologist
                    const GenderLabel = `Gender${showAsterisk ? '*' : ''}`
                    return (
                      <React.Fragment key={x._id || i}>
                        <div className='flex items-end gap-3'>
                          <CheckInput
                            name={`staff.${i}.isAvailable`}
                            control={control}
                            label={''}
                          />
                          <TxtInput
                            control={control}
                            name={`staff.${i}.name`}
                            handleChange={() => {}}
                            placeholder={`Enter ${staffTypes[i]} Name`}
                            sx={{ minWidth: 130 }}
                            label={`${staffTypes[i]} Name${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                            validation={txtFieldValidation(watch(`staff.${i}.isAvailable`))}
                            isDisabled={data?.alreadySubmitted || !watch(`staff.${i}.isAvailable`)}
                          />
                        </div>
                        <SelectInput
                          clearErrors={clearErrors}
                          control={control}
                          label={GenderLabel}
                          name={`staff.${i}.gender`}
                          options={EGenderArray}
                          setError={setError}
                          setValue={setValue}
                          validation={searchSelectValidation('Gender', !showAsterisk)}
                          isDisable={data?.alreadySubmitted || !watch(`staff.${i}.isAvailable`)}
                          sx={{ minWidth: 100 }}
                        />
                        <SelectInput
                          clearErrors={clearErrors}
                          control={control}
                          label={`Qualifications${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                          name={`staff.${i}.qualificationId`}
                          options={qualificationData?.filter((x) => x?.staffType === staffType)}
                          setError={setError}
                          setValue={setValue}
                          validation={searchSelectValidation(
                            'Qualifications',
                            !watch(`staff.${i}.isAvailable`),
                          )}
                          isDisable={data?.alreadySubmitted || !watch(`staff.${i}.isAvailable`)}
                          sx={{ minWidth: 200, maxWidth: 230 }}
                        />
                        <TxtInput
                          control={control}
                          name={`staff.${i}.registrationNo`}
                          handleChange={() => {}}
                          placeholder='Enter Registration Number'
                          sx={{ minWidth: 200, maxWidth: 230 }}
                          label={`Registration Number${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                          validation={txtFieldValidation(watch(`staff.${i}.isAvailable`))}
                          isDisabled={data?.alreadySubmitted || !watch(`staff.${i}.isAvailable`)}
                        />
                        <SelectInput
                          clearErrors={clearErrors}
                          control={control}
                          label={`Council${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                          name={`staff.${i}.councilId`}
                          options={councilData}
                          setError={setError}
                          setValue={setValue}
                          validation={searchSelectValidation(
                            'Council',
                            !watch(`staff.${i}.isAvailable`),
                          )}
                          isDisable={data?.alreadySubmitted || !watch(`staff.${i}.isAvailable`)}
                          sx={{ minWidth: 200, maxWidth: 230 }}
                        />
                      </React.Fragment>
                    )
                  })}
                </div>
                <div className='text-center items-center flex flex-col pt-4'>
                  <Button
                    color='mBlue'
                    sx={{
                      maxHeight: '30px',
                      minHeight: '30px',
                      maxWidth: '100px',
                      minWidth: '100px',
                      color: theme.palette.mWhite.main,
                    }}
                    type='submit'
                    disabled={data?.alreadySubmitted || isFinalSave}
                  >
                    Submit
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
            {/* <div>
              <CheckInput
                name={`isFinalSave`}
                control={control}
                label={'Final Save'}
                handleOnChange={(e) => {
                  setIsFinalSave(e)
                }}
              />
            </div> */}
          </form>
          <div className='text-center items-center flex flex-col pt-6'>
            <Button
              color='mBlue'
              sx={{
                maxHeight: '35px',
                minHeight: '35px',
                color: theme.palette.mWhite.main,
              }}
              disabled={data?.alreadySubmitted}
              onClick={() => {
                onFinalSave()
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ManualEmpanelmentPage
