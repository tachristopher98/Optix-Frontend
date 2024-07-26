import { Trans } from "@lingui/macro";
import { BigNumber } from "ethers";
import { ReactNode, useCallback } from "react";

import { useMarketsInfoData } from "context/SyntheticsStateContext/hooks/globalsHooks";
import {
  useTradeboxExistingOrder,
  useTradeboxIncreasePositionAmounts,
  useTradeboxSelectedPosition,
  useTradeboxState,
  useTradeboxTradeFlags,
} from "context/SyntheticsStateContext/hooks/tradeboxHooks";
import { selectIndexTokenStatsMap } from "context/SyntheticsStateContext/selectors/statsSelectors";
import { selectTradeboxAvailableMarketsOptions } from "context/SyntheticsStateContext/selectors/tradeboxSelectors";
import { useSelector } from "context/SyntheticsStateContext/utils";
import { getFeeItem } from "domain/synthetics/fees/utils";
import { Market, MarketInfo } from "domain/synthetics/markets/types";
import { getAvailableUsdLiquidityForPosition, getMarketPoolName } from "domain/synthetics/markets/utils";
import { BN_ZERO, formatPercentage, formatRatePercentage } from "lib/numbers";
import { getByKey } from "lib/objects";

import { AlertInfo } from "components/AlertInfo/AlertInfo";

const SHOW_HAS_BETTER_FEES_WARNING_THRESHOLD_BPS = 1; // +0.01%
const SHOW_HAS_BETTER_NET_RATE_WARNING_THRESHOLD = BigNumber.from(10).pow(25); // +0.001%

const SPACE = " ";

