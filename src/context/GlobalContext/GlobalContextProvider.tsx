import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getIsSyntheticsSupported } from "config/features";
import { REDIRECT_POPUP_TIMESTAMP_KEY, TRADE_LINK_KEY, TRADE_TYPE_KEY } from "config/localStorage";
import { useChainId } from "lib/chains";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import { PendingTransaction, SetPendingTransactions } from "domain/legacy";
import { useLocalStorage } from "react-use";
import { matchPath, useHistory, useLocation } from "react-router-dom";

type GlobalContextType = null | {
  tradePageVersion: number;
  setTradePageVersion: (version: number) => void;

  pendingTxns: PendingTransaction[];
  setPendingTxns: SetPendingTransactions;

  redirectPopupTimestamp: number | undefined;
  setRedirectPopupTimestamp: Dispatch<SetStateAction<number | undefined>>;

  tradeType: string | undefined;
  setTradeType: (value: string) => void;

  cptype: string | undefined;
  setCpType: (value: string) => void;
};

function isEmpty<T>(value: T | null | undefined): boolean {
  if (value === null || value === undefined) return true; 

  if (typeof value === "string" && value.trim().length === 0) return true; 
  
  if (Array.isArray(value) && value.length === 0) return true; 
  
  if (typeof value === "object" && Object.keys(value as object).length === 0) return true;

  return false;
}

const context = createContext<GlobalContextType>(null);

const { Provider } = context;

export const GlobalStateProvider = memo(
  ({
    pendingTxns,
    setPendingTxns,
    children,
  }: PropsWithChildren<{
    pendingTxns: PendingTransaction[];
    setPendingTxns: SetPendingTransactions;
  }>) => {
    const [tradePageVersion, setTradePageVersion] = useTradePageVersion();

    const [redirectPopupTimestamp, setRedirectPopupTimestamp] = useLocalStorage<number | undefined>(
      REDIRECT_POPUP_TIMESTAMP_KEY,
      undefined,
      {
        raw: false,
        deserializer: (val) => {
          if (!val) {
            return undefined;
          }
          const num = parseInt(val);

          if (Number.isNaN(num)) {
            return undefined;
          }

          return num;
        },
        serializer: (val) => (val ? val.toString() : ""),
      }
    );

    const { chainId } = useChainId();

    const [tradeType, setTradeType] = useLocalStorageSerializeKey(
      [chainId, TRADE_TYPE_KEY],
      isEmpty(localStorage.getItem(JSON.stringify([chainId, TRADE_TYPE_KEY]))) 
        ? 'Perp' 
        : (localStorage.getItem(JSON.stringify([chainId, TRADE_TYPE_KEY])) ?? 'Perp')
    );
    const [cptype, setCpType] = useState('none');

    const value = useMemo(
      () => ({
        tradePageVersion,
        setTradePageVersion,
        pendingTxns,
        setPendingTxns,
        redirectPopupTimestamp,
        setRedirectPopupTimestamp,
        tradeType,
        setTradeType,
        cptype,
        setCpType
      }),
      [
        tradePageVersion,
        setTradePageVersion,
        pendingTxns,
        setPendingTxns,
        redirectPopupTimestamp,
        setRedirectPopupTimestamp,
        tradeType,
        setTradeType,
        cptype,
        setCpType
      ]
    );

    return <Provider value={value}>{children}</Provider>;
  }
);

export const useGlobalContext = () => {
  const value = useContext(context);
  if (value === null) {
    throw new Error("useGlobalContext must be used within a GlobalContextProvider");
  }

  return value;
};

function useTradePageVersion() {
  const { chainId } = useChainId();
  const location = useLocation();
  const history = useHistory();

  const isV2Matched = useMemo(() => matchPath(location.pathname, { path: "/trade/:tradeType?" }), [location.pathname]);
  // const isV1Matched = useMemo(() => matchPath(location.pathname, { path: "/v1/:tradeType?" }), [location.pathname]);
  const isV1Matched = useMemo(() => matchPath(location.pathname, { path: "/trade/:tradeType?" }), [location.pathname]);
  const defaultVersion = !isV1Matched && getIsSyntheticsSupported(chainId) ? 2 : 1;
  const [savedTradePageVersion, setSavedTradePageVersion] = useLocalStorageSerializeKey(
    [chainId, TRADE_LINK_KEY],
    defaultVersion
  );

  const tradePageVersion = savedTradePageVersion ?? defaultVersion;

  // manual switch
  const setTradePageVersion = useCallback(
    (version: number) => {
      setSavedTradePageVersion(version);
      if (version === 1 && isV2Matched) {
        history.replace("/trade/v1");
      } else if (version === 2 && isV1Matched) {
        history.replace("/trade/v2");
      }
    },
    [history, setSavedTradePageVersion, isV1Matched, isV2Matched]
  );

  // chainId changes -> switch to prev selected version
  useEffect(() => {
    if (savedTradePageVersion === 1 && isV2Matched) {
      history.replace("/trade/v1");
    } else if (savedTradePageVersion === 2 && isV1Matched) {
      history.replace("/trade/v2");
    }
  }, [chainId, savedTradePageVersion, history, isV1Matched, isV2Matched]);

  return [tradePageVersion, setTradePageVersion] as const;
}
