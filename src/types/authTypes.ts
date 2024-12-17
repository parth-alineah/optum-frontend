export type SignInFormFields = {
  email: string
  password: string
}

export type SignUpFormFields = {
  name: string
  person_name: string
  email: string
  contact_no: string
  type: any
  permission: boolean
}

export type ForgetPassFields = {
  email: string
}

export type ResetPasswordFields = {
  password: string
  confirmPassword: string
  token: string
}
