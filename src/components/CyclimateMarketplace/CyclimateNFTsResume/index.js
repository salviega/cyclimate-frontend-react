import React from 'react'

import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import logo from './../../../assets/images/logo-Cyclimate.png'

import './CyclimateNFTsResume.scss'

export function CyclimateNFTsResume (props) {
  const {
    purchasedItems,
    setItem,
    setOpenModalSummary
  } = props

  const owner = '0x57B8a9857FE3eEd4382EC203a042af77F5aabC5F'
  const totalItems = purchasedItems.length

  const income = purchasedItems
    ? purchasedItems.reduce((total, item) => parseInt(item.price) + total, 0)
    : 0
  const ethIncome = income ? income / 1000000000000000000 : 0

  const onShowDetail = (item) => {
    setItem(item)
    setOpenModalSummary(true)
  }

  return (
    <div className='resumen'>
      <h1 className='resumen__title'>Lastest transactions</h1>
      <div className='resumen-list'>
        <div className='resumen-list-head'>
          <p className='resumen-list-head__title'>IDs</p>
          <p className='resumen-list-head__title'>Name</p>
          <p className='resumen-list-head__title'>Price</p>
          <p className='resumen-list-head__title'>Image</p>
          <p className='resumen-list-head__title'>Buyer</p>
        </div>
        {purchasedItems.map((boughtItem, index) => (
          <div className='resumen-list-body' key={index}>
            <p className='resumen-list-body__item'>{boughtItem.itemId}</p>
            <p className='resumen-list-body__item'>
              {boughtItem.name ? boughtItem.name.slice(0, 4) + '...' : ''}
            </p>
            <p className='resumen-list-body__item'>
              {' '}
              {parseInt(boughtItem.price) / 1000000000000000000}
            </p>
            <p
              className='resumen-list-body__show'
              onClick={() => {
                onShowDetail(boughtItem)
              }}
            >
              look
              <FontAwesomeIcon
                icon={faEye}
                className='resumen-list-body__icon'
              />
            </p>
            <a
              className='resumen-list-body__address'
              href={`https://testnet.snowtrace.io/address/${boughtItem.buyer}`}
            >
              {' '}
              {boughtItem.buyer.slice(0, 4) +
                '...' +
                boughtItem.buyer.slice(38)}
            </a>
          </div>
        ))}
        <div className='resumen-list-footer'>
          <p className='resumen-list-footer__item'>Total</p>
          <p className='resumen-list-footer__item'>{totalItems}</p>
          <div className='resumen-list-footer-value'>
            <figure>
              <img src={logo} alt='logo' />
            </figure>
            <p className='resumen-list-footer-value__item'>{ethIncome}</p>
          </div>
          <a
            className='resumen-list-footer__wallet'
            href={`https://polygonscan.com/address/${owner}`}
          >
            {' '}
            {owner.slice(0, 4) + '...' + owner.slice(38)}
          </a>
          <p className='resumen-list-footer__item' />
        </div>
      </div>
    </div>
  )
}
