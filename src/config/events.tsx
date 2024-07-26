// date format: d MMM yyyy, H:mm, time should be specifed based on UTC time

import type { JSX } from "react";
import ExternalLink from "components/ExternalLink/ExternalLink";

export type EventData = {
  id: string;
  title: string;
  isActive?: boolean;
  startDate?: string;
  endDate: string;
  bodyText: string | string[] | JSX.Element;
  chains?: number[];
  link?: {
    text: string;
    href: string;
    newTab?: boolean;
  };
};

export const homeEventsData: EventData[] = [];

export const appEventsData: EventData[] = [
  {
    id: "all-incentives-launch",
    title: "Incentives are live",
    isActive: true,
    endDate: "27 Mar 2024, 00:00",
    bodyText: [
      `Arbitrum STIP incentives are live for:`,
      "",
      "• Arbitrum OPTIX Pools Liquidity.",
      "• Arbitrum OPX V2 Trading.",
    ],
    link: {
      text: "Read more.",
      href: "https://gmxio.notion.site/GMX-S-T-I-P-Incentives-Distribution-1a5ab9ca432b4f1798ff8810ce51fec3",
      newTab: true,
    },
  },
  {
    id: "incentives-launch",
    title: "Incentives are live",
    isActive: true,
    endDate: "31 Oct 2024, 12:00",
    bodyText: "Arbitrum STIP incentives are live for Arbitrum OPTIX pools and OPX to OPTIX migrations.",
    link: {
      text: "Read more",
      href: "https://gmxio.notion.site/GMX-S-T-I-P-Incentives-Distribution-1a5ab9ca432b4f1798ff8810ce51fec3",
      newTab: true,
    },
  },
  {
    id: "binance-wallet-campaign",
    title: "Binance Web3 Wallet Trading Campaign is Live",
    isActive: true,
    endDate: "09 Apr 2024, 23:59",
    bodyText: ["Complete any or all of the six OPX campaign tasks and qualify for rewards!"],
    link: {
      text: "Check your tasks and their completion status",
      href: "https://www.binance.com/en/activity/mission/gmx-airdrop",
      newTab: true,
    },
  },
  {
    id: "btc-eth-single-token-markets",
    title: "New BTC/USD and ETH/USD single token OPTIX pools",
    isActive: true,
    endDate: "2 May 2024, 23:59",
    bodyText: [
      "Use only BTC or ETH to provide liquidity to BTC/USD or ETH/USD. Now, you can buy OPTIX without being exposed to stablecoins.",
    ],
    link: {
      text: "View OPTIX pools",
      href: "/#/pools",
    },
  },
  {
    id: "delegate-voting-power",
    title: "Delegate your OPX Voting Power",
    isActive: true,
    endDate: "6 Jun 2024, 23:59",
    bodyText: (
      <>
        <ExternalLink href="https://www.tally.xyz/gov/gmx">The OPX DAO is now live on Tally</ExternalLink>. Please{" "}
        <ExternalLink href="https://www.tally.xyz/gov/gmx/my-voting-power">delegate your voting power</ExternalLink>{" "}
        before staking or claiming OPX rewards.
      </>
    ),
  },
];
