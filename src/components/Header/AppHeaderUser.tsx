import connectWalletImg from "img/ic_wallet_24.svg";
import AddressDropdown from "../AddressDropdown/AddressDropdown";
import ConnectWalletButton from "../Common/ConnectWalletButton";

import { Trans } from "@lingui/macro";
import cx from "classnames";
import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, AVALANCHE_FUJI, getChainName } from "config/chains";
import { isDevelopment } from "config/env";
import { getIcon } from "config/icons";
import { useChainId } from "lib/chains";
import { getAccountUrl, isHomeSite } from "lib/legacy";
import LanguagePopupHome from "../NetworkDropdown/LanguagePopupHome";
import NetworkDropdown from "../NetworkDropdown/NetworkDropdown";
import "./Header.scss";
import { HeaderLink } from "./HeaderLink";
import useWallet from "lib/wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useTradePageVersion } from "lib/useTradePageVersion";
import LanguageModalButton from "components/NetworkDropdown/LanguageModalButton";
import { RiMenuLine } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import { getInclusionDirectives } from "@apollo/client/utilities";
import { Popover } from "@headlessui/react";
import { useTradeType } from "lib/useTradeType";

type Props = {
  openSettings: () => void;
  small?: boolean;
  disconnectAccountAndCloseSettings: () => void;
  showRedirectModal: (to: string) => void;
};

const NETWORK_OPTIONS = [
  {
    label: getChainName(ARBITRUM),
    value: ARBITRUM,
    icon: getIcon(ARBITRUM, "network"),
    color: "#264f79",
  },
  {
    label: getChainName(AVALANCHE),
    value: AVALANCHE,
    icon: getIcon(AVALANCHE, "network"),
    color: "#E841424D",
  },
];

if (isDevelopment()) {
  NETWORK_OPTIONS.push({
    label: getChainName(ARBITRUM_GOERLI),
    value: ARBITRUM_GOERLI,
    icon: getIcon(ARBITRUM_GOERLI, "network"),
    color: "#264f79",
  });
  NETWORK_OPTIONS.push({
    label: getChainName(AVALANCHE_FUJI),
    value: AVALANCHE_FUJI,
    icon: getIcon(AVALANCHE_FUJI, "network"),
    color: "#E841424D",
  });
}

export function AppHeaderUser({ openSettings, small, disconnectAccountAndCloseSettings, showRedirectModal }: Props) {
  const { chainId } = useChainId();
  const { active, account } = useWallet();
  const { openConnectModal } = useConnectModal();
  const showConnectionOptions = !isHomeSite();
  const [tradePageVersion] = useTradePageVersion();
  const [tradeType, setTradeType] = useTradeType();

  const tradeLink = tradePageVersion === 2 ? "/trade" : "/v1";

  const selectorLabel = getChainName(chainId);

  if (!active || !account) {
    return (
      <div className="App-header-user">
        <div className={cx("App-header-trade-link", { "homepage-header": isHomeSite() })}>
          {/* <Popover>
            {({open, close}) => {
              return (<>
                <Popover.Button as="div">
                  <div className="header-trade-btn">Trade</div>
                </Popover.Button>
                <Popover.Panel as="div" className={'header-trade-panel'} style={{ position: 'absolute' }}>
                  <div className={"VersionSwitch"}>
                      <div
                        className={cx("VersionSwitch-option v1", {active: tradeType === 'Perp'})}
                        // { active: currentVersion === 1 })}
                        onClick={() => {setTradeType('Perp'); close()}}
                      >
                        Perp
                      </div>
                      <div
                        className={cx("VersionSwitch-option v2", {active: tradeType === 'Options'})}
                        onClick={() => {setTradeType('Options'); close()}}
                      >
                        Options
                      </div>
                  </div>
                </Popover.Panel>
              </>)
            }}
          </Popover> */}

          {/* <HeaderLink className="default-btn" to={tradeLink!} showRedirectModal={showRedirectModal}>
            {isHomeSite() ? <Trans>Launch App</Trans> : <Trans>Trade</Trans>}
          </HeaderLink> */}
        </div>

        {showConnectionOptions && openConnectModal ? (
          <>
            <LanguageModalButton />
            <ConnectWalletButton onClick={openConnectModal} imgSrc={connectWalletImg}>
              {small ? <Trans>Connect</Trans> : <Trans>Connect Wallet</Trans>}
            </ConnectWalletButton>
            <NetworkDropdown
              small={small}
              networkOptions={NETWORK_OPTIONS}
              selectorLabel={selectorLabel}
              openSettings={openSettings}
            />
          </>
        ) : (
          <LanguagePopupHome />
        )}
      </div>
    );
  }

  const accountUrl = getAccountUrl(chainId, account);

  return (
    <div className="App-header-user">
      <div className={cx("App-header-trade-link")}>
        {/* <Popover>
          <Popover.Button as="div">
            <button className={cx("chart-token-selector", { "chart-token-label--active": open })}>
              <span className="chart-token-selector--current inline-items-center">
                Trade
              </span>
            </button>
          </Popover.Button>
          <Popover.Panel as="div">
            <p>fdsa</p>
          </Popover.Panel>
        </Popover> */}
        {/* <HeaderLink className="default-btn" to={tradeLink!} showRedirectModal={showRedirectModal}>
          {isHomeSite() ? <Trans>Launch App</Trans> : <Trans>Trade</Trans>}
        </HeaderLink> */}
      </div>

      {showConnectionOptions ? (
        <>
          <div className="App-header-user-address">
            <AddressDropdown
              account={account}
              accountUrl={accountUrl}
              disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
            />
          </div>
          <NetworkDropdown
            small={small}
            networkOptions={NETWORK_OPTIONS}
            selectorLabel={selectorLabel}
            openSettings={openSettings}
          />
        </>
      ) : (
        <LanguagePopupHome />
      )}
    </div>
  );
}
