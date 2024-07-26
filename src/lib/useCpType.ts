import { useGlobalContext } from "context/GlobalContext/GlobalContextProvider";

export function useCpType() {
  const { cptype, setCpType } = useGlobalContext();
  return [cptype, setCpType] as const;
}
