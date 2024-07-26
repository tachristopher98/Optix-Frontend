import { FaCaretDown } from "react-icons/fa";
import { dynamicActivate, isTestLanguage, locales } from "lib/i18n";
import { importImage } from "lib/legacy";
import ModalWithPortal from "../Modal/ModalWithPortal";
import type { ModalProps } from "components/Modal/Modal";
import { useState, useRef, useEffect } from 'react';
import { LANGUAGE_LOCALSTORAGE_KEY } from "config/localStorage";
import { defaultLocale } from "lib/i18n";
import LanguageModalContent from "./LanguageModalContent";
import { upperCase } from "lodash";

export default function LanguageModalButton () {
    const currentLanguage = useRef(localStorage.getItem(LANGUAGE_LOCALSTORAGE_KEY) || defaultLocale);
    const [image, setImage] = useState<string>();
    console.log(currentLanguage)
    // const image = importImage(`flag_en.svg`)
    const [activeModal, setActiveModal] = useState<string | null>(null);

    function getModalProps(modalName: string | null): ModalProps {
        return {
            className: "language-popup",
            isVisible: activeModal === "LANGUAGE",
            setIsVisible: () => setActiveModal(null),
            label: `Select Language`,
        };
    }

    function getModalContent(modalName) {
        return <LanguageModalContent currentLanguage={currentLanguage} />;
    }

    useEffect(() => {
        setImage(importImage(`flag_${currentLanguage.current}.svg`));
    }, [currentLanguage.current])

    return (
        <div id="language" className="network-dropdown" style={{marginRight: "2.4rem"}} onClick={() => setActiveModal("LANGUAGE")}>
            <button className="transparent" style={{paddingRight: "0.4rem"}}>
                <img className="network-dropdown-icon" style={{borderRadius: 0}} src={image} alt={"selectorLabel"} />
            </button>
            <button className="transparent" style={{paddingLeft: "0.8rem", color: 'white'}}>
                {upperCase(currentLanguage.current)}
                <FaCaretDown color="white" size={12} />
            </button>
            <ModalWithPortal {...getModalProps(activeModal)}>{getModalContent(activeModal)}</ModalWithPortal>
        </div>
    )
}