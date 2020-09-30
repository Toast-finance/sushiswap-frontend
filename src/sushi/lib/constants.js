import BigNumber from 'bignumber.js/bignumber'
import UNIV2PairAbi from "./abi/uni_v2_lp.json";
import ERC20Abi from "./abi/erc20.json";
import {getContract, getSymbol, getToken0, getToken1} from "../../utils/erc20";

export const SUBTRACT_GAS_LIMIT = 100000

const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)

export const INTEGERS = {
    ONE_MINUTE_IN_SECONDS,
    ONE_HOUR_IN_SECONDS,
    ONE_DAY_IN_SECONDS,
    ONE_YEAR_IN_SECONDS,
    ZERO: new BigNumber(0),
    ONE: new BigNumber(1),
    ONES_31: new BigNumber('4294967295'), // 2**32-1
    ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
    ONES_255: new BigNumber(
        '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    ), // 2**256-1
    INTEREST_RATE_BASE: new BigNumber('1e18'),
}

export const contractAddresses = {
    sushi: {
        1: '0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47',
    },
    masterChef: {
        1: '0xd725621e3b031d74e62c280dc0f5be0b50dfa050',
    },
    weth: {
        1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
}

/*
UNI-V2 LP Address on mainnet for reference
==========================================

HOUSE - 0x19810559df63f19cfe88923313250550edadb743
  AVO - 0x774adc647a8d27947c8d7c098cdb4cdf30b126de
 EGGS - 0x98be5a6b401b911151853d94a6052526dcb46fe3
TOAST - 0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47

0  HOUSE-ETH   0x2209b8260110af927AF0f2Eb96db471aE3Ab05EA
1  TOAST-ETH   0x5690EF1f923007912C29Cf746751BFeAf3435129
2  HOUSE-AVO   0xBDdE248cfe84258E16dBf3911C1Ce9c93beB3EB9
3  HOUSE-EGGS  0x6a81Ef228cfc8964F76F43cdecdcCCAD191baD5f
4  HOUSE-TOAST 0x7978211A31491Af5222B56fbeBBbc67cbf3689fB
5    AVO-EGGS  0x179bE6f0c2cb1558C8C5958b27C7d0951F546ECF
6    AVO-TOAST 0xDcd212e89cCc65ece9e2CFF7AAe35624A269b092
7   EGGS-TOAST 0x324286662f6d9255fBB006D160692e294bDaA920
*/

export const supportedPools = async (sushi, masterChefContract, networkId, web3, ethereum) => {
    let pools = [];

    if (masterChefContract) {
        const poolLength = await masterChefContract.methods.poolLength().call()
        console.log(poolLength);

        for (let i = 0; i < poolLength; i++) {
            const pool = await masterChefContract.methods.poolInfo(i).call()
            let symbol = await getSymbol(ethereum, pool.lpToken);
            const token0 = await getToken0(ethereum, pool.lpToken);
            let token1 = "";
            if (token0 !== "0") {
                const symbol0 = await getSymbol(ethereum, token0);
                token1 = await getToken1(ethereum, pool.lpToken);
                const symbol1 = await getSymbol(ethereum, token1);
                symbol = symbol0 + "-" + symbol1 + " " + symbol;
            }

            let icon = "﹖";
            switch (symbol.substr(0, 1)) {
                case "A":
                    icon = "🍎";
                    break;
                case "B":
                    icon = "🍌";
                    break;
                case "C":
                    icon = "☕️";
                    break;
                case "D":
                    icon = "🍩";
                    break;
                case "E":
                    icon = "🍆";
                    break;
                case "F":
                    icon = "🐟";
                    break;
                case "G":
                    icon = "🍇";
                    break;
                case "H":
                    icon = "🍯";
                    break;
                case "I":
                    icon = "🍦";
                    break;
                case "J":
                    icon = "🧃";
                    break;
                case "K":
                    icon = "🥝";
                    break;
                case "L":
                    icon = "🍋";
                    break;
                case "M":
                    icon = "🍈";
                    break;
                case "N":
                    icon = "🥜";
                    break;
                case "O":
                    icon = "🍊";
                    break;
                case "P":
                    icon = "🍑";
                    break;
                case "Q":
                    icon = "🥧";
                    break;
                case "R":
                    icon = "🍚";
                    break;
                case "S":
                    icon = "🍝";
                    break;
                case "T":
                    icon = "🍅";
                    break;
                case "U":
                    icon = "🍣";
                    break;
                case "V":
                    icon = "🥗";
                    break;
                case "W":
                    icon = "🍷";
                    break;
                case "X":
                    icon = "💋";
                    break;
                case "Y":
                    icon = "🥔";
                    break;
                case "Z":
                    icon = "💤";
                    break;
                default:
                    icon = "﹖";
                    break;
            }
            if (pool.lpToken.toLowerCase() === "0x19810559df63f19cfe88923313250550edadb743") {
                icon = "🏠"
            }
            if (pool.lpToken.toLowerCase() === "0x774adc647a8d27947c8d7c098cdb4cdf30b126de") {
                icon = "🥑"
            }
            if (pool.lpToken.toLowerCase() === "0x98be5a6b401b911151853d94a6052526dcb46fe3") {
                icon = "🥚"
            }
            if (pool.lpToken.toLowerCase() === "0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47") {
                icon = "🍞"
            }
            if (token0 !== "0") {
                icon = "";
                if (token0.toLowerCase() === "0x19810559df63f19cfe88923313250550edadb743") {
                    icon += "🏠"
                }
                if (token0.toLowerCase() === "0x774adc647a8d27947c8d7c098cdb4cdf30b126de") {
                    icon += "🥑"
                }
                if (token0.toLowerCase() === "0x98be5a6b401b911151853d94a6052526dcb46fe3") {
                    icon += "🥚"
                }
                if (token0.toLowerCase() === "0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47") {
                    icon += "🍞"
                }
                if (token1.toLowerCase() === "0x19810559df63f19cfe88923313250550edadb743") {
                    icon += "🏠"
                }
                if (token1.toLowerCase() === "0x774adc647a8d27947c8d7c098cdb4cdf30b126de") {
                    icon += "🥑"
                }
                if (token1.toLowerCase() === "0x98be5a6b401b911151853d94a6052526dcb46fe3") {
                    icon += "🥚"
                }
                if (token1.toLowerCase() === "0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47") {
                    icon += "🍞"
                }
                icon += "🦄";
            }

            console.log(pool)

            pools.push(
                {
                    pid: i,
                    lpAddresses: {
                        1: pool.lpToken,
                    },
                    tokenAddresses: {
                        1: token0 !== "0" ? token0 : pool.lpToken
                    },
                    name: '',
                    symbol: symbol,
                    tokenSymbol: '',
                    icon: icon,
                }
            )
        }
        pools.map((pool) =>
            Object.assign(pool, {
                lpAddress: pool.lpAddresses[networkId],
                tokenAddress: pool.tokenAddresses[networkId],
                lpContract: getContract(ethereum, pool.lpAddresses[networkId]),
                tokenContract: getContract(ethereum, pool.tokenAddresses[networkId]),
            }),
        )

        const setProvider = (contract, address) => {
            contract.setProvider(ethereum)
            if (address) contract.options.address = address
            else console.error('Contract address not found in network', networkId)
        }
        pools.forEach(
            ({ lpContract, lpAddress, tokenContract, tokenAddress }) => {
                setProvider(lpContract, lpAddress)
                setProvider(tokenContract, tokenAddress)
            },
        )
    }

    pools = pools.map(
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
            earnTokenAddress: contractAddresses.sushi,
            icon,
        }),
    )

    localStorage.setItem('pools', JSON.stringify(pools));

    return pools
}

