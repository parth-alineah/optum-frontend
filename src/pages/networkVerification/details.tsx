import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider } from '@mui/material'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/hooks/useToast'
import React, { useEffect, useState } from 'react'
import { theme } from '@/context/ThemeProvider'
import {
  acDefaultValue,
  numberFieldValidation,
  searchSelectValidation,
  txtFieldValidation,
} from '@/utils/form.validation'
import TxtInput from '@/components/TxtInput'
import SelectInput from '@/components/SelectInput'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { SearchDDL } from '@/types/common'
import { dropdownCouncil, dropdownQualification } from '@/lib/dropdown'
import {
  EBankAccTypesArray,
  EGenderArray,
  EOwnershipTypesArray,
  staffTypes,
} from '@/types/empanelmentAdd'
import { createManualEmpanelment } from '@/lib/manualEmpanelment'
import NumInput from '@/components/NumInput'
import { getOneEmpanelmentData } from '@/lib/empanelmentCountAndList'
import CheckInput from '@/components/CheckInput'

type Props = {}

const DetailsList = (props: Props) => {
  const nav = useNavigate()
  const state = useLocation()
  const { setLoading } = useLoading()
  const showToast = useToast()

  // Record and Control States
  const [councilData, setCouncilData] = useState<SearchDDL[]>([])
  const [qualificationData, setQualificationData] = useState<SearchDDL[]>([])
  const [accordionExpand, setAccordionExpand] = useState({
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
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
        gmapLink: '',
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
    },
  })

  const getData = async () => {
    const response = await getOneEmpanelmentData(setLoading, showToast, state?.state?._id)
    if (response) {
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
      setValue('basicDetails.gmapLink', response?.data?.basicDetails?.gmapLink)
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

      setValue('ownershipDetails.ownershipTypeId', {
        _id: response?.data?.ownershipDetails?.ownershipType?._id,
        label: response?.data?.ownershipDetails?.ownershipType?.name,
      })
      setValue('ownershipDetails.ownershipName', response?.data?.ownershipDetails?.ownershipName)
      setValue('ownershipDetails.cuin', response?.data?.ownershipDetails?.cuin)
      setValue('ownershipDetails.panName', response?.data?.ownershipDetails?.panName)
      setValue('ownershipDetails.panNo', response?.data?.ownershipDetails?.panNo)
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
      setValue('bankDetails.bankAccType', {
        _id: response?.data?.bankDetails?.bankAccType,
        label: response?.data?.bankDetails?.bankAccType,
      })
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

  const getQualificationData = async () => {
    const res = await dropdownQualification(setLoading, showToast)
    if (res) {
      setQualificationData(res)
    }
  }

  useEffect(() => {
    getCouncilData()
    getQualificationData()
  }, [])

  useEffect(() => {
    getData()
  }, [])

  const { fields } = useFieldArray({
    control: control,
    name: 'staff',
  })

  return (
    <section>
      <div className='mt-3 mb-8'>
        <div className='flex items-center py-2 w-full px-4 bg-white-main shadow rounded-md justify-between gap-5'>
          <div className='flex gap-10'>
            <span className='text-base font-semibold italic'>View Empanelment</span>
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
          <form>
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
                    label='Provider Name*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <NumInput
                    control={control}
                    name='basicDetails.pincode'
                    handleChange={() => {}}
                    placeholder='Enter PIN Code'
                    sx={{ minWidth: 280 }}
                    label='PIN Code*'
                    validation={numberFieldValidation(true, undefined, 'Pincode')}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.state'
                    handleChange={() => {}}
                    placeholder='Enter State'
                    sx={{ minWidth: 280 }}
                    label='State*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.city'
                    handleChange={() => {}}
                    placeholder='Enter City'
                    sx={{ minWidth: 280 }}
                    label='City*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.addressLineOne'
                    handleChange={() => {}}
                    placeholder='Enter Address Line 1'
                    sx={{ minWidth: 280 }}
                    label='Address Line 1*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.addressLineTwo'
                    handleChange={() => {}}
                    placeholder='Enter Address Line 2'
                    sx={{ minWidth: 280 }}
                    label='Address Line 2*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.landmark'
                    handleChange={() => {}}
                    placeholder='Enter Landmarks'
                    sx={{ minWidth: 280 }}
                    label='Landmarks*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <NumInput
                    control={control}
                    name='basicDetails.telephone'
                    handleChange={() => {}}
                    placeholder='Enter Center Telephone'
                    sx={{ minWidth: 280 }}
                    label='Center Telephone*'
                    validation={numberFieldValidation(true, undefined, 'Phone')}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.website'
                    handleChange={() => {}}
                    placeholder='Enter Website/URL'
                    sx={{ minWidth: 280 }}
                    label='Website/URL*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.latitude'
                    handleChange={() => {}}
                    placeholder='Enter Latitude'
                    sx={{ minWidth: 280 }}
                    label='Latitude*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.longitude'
                    handleChange={() => {}}
                    placeholder='Enter Longitude'
                    sx={{ minWidth: 280 }}
                    label='Longitude*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='basicDetails.gmapLink'
                    handleChange={() => {}}
                    placeholder='Enter Google Plus Code'
                    sx={{ minWidth: 280 }}
                    label='Google Plus Code*'
                    validation={txtFieldValidation(true, 'Description')}
                    isDisabled={true}
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
                <div className='grid lg:grid-cols-4 grid-cols-2 gap-3'>
                  <TxtInput
                    control={control}
                    name='contactDetails.primaryContactName'
                    handleChange={() => {}}
                    placeholder='Enter Primary Contact Name'
                    sx={{ minWidth: 280 }}
                    label='Primary Contact Name*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.primaryContactEmail'
                    handleChange={() => {}}
                    placeholder='Enter Primary Contact Email'
                    sx={{ minWidth: 280 }}
                    label='Primary Contact Email*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.reenterPrimaryContactEmail'
                    handleChange={() => {}}
                    placeholder='Enter Re-enter Contact email'
                    sx={{ minWidth: 280 }}
                    label='Re-enter Contact email*'
                    // validation={txtFieldValidation(true)}
                    validation={{
                      required: 'Required.',
                      validate: (value) =>
                        value === getValues('contactDetails.primaryContactEmail') ||
                        'Primary Contact Email do not match',
                    }}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.secondaryContactName'
                    handleChange={() => {}}
                    placeholder='Enter Secondary Contact Name'
                    sx={{ minWidth: 280 }}
                    label='Secondary Contact Name*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.secondaryContactEmail'
                    handleChange={() => {}}
                    placeholder='Enter Secondary Contact Email'
                    sx={{ minWidth: 280 }}
                    label='Secondary Contact Email*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='contactDetails.reenterSecondaryContactEmail'
                    handleChange={() => {}}
                    placeholder='Enter Re-enter Contact email'
                    sx={{ minWidth: 280 }}
                    label='Re-enter Contact email*'
                    // validation={txtFieldValidation(true)}
                    validation={{
                      required: 'Required.',
                      validate: (value) =>
                        value === getValues('contactDetails.reenterSecondaryContactEmail') ||
                        'Secondary Contact Email do not match',
                    }}
                    isDisabled={true}
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
                <div className='grid lg:grid-cols-4 grid-cols-2 gap-3'>
                  <SelectInput
                    clearErrors={clearErrors}
                    control={control}
                    label='Type of Ownership*'
                    name='ownershipDetails.ownershipTypeId'
                    options={EOwnershipTypesArray}
                    setError={setError}
                    setValue={setValue}
                    validation={searchSelectValidation('Type of Ownership')}
                    isDisable={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.ownershipName'
                    handleChange={() => {}}
                    placeholder={`Enter Owner's Name`}
                    sx={{ minWidth: 280 }}
                    label={`Owner's Name*`}
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.cuin'
                    handleChange={() => {}}
                    placeholder='Enter CUIN'
                    sx={{ minWidth: 280 }}
                    label='CUIN*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.panName'
                    handleChange={() => {}}
                    placeholder='Enter PAN Card Name'
                    sx={{ minWidth: 280 }}
                    label='PAN Card Name*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.panNo'
                    handleChange={() => {}}
                    placeholder='Enter PAN Card Number'
                    sx={{ minWidth: 280 }}
                    label='PAN Card Number*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.aadharName'
                    handleChange={() => {}}
                    placeholder='Enter Aadhar Card Name'
                    sx={{ minWidth: 280 }}
                    label='Aadhar Card Name*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.aadharNo'
                    handleChange={() => {}}
                    placeholder='Enter Aadhar Card Number'
                    sx={{ minWidth: 280 }}
                    label='Aadhar Card Number*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <NumInput
                    control={control}
                    name='ownershipDetails.ownerContactNo'
                    handleChange={() => {}}
                    placeholder='Enter Owner Contact No'
                    sx={{ minWidth: 280 }}
                    label='Owner Contact No*'
                    validation={numberFieldValidation(false, undefined, 'Phone')}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.officeAddressLineOne'
                    handleChange={() => {}}
                    placeholder='Enter Regd Office Address Line 1'
                    sx={{ minWidth: 280 }}
                    label='Regd Office Address Line 1*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.officeAddressLineTwo'
                    handleChange={() => {}}
                    placeholder='Enter Regd Office Address Line 2'
                    sx={{ minWidth: 280 }}
                    label='Regd Office Address Line 2*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <NumInput
                    control={control}
                    name='ownershipDetails.officePincode'
                    handleChange={() => {}}
                    placeholder='Enter PIN Code'
                    sx={{ minWidth: 280 }}
                    label='PIN Code*'
                    validation={numberFieldValidation(true, undefined, 'Pincode')}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.officeState'
                    handleChange={() => {}}
                    placeholder='Enter State'
                    sx={{ minWidth: 280 }}
                    label='State*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.officeCity'
                    handleChange={() => {}}
                    placeholder='Enter City'
                    sx={{ minWidth: 280 }}
                    label='City*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.authorizedSignatoryName'
                    handleChange={() => {}}
                    placeholder='Enter Full Name of Authorized Signatory'
                    sx={{ minWidth: 280 }}
                    label='Full Name of Authorized Signatory*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.authorizedSignatoryDesignation'
                    handleChange={() => {}}
                    placeholder='Enter Designation of Authorized Signatory'
                    sx={{ minWidth: 280 }}
                    label='Designation of Authorized Signatory*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='ownershipDetails.authorizedSignatoryEmail'
                    handleChange={() => {}}
                    placeholder='Enter Email of Authorized Signatory'
                    sx={{ minWidth: 280 }}
                    label='Email of Authorized Signatory*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
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
                <div className='grid lg:grid-cols-4 grid-cols-2 gap-3'>
                  <TxtInput
                    control={control}
                    name='bankDetails.bankAccName'
                    handleChange={() => {}}
                    placeholder='Enter Account Name'
                    sx={{ minWidth: 280 }}
                    label='Account Name*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='bankDetails.bankAccNo'
                    handleChange={() => {}}
                    placeholder='Enter Account Number'
                    sx={{ minWidth: 280 }}
                    label='Account Number*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='bankDetails.bankAccIFSC'
                    handleChange={() => {}}
                    placeholder='Enter IFSC Code'
                    sx={{ minWidth: 280 }}
                    label='IFSC Code*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='bankDetails.bankName'
                    handleChange={() => {}}
                    placeholder='Enter Bank Name'
                    sx={{ minWidth: 280 }}
                    label='Bank Name*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='bankDetails.bankBranch'
                    handleChange={() => {}}
                    placeholder='Enter Branch'
                    sx={{ minWidth: 280 }}
                    label='Branch*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
                  <TxtInput
                    control={control}
                    name='bankDetails.bankBranchCity'
                    handleChange={() => {}}
                    placeholder='Enter City'
                    sx={{ minWidth: 280 }}
                    label='City*'
                    validation={txtFieldValidation(true)}
                    isDisabled={true}
                  />
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
                  />
                </div>
              </AccordionDetails>
            </Accordion>
            {/* <Accordion
                sx={{
                  '.MuiAccordionSummary-root.Mui-expanded': {
                    minHeight: '0px',
                    backgroundColor: theme.palette.mLightGray.main,
                  },
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
                  <div className='grid lg:grid-cols-4 grid-cols-2 gap-3'>
                    <SelectInput
                      clearErrors={clearErrors}
                      control={control}
                      label='Type of Tests*'
                      name='bankAccType'
                      options={EBankAccTypesArray}
                      setError={setError}
                      setValue={setValue}
                      validation={searchSelectValidation('Type of Tests')}
                    />
                    <SelectInput
                      clearErrors={clearErrors}
                      control={control}
                      label='Type of Tests*'
                      name='bankAccType'
                      options={EBankAccTypesArray}
                      setError={setError}
                      setValue={setValue}
                      validation={searchSelectValidation('Type of Tests')}
                    />
                    <SelectInput
                      clearErrors={clearErrors}
                      control={control}
                      label='Type of Tests*'
                      name='bankAccType'
                      options={EBankAccTypesArray}
                      setError={setError}
                      setValue={setValue}
                      validation={searchSelectValidation('Type of Tests')}
                    />
                    <SelectInput
                      clearErrors={clearErrors}
                      control={control}
                      label='Type of Tests*'
                      name='bankAccType'
                      options={EBankAccTypesArray}
                      setError={setError}
                      setValue={setValue}
                      validation={searchSelectValidation('Type of Tests')}
                    />
                    <SelectInput
                      clearErrors={clearErrors}
                      control={control}
                      label='Type of Tests*'
                      name='bankAccType'
                      options={EBankAccTypesArray}
                      setError={setError}
                      setValue={setValue}
                      validation={searchSelectValidation('Type of Tests')}
                    />
                  </div>
                </AccordionDetails>
              </Accordion> */}
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
                    return (
                      <React.Fragment key={x._id || i}>
                        <div className='flex items-end gap-3'>
                          <CheckInput
                            name={`staff.${i}.isAvailable`}
                            control={control}
                            label={''}
                            isDisabled={true}
                          />
                          <TxtInput
                            control={control}
                            name={`staff.${i}.name`}
                            handleChange={() => {}}
                            placeholder={`Enter ${staffTypes[i]} Name`}
                            sx={{ minWidth: 130 }}
                            label={`${staffTypes[i]} Name${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                            validation={txtFieldValidation(watch(`staff.${i}.isAvailable`))}
                            isDisabled={true}
                          />
                        </div>
                        <SelectInput
                          clearErrors={clearErrors}
                          control={control}
                          label={`Gender${watch(`staff.${i}.isAvailable`) ? '*' : ''}`}
                          name={`staff.${i}.gender`}
                          options={EGenderArray}
                          setError={setError}
                          setValue={setValue}
                          validation={searchSelectValidation(
                            'Gender',
                            !watch(`staff.${i}.isAvailable`),
                          )}
                          isDisable={true}
                          sx={{ minWidth: 100 }}
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
                          isDisable={true}
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
                          isDisabled={true}
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
                          isDisable={true}
                          sx={{ minWidth: 200, maxWidth: 230 }}
                        />
                      </React.Fragment>
                    )
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          </form>
        </div>
      </div>
    </section>
  )
}

export default DetailsList
