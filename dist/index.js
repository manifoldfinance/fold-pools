"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const IUniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const provider = new ethers_1.ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/3ff0c675dc614116aa126b14f6368971');
const poolAddress = '0xe081eeab0adde30588ba8d5b3f6ae5284790f54a';
const poolContract = new ethers_1.ethers.Contract(poolAddress, IUniswapV3Pool_json_1.abi, provider);
async function getPoolImmutables() {
    const immutables = {
        factory: await poolContract.factory(),
        token0: await poolContract.token0(),
        token1: await poolContract.token1(),
        fee: await poolContract.fee(),
        tickSpacing: await poolContract.tickSpacing(),
        maxLiquidityPerTick: await poolContract.maxLiquidityPerTick(),
    };
    return immutables;
}
async function getPoolState() {
    const slot = await poolContract.slot0();
    const PoolState = {
        liquidity: await poolContract.liquidity(),
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
    };
    return PoolState;
}
async function main() {
    const immutables = await getPoolImmutables();
    const state = await getPoolState();
    const TokenA = new sdk_core_1.Token(1, immutables.token0, 6, 'USDC', 'USD Coin');
    const TokenB = new sdk_core_1.Token(1, immutables.token1, 18, 'FOLD', 'Manifold Finance');
    const poolExample = new v3_sdk_1.Pool(TokenA, TokenB, immutables.fee, state.sqrtPriceX96.toString(), state.liquidity.toString(), state.tick);
    console.log(poolExample);
}
main();
