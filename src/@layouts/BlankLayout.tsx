'use client'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ChildrenType, SystemMode } from '@core/types'

// Hook Imports

// Util Imports
import { blankLayoutClasses } from './utils/layoutClasses'

type Props = ChildrenType & {
  systemMode: SystemMode
}

const BlankLayout = (props: Props) => {
  // Props
  const { children } = props

  // Hooks


  return (
    <div className={classnames(blankLayoutClasses.root, 'is-full bs-full')} >
      {children}
    </div>
  )
}

export default BlankLayout
