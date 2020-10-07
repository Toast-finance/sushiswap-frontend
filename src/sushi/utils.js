import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import {supportedPools} from "./lib/constants";
import {Contracts} from "./lib/contracts";
import UNIV2PairAbi from "./lib/abi/uni_v2_lp.json";
import ERC20Abi from "./lib/abi/erc20.json";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getMasterChefAddress = (sushi) => {
  return sushi && sushi.masterChefAddress
}
export const getSushiAddress = (sushi) => {
  return sushi && sushi.sushiAddress
}
export const getWethContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.weth
}

export const getHeadChefContract = (sushi) => {
    return sushi && sushi.contracts && sushi.contracts.headChef
}
export const getMasterChefContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.masterChef
}
export const getSushiContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.sushi
}

export const getFarms = (sushi) => {
  return localStorage.getItem("pools") ? JSON.parse(localStorage.getItem("pools")) : []
  if (!sushi) {
    return []
  }
  else {
    return sushi.contracts.pools.map(
        ({
           pid,
           name,
           symbol,
           icon,
           tokenAddress,
           tokenSymbol,
           tokenContract,
           lpAddress,
           lpContract,
         }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          earnToken: 'toast',
          earnTokenAddress: sushi.contracts.sushi.options.address,
          icon,
        }),
    )
  }
}

export const getPoolSingleWeight = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  return new BigNumber(allocPoint)
}

export const getPoolWeight = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await masterChefContract.methods
    .totalAllocPoint()
    .call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterChefContract, pid, account) => {
  return masterChefContract.methods.pendingSushi(pid, account).call()
}

