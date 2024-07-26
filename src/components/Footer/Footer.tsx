import React from "react";
import cx from "classnames";
import "./Footer.css";
import logoImg from "img/ic_optix_footer_logo.svg";
import { NavLink } from "react-router-dom";
import { isHomeSite, getAppBaseUrl, shouldShowRedirectModal } from "lib/legacy";
import { getFooterLinks, SOCIAL_LINKS } from "./constants";
import ExternalLink from "components/ExternalLink/ExternalLink";

type Props = { showRedirectModal?: (to: string) => void; redirectPopupTimestamp?: number };

export default function Footer({ showRedirectModal, redirectPopupTimestamp }: Props) {
  const isHome = isHomeSite();

  return (
    <div className="Footer">
      <div className={cx("Footer-wrapper", { home: isHome })}>
        <div className="Footer-logo">
          <img src={logoImg} alt="MetaMask" />
        </div>
        <div className="Footer-social-link-block">
          {SOCIAL_LINKS.map((platform) => {
            return (
              <ExternalLink key={platform.name} className="App-social-link" href={platform.link}>
                <img src={platform.icon} alt={platform.name} />
              </ExternalLink>
            );
          })}
        </div>
        <div style={{maxWidth: "60%", margin: "auto"}}>
        {/* <div style={{maxWidth: "130rem", margin: "auto"}}> */}
          <div style={{borderTop: "solid 1px #434359", paddingBottom: "2rem"}}></div>
          <span className="Footer-links-optix">
            Optix 2024 All Rights Reserved
          </span>
        </div>
        {/* <div className="Footer-links">
          {getFooterLinks(isHome).map(({ external, label, link, isAppLink }) => {
            if (external) {
              return (
                <ExternalLink key={label} href={link} className="Footer-link">
                  {label}
                </ExternalLink>
              );
            }
            if (isAppLink) {
              if (shouldShowRedirectModal(redirectPopupTimestamp)) {
                return (
                  <div
                    key={label}
                    className="Footer-link a"
                    onClick={() => showRedirectModal && showRedirectModal(link)}
                  >
                    {label}
                  </div>
                );
              } else {
                const baseUrl = getAppBaseUrl();
                return (
                  <a key={label} href={baseUrl + link} className="Footer-link">
                    {label}
                  </a>
                );
              }
            }
            return (
              <NavLink key={link} to={link} className="Footer-link" activeClassName="active">
                {label}
              </NavLink>
            );
          })}
        </div> */}
      </div>
    </div>
  );
}
