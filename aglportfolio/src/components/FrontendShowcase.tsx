import { companyWebsiteContent } from '../utils/companyData'
import { CompanyWebsite } from './website/CompanyWebsite'

export function FrontendShowcase() {
  return <CompanyWebsite content={companyWebsiteContent} />
}
