import React from 'react'

import bbva from '../../assets/images/logo-bbva.png'

import './CyclimateFooter.scss'

function CyclimateFooter() {
	return (
		<footer className='footer'>
			<div className='footer-gap' />
			<div className='footer-container'>
				<div className='footer-container-info'>
					<div className='footer-container-info-network'>
						<figure>
							<img src={bbva} alt='logo' />
						</figure>
						<p className='footer-container-info-network__description'>
							® Cyclimate All rights reserved
						</p>
					</div>
					<div className='footer-container-info-marketplace'>
						<p className='footer-container-info-marketplace__title'>
							Follow us
						</p>
						<p className='footer-container-info-marketplace__subtitle'>
							Instagram
						</p>
						<p className='footer-container-info-marketplace__subtitle'>
							Facebook
						</p>
						<p className='footer-container-info-marketplace__subtitle'>
							Twitter
						</p>
						<p className='footer-container-info-marketplace__subtitle'>
							Blog Cyclimate
						</p>
					</div>
					<div className='footer-container-info-create'>
						<p className='footer-container-info-create__title'>
							Links of interest
						</p>
						<p className='footer-container-info-create__subtitle'>About us</p>

						<p className='footer-container-info-create__subtitle'>
							Support center
						</p>
						<p className='footer-container-info-create__subtitle'>
							Privacy policy
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default CyclimateFooter
