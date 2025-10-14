// Guest-only layout simplified: renders children directly
import type { ChildrenType } from '@core/types'
import type { Locale } from '@/configs/i18n'


const Layout = ({ children }: ChildrenType & { params: { lang: Locale } }) => {
  return <>{children}</>
}

export default Layout
