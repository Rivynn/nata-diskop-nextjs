export type RegisterFormData = {
  account: {
    username: string
    email: string
    phone: string
    password: string
    passwordConfirmation: string
  }

  personal: {
    nik: string
    fullName: string
    birthPlace: string
    birthDate: Date | null
    gender: string
  }

  profile: {
    provinceCode: string
    regencyCode: string
    districtCode: string
    villageCode: string

    fullAddress: string
    postalCode: string

    education: string
    institution: string
    major: string
    graduationYear: string

    employmentStatus: string
    companyName: string
    position: string
    businessName: string
    businessField: string
  }

  purpose: {
    interest: string
    purpose: string
    motivation: string
  }
}
