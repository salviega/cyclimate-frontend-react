import React from 'react'

import './CyclimateNFTs.scss'

export function CyclimateNFTs(props) {
	const {
		children,
		contracts,
		onLoading,
		onSincronizedItems,
		setItem,
		setOpenModal
	} = props

	return (
		<div className='nfts'>
			<div className='nfts-container'>
				{React.Children.toArray(children).map(child =>
					React.cloneElement(child, {
						contracts,
						onLoading,
						onSincronizedItems,
						setItem,
						setOpenModal
					})
				)}
			</div>
		</div>
	)
}
