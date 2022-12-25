import React from 'react'

import './CyclimateDashboardNFTs.scss'

export function CyclimateDashboardNFTs ({
  children,
  contracts,
  setLoading,
  setSincronized,
  setItem,
  setOpenModal,
  setOpenModalTransfer
}) {
  return (
    <div className='nfts'>
      <div className='nfts-container'>
        {React.Children.toArray(children).map((child) =>
          React.cloneElement(child, {
            contracts,
            setLoading,
            setSincronized,
            setItem,
            setOpenModal,
            setOpenModalTransfer
          })
        )}
      </div>
    </div>
  )
}
