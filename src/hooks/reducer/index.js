import { reducerObjectMarketplace } from './reducerObject/reducerObjectMarketplace'

export const reducerMarketplace = () => {
  const { initialValue, reducerObject, actionMarketplace: actionTypes } = reducerObjectMarketplace()
  return { initialValue, reducerObject, actionTypes }
}
