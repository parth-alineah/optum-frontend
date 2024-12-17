export const acDefaultValue = { label: 'Select', _id: '00' }

export const numberFieldValidation = (
  isRequired: boolean,
  length?: number,
  type?: 'Phone' | 'Pincode' | 'Days' | 'Amount' | 'Capacity',
) => {
  switch (type) {
    case 'Phone':
      if (isRequired) {
        return {
          required: 'required.',
          min: { value: 0, message: 'Only positive integers allowed' },
          minLength: {
            value: 10,
            message: '10 digits are allowed',
          },
          maxLength: {
            value: 10,
            message: '10 digits are allowed',
          },
        }
      } else {
        return {
          min: { value: 0, message: 'Only positive integers allowed' },
          minLength: {
            value: 10,
            message: '10 digits are allowed',
          },
          maxLength: {
            value: 10,
            message: '10 digits are allowed',
          },
        }
      }
    case 'Days':
      if (isRequired) {
        return {
          required: 'required.',
          min: { value: 1, message: 'Must be greater than 0' },
        }
      } else {
        return {
          min: { value: 1, message: 'Must be greater than 0' },
        }
      }
    case 'Pincode':
      if (isRequired) {
        return {
          required: 'required.',
          min: { value: 0, message: 'Only positive integers allowed' },
          minLength: {
            value: 6,
            message: '6 digits are allowed',
          },
          maxLength: {
            value: 6,
            message: '6 digits are allowed',
          },
        }
      } else {
        return {
          min: { value: 0, message: 'Only positive integers allowed' },
          minLength: {
            value: 6,
            message: '6 digits are allowed',
          },
          maxLength: {
            value: 6,
            message: '6 digits are allowed',
          },
        }
      }
    case 'Amount':
      // Validation rules for Amount
      if (isRequired) {
        return {
          required: 'required.',
          min: { value: 1, message: 'Amount cannot be zero or negative' },
        }
      } else {
        return {
          min: { value: 0, message: 'Amount cannot be negative' },
        }
      }
    case 'Capacity':
      // Validation rules for Vehicle Capacity
      if (isRequired) {
        return {
          required: 'required.',
          min: { value: 1, message: 'Vehicle Capacity cannot be zero or negative' },
        }
      } else {
        return {
          min: { value: 0, message: 'Vehicle Capacity cannot be negative' },
        }
      }
    default:
      return {
        ...(isRequired && { required: 'required.' }),
        minLength: { value: 1, message: 'Atleast 1 digits are required' },
        maxLength: {
          value: length ?? 20,
          message: `Atmost ${length ?? 20} digits are required`,
        },
        min: { value: 1, message: 'Must be greater than 0' },
      }
  }
}

export const searchSelectValidation = (label: string, notRequired?: boolean) => {
  if (notRequired) {
    return {}
  } else {
    return {
      validate: (value: any) => {
        return value?._id !== acDefaultValue?._id || `Select ${label}`
      },
    }
  }
}

export const dateSelectValidation = (name: string, notRequired?: boolean) => {
  if (notRequired) {
    return {}
  } else {
    return {
      validate: (value: any) => {
        if (value === '' || value === null || value === undefined) {
          return `Select ${name}`
        }
        return true
      },
    }
  }
}

