import { useGlobalContext } from "context/GlobalContext/GlobalContextProvider";

export function useTradeType() {
  const { setTradeType, tradeType } = useGlobalContext();
  return [tradeType, setTradeType] as const;
}
