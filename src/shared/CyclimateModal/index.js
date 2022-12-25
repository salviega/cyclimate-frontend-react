import React from 'react'
import ReactDOM from 'react-dom'

import './CyclimateModal.scss'

export function CyclimateModal ({ children }) {
  return ReactDOM.createPortal(
    <div className='modal'>{children}</div>,
    document.getElementById('modal')
  )
}
