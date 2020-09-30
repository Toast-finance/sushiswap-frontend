import { useContext } from 'react'
import { Context as FarmsContext, Farm } from '../contexts/Farms'

const useFarm = (lpTokenAddress: String): Farm => {
  const { farms } = useContext(FarmsContext)
  const farm = farms.find((farm) => farm.lpTokenAddress === lpTokenAddress)
  return farm
}

export default useFarm
