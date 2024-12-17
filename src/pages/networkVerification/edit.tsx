import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider } from '@mui/material'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import React, { useEffect, useState } from 'react'
import { theme } from '@/context/ThemeProvider'
import {
  acDefaultValue,
  dateAndTimeSelectValidation,
  numberFieldValidation,
  searchSelectValidation,
  txtFieldValidation,
} from '@/utils/form.validation'
import TxtInput from '@/components/TxtInput'
import SelectInput from '@/components/SelectInput'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Controls, HandleControls, HeadCell, SearchDDL } from '@/types/common'
import {
  dropdownCategory,
  dropdownCouncil,
  dropdownOwnership,
  dropdownQualification,
  getLabTests,
} from '@/lib/dropdown'
import {
  EBankAccTypesArray,
  EGenderArray,
  EOwnershipTypesArray,
  EStaffType,
  staffTypes,
} from '@/types/empanelmentAdd'
import NumInput from '@/components/NumInput'
import {
  EVerificationProcess,
  getOneEmpanelmentData,
  verifyEmpanelmentByNetwork,
} from '@/lib/empanelmentCountAndList'
import { editManualEmpanelment } from '@/lib/manualEmpanelment'
import CheckInput from '@/components/CheckInput'
import { DateInput } from '@/components/DateInput'
import Table from '@/components/Table'
import { limitOfPage, TABLES } from '@/utils/constants'
import { useNotFound } from '@/context/NotFound'
import _ from 'lodash'

type Props = {}