/*export const supportedPools = [
    {
        pid: 0,
        lpAddresses: {
            1: '0x2209b8260110af927AF0f2Eb96db471aE3Ab05EA',
        },
        tokenAddresses: {
            1: '0x19810559df63f19cfe88923313250550edadb743',
        },
        name: '',
        symbol: 'HOUSE-ETH UNI-V2 LP',
        tokenSymbol: 'HOUSE',
        icon: '🏠',
    },
    {
        pid: 1,
        lpAddresses: {
            1: '0x5690EF1f923007912C29Cf746751BFeAf3435129',
        },
        tokenAddresses: {
            1: '0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47',
        },
        name: '',
        symbol: 'TOAST-ETH UNI-V2 LP',
        tokenSymbol: 'TOAST',
        icon: '🍞',
    },
    {
        pid: 11,
        lpAddresses: {
            1: '0x767a1678519661605e712439cf826ea39986f7c9',
        },
        tokenAddresses: {
            1: '0x767a1678519661605e712439cf826ea39986f7c9',
        },
        name: '',
        symbol: 'TOASTER BPT',
        tokenSymbol: 'BPT',
        icon: '🏠🥑🥚🍞',
    },
    {
        pid: 2,
        lpAddresses: {
            1: '0xBDdE248cfe84258E16dBf3911C1Ce9c93beB3EB9',
        },
        tokenAddresses: {
            1: '0x19810559df63f19cfe88923313250550edadb743',
            2: '0x774adc647a8d27947c8d7c098cdb4cdf30b126de',
        },
        name: '',
        symbol: 'HOUSE-AVO UNI-V2 LP',
        tokenSymbol: '',
        icon: '🏠🥑',
    },
    {
        pid: 3,
        lpAddresses: {
            1: '0x6a81Ef228cfc8964F76F43cdecdcCCAD191baD5f',
        },
        tokenAddresses: {
            1: '0x19810559df63f19cfe88923313250550edadb743',
            2: '0x98be5a6b401b911151853d94a6052526dcb46fe3',
        },
        name: '',
        symbol: 'HOUSE-EGGS UNI-V2 LP',
        tokenSymbol: '',
        icon: '🏠🥚',
    },
    {
        pid: 4,
        lpAddresses: {
            1: '0x7978211A31491Af5222B56fbeBBbc67cbf3689fB',
        },
        tokenAddresses: {
            1: '0x19810559df63f19cfe88923313250550edadb743',
            2: '0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47',
        },
        name: '',
        symbol: 'HOUSE-TOAST UNI-V2 LP',
        tokenSymbol: '',
        icon: '🏠🍞',
    },
    {
        pid: 5,
        lpAddresses: {
            1: '0x179bE6f0c2cb1558C8C5958b27C7d0951F546ECF',
        },
        tokenAddresses: {
            1: '0x774adc647a8d27947c8d7c098cdb4cdf30b126de',
            2: '0x98be5a6b401b911151853d94a6052526dcb46fe3',
        },
        name: '',
        symbol: 'AVO-EGGS UNI-V2 LP',
        tokenSymbol: '',
        icon: '🥑🥚',
    },
    {
        pid: 6,
        lpAddresses: {
            1: '0xDcd212e89cCc65ece9e2CFF7AAe35624A269b092',
        },
        tokenAddresses: {
            2: '0x774adc647a8d27947c8d7c098cdb4cdf30b126de',
            1: '0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47',
        },
        name: '',
        symbol: 'AVO-TOAST UNI-V2 LP',
        tokenSymbol: '',
        icon: '🥑🍞',
    },
    {
        pid: 7,
        lpAddresses: {
            1: '0x324286662f6d9255fBB006D160692e294bDaA920',
        },
        tokenAddresses: {
            2: '0x98be5a6b401b911151853d94a6052526dcb46fe3',
            1: '0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47',
        },
        name: '',
        symbol: 'EGGS-TOAST UNI-V2 LP',
        tokenSymbol: '',
        icon: '🥚🍞',
    },
    {
        pid: 8,
        lpAddresses: {
            1: '0xddf9b7a31b32ebaf5c064c80900046c9e5b7c65f',
        },
        tokenAddresses: {
            1: '0x2ba592f78db6436527729929aaf6c908497cb200',
        },
        name: '',
        symbol: 'CREAM-ETH UNI-V2 LP',
        tokenSymbol: 'CREAM',
        icon: '🍦',
    },
    {
        pid: 9,
        lpAddresses: {
            1: '0xc139d8450177c0b8c3788608518687b585f7ae5a',
        },
        tokenAddresses: {
            1: '0xb8baa0e4287890a5f79863ab62b7f175cecbd433',
        },
        name: '',
        symbol: 'SWRV-ETH UNI-V2 LP',
        tokenSymbol: 'SWRV',
        icon: '↩️',
    },
    {
        pid: 10,
        lpAddresses: {
            1: '0xcb4f983e705caeb7217c5c3785001cb138115f0b',
        },
        tokenAddresses: {
            1: '0x45f24baeef268bb6d63aee5129015d69702bcdfa',
        },
        name: '',
        symbol: 'YFV-ETH UNI-V2 LP',
        tokenSymbol: 'YFV',
        icon: '📈',
    },
    {
        pid: 12,
        lpAddresses: {
            1: '0x8f1a125b6e3cc83855e8e36a5fde65a2453ab395',
        },
        tokenAddresses: {
            1: '0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47',
        },
        name: '',
        symbol: 'UNI-TOAST UNI-V2 LP',
        tokenSymbol: '',
        icon: '🦄🍞',
    },
    {
        pid: 13,
        lpAddresses: {
            1: '0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D',
        },
        tokenAddresses: {
            1: '0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D',
        },
        name: '',
        symbol: 'Statera Phoenix BPT',
        tokenSymbol: '',
        icon: '🦅',
    },
]*/
