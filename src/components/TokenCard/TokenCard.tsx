import { Trans } from "@lingui/macro";
import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

import { isHomeSite } from "lib/legacy";

import ExternalLink from "components/ExternalLink/ExternalLink";
import { ARBITRUM, AVALANCHE } from "config/chains";
import { getIcon } from "config/icons";
import { useChainId } from "lib/chains";
import { switchNetwork } from "lib/wallets";
import APRLabel from "../APRLabel/APRLabel";
import { HeaderLink } from "../Header/HeaderLink";
import useWallet from "lib/wallets/useWallet";
import useIncentiveStats from "domain/synthetics/common/useIncentiveStats";
import BannerButton from "components/Banner/BannerButton";
import { useMarketTokensAPR } from "domain/synthetics/markets/useMarketTokensAPR";
import { mergeWith } from "lodash";
import { formatAmount } from "lib/numbers";
import type { MarketTokensAPRData } from "domain/synthetics/markets/types";
import Optix from '../../img/optix.svg';
import Arbitrum from '../../img/arbitrum-arb-logo.svg';

const glpIcon = getIcon("common", "glp");
const gmxIcon = getIcon("common", "gmx");
const gmIcon = getIcon("common", "gm");

function calculateMaxApr(apr: MarketTokensAPRData, incentiveApr: MarketTokensAPRData) {
  const totalApr = mergeWith({}, apr, incentiveApr, (aprValue, incentiveAprValue) => aprValue?.add(incentiveAprValue));
  const aprValues = Object.values(totalApr || {});

  const maxApr = aprValues.reduce((max, value) => (value.gt(max) ? value : max), aprValues[0]);

  return maxApr;
}

type Props = {
  showRedirectModal?: (to: string) => void;
};

export default function TokenCard({ showRedirectModal }: Props) {
  const isHome = isHomeSite();
  const { chainId } = useChainId();
  const { active } = useWallet();
  const arbitrumIncentiveState = useIncentiveStats(ARBITRUM);
  const { marketsTokensAPRData: arbApr, marketsTokensIncentiveAprData: arbIncentiveApr } = useMarketTokensAPR(ARBITRUM);
  const { marketsTokensAPRData: avaxApr, marketsTokensIncentiveAprData: avaxIncentiveApr } =
    useMarketTokensAPR(AVALANCHE);

  const maxAprText = useMemo(() => {
    if (!arbApr || !arbIncentiveApr || !avaxApr || !avaxIncentiveApr)
      return {
        [ARBITRUM]: "...%",
        [AVALANCHE]: "...%",
      };

    const maxArbApr = calculateMaxApr(arbApr, arbIncentiveApr);
    const maxAvaxApr = calculateMaxApr(avaxApr, avaxIncentiveApr);

    return {
      [ARBITRUM]: `${formatAmount(maxArbApr, 28, 2)}%`,
      [AVALANCHE]: `${formatAmount(maxAvaxApr, 28, 2)}%`,
    };
  }, [arbApr, arbIncentiveApr, avaxApr, avaxIncentiveApr]);

  const changeNetwork = useCallback(
    (network) => {
      if (network === chainId) {
        return;
      }
      if (!active) {
        setTimeout(() => {
          return switchNetwork(network, active);
        }, 500);
      } else {
        return switchNetwork(network, active);
      }
    },
    [chainId, active]
  );

  const BuyLink = ({ className, to, children, network }) => {
    if (isHome && showRedirectModal) {
      return (
        <HeaderLink to={to} className={className} showRedirectModal={showRedirectModal}>
          {children}
        </HeaderLink>
      );
    }

    return (
      <Link to={to} className={className} onClick={() => changeNetwork(network)}>
        {children}
      </Link>
    );
  };

  return (
    <div className="Home-token-card-options">
      <div className="Home-token-card-option">
        <div>
          <div className="Home-token-card-option-icon">
          <div className="App-card-title-mark-icon">
              {/* <img src={currentIcons.gmx} width="40" alt="GMX Token Icon" /> */}
              <img src={Optix} width="40" alt="OPTIX Token Icon" />
              <img src={Arbitrum} width={"20"} alt="arbitrum" style={{position: 'absolute', right: "-4px", bottom: "0"}} />
            </div> OPTIX
          </div>
          <div className="Home-token-card-option-info">
            <div className="Home-token-card-option-title">
              <Trans>
              OPTIX is the liquidity provider token for OPX V2 markets. Accrues 63% of the V2 markets generated fees.
              </Trans>
            </div>
          </div>
          {arbitrumIncentiveState?.lp?.isActive && (
            <BannerButton
              className="mt-md"
              label="Arbitrum OPTIX Pools are incentivized."
              link="https://gmxio.notion.site/GMX-S-T-I-P-Incentives-Distribution-1a5ab9ca432b4f1798ff8810ce51fec3#dc108b8a0a114c609ead534d1908d2fa"
            />
          )}
          <div className="Home-token-card-option-apr">
            <Trans>Arbitrum Max. APR:</Trans> {maxAprText?.[ARBITRUM]},{" "}
            <Trans>Avalanche Max. APR: {maxAprText?.[AVALANCHE]}</Trans>{" "}
          </div>
        </div>

        <div className="Home-token-card-option-action Token-card-buy">
          <div className="buy">
            <BuyLink to="/pools" className="default-btn" network={ARBITRUM}>
              <Trans>View on Arbitrum</Trans>
            </BuyLink>

            <BuyLink to="/pools" className="default-btn" network={AVALANCHE}>
              <Trans>View on Avalanche</Trans>
            </BuyLink>
          </div>
          <a
            href="https://docs.gmx.io/docs/providing-liquidity/v2"
            target="_blank"
            rel="noreferrer"
            className="default-btn read-more"
          >
            <Trans>Read more</Trans>
          </a>
        </div>
      </div>
    </div>
  );
}
