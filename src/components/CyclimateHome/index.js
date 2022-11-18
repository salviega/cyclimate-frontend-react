import './CyclimateHome.scss'
import React from 'react'
import logo from '../../assets/images/logo-Cyclimate.png'
import bussinesModel from '../../assets/images/bussines-model.png'
import { CyclimateEvent } from './CyclimateEvent'
import { CyclimateEvents } from './CyclimateEvents'

export function CyclimateHome ({ items: events, loading, error }) {
  return (
    <div className='home'>
      <div className='home__start_page'>
        <h1 className='home__title'>Cyclimate</h1>
        <img src={logo} alt='logo' className='home__logo' />
        <h2 className='home__description'>
          Fight global warming while pedaling.
        </h2>
        <img src={bussinesModel} alt='logo' className='home__bussines' />
      </div>
      <CyclimateEvents>
        {events?.map((event, index) => (
          <CyclimateEvent key={index} event={event} />
        ))}
      </CyclimateEvents>
    </div>
  )
}
