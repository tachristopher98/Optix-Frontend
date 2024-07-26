import React, { ReactNode, useEffect, useState } from "react";
import cx from "classnames";

import { AppHeaderUser } from "./AppHeaderUser";
import { AppHeaderLinks } from "./AppHeaderLinks";

import logoImg from "img/logo_GMX.svg";
import logoSmallImg from "img/logo_GMX_small.svg";
import { RiMenuLine } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import { AnimatePresence as FramerAnimatePresence, motion } from "framer-motion";

import "./Header.scss";
import { Link } from "react-router-dom";
import { isHomeSite } from "lib/legacy";
import { HomeHeaderLinks } from "./HomeHeaderLinks";
import { Trans } from "@lingui/macro";
import { HeaderPromoBanner } from "components/HeaderPromoBanner/HeaderPromoBanner";
import { useMedia } from "react-use";
import { HeaderLink } from "./HeaderLink";
import useIncentiveStats from "domain/synthetics/common/useIncentiveStats";

// Fix framer-motion old React FC type (solved in react 18)
const AnimatePresence = (props: React.ComponentProps<typeof FramerAnimatePresence> & { children: ReactNode }) => (
  <FramerAnimatePresence {...props} />
);

const FADE_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const SLIDE_VARIANTS = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

const TRANSITION = { duration: 0.2 };

type Props = {
  disconnectAccountAndCloseSettings: () => void;
  openSettings: () => void;
  showRedirectModal: (to: string) => void;
};

