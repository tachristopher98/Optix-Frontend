import { getKeepLeverageKey } from "config/localStorage";
import { SettingsContextType, useSettings } from "context/SettingsContext/SettingsContextProvider";
import { UserReferralInfo, useUserReferralInfoRequest } from "domain/referrals";
import { useGasLimits, useGasPrice } from "domain/synthetics/fees";
import { RebateInfoItem, useRebatesInfoRequest } from "domain/synthetics/fees/useRebatesInfo";
import useUiFeeFactor from "domain/synthetics/fees/utils/useUiFeeFactor";
import { MarketsInfoResult, MarketsResult, useMarkets, useMarketsInfoRequest } from "domain/synthetics/markets";
import { OrderEditorState, useOrderEditorState } from "domain/synthetics/orders/useOrderEditorState";
import { AggregatedOrdersDataResult, useOrdersInfoRequest } from "domain/synthetics/orders/useOrdersInfo";
import {
  PositionsConstantsResult,
  PositionsInfoResult,
  usePositionsConstantsRequest,
  usePositionsInfoRequest,
} from "domain/synthetics/positions";
import { PositionEditorState, usePositionEditorState } from "domain/synthetics/trade/usePositionEditorState";
import { PositionSellerState, usePositionSellerState } from "domain/synthetics/trade/usePositionSellerState";
import { TradeboxState, useTradeboxState } from "domain/synthetics/trade/useTradeboxState";
import { BigNumber, ethers } from "ethers";
import { useChainId } from "lib/chains";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import useWallet from "lib/wallets/useWallet";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Context, createContext, useContext, useContextSelector } from "use-context-selector";
import { LeaderboardState, useLeaderboardState } from "./useLeaderboardState";

export type SyntheticsPageType = "actions" | "trade" | "pools" | "leaderboard" | "competitions";

export type SyntheticsState = {
  pageType: SyntheticsPageType;
  globals: {
    chainId: number;
    markets: MarketsResult;
    marketsInfo: MarketsInfoResult;
    positionsInfo: PositionsInfoResult;
    account: string | undefined;
    ordersInfo: AggregatedOrdersDataResult;
    positionsConstants: PositionsConstantsResult;
    uiFeeFactor: BigNumber;
    userReferralInfo: UserReferralInfo | undefined;

    closingPositionKey: string | undefined;
    setClosingPositionKey: (key: string | undefined) => void;

    keepLeverage: boolean | undefined;
    setKeepLeverage: (value: boolean) => void;

    gasLimits: ReturnType<typeof useGasLimits>;
    gasPrice: ReturnType<typeof useGasPrice>;
  };
  claims: {
    accruedPositionPriceImpactFees: RebateInfoItem[];
    claimablePositionPriceImpactFees: RebateInfoItem[];
  };
  leaderboard: LeaderboardState;
  settings: SettingsContextType;
  tradebox: TradeboxState;
  orderEditor: OrderEditorState;
  positionSeller: PositionSellerState;
  positionEditor: PositionEditorState;
};

const StateCtx = createContext<SyntheticsState | null>(null);

let latestState: SyntheticsState | null = null;

