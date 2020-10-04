import { useContext } from 'react'
import { Context as FarmsContext, Farm } from '../contexts/Farms'
import {supportedPools2, supportedPools3} from "../sushi/lib/constants";

const useFarm = (lpTokenAddress: String, isCommunity = false): any => {
  let farms = supportedPools3
  if (isCommunity) {
    farms = localStorage.getItem("pools") ? JSON.parse(localStorage.getItem("pools")) : []
  }
  const farm = farms.find((farm : any) => farm.lpTokenAddress === lpTokenAddress)
  return farm
}

export default useFarm
