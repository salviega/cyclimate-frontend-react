import * as PushAPI from '@pushprotocol/restapi'

export function pushProtocolRestApi () {
  const getNotifications = async (userAddress) => {
    const response = await PushAPI.user.getFeeds({
      user: `eip155:5:${userAddress}`,
      env: 'staging'
    })
    const refactoredResponse = response.map((notification) => {
      if (notification.notification.title.includes('Cyclimate')) {
        return notification
      }
      return null
    })
    const newRefactoredResponse = []
    Object.keys(refactoredResponse).map((attribute) => {
      if (refactoredResponse[attribute] !== null) {
        newRefactoredResponse.push(refactoredResponse[attribute])
      }
    })

    return newRefactoredResponse
  }

  return { getNotifications }
}