export function SyntheticsStateContextProvider({
  children,
  skipLocalReferralCode,
  pageType,
}: {
  children: ReactNode;
  skipLocalReferralCode: boolean;
  pageType: SyntheticsState["pageType"];
}) {
  const { chainId: selectedChainId } = useChainId();

  const { account: walletAccount, signer } = useWallet();
  const { account: paramsAccount } = useParams<{ account?: string }>();

  let checkSummedAccount: string | undefined;

  if (paramsAccount && ethers.utils.isAddress(paramsAccount)) {
    checkSummedAccount = ethers.utils.getAddress(paramsAccount);
  }

  const account = pageType === "actions" ? checkSummedAccount : walletAccount;
  const isLeaderboardPage = pageType === "competitions" || pageType === "leaderboard";
  const leaderboard = useLeaderboardState(account, isLeaderboardPage);
  const chainId = isLeaderboardPage ? leaderboard.chainId : selectedChainId;

  const markets = useMarkets(chainId);
  const marketsInfo = useMarketsInfoRequest(chainId);
  const positionsConstants = usePositionsConstantsRequest(chainId);
  const uiFeeFactor = useUiFeeFactor(chainId);
  const userReferralInfo = useUserReferralInfoRequest(signer, chainId, account, skipLocalReferralCode);
  const [closingPositionKey, setClosingPositionKey] = useState<string>();
  const { accruedPositionPriceImpactFees, claimablePositionPriceImpactFees } = useRebatesInfoRequest(
    chainId,
    pageType === "trade"
  );

  const settings = useSettings();

  const { isLoading, positionsInfoData } = usePositionsInfoRequest(chainId, {
    account,
    showPnlInLeverage: settings.isPnlInLeverage,
    marketsInfoData: marketsInfo.marketsInfoData,
    pricesUpdatedAt: marketsInfo.pricesUpdatedAt,
    skipLocalReferralCode,
    tokensData: marketsInfo.tokensData,
  });

  const ordersInfo = useOrdersInfoRequest(chainId, {
    account,
    marketsInfoData: marketsInfo.marketsInfoData,
    tokensData: marketsInfo.tokensData,
  });

  const tradeboxState = useTradeboxState(chainId, {
    marketsInfoData: marketsInfo.marketsInfoData,
    tokensData: marketsInfo.tokensData,
    positionsInfoData,
  });

  const orderEditor = useOrderEditorState(ordersInfo.ordersInfoData);

  const positionSellerState = usePositionSellerState(chainId);
  const positionEditorState = usePositionEditorState(chainId);

  const gasLimits = useGasLimits(chainId);
  const gasPrice = useGasPrice(chainId);

  const [keepLeverage, setKeepLeverage] = useLocalStorageSerializeKey(getKeepLeverageKey(chainId), true);

  const state = useMemo(() => {
    const s: SyntheticsState = {
      pageType,
      globals: {
        chainId,
        account,
        markets,
        marketsInfo,
        ordersInfo,
        positionsConstants,
        positionsInfo: {
          isLoading,
          positionsInfoData,
        },
        uiFeeFactor,
        userReferralInfo,

        closingPositionKey,
        setClosingPositionKey,

        gasLimits,
        gasPrice,

        keepLeverage,
        setKeepLeverage,
      },
      claims: { accruedPositionPriceImpactFees, claimablePositionPriceImpactFees },
      leaderboard,
      settings,
      tradebox: tradeboxState,
      orderEditor,
      positionSeller: positionSellerState,
      positionEditor: positionEditorState,
    };

    return s;
  }, [
    pageType,
    chainId,
    account,
    markets,
    marketsInfo,
    ordersInfo,
    positionsConstants,
    isLoading,
    positionsInfoData,
    uiFeeFactor,
    userReferralInfo,
    closingPositionKey,
    gasLimits,
    gasPrice,
    keepLeverage,
    setKeepLeverage,
    accruedPositionPriceImpactFees,
    claimablePositionPriceImpactFees,
    leaderboard,
    settings,
    tradeboxState,
    orderEditor,
    positionSellerState,
    positionEditorState,
  ]);

  latestState = state;

  return <StateCtx.Provider value={state}>{children}</StateCtx.Provider>;
}

export function useSyntheticsStateSelector<Selected>(selector: (s: SyntheticsState) => Selected) {
  const value = useContext(StateCtx);
  if (!value) {
    throw new Error("Used useSyntheticsStateSelector outside of SyntheticsStateContextProvider");
  }
  return useContextSelector(StateCtx as Context<SyntheticsState>, selector) as Selected;
}

export function useCalcSelector() {
  return useCallback(function useCalcSelector<Selected>(selector: (state: SyntheticsState) => Selected) {
    if (!latestState) throw new Error("Used calcSelector outside of SyntheticsStateContextProvider");
    return selector(latestState);
  }, []);
}
