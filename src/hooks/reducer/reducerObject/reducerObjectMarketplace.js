import { actionMarketplace } from '../actionTypes'

export function reducerObjectMarketplace () {
  const initialValue = {
    itemsSale: [],
    purchasedItems: [],
    currency: 0,
    tokenIdCounter: 0,
    error: false,
    loading: true,
    sincronizedItems: true
  }

  const reducerObject = (state, action) => {
    switch (action.type) {
      case 'ERROR':
        return {
          ...state,
          error: action.payload,
          loading: false
        }
      case 'LOADING':
        return {
          ...state,
          loading: true
        }
      case 'SINCRONIZE':
        return {
          ...state,
          error: false,
          loading: true,
          sincronizedItems: false
        }
      case 'SUCCESS':
        return {
          itemsSale: action.payload.refactoredSaleItems,
          purchasedItems: action.payload.refactoredPurchasedItems,
          currency: action.payload.currency,
          tokenIdCounter: action.payload.tokenIdCounter,
          error: false,
          loading: false,
          sincronizedItems: true
        }
      default:
        return {
          ...state
        }
    }
  }

  return { initialValue, reducerObject, actionMarketplace }
}
