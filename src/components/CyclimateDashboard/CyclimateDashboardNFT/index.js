import React, { useEffect } from 'react'

import { getDataMarketPlaceSubGraph } from '../../../middleware/getDataMarketPlaceSubGraph'

import logo from './../../../assets/images/logo-Cyclimate.png'

import './CyclimateDashboardNFT.scss'

export function CyclimateDashboardNFT(props) {
	const { item: initialState, setItem, setOpenModal } = props

	const [parsedItem, setParsedItem] = React.useState(initialState)
	const { getNFTByTokenId } = getDataMarketPlaceSubGraph()

	const onShowDetail = item => {
		setItem(item)
		setOpenModal(true)
	}
	const refactorItem = async () => {
		const datumSubGraphArr = await getNFTByTokenId(initialState.token_id)
		const datumSubGraph = datumSubGraphArr[0]
		const itemJson = JSON.parse(initialState.metadata)
		const newDatum = {
			...itemJson,
			artist: datumSubGraph.artist,
			taxFee: datumSubGraph.taxFee,
			tokenId: datumSubGraph.tokenId,
			price: datumSubGraph.price
		}
		setParsedItem(newDatum)
	}

	useEffect(() => {
		refactorItem()
	}, [])

	return (
		<div className='nft'>
			<figure onClick={() => onShowDetail(parsedItem)}>
				<img src={parsedItem.image} alt='logo' />
			</figure>
			<div className='nft-description'>
				<p className='nft-description__title'>{parsedItem.name}</p>
				<div className='nft-description-container'>
					<figure onClick={() => onShowDetail(parsedItem)}>
						<img alt='logo' src={logo} />
					</figure>
					<p className='nft-description-container__price'>
						{parseInt(parsedItem.price) / 1000000000000000000}
					</p>
				</div>
			</div>
			{/* <button className="nft-description__show" onClick={onTransferFrom}>
        Transferir
      </button> */}
		</div>
	)
}
