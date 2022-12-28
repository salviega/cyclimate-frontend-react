import { Blob, File, Web3Storage } from 'web3.storage'

export function web3Storage() {
	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGVFOTUzZjhENDFGNkRFRjQ5RGEzMzYxODkyNzRFNDhBNjE0YjAyNTMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgwODM4ODk3MzcsIm5hbWUiOiJza3l3b29kLnVyYmFuIn0.L4s7ztTLukk2TBGvBlyVQ7xUbPX8lNVS8tHR4o3y-tU'

	const putImage = async object => {
		if (!token) {
			console.error(
				'A token is needed. You can create one on https://web3.storage'
			)
			return
		}

		const storage = new Web3Storage({ token })
		const image = prepareImage(object)
		const cid = await storage.put(image)

		return `${cid}.ipfs.w3s.link/${object.name}.${object.typeImage}`
	}

	const putMetadata = async newObject => {
		if (!token) {
			console.error(
				'A token is needed. You can create one on https://web3.storage'
			)
			return
		}

		const storage = new Web3Storage({ token })

		const json = prepareMetadata(newObject)
		const cid = await storage.put(json)

		return `${cid}.ipfs.w3s.link/${newObject.name}`
	}

	return { putImage, putMetadata }
}

function prepareImage(object) {
	const blob = new Blob([object.image], {
		type: `application/${object.typeImage}`
	})

	return [new File([blob], `${object.name}.${object.typeImage}`)]
}

function prepareMetadata(newObject) {
	const metadata = {
		name: newObject.name,
		description: newObject.description,
		image: newObject.image,
		attributes: [
			{
				'trait-Type': newObject.traitType,
				value: newObject.terms
			}
		]
	}

	const blob = new Blob([JSON.stringify(metadata)], {
		type: 'application/json'
	})

	const json = [new File([blob], newObject.name)]
	return json
}
