import { t, Trans } from "@lingui/macro";
import dateFnsFormat from "date-fns/format";
import { BigNumber } from "ethers";
import { useCallback, useState } from "react";

import { getExplorerUrl } from "config/chains";
import { useMarketsInfoData, useTokensData } from "context/SyntheticsStateContext/hooks/globalsHooks";
import { OrderType } from "domain/synthetics/orders/types";
import { isSwapOrderType } from "domain/synthetics/orders/utils";
import {
  fetchTradeActions,
  PositionTradeAction,
  SwapTradeAction,
  TradeActionType,
} from "domain/synthetics/tradeHistory";
import { useChainId } from "lib/chains";
import { downloadAsCsv } from "lib/csv";
import { definedOrThrow } from "lib/guards";
import { helperToast } from "lib/helperToast";
import { getSyntheticsGraphClient } from "lib/subgraph/clients";

import { ToastifyDebug } from "components/ToastifyDebug/ToastifyDebug";
import { formatPositionMessage } from "./TradeHistoryRow/utils/position";
import { RowDetails } from "./TradeHistoryRow/utils/shared";
import { formatSwapMessage } from "./TradeHistoryRow/utils/swap";

const GRAPHQL_MAX_SIZE = 10_000;

export function useDownloadAsCsv({
  marketAddresses,
  forAllAccounts,
  account,
  fromTxTimestamp,
  toTxTimestamp,
  orderEventCombinations,
  minCollateralUsd,
}: {
  marketAddresses: string[] | undefined;
  forAllAccounts: boolean | undefined;
  account: string | null | undefined;
  fromTxTimestamp: number | undefined;
  toTxTimestamp: number | undefined;
  orderEventCombinations:
    | {
        eventName?: TradeActionType | undefined;
        orderType?: OrderType | undefined;
        isDepositOrWithdraw?: boolean | undefined;
      }[]
    | undefined;

  minCollateralUsd?: BigNumber;
}): [boolean, () => Promise<void>] {
  const { chainId } = useChainId();
  const marketsInfoData = useMarketsInfoData();
  const tokensData = useTokensData();
  const [isLoading, setIsLoading] = useState(false);

  const handleCsvDownload = useCallback(async () => {
    try {
      setIsLoading(true);

      const client = getSyntheticsGraphClient(chainId);
      definedOrThrow(client);

      const tradeActions = await fetchTradeActions({
        chainId,
        pageIndex: 0,
        pageSize: GRAPHQL_MAX_SIZE,
        marketAddresses,
        forAllAccounts,
        account,
        fromTxTimestamp,
        toTxTimestamp,
        orderEventCombinations,
        marketsInfoData,
        tokensData,
      });

      const fullFormattedData = tradeActions
        .map((tradeAction) => {
          const explorerUrl = getExplorerUrl(chainId) + `tx/${tradeAction.transaction.hash}`;

          let rowDetails: RowDetails | null;

          if (isSwapOrderType(tradeAction.orderType!)) {
            rowDetails = formatSwapMessage(tradeAction as SwapTradeAction, marketsInfoData, false);
          } else {
            rowDetails = formatPositionMessage(tradeAction as PositionTradeAction, minCollateralUsd!, false);
          }

          return {
            ...rowDetails,
            explorerUrl,
          };
        })
        .filter(Boolean);

      const timezone = dateFnsFormat(new Date(), "z");

      downloadAsCsv("trade-history", fullFormattedData, ["priceComment"], {
        timestamp: t`Date` + ` (${timezone})`,
        action: t`Action`,
        size: t`Size`,
        market: t`Market`,
        fullMarket: t`Full market`,
        marketPrice: t`Mark Price`,
        acceptablePrice: t`Acceptable Price`,
        executionPrice: t`Execution Price`,
        triggerPrice: t`Trigger Price`,
        priceImpact: t`Price Impact`,
        explorerUrl: t`Transaction ID`,
      });
    } catch (error) {
      helperToast.error(
        <div>
          <Trans>Failed to download trade history CSV.</Trans>
          <br />
          <ToastifyDebug>{String(error)}</ToastifyDebug>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    account,
    chainId,
    forAllAccounts,
    fromTxTimestamp,
    marketAddresses,
    marketsInfoData,
    minCollateralUsd,
    orderEventCombinations,
    toTxTimestamp,
    tokensData,
  ]);

  return [isLoading, handleCsvDownload];
}
