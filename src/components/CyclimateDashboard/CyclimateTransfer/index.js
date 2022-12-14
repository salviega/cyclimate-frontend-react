import React from 'react'

import {
	faArrowRightArrowLeft,
	faXmark
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useAuth, useContracts } from '../../../hooks/context'

import './CyclimateTransfer.scss'

export function CyclimateTransfer(props) {
	const {
		item,
		setLoading,
		setSincronized,
		setOpenModal,
		setOpenModalTransfer
	} = props

	const auth = useAuth()
	const contracts = useContracts()
	const address = React.useRef()

	const closeModal = () => {
		setOpenModalTransfer(false)
	}

	const onTransferFrom = async event => {
		event.preventDefault()
		const info = {
			from: auth.user.walletAddress,
			to: address.current.value,
			tokenId: parseInt(item.tokenId)
		}
		setOpenModal(false)
		setOpenModalTransfer(false)

		try {
			setLoading(true)
			const response = await contracts.cycliContract.authorizeOperator(
				contracts.marketPlaceContract.address
			)

			contracts.web3Provider
				.waitForTransaction(response.hash)
				.then(async _response => {
					const response2 = await contracts.marketPlaceContract.approve(
						contracts.marketPlaceContract.address,
						info.tokenId,
						{ gasLimit: 250000 }
					)
					contracts.web3Provider
						.waitForTransaction(response2.hash)
						.then(async _response2 => {
							const response2 =
								await contracts.marketPlaceContract.transferFrom(
									info.from,
									info.to,
									info.tokenId,
									{ gasLimit: 250000 }
								)
							contracts.web3Provider
								.waitForTransaction(response2.hash)
								.then(async _response2 => {
									setTimeout(() => {
										setLoading(false)
										window.alert(`Was transfer ${item.name} to ${info.to}`)
										setSincronized(false)
									}, 3000)
								})
								.catch(error => {
									window.alert('Hubo un error, revisa la consola')
									console.log(error)
									setLoading(false)
								})
						})
						.catch(error => {
							window.alert('Hubo un error, revisa la consola')
							console.log(error)
							setLoading(false)
						})
				})
				.catch(error => {
					window.alert('Hubo un error, revisa la consola')
					console.log(error)
					setLoading(false)
				})
		} catch (error) {
			window.alert('Hubo un error, revisa la consola')
			console.log(error)
			setLoading(false)
		}
	}

	return (
		<div className='modal'>
			<div className='modal-container'>
				<div className='modal-container__cancel' onClick={closeModal}>
					<FontAwesomeIcon icon={faXmark} />
				</div>
				<form className='modal-container-form' onSubmit={onTransferFrom}>
					<span>
						<p className='modal-container-form__subtitle'>
							Direcci??n de billetera
						</p>
						<input
							className='modal-container-form__add'
							ref={address}
							type='text'
							required
						/>
					</span>
					<button className='modal-container-form__submit'>
						<FontAwesomeIcon
							icon={faArrowRightArrowLeft}
							className='collection-modal-container-metadata-buy__icon'
						/>
						Transferir
					</button>
				</form>
			</div>
		</div>
	)
}