export function Header({ disconnectAccountAndCloseSettings, openSettings, showRedirectModal }: Props) {
  const isMobile = useMedia("(max-width: 1200px)");

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isNativeSelectorModalVisible, setIsNativeSelectorModalVisible] = useState(false);
  const isTradingIncentiveActive = useIncentiveStats()?.trading?.isActive ?? false;

  useEffect(() => {
    if (isDrawerVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerVisible]);

  return (
    <>
      {isDrawerVisible && (
        <AnimatePresence>
          {isDrawerVisible && (
            <motion.div
              className="App-header-backdrop"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={FADE_VARIANTS}
              transition={TRANSITION}
              onClick={() => setIsDrawerVisible(!isDrawerVisible)}
            ></motion.div>
          )}
        </AnimatePresence>
      )}
      {isNativeSelectorModalVisible && (
        <AnimatePresence>
          {isNativeSelectorModalVisible && (
            <motion.div
              className="selector-backdrop"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={FADE_VARIANTS}
              transition={TRANSITION}
              onClick={() => setIsNativeSelectorModalVisible(!isNativeSelectorModalVisible)}
            ></motion.div>
          )}
        </AnimatePresence>
      )}
      <header>
        {!isMobile && (
          <div className="App-header-container">
            <div className="App-header large">
              <div className="App-header-container-left">
                <Link className="App-header-link-main" to="/">
                  <svg width="118" height="35" viewBox="0 0 118 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50.1002 26.4772C48.1619 26.4772 46.3817 26.0274 44.7597 25.1274C43.1377 24.2277 41.8522 22.9856 40.9026 21.4011C39.9532 19.7971 39.4785 17.9875 39.4785 15.9728C39.4785 13.9776 39.9532 12.1877 40.9026 10.6032C41.8522 8.99917 43.1377 7.74724 44.7597 6.84744C46.3817 5.94761 48.1619 5.49771 50.1002 5.49771C52.0584 5.49771 53.8386 5.94761 55.441 6.84744C57.0627 7.74724 58.3386 8.99917 59.2683 10.6032C60.2177 12.1877 60.6925 13.9776 60.6925 15.9728C60.6925 17.9875 60.2177 19.7971 59.2683 21.4011C58.3386 22.9856 57.0627 24.2277 55.441 25.1274C53.819 26.0274 52.0388 26.4772 50.1002 26.4772ZM50.1002 22.8095C51.3463 22.8095 52.4442 22.5355 53.3935 21.9879C54.3431 21.4207 55.0849 20.6185 55.619 19.5818C56.153 18.545 56.4201 17.342 56.4201 15.9728C56.4201 14.6035 56.153 13.4102 55.619 12.3931C55.0849 11.3563 54.3431 10.5641 53.3935 10.0164C52.4442 9.46864 51.3463 9.1948 50.1002 9.1948C48.8541 9.1948 47.7466 9.46864 46.7774 10.0164C45.8278 10.5641 45.086 11.3563 44.5519 12.3931C44.0179 13.4102 43.7509 14.6035 43.7509 15.9728C43.7509 17.342 44.0179 18.545 44.5519 19.5818C45.086 20.6185 45.8278 21.4207 46.7774 21.9879C47.7466 22.5355 48.8541 22.8095 50.1002 22.8095Z" fill="white"/>
                    <path d="M67.9364 12.3637C68.4705 11.6204 69.2024 11.0042 70.1321 10.5152C71.0815 10.0066 72.1595 9.75229 73.366 9.75229C74.7705 9.75229 76.0364 10.0946 77.1638 10.7792C78.311 11.4639 79.211 12.4419 79.8638 13.7135C80.5362 14.9654 80.8724 16.4226 80.8724 18.0855C80.8724 19.7481 80.5362 21.225 79.8638 22.5161C79.211 23.7876 78.311 24.7753 77.1638 25.4795C76.0364 26.1838 74.7705 26.5359 73.366 26.5359C72.1595 26.5359 71.0914 26.2915 70.1617 25.8023C69.2517 25.3132 68.5101 24.6972 67.9364 23.9537V34.018H63.7828V10.0164H67.9364V12.3637ZM76.6298 18.0855C76.6298 17.1074 76.422 16.2662 76.0067 15.5619C75.611 14.8383 75.077 14.2905 74.4045 13.9189C73.7517 13.5472 73.0397 13.3614 72.2683 13.3614C71.5166 13.3614 70.8045 13.5569 70.1321 13.9483C69.4793 14.3198 68.9453 14.8676 68.53 15.5913C68.1343 16.3152 67.9364 17.1661 67.9364 18.1442C67.9364 19.1222 68.1343 19.9731 68.53 20.6968C68.9453 21.4207 69.4793 21.978 70.1321 22.3694C70.8045 22.7409 71.5166 22.9269 72.2683 22.9269C73.0397 22.9269 73.7517 22.7312 74.4045 22.34C75.077 21.9486 75.611 21.3913 76.0067 20.6675C76.422 19.9438 76.6298 19.0829 76.6298 18.0855Z" fill="white"/>
                    <path d="M88.7272 13.3908V21.2544C88.7272 21.8022 88.8556 22.2031 89.1127 22.4574C89.3897 22.6922 89.8446 22.8096 90.4776 22.8096H92.4063V26.2719H89.7953C86.2942 26.2719 84.5438 24.5896 84.5438 21.225V13.3908H82.5856V10.0164H84.5438V5.99655H88.7272V10.0164H92.4063V13.3908H88.7272Z" fill="white"/>
                    <path d="M99.5476 10.0164V26.2719H95.3937V10.0164H99.5476Z" fill="white"/>
                    <path d="M112.73 26.2719L109.348 21.225L106.352 26.2719H101.901L107.271 18.1148L101.842 10.0164H106.53L109.882 15.0338L112.908 10.0164H117.359L111.959 18.1148L117.418 26.2719H112.73Z" fill="white"/>
                    <path d="M97.2162 7.44524C96.6455 7.44524 96.1334 7.31414 95.6795 7.05193C95.2388 6.78974 94.8886 6.43574 94.6293 5.99001C94.37 5.54425 94.2403 5.0395 94.2403 4.47576C94.2403 3.92512 94.37 3.42693 94.6293 2.98117C94.8886 2.52232 95.2388 2.16834 95.6795 1.91925C96.1334 1.65704 96.6455 1.52594 97.2162 1.52594C97.7737 1.52594 98.2728 1.65704 98.7138 1.91925C99.1545 2.16834 99.5047 2.51576 99.764 2.96152C100.023 3.40726 100.153 3.912 100.153 4.47576C100.153 5.0395 100.023 5.55081 99.764 6.00966C99.5047 6.45542 99.1545 6.8094 98.7138 7.07161C98.2728 7.3207 97.7737 7.44524 97.2162 7.44524ZM97.2162 6.22598C97.6959 6.22598 98.0849 6.06211 98.383 5.73435C98.6942 5.40659 98.8498 4.98707 98.8498 4.47576C98.8498 3.97757 98.6942 3.56459 98.383 3.23683C98.0849 2.90907 97.6959 2.7452 97.2162 2.7452C96.7233 2.7452 96.3213 2.90907 96.0101 3.23683C95.6989 3.56459 95.5433 3.97757 95.5433 4.47576C95.5433 4.98707 95.6989 5.40659 96.0101 5.73435C96.3213 6.06211 96.7233 6.22598 97.2162 6.22598Z" fill="#FFD718"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.49019 15.9988C5.49019 21.0401 9.30016 25.1268 14 25.1268V31.0157C6.26801 31.0157 0 24.2925 0 15.9988C0 7.70529 6.26801 0.981995 14 0.981995V6.87098C9.30016 6.87098 5.49019 10.9577 5.49019 15.9988Z" fill="url(#paint0_linear_0_11)"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.5001 0.981995C17.2239 0.981995 17 1.2357 17 1.54866V7.64042C17 7.9534 17.2239 8.2071 17.5001 8.2071C17.7761 8.2071 18 7.9534 18 7.64042V1.54866C18 1.2357 17.7761 0.981995 17.5001 0.981995ZM17.5001 23.9324C17.2239 23.9324 17 24.1861 17 24.499V30.4491C17 30.7621 17.2239 31.0157 17.5001 31.0157C17.7761 31.0157 18 30.7621 18 30.4491V24.499C18 24.1861 17.7761 23.9324 17.5001 23.9324Z" fill="#FFD718"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M29.5 12.9955C29.2238 12.9955 29 13.2368 29 13.5346V19.4643C29 19.7621 29.2238 20.0034 29.5 20.0034C29.7761 20.0034 30 19.7621 30 19.4643V13.5346C30 13.2368 29.7761 12.9955 29.5 12.9955Z" fill="#FFD718"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M26.5 6.98874C26.2239 6.98874 26 7.24086 26 7.55187V24.4459C26 24.7568 26.2239 25.009 26.5 25.009C26.7762 25.009 27 24.7568 27 24.4459V7.55187C27 7.24086 26.7762 6.98874 26.5 6.98874Z" fill="#FFD718"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M23.5 3.98538C23.2238 3.98538 23 4.24006 23 4.55421V11.9489C23 12.263 23.2238 12.5177 23.5 12.5177C23.7761 12.5177 24 12.263 24 11.9489V4.55421C24 4.24006 23.7761 3.98538 23.5 3.98538ZM23.5 19.628C23.2238 19.628 23 19.8826 23 20.1968V28.4447C23 28.7588 23.2238 29.0135 23.5 29.0135C23.7761 29.0135 24 28.7588 24 28.4447V20.1968C24 19.8826 23.7761 19.628 23.5 19.628Z" fill="#FFD718"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.5001 1.98312C20.2239 1.98312 20 2.23412 20 2.54375V8.85083C20 9.16046 20.2239 9.41145 20.5001 9.41145C20.7761 9.41145 21 9.16046 21 8.85083V2.54375C21 2.23412 20.7761 1.98312 20.5001 1.98312ZM20.5001 22.5863C20.2239 22.5863 20 22.8372 20 23.1469V29.454C20 29.7636 20.2239 30.0146 20.5001 30.0146C20.7761 30.0146 21 29.7636 21 29.454V23.1469C21 22.8372 20.7761 22.5863 20.5001 22.5863Z" fill="#FFD718"/>
                    <defs>
                    <linearGradient id="paint0_linear_0_11" x1="14" y1="11.0648" x2="-0.0286656" y2="11.1477" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6131FA"/>
                    <stop offset="1" stopColor="#451EC1"/>
                    </linearGradient>
                    </defs>
                  </svg>
                </Link>
                {isHomeSite() ? (
                  <HomeHeaderLinks showRedirectModal={showRedirectModal} />
                ) : (
                  <AppHeaderLinks showRedirectModal={showRedirectModal} />
                )}
              </div>
              <div className="App-header-container-right">
                <AppHeaderUser
                  disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
                  openSettings={openSettings}
                  showRedirectModal={showRedirectModal}
                />
              </div>
            </div>
          </div>
        )}
        {isMobile && (
          <div className={cx("App-header", "small", { active: isDrawerVisible })}>
            <div
              className={cx("App-header-link-container", "App-header-top", {
                active: isDrawerVisible,
              })}
            >
              <div className="App-header-container-left">
                {/* <div className="App-header-menu-icon-block" onClick={() => setIsDrawerVisible(!isDrawerVisible)}>
                  {!isDrawerVisible && <RiMenuLine className="App-header-menu-icon" />}
                  {isDrawerVisible && <FaTimes className="App-header-menu-icon" />}
                </div> */}
                <div className="App-header-link-main clickable" onClick={() => setIsDrawerVisible(!isDrawerVisible)}>
                  {/* <img src={logoImg} className="big" alt="OPX Logo" />
                  <img src={logoSmallImg} className="small" alt="OPX Logo" /> */}
                  <svg width="85" height="25" viewBox="0 0 118 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50.1002 26.4772C48.1619 26.4772 46.3817 26.0274 44.7597 25.1274C43.1377 24.2277 41.8522 22.9856 40.9026 21.4011C39.9532 19.7971 39.4785 17.9875 39.4785 15.9728C39.4785 13.9776 39.9532 12.1877 40.9026 10.6032C41.8522 8.99917 43.1377 7.74724 44.7597 6.84744C46.3817 5.94761 48.1619 5.49771 50.1002 5.49771C52.0584 5.49771 53.8386 5.94761 55.441 6.84744C57.0627 7.74724 58.3386 8.99917 59.2683 10.6032C60.2177 12.1877 60.6925 13.9776 60.6925 15.9728C60.6925 17.9875 60.2177 19.7971 59.2683 21.4011C58.3386 22.9856 57.0627 24.2277 55.441 25.1274C53.819 26.0274 52.0388 26.4772 50.1002 26.4772ZM50.1002 22.8095C51.3463 22.8095 52.4442 22.5355 53.3935 21.9879C54.3431 21.4207 55.0849 20.6185 55.619 19.5818C56.153 18.545 56.4201 17.342 56.4201 15.9728C56.4201 14.6035 56.153 13.4102 55.619 12.3931C55.0849 11.3563 54.3431 10.5641 53.3935 10.0164C52.4442 9.46864 51.3463 9.1948 50.1002 9.1948C48.8541 9.1948 47.7466 9.46864 46.7774 10.0164C45.8278 10.5641 45.086 11.3563 44.5519 12.3931C44.0179 13.4102 43.7509 14.6035 43.7509 15.9728C43.7509 17.342 44.0179 18.545 44.5519 19.5818C45.086 20.6185 45.8278 21.4207 46.7774 21.9879C47.7466 22.5355 48.8541 22.8095 50.1002 22.8095Z" fill="white"/>
                    <path d="M67.9364 12.3637C68.4705 11.6204 69.2024 11.0042 70.1321 10.5152C71.0815 10.0066 72.1595 9.75229 73.366 9.75229C74.7705 9.75229 76.0364 10.0946 77.1638 10.7792C78.311 11.4639 79.211 12.4419 79.8638 13.7135C80.5362 14.9654 80.8724 16.4226 80.8724 18.0855C80.8724 19.7481 80.5362 21.225 79.8638 22.5161C79.211 23.7876 78.311 24.7753 77.1638 25.4795C76.0364 26.1838 74.7705 26.5359 73.366 26.5359C72.1595 26.5359 71.0914 26.2915 70.1617 25.8023C69.2517 25.3132 68.5101 24.6972 67.9364 23.9537V34.018H63.7828V10.0164H67.9364V12.3637ZM76.6298 18.0855C76.6298 17.1074 76.422 16.2662 76.0067 15.5619C75.611 14.8383 75.077 14.2905 74.4045 13.9189C73.7517 13.5472 73.0397 13.3614 72.2683 13.3614C71.5166 13.3614 70.8045 13.5569 70.1321 13.9483C69.4793 14.3198 68.9453 14.8676 68.53 15.5913C68.1343 16.3152 67.9364 17.1661 67.9364 18.1442C67.9364 19.1222 68.1343 19.9731 68.53 20.6968C68.9453 21.4207 69.4793 21.978 70.1321 22.3694C70.8045 22.7409 71.5166 22.9269 72.2683 22.9269C73.0397 22.9269 73.7517 22.7312 74.4045 22.34C75.077 21.9486 75.611 21.3913 76.0067 20.6675C76.422 19.9438 76.6298 19.0829 76.6298 18.0855Z" fill="white"/>
                    <path d="M88.7272 13.3908V21.2544C88.7272 21.8022 88.8556 22.2031 89.1127 22.4574C89.3897 22.6922 89.8446 22.8096 90.4776 22.8096H92.4063V26.2719H89.7953C86.2942 26.2719 84.5438 24.5896 84.5438 21.225V13.3908H82.5856V10.0164H84.5438V5.99655H88.7272V10.0164H92.4063V13.3908H88.7272Z" fill="white"/>
                    <path d="M99.5476 10.0164V26.2719H95.3937V10.0164H99.5476Z" fill="white"/>
                    <path d="M112.73 26.2719L109.348 21.225L106.352 26.2719H101.901L107.271 18.1148L101.842 10.0164H106.53L109.882 15.0338L112.908 10.0164H117.359L111.959 18.1148L117.418 26.2719H112.73Z" fill="white"/>
                    <path d="M97.2162 7.44524C96.6455 7.44524 96.1334 7.31414 95.6795 7.05193C95.2388 6.78974 94.8886 6.43574 94.6293 5.99001C94.37 5.54425 94.2403 5.0395 94.2403 4.47576C94.2403 3.92512 94.37 3.42693 94.6293 2.98117C94.8886 2.52232 95.2388 2.16834 95.6795 1.91925C96.1334 1.65704 96.6455 1.52594 97.2162 1.52594C97.7737 1.52594 98.2728 1.65704 98.7138 1.91925C99.1545 2.16834 99.5047 2.51576 99.764 2.96152C100.023 3.40726 100.153 3.912 100.153 4.47576C100.153 5.0395 100.023 5.55081 99.764 6.00966C99.5047 6.45542 99.1545 6.8094 98.7138 7.07161C98.2728 7.3207 97.7737 7.44524 97.2162 7.44524ZM97.2162 6.22598C97.6959 6.22598 98.0849 6.06211 98.383 5.73435C98.6942 5.40659 98.8498 4.98707 98.8498 4.47576C98.8498 3.97757 98.6942 3.56459 98.383 3.23683C98.0849 2.90907 97.6959 2.7452 97.2162 2.7452C96.7233 2.7452 96.3213 2.90907 96.0101 3.23683C95.6989 3.56459 95.5433 3.97757 95.5433 4.47576C95.5433 4.98707 95.6989 5.40659 96.0101 5.73435C96.3213 6.06211 96.7233 6.22598 97.2162 6.22598Z" fill="#FFD718"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.49019 15.9988C5.49019 21.0401 9.30016 25.1268 14 25.1268V31.0157C6.26801 31.0157 0 24.2925 0 15.9988C0 7.70529 6.26801 0.981995 14 0.981995V6.87098C9.30016 6.87098 5.49019 10.9577 5.49019 15.9988Z" fill="url(#paint0_linear_0_11)"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.5001 0.981995C17.2239 0.981995 17 1.2357 17 1.54866V7.64042C17 7.9534 17.2239 8.2071 17.5001 8.2071C17.7761 8.2071 18 7.9534 18 7.64042V1.54866C18 1.2357 17.7761 0.981995 17.5001 0.981995ZM17.5001 23.9324C17.2239 23.9324 17 24.1861 17 24.499V30.4491C17 30.7621 17.2239 31.0157 17.5001 31.0157C17.7761 31.0157 18 30.7621 18 30.4491V24.499C18 24.1861 17.7761 23.9324 17.5001 23.9324Z" fill="#FFD718"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M29.5 12.9955C29.2238 12.9955 29 13.2368 29 13.5346V19.4643C29 19.7621 29.2238 20.0034 29.5 20.0034C29.7761 20.0034 30 19.7621 30 19.4643V13.5346C30 13.2368 29.7761 12.9955 29.5 12.9955Z" fill="#FFD718"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M26.5 6.98874C26.2239 6.98874 26 7.24086 26 7.55187V24.4459C26 24.7568 26.2239 25.009 26.5 25.009C26.7762 25.009 27 24.7568 27 24.4459V7.55187C27 7.24086 26.7762 6.98874 26.5 6.98874Z" fill="#FFD718"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M23.5 3.98538C23.2238 3.98538 23 4.24006 23 4.55421V11.9489C23 12.263 23.2238 12.5177 23.5 12.5177C23.7761 12.5177 24 12.263 24 11.9489V4.55421C24 4.24006 23.7761 3.98538 23.5 3.98538ZM23.5 19.628C23.2238 19.628 23 19.8826 23 20.1968V28.4447C23 28.7588 23.2238 29.0135 23.5 29.0135C23.7761 29.0135 24 28.7588 24 28.4447V20.1968C24 19.8826 23.7761 19.628 23.5 19.628Z" fill="#FFD718"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.5001 1.98312C20.2239 1.98312 20 2.23412 20 2.54375V8.85083C20 9.16046 20.2239 9.41145 20.5001 9.41145C20.7761 9.41145 21 9.16046 21 8.85083V2.54375C21 2.23412 20.7761 1.98312 20.5001 1.98312ZM20.5001 22.5863C20.2239 22.5863 20 22.8372 20 23.1469V29.454C20 29.7636 20.2239 30.0146 20.5001 30.0146C20.7761 30.0146 21 29.7636 21 29.454V23.1469C21 22.8372 20.7761 22.5863 20.5001 22.5863Z" fill="#FFD718"/>
                    <defs>
                    <linearGradient id="paint0_linear_0_11" x1="14" y1="11.0648" x2="-0.0286656" y2="11.1477" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6131FA"/>
                    <stop offset="1" stopColor="#451EC1"/>
                    </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="App-header-container-right">
                <AppHeaderUser
                  disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
                  openSettings={openSettings}
                  small
                  showRedirectModal={showRedirectModal}
                />
                <div className="App-header-network" onClick={() => {setIsDrawerVisible !== undefined ? setIsDrawerVisible(!isDrawerVisible) : null}}>
                  {!isDrawerVisible && <RiMenuLine className="App-header-menu-icon" />}
                  {isDrawerVisible && <FaTimes className="App-header-menu-icon" />}
                </div>
              </div>
            </div>
          </div>
        )}
        {isTradingIncentiveActive && (
          <HeaderPromoBanner>
            <Trans>
              Trade&nbsp;on OPX&nbsp;V2 in&nbsp;Arbitrum and win&nbsp;280,000&nbsp;ARB ({">"} $500k) in prizes in{" "}
              <HeaderLink
                to="/competitions/"
                showRedirectModal={showRedirectModal}
                className="underline inline-block clickable"
              >
                two&nbsp;weekly
              </HeaderLink>{" "}
              competitions. Live&nbsp;from&nbsp;March 13th to 27th.
            </Trans>
          </HeaderPromoBanner>
        )}
      </header>
      <AnimatePresence>
        {isDrawerVisible && (
          <motion.div
            // onClick={() => setIsDrawerVisible(false)}
            className="App-header-links-container App-header-drawer"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={SLIDE_VARIANTS}
            transition={TRANSITION}
          >
            {isHomeSite() ? (
              <HomeHeaderLinks
                small
                clickCloseIcon={() => setIsDrawerVisible(false)}
                showRedirectModal={showRedirectModal}
              />
            ) : (
              <AppHeaderLinks
                small
                openSettings={openSettings}
                clickCloseIcon={() => setIsDrawerVisible(false)}
                showRedirectModal={showRedirectModal}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
