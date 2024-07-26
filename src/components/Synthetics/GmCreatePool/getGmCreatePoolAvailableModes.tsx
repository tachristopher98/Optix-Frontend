import { Market } from "domain/synthetics/markets/types";
import { Mode, Operation } from "./GmCreatePool";

export const getGmCreatePoolAvailableModes = (
  operation: Operation,
  market: Pick<Market, "isSameCollaterals"> | undefined
) => {
  if (market && market.isSameCollaterals) {
    return [Mode.Single];
  }

  if (operation === Operation.Deposit) {
    return [Mode.Single, Mode.Pair];
  }

  return [Mode.Pair];
};