export const getTotalLPWethValue = async (
  masterChefContract,
  wethContract,
  pid,
  pools,
) => {

  if (pools.length === 0 || !pools.find(pool => pid === pool.pid) || !pools.find(pool => pid === pool.pid).tokenContract.methods.balanceOf || !pools.find(pool => pid === pool.pid).lpContract.methods.balanceOf) {
      if (pid === 11) {
          console.log("toaster")
          console.log(pools.find(pool => pid === pool.pid))
      }
      return {
          tokenAmount: new BigNumber(0),
          wethAmount : new BigNumber(0),
          totalWethValue: new BigNumber(0),
          tokenPriceInWeth: new BigNumber(0),
          poolWeight: new BigNumber(0),
      };
  }

  // Get balance of the token address
  const tokenAmountWholeLP = await pools.find(pool => pid === pool.pid).tokenContract.methods
    .balanceOf(pools.find(pool => pid === pool.pid).lpAddress)
    .call()
  const tokenDecimals = await pools.find(pool => pid === pool.pid).tokenContract.methods.decimals().call()
  // Get the share of lpContract that masterChefContract owns
  const balance = await pools.find(pool => pid === pool.pid).lpContract.methods
    .balanceOf(masterChefContract.options.address)
    .call()
  // Convert that into the portion of total lpContract = p1
  const totalSupply = await pools.find(pool => pid === pool.pid).lpContract.methods.totalSupply().call()
  // Get total weth value for the lpContract = w1
  let lpContractWeth = await wethContract.methods
    .balanceOf(pools.find(pool => pid === pool.pid).lpAddress)
    .call()

    if (lpContractWeth == 0 && pools.find(pool => pid === pool.pid).lpAddress.toLowerCase() === pools.find(pool => pid === pool.pid).tokenAddresses[1].toLowerCase()) {
        const tokenBalance = await pools.find(pool => pid === pool.pid).lpContract.methods
            .balanceOf(masterChefContract.options.address)
            .call()
        const balance2index = pools.findIndex(pool => pool.pid !== pid && pool.tokenAddresses[1].toLowerCase() == pools.find(pool => pid === pool.pid).tokenAddresses[1].toString().toLowerCase());
        if (balance2index >= 0) {
            let lpContractOtherToken = await pools.find(pool => pid === pool.pid).tokenContract.methods
                .balanceOf(pools[balance2index].lpAddress)
                .call()
            lpContractWeth = await wethContract.methods
                .balanceOf(pools[balance2index].lpAddress)
                .call() * tokenBalance / lpContractOtherToken;
        }
    }

  if (lpContractWeth == 0) {
    const tokenBalance = await pools.find(pool => pid === pool.pid).tokenContract.methods
        .balanceOf(pools.find(pool => pid === pool.pid).lpAddress)
        .call()
    const balance2index = pools.findIndex(pool => pool.pid !== pid && pool.tokenAddresses[1].toLowerCase() == pools.find(pool => pid === pool.pid).tokenAddresses[1].toString().toLowerCase());
    if (balance2index >= 0) {
        let lpContractOtherToken = await pools.find(pool => pid === pool.pid).tokenContract.methods
            .balanceOf(pools[balance2index].lpAddress)
            .call()
        lpContractWeth = await wethContract.methods
            .balanceOf(pools[balance2index].lpAddress)
            .call() * tokenBalance / lpContractOtherToken;
    }

      if (lpContractWeth == 0) {
          const tokenBalance = await pools.find(pool => pid === pool.pid).tokenContract2.methods
              .balanceOf(pools.find(pool => pid === pool.pid).lpAddress)
              .call()
          const balance2index = pools.findIndex(pool => pool.pid !== pid && pool.tokenAddresses[1].toLowerCase() == pools.find(pool => pid === pool.pid).tokenAddresses[2].toString().toLowerCase());
          if (balance2index >= 0) {
          let lpContractOtherToken = await pools.find(pool => pid === pool.pid).tokenContract2.methods
              .balanceOf(pools[balance2index].lpAddress)
              .call()
          lpContractWeth = await wethContract.methods
              .balanceOf(pools[balance2index].lpAddress)
              .call() * tokenBalance / lpContractOtherToken;
          }
      }

    if (lpContractWeth == 0) {
      const firstStepIndex = pools.findIndex(pool => pool.pid !== pid && pool.tokenAddresses[2] && pool.tokenAddresses[2].toLowerCase() == pools.find(pool => pid === pool.pid).tokenAddress.toString().toLowerCase());
      if (firstStepIndex >= 0) {
          let firstStepTokenBalance = await pools.find(pool => pid === pool.pid).tokenContract.methods
              .balanceOf(pools[firstStepIndex].lpAddress)
              .call()

          let secondStepTokenBalance = await pools[firstStepIndex].tokenContract.methods
              .balanceOf(pools[firstStepIndex].lpAddress)
              .call()
          const secondStepIndex = pools.findIndex(pool => pool.pid !== pid && pool.tokenAddresses[1].toLowerCase() == pools[firstStepIndex].tokenAddress.toString().toLowerCase());
          let thirdStepTokenBalance = await pools[firstStepIndex].tokenContract.methods
              .balanceOf(pools[secondStepIndex].lpAddress)
              .call()
          lpContractWeth = await wethContract.methods
              .balanceOf(pools[secondStepIndex].lpAddress)
              .call() * secondStepTokenBalance / thirdStepTokenBalance * tokenBalance / firstStepTokenBalance;
      }
    }

  }

  console.log("pid " + pid + " " + pools.find(pool => pid === pool.pid).wethWeight)
  lpContractWeth *= (500000000000000000 / pools.find(pool => pid === pool.pid).wethWeight)

  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
  const lpWethWorth = new BigNumber(lpContractWeth)
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))

  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenDecimals))

  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))

  console.log(pid)
  console.log(wethAmount.toNumber())

  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(masterChefContract, pid),
  }
}

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const boost = async (pid, headChefContract, account) => {
    return headChefContract.methods
        .increaseWeight(pid, true)
        .send({ from: account })
}

export const add = async (token, headChefContract, account) => {
    return headChefContract.methods
        .addPool(token, true)
        .send({ from: account })
}

export const getSushiSupply = async (sushi) => {
  return new BigNumber(await sushi.contracts.sushi.methods.totalSupply().call())
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (masterChefContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return masterChefContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}
