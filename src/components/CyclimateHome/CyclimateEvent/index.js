import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../../hooks/context'

import './CyclimateEvent.scss'

export function CyclimateEvent(props) {
	const { event } = props

	const auth = useAuth()
	const navigate = useNavigate()

	const goDetails = () => {
		if (auth.user.walletAddress === 'Connect wallet') {
			window.alert('Connect your wallet')
			return
		}
		return navigate(`/${event.id}`, { state: { event } })
	}

	return (
		<div className='event'>
			<figure>
				<img src={event.imageBase64} alt='logo' />
			</figure>
			<div className='event-description'>
				<p className='event-description__title'>{event.name}</p>
			</div>
			<button className='event-description__show' onClick={goDetails}>
				Learn more
			</button>
		</div>
	)
}