export const txtFieldValidation = (
  isRequired: boolean,
  type?:
    | 'txtArea'
    | 'Email'
    | 'Description'
    | 'ShortName'
    | 'multiEmail'
    | 'Password'
    | 'PositiveNumbers',
  fieldLength?: number,
) => {
  switch (type) {
    case 'txtArea':
      if (isRequired) {
        return {
          required: 'required.',
          minLength: { value: 1, message: 'Minimum 1 characters' },
          maxLength: {
            value: 100,
            message: 'Maximum 100 characters allowed',
          },
        }
      } else {
        return {
          minLength: { value: 1, message: 'Minimum 1 characters' },
          maxLength: {
            value: 100,
            message: 'Maximum 100 characters allowed',
          },
        }
      }
    case 'ShortName':
      if (isRequired) {
        return {
          required: 'required.',
          minLength: { value: 1, message: 'Minimum 1 characters' },
          maxLength: {
            value: 5,
            message: 'Maximum 5 characters allowed',
          },
        }
      } else {
        return {
          minLength: { value: 1, message: 'Minimum 1 characters' },
          maxLength: {
            value: 5,
            message: 'Maximum 5 characters allowed',
          },
        }
      }
    case 'Description':
      if (isRequired) {
        return {
          required: 'required.',
          minLength: { value: 1, message: 'Minimum 1 characters' },
          maxLength: {
            value: 300,
            message: 'Maximum 300 characters allowed',
          },
        }
      } else {
        return {
          minLength: { value: 1, message: 'Minimum 1 characters' },
          maxLength: {
            value: 300,
            message: 'Maximum 300 characters allowed',
          },
        }
      }
    case 'Email':
      if (isRequired) {
        return {
          required: 'required.',
          pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i,
            message: 'Please enter a valid email ID',
          },
        }
      } else {
        return {
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: 'Please enter correct email ID',
          },
        }
      }
    case 'Password':
      if (isRequired) {
        return {
          required: 'required.',
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, one number and one special character',
          },
        }
      } else {
        return {
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, one number and one special character',
          },
        }
      }
    case 'PositiveNumbers':
      if (isRequired) {
        return {
          required: 'required.',
          pattern: {
            value: /^^(0|[1-9][0-9]{0,9})$/,
            message: 'Only positive integers are allowed',
          },
        }
      } else {
        return {
          pattern: {
            value: /^^(0|[1-9][0-9]{0,9})$/,
            message: 'Only positive integers are allowed',
          },
        }
      }
    case 'multiEmail':
      if (isRequired) {
        return {
          required: {
            value: fieldLength === 0,
            message: 'required.',
          },
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: 'Please enter correct email ID',
          },
        }
      } else {
        return {
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: 'Please enter correct email ID',
          },
        }
      }
    default:
      if (isRequired) {
        return {
          required: 'required.',
          minLength: { value: 1, message: 'Minimum 1 characters' },
          maxLength: { value: 50, message: 'Maximum 50 characters allowed' },
        }
      } else {
        return {
          minLength: { value: 1, message: 'Minimum 1 characters' },
          maxLength: { value: 50, message: 'Maximum 50 characters allowed' },
        }
      }
  }
}

export const labelAndError = (
  isErr: boolean,
  msg: string | undefined,
  labelName: string,
  isSelectPlaceholder?: string,
) => {
  return {
    InputLabelProps: { shrink: true },
    label: labelName,
    error: isErr,
    helperText: isErr ? msg : '',
    placeholder: isSelectPlaceholder ? `${isSelectPlaceholder}` : `Enter ${labelName}`,
  }
}

export const fileValidation = (isRequired: boolean, type?: 'Photo' | 'PDF' | 'Word' | 'Excel') => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'svg', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
  const maxFileSizeMB = 10

  const validateFile = (value: string) => {
    const extension = value.split('.').pop()?.toLowerCase()
    if (!extension || !allowedExtensions.includes(extension)) {
      return 'Invalid file extension. Only jpg, jpeg, png, svg, pdf, doc, docx, xls, and xlsx are allowed.'
    }
    return true
  }

  const fileValidationRules = {
    validate: validateFile,
    maxSize: {
      value: maxFileSizeMB * 1024 * 1024,
      message: `File size should be less than ${maxFileSizeMB} MB.`,
    },
  }

  if (isRequired) {
    return {
      required: 'required.',
      ...fileValidationRules,
    }
  } else {
    return {
      ...fileValidationRules,
    }
  }
}

export const dateAndTimeSelectValidation = (name: string) => {
  return {
    validate: (value: any) => {
      return value !== '' || `Select ${name}`
    },
  }
}
