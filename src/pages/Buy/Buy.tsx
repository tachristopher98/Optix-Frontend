import { t } from "@lingui/macro";

import { getPageTitle } from "lib/legacy";

import SEO from "components/Common/SEO";
import Footer from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import TokenCard from "components/TokenCard/TokenCard";

import "./Buy.css";

export default function BuyGMXGLP() {
  return (
    <SEO title={getPageTitle(t`Buy OPTIX or OPX`)}>
      <div className="BuyGMXGLP page-layout">
        <div className="BuyGMXGLP-container default-container">
          <PageTitle showNetworkIcon={false} isTop title={t`Optix Protocol Tokens`} subtitle={t`Buy OPTIX and earn rewards!`} />
          <TokenCard />
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
