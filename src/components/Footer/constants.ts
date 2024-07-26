import { t } from "@lingui/macro";
import "./Footer.css";
import xIcon from "img/ic_x.svg";
import discordIcon from "img/ic_baseline-discord.svg";
import telegramIcon from "img/ic_telegram.svg";
import githubIcon from "img/ic_github.svg";

type Link = {
  label: string;
  link: string;
  external?: boolean;
  isAppLink?: boolean;
};

type SocialLink = {
  link: string;
  name: string;
  icon: string;
};

export function getFooterLinks(isHome) {
  const FOOTER_LINKS: { home: Link[]; app: Link[] } = {
    home: [
      { label: t`Terms and Conditions`, link: "/terms-and-conditions" },
      { label: t`Referral Terms`, link: "/referral-terms" },
      { label: t`Media Kit`, link: "https://docs.gmx.io/docs/community/media-kit", external: true },
      // { label: "Jobs", link: "/jobs", isAppLink: true },
    ],
    app: [
      { label: t`Media Kit`, link: "https://docs.gmx.io/docs/community/media-kit", external: true },
      // { label: "Jobs", link: "/jobs" },
    ],
  };
  return FOOTER_LINKS[isHome ? "home" : "app"];
}

export const SOCIAL_LINKS: SocialLink[] = [
  { link: "https://twitter.com/optix", name: "Twitter", icon: xIcon },
  { link: "https://github.com/optix", name: "Github", icon: githubIcon },
  { link: "https://t.me/optix", name: "Telegram", icon: telegramIcon },
  { link: "https://discord.gg/optix", name: "Discord", icon: discordIcon },
];