const PendingVerifyDetailsEditList = (props: Props) => {
  const nav = useNavigate()
  const state = useLocation()
  const { setLoading } = useLoading()
  const showToast = useToast()

  // Record and Control States
  const [data, setData] = useState(null)
  const [councilData, setCouncilData] = useState<SearchDDL[]>([])
  const [qualificationData, setQualificationData] = useState<SearchDDL[]>([])
  const [ownershipData, setOwnershipData] = useState<SearchDDL[]>([])

  const [accordionExpand, setAccordionExpand] = useState({
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
  })

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
      remark: '',
    },
  })

  const getData = async () => {
    const response = await getOneEmpanelmentData(setLoading, showToast, state?.state?._id)
    if (response) {
      setData(response?.data)
      setValue('basicDetails.zone', response?.data?.basicDetails?.zone)
      setValue('basicDetails.pincodeId', response?.data?.basicDetails?.pincodeId)
      setValue('basicDetails.pincode', response?.data?.basicDetails?.pincode)
      setValue('basicDetails.state', response?.data?.basicDetails?.state)
      setValue('basicDetails.city', response?.data?.basicDetails?.city)
      setValue('basicDetails.providerName', response?.data?.basicDetails?.providerName)
      setValue('basicDetails.addressLineOne', response?.data?.basicDetails?.addressLineOne)
      setValue('basicDetails.addressLineTwo', response?.data?.basicDetails?.addressLineTwo)
      setValue('basicDetails.landmark', response?.data?.basicDetails?.landmark)
      setValue('basicDetails.telephone', response?.data?.basicDetails?.telephone)
      setValue('basicDetails.website', response?.data?.basicDetails?.website)
      setValue('basicDetails.fax', response?.data?.basicDetails?.fax)
      setValue('basicDetails.longitude', response?.data?.basicDetails?.longitude)
      setValue('basicDetails.latitude', response?.data?.basicDetails?.latitude)
      setValue('basicDetails.googlePlusCode', response?.data?.basicDetails?.googlePlusCode)
      setValue(
        'contactDetails.primaryContactName',
        response?.data?.contactDetails?.primaryContactName,
      )
      setValue(
        'contactDetails.primaryContactEmail',
        response?.data?.contactDetails?.primaryContactEmail,
      )
      setValue(
        'contactDetails.reenterPrimaryContactEmail',
        response?.data?.contactDetails?.primaryContactEmail,
      )
      setValue(
        'contactDetails.secondaryContactName',
        response?.data?.contactDetails?.secondaryContactName,
      )
      setValue(
        'contactDetails.secondaryContactEmail',
        response?.data?.contactDetails?.secondaryContactEmail,
      )
      setValue(
        'contactDetails.reenterSecondaryContactEmail',
        response?.data?.contactDetails?.secondaryContactEmail,
      )

      setValue(
        'ownershipDetails.ownershipTypeId',
        response?.data?.ownershipDetails?.ownershipType
          ? {
              _id: response?.data?.ownershipDetails?.ownershipType?._id,
              label: response?.data?.ownershipDetails?.ownershipType?.name,
            }
          : acDefaultValue,
      )
      setValue('ownershipDetails.ownershipName', response?.data?.ownershipDetails?.ownershipName)
      setValue('ownershipDetails.cuin', response?.data?.ownershipDetails?.cuin)
      setValue('ownershipDetails.panName', response?.data?.ownershipDetails?.panName)
      setValue('ownershipDetails.panNo', response?.data?.ownershipDetails?.panNo)
      setValue('ownershipDetails.panDob', response?.data?.ownershipDetails?.panDob)
      setValue('ownershipDetails.aadharName', response?.data?.ownershipDetails?.aadharName)
      setValue('ownershipDetails.aadharNo', response?.data?.ownershipDetails?.aadharNo)
      setValue('ownershipDetails.ownerContactNo', response?.data?.ownershipDetails?.ownerContactNo)
      setValue(
        'ownershipDetails.officeAddressLineOne',
        response?.data?.ownershipDetails?.officeAddressLineOne,
      )
      setValue(
        'ownershipDetails.officeAddressLineTwo',
        response?.data?.ownershipDetails?.officeAddressLineTwo,
      )
      setValue('ownershipDetails.officeState', response?.data?.ownershipDetails?.officeState)
      setValue('ownershipDetails.officeCity', response?.data?.ownershipDetails?.officeCity)
      setValue('ownershipDetails.officePincode', response?.data?.ownershipDetails?.officePincode)
      setValue(
        'ownershipDetails.authorizedSignatoryName',
        response?.data?.ownershipDetails?.authorizedSignatoryName,
      )
      setValue(
        'ownershipDetails.authorizedSignatoryDesignation',
        response?.data?.ownershipDetails?.authorizedSignatoryDesignation,
      )
      setValue(
        'ownershipDetails.authorizedSignatoryEmail',
        response?.data?.ownershipDetails?.authorizedSignatoryEmail,
      )

      setValue('bankDetails.bankAccIFSC', response?.data?.bankDetails?.bankAccIFSC)
      setValue('bankDetails.bankAccName', response?.data?.bankDetails?.bankAccName)
      setValue('bankDetails.bankAccNo', response?.data?.bankDetails?.bankAccNo)
      setValue('bankDetails.bankBranch', response?.data?.bankDetails?.bankBranch)
      setValue('bankDetails.bankName', response?.data?.bankDetails?.bankName)
      setValue('bankDetails.bankBranchCity', response?.data?.bankDetails?.bankBranchCity)
      setValue(
        'bankDetails.bankAccType',
        response?.data?.bankDetails?.bankAccType
          ? {
              _id: response?.data?.bankDetails?.bankAccType,
              label: response?.data?.bankDetails?.bankAccType,
            }
          : acDefaultValue,
      )
      response?.data?.staff?.forEach((x, i) => {
        const index = staffTypes.findIndex((y) => x.staffType === y)
        if (index >= 0) {
          setValue(`staff.${index}.isAvailable`, x?.isAvailable || false)
          setValue(`staff.${index}.type`, x?.type || '')
          setValue(`staff.${index}.name`, x?.name || '')
          setValue(
            `staff.${index}.qualificationId`,
            x?.qualificationId
              ? { _id: x?.qualificationId, label: x?.qualification?.displayName }
              : acDefaultValue,
          )
          setValue(`staff.${index}.otherQualification`, x?.otherQualification || '')
          setValue(`staff.${index}.registrationNo`, x?.registrationNo || '')
          setValue(
            `staff.${index}.councilId`,
            x?.councilId ? { _id: x?.councilId, label: x?.council?.displayName } : acDefaultValue,
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
    }
  }

  const getCouncilData = async () => {
    const res = await dropdownCouncil(setLoading, showToast)
    if (res) {
      setCouncilData(res)
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

  const getQualificationData = async () => {
    const res = await dropdownQualification(setLoading, showToast)
    if (res) {
      setQualificationData(res)
    }
  }
  const getOwnershipData = async () => {
    const res = await dropdownOwnership(setLoading, showToast)
    if (res) {
      setOwnershipData(res)
    }
  }

  useEffect(() => {
    getCategoryData()
    getCouncilData()
    getQualificationData()
    getOwnershipData()
  }, [])

  useEffect(() => {
    getData()
  }, [])

  const onSubmitHandle: SubmitHandler<any> = async (data) => {
    if (!validateLatitudeLongitude()) {
      setError('basicDetails.latitude', {
        type: 'manual',
        message: 'Latitude is required if Google Plus Code is not provided',
      })
      setError('basicDetails.longitude', {
        type: 'manual',
        message: 'Longitude is required if Google Plus Code is not provided',
      })
      return
    } else if (!validateGooglePlusCode()) {
      setError('basicDetails.googlePlusCode', {
        type: 'manual',
        message: 'Google Plus Code is required if Latitude and Longitude are not provided',
      })
      return
    }
    const { reenterPrimaryContactEmail, reenterSecondaryContactEmail, ...updateContactDetails } =
      data.contactDetails
    const newData = {
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
      basicDetails: data?.basicDetails,
      contactDetails: updateContactDetails,
      ownershipDetails: {
        ...data?.ownershipDetails,
        ownershipTypeId: data?.ownershipDetails?.ownershipTypeId?._id,
      },
      bankDetails: {
        ...data?.bankDetails,
        bankAccType: data?.bankDetails?.bankAccType?._id,
      },
      documents: data?.documents,
      availableTestIds: selectedRows?.map((x) => x?._id),
      id: state?.state?._id,
    }

    const res = await editManualEmpanelment(setLoading, showToast, newData)
    if (res?.success) {
      nav('/dashboard?tab=3')
      localStorage.removeItem('testIds')
    }
  }

  const { fields } = useFieldArray({
    control: control,
    name: 'staff',
  })

  //default controls
  const defaultControls = {
    search: '',
    currentPage: 1,
    limitPerPage: limitOfPage,
    sortParam: 'createdAt',
    sortOrder: -1,
  }

  // Record and Control States
  const { setNotFound, notFound } = useNotFound()
  const [entity, setEntity] = useState<any | undefined>()
  const [controls, setControls] = useState({})
  const [handleControls, setHandleControls] = useState<HandleControls>(defaultControls)
  const [categoryData, setCategoryData] = useState<SearchDDL[]>([])
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [labTestData, setLabTestData] = useState<any[]>([])

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
    if (data) {
      setSelectedRows(data?.availableTestIds)
      const exist = localStorage.getItem('testIds')
      if (!exist) {
        localStorage.setItem(
          'testIds',
          JSON.stringify(data?.availableTestIds?.map((x) => x._id)),
        ) as any
      } else {
        const selected = JSON.parse(exist)
        const diff = _.difference(
          data?.availableTestIds?.map((x) => x._id),
          selected,
        )
        const combined = [...selected, ...diff]
        localStorage.setItem('testIds', JSON.stringify(combined)) as any
      }
    }
  }, [data])

  const checkLegalField = (field) => {
    switch (state?.state?.verificationStatusByLegal) {
      case EVerificationProcess.Pending:
        return true // First case: when status is 'Pending', always return false.

      case EVerificationProcess.ReturnedByLegal:
        // Second case: when status is 'ReturnedByLegal', check if field is in 'legalUnverifiedFields'.
        return data?.legalUnverifiedFields && data?.legalUnverifiedFields.includes(field)
          ? true
          : false

      default:
        return true // Default case: always return false.
    }
  }

  const fieldName = {
    basicDetails: [
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
    ],
    contactDetails: [
      'primaryContactName',
      'primaryContactEmail',
      'reenterPrimaryContactEmail',
      'secondaryContactName',
      'secondaryContactEmail',
      'reenterSecondaryContactEmail',
    ],
    ownershipDetails: [
      'ownershipTypeId',
      'ownershipName',
      'cuin',
      'ownerContactNo',
      'panName',
      'panNo',
      'panDob',
      'aadharNo',
      'aadharName',
      'officeAddressLineOne',
      'officeAddressLineTwo',
      'officePincode',
      'officeState',
      'officeCity',
      'authorizedSignatoryName',
      'authorizedSignatoryDesignation',
      'authorizedSignatoryEmail',
    ],
    bankDetails: [
      'bankAccType',
      'bankAccNo',
      'bankAccIFSC',
      'bankName',
      'bankBranch',
      'bankBranchCity',
    ],
  }

  useEffect(() => {
    if (
      state?.state?.verificationStatusByLegal === EVerificationProcess.ReturnedByLegal &&
      data &&
      data?.legalUnverifiedFields.length !== 0
    ) {
      for (const [section, fields] of Object.entries(fieldName)) {
        data?.legalUnverifiedFields?.forEach((shortName: string) => {
          if (fields.includes(shortName)) {
            // @ts-expect-error: Ignore type checking for this line
            setError(`${section}.${shortName}`, {
              type: 'manual',
              message: `${shortName} is unverified`,
            })
          }
        })
      }
    }
  }, [data?.legalUnverifiedFields])

  const handleFieldChange = (section: string, fieldName: string) => {
    if (state?.state?.verificationStatusByLegal === EVerificationProcess.ReturnedByLegal) {
      //@ts-expect-error: Ignore type checking for this line
      clearErrors(`${section}.${fieldName}`)
    }
  }

  const validateLatitudeLongitude = () => {
    const googlePlusCode = getValues('basicDetails.googlePlusCode')
    const latitude = getValues('basicDetails.latitude')
    const longitude = getValues('basicDetails.longitude')
    return googlePlusCode?.trim() !== '' || (latitude?.trim() !== '' && longitude?.trim() !== '')
  }

  const validateGooglePlusCode = () => {
    const googlePlusCode = getValues('basicDetails.googlePlusCode')
    const latitude = getValues('basicDetails.latitude')
    const longitude = getValues('basicDetails.longitude')
    return googlePlusCode?.trim() !== '' || latitude?.trim() !== '' || longitude?.trim() !== ''
  }

  return (
    <section>
      <div className='mt-3 mb-8'>
        <div className='flex items-center py-2 w-full px-4 bg-white-main shadow rounded-md justify-between gap-5'>
          <div className='flex gap-10'>
            <span className='text-base font-semibold italic'>Edit Empanelment</span>
          </div>
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
        </div>
        <div className='w-full pt-5'>
          <form onSubmit={handleSubmit(onSubmitHandle)}>
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
                    placeholder='Enter Provider Name'
                    sx={{ minWidth: 280 }}
                    label='Provider Name*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('providerName')}
                    handleChange={() => handleFieldChange('basicDetails', 'providerName')}
                  />
                  <NumInput
                    control={control}
                    name='basicDetails.pincode'
                    handleChange={() => handleFieldChange('basicDetails', 'pincode')}
                    placeholder='Enter PIN Code'
                    sx={{ minWidth: 280 }}
                    label='PIN Code*'
                    validation={numberFieldValidation(true, undefined, 'Pincode')}
                    isDisabled={!checkLegalField('pincode')}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.state'
                    handleChange={() => handleFieldChange('basicDetails', 'state')}
                    placeholder='Enter State'
                    sx={{ minWidth: 280 }}
                    label='State*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('state')}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.city'
                    handleChange={() => handleFieldChange('basicDetails', 'city')}
                    placeholder='Enter City'
                    sx={{ minWidth: 280 }}
                    label='City*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('city')}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.addressLineOne'
                    handleChange={() => handleFieldChange('basicDetails', 'addressLineOne')}
                    placeholder='Enter Address Line 1'
                    sx={{ minWidth: 280 }}
                    label='Address Line 1*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('addressLineOne')}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.addressLineTwo'
                    handleChange={() => handleFieldChange('basicDetails', 'addressLineTwo')}
                    placeholder='Enter Address Line 2'
                    sx={{ minWidth: 280 }}
                    label='Address Line 2*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('addressLineTwo')}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.landmark'
                    handleChange={() => handleFieldChange('basicDetails', 'landmark')}
                    placeholder='Enter Landmarks'
                    sx={{ minWidth: 280 }}
                    label='Landmarks*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('landmark')}
                  />
                  <NumInput
                    control={control}
                    name='basicDetails.telephone'
                    handleChange={() => handleFieldChange('basicDetails', 'telephone')}
                    placeholder='Enter Center Telephone'
                    sx={{ minWidth: 280 }}
                    label='Center Telephone*'
                    validation={numberFieldValidation(true, undefined, 'Phone')}
                    isDisabled={!checkLegalField('telephone')}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.website'
                    handleChange={() => handleFieldChange('basicDetails', 'website')}
                    placeholder='Enter Website/URL'
                    sx={{ minWidth: 280 }}
                    label='Website/URL*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('website')}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.latitude'
                    handleChange={() => handleFieldChange('basicDetails', 'latitude')}
                    placeholder='Enter Latitude'
                    sx={{ minWidth: 280 }}
                    label='Latitude*'
                    validation={txtFieldValidation(false)}
                    isDisabled={!checkLegalField('latitude')}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.longitude'
                    handleChange={() => handleFieldChange('basicDetails', 'longitude')}
                    placeholder='Enter Longitude'
                    sx={{ minWidth: 280 }}
                    label='Longitude*'
                    validation={txtFieldValidation(false)}
                    isDisabled={!checkLegalField('longitude')}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.googlePlusCode'
                    handleChange={() => handleFieldChange('basicDetails', 'googlePlusCode')}
                    placeholder='Enter Google Plus Code'
                    sx={{ minWidth: 280 }}
                    label='Google Plus Code*'
                    validation={txtFieldValidation(false)}
                    isDisabled={!checkLegalField('googlePlusCode')}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
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
                    handleChange={() => handleFieldChange('contactDetails', 'primaryContactName')}
                    placeholder='Enter Primary Contact Name'
                    sx={{ minWidth: 280 }}
                    label='Primary Contact Name*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('primaryContactName')}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.primaryContactEmail'
                    handleChange={() => handleFieldChange('contactDetails', 'primaryContactEmail')}
                    placeholder='Enter Primary Contact Email'
                    sx={{ minWidth: 280 }}
                    label='Primary Contact Email*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('primaryContactEmail')}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.reenterPrimaryContactEmail'
                    handleChange={() =>
                      handleFieldChange('contactDetails', 'reenterPrimaryContactEmail')
                    }
                    placeholder='Enter Primary Re-enter Contact email'
                    sx={{ minWidth: 280 }}
                    label='Re-enter Primary Contact email*'
                    // validation={txtFieldValidation(true)}
                    validation={{
                      required: 'Required.',
                      validate: (value) =>
                        value === getValues('contactDetails.primaryContactEmail') ||
                        'Primary Contact Email do not match',
                    }}
                    isDisabled={!checkLegalField('reenterPrimaryContactEmail')}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.secondaryContactName'
                    handleChange={() => handleFieldChange('contactDetails', 'secondaryContactName')}
                    placeholder='Enter Secondary Contact Name'
                    sx={{ minWidth: 280 }}
                    label='Secondary Contact Name*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('secondaryContactName')}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.secondaryContactEmail'
                    handleChange={() =>
                      handleFieldChange('contactDetails', 'secondaryContactEmail')
                    }
                    placeholder='Enter Secondary Contact Email'
                    sx={{ minWidth: 280 }}
                    label='Secondary Contact Email*'
                    validation={txtFieldValidation(true)}
                    isDisabled={!checkLegalField('secondaryContactEmail')}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.reenterSecondaryContactEmail'
                    handleChange={() =>
                      handleFieldChange('contactDetails', 'reenterSecondaryContactEmail')
                    }
                    placeholder='Enter Re-enter Secondary Contact email'
                    sx={{ minWidth: 280 }}
                    label='Re-enter Secondary Contact email*'
                    // validation={txtFieldValidation(true)}
                    validation={{
                      required: 'Required.',
                      validate: (value) =>
                        value === getValues('contactDetails.reenterSecondaryContactEmail') ||
                        'Secondary Contact Email do not match',
                    }}
                    isDisabled={!checkLegalField('reenterSecondaryContactEmail')}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
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
                      label='Type of Ownership*'
                      name='ownershipDetails.ownershipTypeId'
                      options={ownershipData}
                      setError={setError}
                      setValue={setValue}
                      validation={searchSelectValidation('Type of Ownership')}
                      isDisable={!checkLegalField('ownershipTypeId')}
                      handleChange={() => handleFieldChange('ownershipDetails', 'ownershipTypeId')}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.ownershipName'
                      handleChange={() => handleFieldChange('ownershipDetails', 'ownershipName')}
                      placeholder={`Enter Owner's Name`}
                      sx={{ minWidth: 280 }}
                      label={`Owner's Name*`}
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('ownershipName')}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.cuin'
                      handleChange={() => handleFieldChange('ownershipDetails', 'cuin')}
                      placeholder='Enter CUIN'
                      sx={{ minWidth: 280 }}
                      label='CUIN'
                      validation={txtFieldValidation(false)}
                      isDisabled={!checkLegalField('cuin')}
                    />
                    <NumInput
                      control={control}
                      name='ownershipDetails.ownerContactNo'
                      handleChange={() => handleFieldChange('ownershipDetails', 'ownerContactNo')}
                      placeholder='Enter Owner Contact No'
                      sx={{ minWidth: 280 }}
                      label='Owner Contact No*'
                      validation={numberFieldValidation(false, undefined, 'Phone')}
                      isDisabled={!checkLegalField('ownerContactNo')}
                    />
                  </div>
                  <div className='grid lg:grid-cols-3 grid-cols-2 gap-3'>
                    <TxtInput
                      control={control}
                      name='ownershipDetails.panName'
                      handleChange={() => handleFieldChange('ownershipDetails', 'panName')}
                      placeholder='Enter PAN Card Name'
                      sx={{ minWidth: 280 }}
                      label='PAN Card Name*'
                      validation={txtFieldValidation(true)}
                      isDisabled={true}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.panNo'
                      handleChange={() => handleFieldChange('ownershipDetails', 'panNo')}
                      placeholder='Enter PAN Card Number'
                      sx={{ minWidth: 280 }}
                      label='PAN Card Number*'
                      validation={txtFieldValidation(true)}
                      isDisabled={true}
                    />
                    <DateInput
                      control={control}
                      name='ownershipDetails.panDob'
                      setError={setError}
                      clearErrors={clearErrors}
                      handleChange={() => handleFieldChange('ownershipDetails', 'panDob')}
                      sx={{ minWidth: 280 }}
                      label={`Date of incorporation/Birth*`}
                      validation={dateAndTimeSelectValidation('Date of incorporation')}
                      isDisabled={true}
                    />
                  </div>
                  <div className='grid lg:grid-cols-2 grid-cols-1 gap-3'>
                    <TxtInput
                      control={control}
                      name='ownershipDetails.aadharNo'
                      handleChange={() => handleFieldChange('ownershipDetails', 'aadharNo')}
                      placeholder='Enter Aadhar Card Number'
                      sx={{ minWidth: 280 }}
                      label='Aadhar Card Number*'
                      validation={txtFieldValidation(true)}
                      isDisabled={true}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.aadharName'
                      handleChange={() => handleFieldChange('ownershipDetails', 'aadharName')}
                      placeholder='Enter Aadhar Card Name'
                      sx={{ minWidth: 280 }}
                      label='Aadhar Card Name*'
                      validation={txtFieldValidation(true)}
                      isDisabled={true}
                    />
                  </div>
                  <div className='grid lg:grid-cols-5 grid-cols-2 gap-3'>
                    <TxtInput
                      control={control}
                      name='ownershipDetails.officeAddressLineOne'
                      handleChange={() =>
                        handleFieldChange('ownershipDetails', 'officeAddressLineOne')
                      }
                      placeholder='Enter Regd Office Address Line 1'
                      sx={{ minWidth: 200 }}
                      label='Regd Office Address Line 1*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('officeAddressLineOne')}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.officeAddressLineTwo'
                      handleChange={() =>
                        handleFieldChange('ownershipDetails', 'officeAddressLineTwo')
                      }
                      placeholder='Enter Regd Office Address Line 2'
                      sx={{ minWidth: 200 }}
                      label='Regd Office Address Line 2*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('officeAddressLineTwo')}
                    />
                    <NumInput
                      control={control}
                      name='ownershipDetails.officePincode'
                      handleChange={() => handleFieldChange('ownershipDetails', 'officePincode')}
                      placeholder='Enter PIN Code'
                      sx={{ minWidth: 200 }}
                      label='PIN Code*'
                      validation={numberFieldValidation(true, undefined, 'Pincode')}
                      isDisabled={!checkLegalField('officePincode')}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.officeState'
                      handleChange={() => handleFieldChange('ownershipDetails', 'officeState')}
                      placeholder='Enter State'
                      sx={{ minWidth: 200 }}
                      label='State*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('officeState')}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.officeCity'
                      handleChange={() => handleFieldChange('ownershipDetails', 'officeCity')}
                      placeholder='Enter City'
                      sx={{ minWidth: 200 }}
                      label='City*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('officeCity')}
                    />
                  </div>
                  <div className='grid lg:grid-cols-3 grid-cols-2 gap-3'>
                    <TxtInput
                      control={control}
                      name='ownershipDetails.authorizedSignatoryName'
                      handleChange={() =>
                        handleFieldChange('ownershipDetails', 'authorizedSignatoryName')
                      }
                      placeholder='Enter Full Name of Authorized Signatory'
                      sx={{ minWidth: 280 }}
                      label='Full Name of Authorized Signatory*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('authorizedSignatoryName')}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.authorizedSignatoryDesignation'
                      handleChange={() =>
                        handleFieldChange('ownershipDetails', 'authorizedSignatoryDesignation')
                      }
                      placeholder='Enter Designation of Authorized Signatory'
                      sx={{ minWidth: 280 }}
                      label='Designation of Authorized Signatory*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('authorizedSignatoryDesignation')}
                    />
                    <TxtInput
                      control={control}
                      name='ownershipDetails.authorizedSignatoryEmail'
                      handleChange={() =>
                        handleFieldChange('ownershipDetails', 'authorizedSignatoryEmail')
                      }
                      placeholder='Enter Email of Authorized Signatory'
                      sx={{ minWidth: 280 }}
                      label='Email of Authorized Signatory*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('authorizedSignatoryEmail')}
                    />
                  </div>
                </div>{' '}
              </AccordionDetails>
            </Accordion>
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
                  <div className='grid lg:grid-cols-3 grid-cols-2 gap-3'>
                    <SelectInput
                      clearErrors={clearErrors}
                      control={control}
                      label='Type of Account*'
                      name='bankDetails.bankAccType'
                      options={EBankAccTypesArray}
                      setError={setError}
                      setValue={setValue}
                      validation={searchSelectValidation('Type of Account')}
                      isDisable={true}
                      handleChange={() => handleFieldChange('bankDetails', 'bankAccType')}
                    />
                    <TxtInput
                      control={control}
                      name='bankDetails.bankAccNo'
                      handleChange={() => handleFieldChange('bankDetails', 'bankAccNo')}
                      placeholder='Enter Account Number'
                      sx={{ minWidth: 280 }}
                      label='Account Number*'
                      validation={txtFieldValidation(true)}
                      isDisabled={true}
                    />
                    <TxtInput
                      control={control}
                      name='bankDetails.bankAccIFSC'
                      handleChange={() => handleFieldChange('bankDetails', 'bankAccIFSC')}
                      placeholder='Enter IFSC Code'
                      sx={{ minWidth: 280 }}
                      label='IFSC Code*'
                      validation={txtFieldValidation(true)}
                      isDisabled={true}
                    />
                  </div>
                  <div className='grid lg:grid-cols-4 grid-cols-2 gap-3'>
                    <TxtInput
                      control={control}
                      name='bankDetails.bankAccName'
                      handleChange={() => handleFieldChange('bankDetails', 'bankAccName')}
                      placeholder='Enter Account Name'
                      sx={{ minWidth: 280 }}
                      label='Account Name*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('bankAccName')}
                    />
                    <TxtInput
                      control={control}
                      name='bankDetails.bankName'
                      handleChange={() => handleFieldChange('bankDetails', 'bankName')}
                      placeholder='Enter Bank Name'
                      sx={{ minWidth: 280 }}
                      label='Bank Name*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('bankName')}
                    />
                    <TxtInput
                      control={control}
                      name='bankDetails.bankBranch'
                      handleChange={() => handleFieldChange('bankDetails', 'bankBranch')}
                      placeholder='Enter Branch'
                      sx={{ minWidth: 280 }}
                      label='Branch*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('bankBranch')}
                    />
                    <TxtInput
                      control={control}
                      name='bankDetails.bankBranchCity'
                      handleChange={() => handleFieldChange('bankDetails', 'bankBranchCity')}
                      placeholder='Enter City'
                      sx={{ minWidth: 280 }}
                      label='City*'
                      validation={txtFieldValidation(true)}
                      isDisabled={!checkLegalField('bankBranchCity')}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
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
              </AccordionDetails>
            </Accordion>
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
                {/* <div className='grid lg:grid-cols-4 grid-cols-2 gap-3'>
                  {[...Array(5)].map((_, i) => {
                    const x: any = fields[i] || {}
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
                            sx={{ minWidth: 240 }}
                            label={`${staffTypes[i]} Name${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                            validation={txtFieldValidation(watch(`staff.${i}.isAvailable`))}
                          />
                        </div>
                        <SelectInput
                          clearErrors={clearErrors}
                          control={control}
                          label={`Qualifications${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                          name={`staff.${i}.qualificationId`}
                          options={qualificationData}
                          setError={setError}
                          setValue={setValue}
                          validation={searchSelectValidation(
                            'Qualifications',
                            !watch(`staff.${i}.isAvailable`),
                          )}
                        />
                        <TxtInput
                          control={control}
                          name={`staff.${i}.registrationNo`}
                          handleChange={() => {}}
                          placeholder='Enter Registration Number'
                          sx={{ minWidth: 280 }}
                          label={`Registration Number${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                          validation={txtFieldValidation(watch(`staff.${i}.isAvailable`))}
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
                        />
                      </React.Fragment>
                    )
                  })}
                </div> */}
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
                            isDisabled={!watch(`staff.${i}.isAvailable`)}
                          />
                        </div>
                        <SelectInput
                          clearErrors={clearErrors}
                          control={control}
                          // label={`Gender${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                          name={`staff.${i}.gender`}
                          options={EGenderArray}
                          setError={setError}
                          setValue={setValue}
                          // validation={searchSelectValidation(
                          //   'Gender',
                          //   !watch(`staff.${i}.isAvailable`),
                          // )}
                          sx={{ minWidth: 100 }}
                          label={GenderLabel}
                          validation={searchSelectValidation('Gender', !showAsterisk)}
                          isDisable={!watch(`staff.${i}.isAvailable`)}
                        />
                        <SelectInput
                          clearErrors={clearErrors}
                          control={control}
                          label={`Qualifications${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                          name={`staff.${i}.qualificationId`}
                          options={qualificationData}
                          setError={setError}
                          setValue={setValue}
                          validation={searchSelectValidation(
                            'Qualifications',
                            !watch(`staff.${i}.isAvailable`),
                          )}
                          sx={{ minWidth: 200, maxWidth: 230 }}
                          isDisable={!watch(`staff.${i}.isAvailable`)}
                        />
                        <TxtInput
                          control={control}
                          name={`staff.${i}.registrationNo`}
                          handleChange={() => {}}
                          placeholder='Enter Registration Number'
                          sx={{ minWidth: 200, maxWidth: 230 }}
                          label={`Registration Number${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                          validation={txtFieldValidation(watch(`staff.${i}.isAvailable`))}
                          isDisabled={!watch(`staff.${i}.isAvailable`)}
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
                          sx={{ minWidth: 200, maxWidth: 230 }}
                          isDisable={!watch(`staff.${i}.isAvailable`)}
                        />
                      </React.Fragment>
                    )
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
            <div className='text-center items-center justify-center gap-5 flex pt-6'>
              <Button
                color='mBlue'
                sx={{
                  maxHeight: '35px',
                  minHeight: '35px',
                  color: theme.palette.mWhite.main,
                }}
                type='submit'
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default PendingVerifyDetailsEditList
