import { Trans } from "@lingui/macro";
import { useEffect, useState } from "react";

import { TRADE_HISTORY_PER_PAGE } from "config/ui";
import { useShowDebugValues } from "context/SyntheticsStateContext/hooks/settingsHooks";
import { OrderType } from "domain/synthetics/orders/types";
import { usePositionsConstantsRequest } from "domain/synthetics/positions/usePositionsConstants";
import { TradeActionType, useTradeHistory } from "domain/synthetics/tradeHistory";
import { useChainId } from "lib/chains";
import { useDateRange, useNormalizeDateRange } from "lib/dates";

import Button from "components/Button/Button";
import Pagination from "components/Pagination/Pagination";
import usePagination from "components/Referrals/usePagination";
import { TradesHistorySkeleton } from "components/Skeleton/Skeleton";

import { DateRangeSelect } from "../DateRangeSelect/DateRangeSelect";
import { MarketFilterLongShort } from "../TableMarketFilter/MarketFilterLongShort";
import { ActionFilter } from "./filters/ActionFilter";
import { TradeHistoryRow } from "./TradeHistoryRow/TradeHistoryRow";

import { useDownloadAsCsv } from "./useDownloadAsCsv";

import downloadIcon from "img/ic_download_simple.svg";

import "./TradeHistorySynthetics.scss";

const TRADE_HISTORY_PREFETCH_SIZE = 100;
const ENTITIES_PER_PAGE = TRADE_HISTORY_PER_PAGE;

const CSV_ICON_INFO = {
  src: downloadIcon,
};

type Props = {
  shouldShowPaginationButtons: boolean;
  account: string | null | undefined;
  forAllAccounts?: boolean;
};

export function TradeHistory(p: Props) {
  const { shouldShowPaginationButtons, forAllAccounts, account } = p;
  const { chainId } = useChainId();
  const showDebugValues = useShowDebugValues();
  const [startDate, endDate, setDateRange] = useDateRange();
  const [marketAddressesFilter, setMarketAddressesFilter] = useState<string[]>([]);
  const [actionFilter, setActionFilter] = useState<
    {
      orderType: OrderType;
      eventName: TradeActionType;
      isDepositOrWithdraw: boolean;
    }[]
  >([]);
  const [isLongFilter, setIsLongFilter] = useState<boolean | undefined>(undefined);

  const [fromTxTimestamp, toTxTimestamp] = useNormalizeDateRange(startDate, endDate);

  const { minCollateralUsd } = usePositionsConstantsRequest(chainId);
  const {
    tradeActions,
    isLoading: isHistoryLoading,
    pageIndex: tradeActionsPageIndex,
    setPageIndex: setTradeActionsPageIndex,
  } = useTradeHistory(chainId, {
    account,
    forAllAccounts,
    pageSize: TRADE_HISTORY_PREFETCH_SIZE,
    fromTxTimestamp,
    toTxTimestamp,
    marketAddresses: marketAddressesFilter,
    orderEventCombinations: actionFilter,
    isLong: isLongFilter,
  });

  const isConnected = Boolean(account);
  const isLoading = (forAllAccounts || isConnected) && (!minCollateralUsd || isHistoryLoading);

  const isEmpty = !isLoading && !tradeActions?.length;
  const { currentPage, setCurrentPage, getCurrentData, pageCount } = usePagination(
    [account, forAllAccounts].toString(),
    tradeActions,
    ENTITIES_PER_PAGE
  );
  const currentPageData = getCurrentData();
  const hasFilters = Boolean(startDate || endDate || marketAddressesFilter.length || actionFilter.length);

  useEffect(() => {
    if (!pageCount || !currentPage) return;
    const totalPossiblePages = (TRADE_HISTORY_PREFETCH_SIZE * tradeActionsPageIndex) / TRADE_HISTORY_PER_PAGE;
    const doesMoreDataExist = pageCount >= totalPossiblePages;
    const isCloseToEnd = pageCount && pageCount < currentPage + 2;

    if (doesMoreDataExist && isCloseToEnd) {
      setTradeActionsPageIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentPage, pageCount, tradeActionsPageIndex, setTradeActionsPageIndex]);

  const [isCsvDownloading, handleCsvDownload] = useDownloadAsCsv({
    account,
    forAllAccounts,
    fromTxTimestamp,
    toTxTimestamp,
    marketAddresses: marketAddressesFilter,
    orderEventCombinations: actionFilter,
    minCollateralUsd: minCollateralUsd,
  });

  return (
    <div className="TradeHistorySynthetics">
      <div className="App-box">
        <div className="TradeHistorySynthetics-controls">
          <div>
            <Trans>Trade History</Trans>
          </div>
          <div className="TradeHistorySynthetics-controls-right">
            <div className="TradeHistorySynthetics-filters">
              <DateRangeSelect startDate={startDate} endDate={endDate} onChange={setDateRange} />
            </div>
            <Button variant="secondary" disabled={isCsvDownloading} imgInfo={CSV_ICON_INFO} onClick={handleCsvDownload}>
              CSV
            </Button>
          </div>
        </div>
        <div className="TradeHistorySynthetics-horizontal-scroll-container">
          <table className="Exchange-list TradeHistorySynthetics-table">
            <colgroup>
              <col className="TradeHistorySynthetics-action-column" />
              <col className="TradeHistorySynthetics-market-column" />
              <col className="TradeHistorySynthetics-size-column" />
              <col className="TradeHistorySynthetics-price-column" />
            </colgroup>
            <thead className="TradeHistorySynthetics-header">
              <tr>
                <th>
                  <ActionFilter value={actionFilter} onChange={setActionFilter} />
                </th>
                <th>
                  <MarketFilterLongShort
                    value={marketAddressesFilter}
                    onChange={setMarketAddressesFilter}
                    valueIsLong={isLongFilter}
                    onChangeIsLong={setIsLongFilter}
                  />
                </th>
                <th>
                  <Trans>Size</Trans>
                </th>
                <th className="TradeHistorySynthetics-price-header">
                  <Trans>Price</Trans>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TradesHistorySkeleton withTimestamp={forAllAccounts} />
              ) : (
                currentPageData.map((tradeAction) => (
                  <TradeHistoryRow
                    key={tradeAction.id}
                    tradeAction={tradeAction}
                    minCollateralUsd={minCollateralUsd!}
                    showDebugValues={showDebugValues}
                    shouldDisplayAccount={forAllAccounts}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        {isEmpty && hasFilters && (
          <div className="TradeHistorySynthetics-padded-cell">
            <Trans>No trades match the selected filters</Trans>
          </div>
        )}
        {isEmpty && !hasFilters && !isLoading && (
          <div className="TradeHistorySynthetics-padded-cell">
            <Trans>No trades yet</Trans>
          </div>
        )}
      </div>

      {shouldShowPaginationButtons && (
        <Pagination page={currentPage} pageCount={pageCount} onPageChange={(page) => setCurrentPage(page)} />
      )}
    </div>
  );
}
