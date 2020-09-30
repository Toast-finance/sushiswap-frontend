import { useContext } from 'react'
import { Context as FarmsContext, Farm } from '../contexts/Farms'

const useFarm = (lpTokenAddress: String): Farm => {
  const farms = localStorage.getItem("pools") ? JSON.parse(localStorage.getItem("pools")) : []
  const farm = farms.find((farm : any) => farm.lpTokenAddress === lpTokenAddress)
  return farm
}

export default useFarm
