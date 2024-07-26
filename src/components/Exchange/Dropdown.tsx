import { Popover } from '@headlessui/react';
import { ReactNode } from 'react'
import { GoTriangleDown } from "react-icons/go";
import cx from 'classnames';
import './Dropdown.css';
type Props = {
    options: (string | number)[];
    option: string | number | undefined;
    setOption?: (option: any) => void;
    onChange?: (option: any) => void;
    type?: "block" | "inline";
    className?: string;
    optionLabels?: Record<string | number, ReactNode> | string[];
    icons?: Record<string, string>;
};

export default function Dropdown(props: Props) {
    const { options, option, setOption, onChange, type = "block", className, optionLabels, icons } = props;
    const onClick = (opt) => {
        if (setOption) {
          setOption(opt);
        }
        if (onChange) {
          onChange(opt);
        }
    };
    return (
        <div className="dropdown-popover-options" style={{paddingBottom: '1rem'}}>
            <Popover.Group style={{display: 'flex'}}>
                <Popover className={"dropdown-options-popover"}>
                    {({ open, close }) => {
                        return (
                            <>
                                <Popover.Button as="div">
                                    <div className="options-button">
                                        {option}
                                        <GoTriangleDown />
                                    </div>
                                </Popover.Button>
                                <Popover.Panel as="div" className={"options-container"}>
                                    {/* <div className='options-item'>
                                            ALL
                                        </div> */}
                                    {
                                        options.map((opt) => {
                                            const label = optionLabels && optionLabels[opt] ? optionLabels[opt] : opt;
                                            return <div className={cx('options-item', {active: option === opt})} key={opt} onClick={() => {onClick(opt);close()}}>
                                                {label}
                                            </div>
                                        })
                                    }
                                </Popover.Panel>
                            </>
                        );
                    }}
                </Popover>
            </Popover.Group>
        </div>
    )
}
