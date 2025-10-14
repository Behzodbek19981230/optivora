// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

import { getSystemMode } from '@core/utils/serverHelpers'

type Props = ChildrenType & {
  params: { lang: Locale }
}

const Layout = ({ children }: Props) => {
  // Vars
  const systemMode = getSystemMode()

  return (
    <Providers>
      <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
    </Providers>
  )
}

export default Layout