export const useTradeboxPoolWarnings = (
  withActions = true,
  textColor: "text-warning" | "text-gray" = "text-warning"
) => {
  const marketsInfoData = useMarketsInfoData();
  const marketsOptions = useSelector(selectTradeboxAvailableMarketsOptions);
  const increaseAmounts = useTradeboxIncreasePositionAmounts();
  const { marketInfo, setMarketAddress, setCollateralAddress } = useTradeboxState();
  const { isLong, isIncrease } = useTradeboxTradeFlags();
  const existingOrder = useTradeboxExistingOrder();
  const selectedPosition = useTradeboxSelectedPosition();
  const hasExistingOrder = Boolean(existingOrder);
  const hasExistingPosition = Boolean(selectedPosition);
  const allMarketStats = useSelector(selectIndexTokenStatsMap);

  const currentMarketStat =
    marketInfo &&
    allMarketStats.indexMap[marketInfo.indexTokenAddress]?.marketsStats.find(
      (marketStat) => marketStat.marketInfo.marketTokenAddress === marketInfo.marketTokenAddress
    );

  const isSelectedMarket = useCallback(
    (market: Market) => {
      return marketInfo && market.marketTokenAddress === marketInfo.marketTokenAddress;
    },
    [marketInfo]
  );

  const WithActon = useCallback(
    ({ children }: { children: ReactNode }) =>
      withActions ? (
        <>
          {SPACE}
          {children}
        </>
      ) : null,
    [withActions]
  );

  if (!marketInfo) {
    return null;
  }

  const indexToken = marketInfo.indexToken;
  const marketWithPosition = marketsOptions?.marketWithPosition;
  const isNoSufficientLiquidityInAnyMarket = marketsOptions?.isNoSufficientLiquidityInAnyMarket;
  const isNoSufficientLiquidityInMarketWithPosition = marketsOptions?.isNoSufficientLiquidityInMarketWithPosition;
  const minOpenFeesMarket = (marketsOptions?.minOpenFeesAvailableMarketAddress &&
    getByKey(marketsInfoData, marketsOptions?.minOpenFeesAvailableMarketAddress)) as MarketInfo | undefined;
  const longLiquidity = getAvailableUsdLiquidityForPosition(marketInfo, true);
  const shortLiquidity = getAvailableUsdLiquidityForPosition(marketInfo, false);
  const isOutPositionLiquidity = isLong
    ? longLiquidity.lt(increaseAmounts?.sizeDeltaUsd || 0)
    : shortLiquidity.lt(increaseAmounts?.sizeDeltaUsd || 0);
  const marketWithOrder = marketsOptions?.marketWithOrder;

  const positionFeeBeforeDiscountBps =
    increaseAmounts &&
    getFeeItem(increaseAmounts.positionFeeUsd.add(increaseAmounts.feeDiscountUsd).mul(-1), increaseAmounts.sizeDeltaUsd)
      ?.bps;

  const improvedOpenFeesDeltaBps =
    increaseAmounts?.acceptablePriceDeltaBps &&
    (marketsOptions.minOpenFeesBps || BN_ZERO)
      .sub(positionFeeBeforeDiscountBps || BN_ZERO)
      .sub(increaseAmounts.acceptablePriceDeltaBps);

  const availableIndexTokenStat = marketsOptions.availableIndexTokenStat;

  const bestNetFee = isLong ? availableIndexTokenStat?.bestNetFeeLong : availableIndexTokenStat?.bestNetFeeShort;
  const currentNetFee = isLong ? currentMarketStat?.netFeeLong : currentMarketStat?.netFeeShort;
  const improvedNetRateAbsDelta =
    currentMarketStat && bestNetFee && currentNetFee && bestNetFee.sub(currentNetFee).abs();
  const bestNetFeeMarket = getByKey(
    marketsInfoData,
    isLong
      ? availableIndexTokenStat?.bestNetFeeLongMarketAddress
      : availableIndexTokenStat?.bestNetFeeShortMarketAddress
  );

  const showHasExistingPositionButNotEnoughLiquidityWarning =
    !hasExistingPosition &&
    marketWithPosition &&
    !isSelectedMarket(marketWithPosition) &&
    isNoSufficientLiquidityInMarketWithPosition;
  const showHasExistingPositionWarning =
    !showHasExistingPositionButNotEnoughLiquidityWarning &&
    !hasExistingPosition &&
    marketWithPosition &&
    !isSelectedMarket(marketWithPosition);
  const showHasNoSufficientLiquidityInAnyMarketWarning = isNoSufficientLiquidityInAnyMarket;
  const showHasInsufficientLiquidityAndPositionWarning =
    isOutPositionLiquidity && minOpenFeesMarket && !isSelectedMarket(minOpenFeesMarket) && hasExistingPosition;
  const showHasInsufficientLiquidityAndNoPositionWarning =
    isOutPositionLiquidity && minOpenFeesMarket && !isSelectedMarket(minOpenFeesMarket) && !hasExistingPosition;

  const showHasExistingOrderWarning =
    !hasExistingPosition &&
    !marketWithPosition &&
    !hasExistingOrder &&
    marketWithOrder &&
    !isSelectedMarket(marketWithOrder);

  const canShowHasBetterExecutionFeesWarning =
    isIncrease &&
    minOpenFeesMarket &&
    !isSelectedMarket(minOpenFeesMarket) &&
    improvedOpenFeesDeltaBps?.gte(SHOW_HAS_BETTER_FEES_WARNING_THRESHOLD_BPS);

  const canShowHasBetterNetFeesWarning =
    isIncrease &&
    bestNetFeeMarket &&
    marketInfo.marketTokenAddress !== bestNetFeeMarket.marketTokenAddress &&
    improvedNetRateAbsDelta?.gte(SHOW_HAS_BETTER_NET_RATE_WARNING_THRESHOLD);
  const showHasBetterOpenFeesAndNetFeesWarning =
    canShowHasBetterExecutionFeesWarning &&
    canShowHasBetterNetFeesWarning &&
    bestNetFeeMarket.marketTokenAddress === minOpenFeesMarket?.marketTokenAddress;
  const showHasBetterOpenFeesWarning = canShowHasBetterExecutionFeesWarning && !showHasBetterOpenFeesAndNetFeesWarning;
  const showHasBetterNetFeesWarning = canShowHasBetterNetFeesWarning && !showHasBetterOpenFeesAndNetFeesWarning;

  if (
    !showHasExistingPositionWarning &&
    !showHasNoSufficientLiquidityInAnyMarketWarning &&
    !showHasInsufficientLiquidityAndPositionWarning &&
    !showHasInsufficientLiquidityAndNoPositionWarning &&
    !showHasExistingOrderWarning &&
    !showHasBetterOpenFeesWarning &&
    !showHasBetterNetFeesWarning &&
    !showHasBetterOpenFeesAndNetFeesWarning &&
    !showHasExistingPositionButNotEnoughLiquidityWarning
  ) {
    return null;
  }

  const warning: ReactNode[] = [];

  if (showHasExistingPositionWarning) {
    warning.push(
      <AlertInfo key="showHasExistingPositionWarning" type="warning" compact textColor={textColor}>
        <Trans>
          You have an existing position in the {getMarketPoolName(marketWithPosition)} market pool.
          <WithActon>
            <span
              className="clickable underline muted"
              onClick={() => {
                setMarketAddress(marketWithPosition.marketTokenAddress);
                setCollateralAddress(marketsOptions.collateralWithPosition?.address);
              }}
            >
              Switch to {getMarketPoolName(marketWithPosition)} market pool
            </span>
            .
          </WithActon>
        </Trans>
      </AlertInfo>
    );
  }

  if (showHasExistingPositionButNotEnoughLiquidityWarning) {
    warning.push(
      <AlertInfo key="showHasExistingPositionButNotEnoughLiquidityWarning" type="warning" compact textColor={textColor}>
        <Trans>
          You have an existing position in the {getMarketPoolName(marketWithPosition)} market pool, but it lacks
          liquidity for this order.
          <WithActon>
            <span
              className="clickable underline muted"
              onClick={() => {
                setMarketAddress(marketWithPosition.marketTokenAddress);
                setCollateralAddress(marketsOptions.collateralWithPosition?.address);
              }}
            >
              Switch anyway to {getMarketPoolName(marketWithPosition)} market pool
            </span>
            .
          </WithActon>
        </Trans>
      </AlertInfo>
    );
  }

  if (showHasNoSufficientLiquidityInAnyMarketWarning) {
    warning.push(
      <AlertInfo key="showHasNoSufficientLiquidityInAnyMarketWarning" type="warning" compact textColor={textColor}>
        <Trans>Insufficient liquidity in any {indexToken?.symbol}/USD market pools for your order.</Trans>
      </AlertInfo>
    );
  }

  if (showHasInsufficientLiquidityAndNoPositionWarning) {
    warning.push(
      <AlertInfo key="showHasInsufficientLiquidityAndNoPositionWarning" type="warning" compact textColor={textColor}>
        <Trans>
          Insufficient liquidity in the {marketInfo ? getMarketPoolName(marketInfo) : "..."} market pool. Select a
          different pool for this market.
          <WithActon>
            <span
              className="clickable underline muted"
              onClick={() => setMarketAddress(minOpenFeesMarket!.marketTokenAddress)}
            >
              Switch to {getMarketPoolName(minOpenFeesMarket)} market pool
            </span>
            .
          </WithActon>
        </Trans>
      </AlertInfo>
    );
  }

  if (showHasInsufficientLiquidityAndPositionWarning) {
    warning.push(
      <AlertInfo key="showHasInsufficientLiquidityAndPositionWarning" type="warning" compact textColor={textColor}>
        <Trans>
          Insufficient liquidity in the {marketInfo ? getMarketPoolName(marketInfo) : "..."} market pool. Select a
          different pool for this market. Choosing a different pool would open a new position different from the
          existing one.
          <WithActon>
            <span
              className="clickable underline muted"
              onClick={() => setMarketAddress(marketsOptions.minOpenFeesAvailableMarketAddress)}
            >
              Switch to {getMarketPoolName(minOpenFeesMarket)} market pool
            </span>
            .
          </WithActon>
        </Trans>
      </AlertInfo>
    );
  }

  if (showHasExistingOrderWarning) {
    const address = marketsOptions.collateralWithOrder!.address;

    warning.push(
      <AlertInfo key="showHasExistingOrderWarning" type="warning" compact textColor={textColor}>
        <Trans>
          You have an existing order in the {getMarketPoolName(marketWithOrder)} market pool.
          <WithActon>
            <span
              className="clickable underline muted"
              onClick={() => {
                setMarketAddress(marketWithOrder.marketTokenAddress);
                setCollateralAddress(address);
              }}
            >
              Switch to {getMarketPoolName(marketWithOrder)} market pool
            </span>
            .
          </WithActon>
        </Trans>
      </AlertInfo>
    );
  }

  if (showHasBetterOpenFeesWarning) {
    warning.push(
      <AlertInfo key="showHasBetterOpenFeesWarning" type="warning" compact textColor={textColor}>
        <Trans>
          You can get {formatPercentage(improvedOpenFeesDeltaBps)} better open fees in the{" "}
          {getMarketPoolName(minOpenFeesMarket)} market pool.
          <WithActon>
            <span
              className="clickable underline muted"
              onClick={() => setMarketAddress(minOpenFeesMarket.marketTokenAddress)}
            >
              Switch to {getMarketPoolName(minOpenFeesMarket)} market pool
            </span>
            .
          </WithActon>
        </Trans>
      </AlertInfo>
    );
  }

  if (showHasBetterNetFeesWarning) {
    warning.push(
      <AlertInfo key="showHasBetterNetFeesWarning" type="warning" compact textColor={textColor}>
        <Trans>
          You can get a {formatRatePercentage(improvedNetRateAbsDelta, { signed: false })} / 1h better net rate in the{" "}
          {getMarketPoolName(bestNetFeeMarket)} market pool.
          <WithActon>
            <span
              className="clickable underline muted"
              onClick={() => setMarketAddress(bestNetFeeMarket.marketTokenAddress)}
            >
              Switch to {getMarketPoolName(bestNetFeeMarket)} market pool
            </span>
            .
          </WithActon>
        </Trans>
      </AlertInfo>
    );
  }

  if (showHasBetterOpenFeesAndNetFeesWarning) {
    warning.push(
      <AlertInfo key="showHasBetterOpenFeesAndNetFeesWarning" type="warning" compact textColor={textColor}>
        <Trans>
          You can get {formatPercentage(improvedOpenFeesDeltaBps)} better open fees and a{" "}
          {formatRatePercentage(improvedNetRateAbsDelta, { signed: false })} / 1h better net rate in the{" "}
          {getMarketPoolName(minOpenFeesMarket)} market pool.
          <WithActon>
            <span
              className="clickable underline muted"
              onClick={() => setMarketAddress(minOpenFeesMarket.marketTokenAddress)}
            >
              Switch to {getMarketPoolName(minOpenFeesMarket)} market pool
            </span>
            .
          </WithActon>
        </Trans>
      </AlertInfo>
    );
  }

  return warning;
};

export function TradeboxPoolWarnings() {
  const warnings = useTradeboxPoolWarnings();

  return <>{warnings}</>;
}
