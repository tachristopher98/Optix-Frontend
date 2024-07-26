import React, { useEffect, useState } from "react";
import "./OptionsContainer.css";
import { Popover } from "@headlessui/react";
import { GoTriangleDown } from "react-icons/go";
import { BsPlusSquare } from "react-icons/bs";
import { AiFillCaretUp } from "react-icons/ai";
import cx from 'classnames';
import { useCpType } from "lib/useCpType";
import { expirationData } from "utils";

export default function OptionsContainer() {
    const [cptype, setCpType] = useCpType();
    const [options, setOptions] = useState('ALL');
    const [selectedDate, setSelectedDate] = useState(-1);
    const month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const today = new Date();
    const [data, setData] = useState(expirationData.filter(item => selectedDate === -1 ? item : item.date === selectedDate));
    let dates: Array<Date> = [
        new Date(today),
        new Date(today),
        new Date(today),
        new Date(today),
        new Date(today),
        new Date(today),
        new Date(today),
    ];

    // dates[0].setDate(today.getDate() + 1);
    dates[1].setDate(today.getDate() + 1);
    dates[2].setDate(today.getDate() + 7);
    dates[3].setDate(today.getDate() + 14);
    dates[4].setDate(today.getDate() + 21);
    dates[5].setDate(today.getDate() + 28);
    dates[6].setDate(today.getDate() + 59);

    const mock = new Array(8);
    mock.fill(0);

    useEffect(() => {
        if (selectedDate === -1)
            setData(expirationData);
        else
            setData(expirationData.filter(item => item.date === selectedDate))
    }, [selectedDate]);

    return (
        <div>
            <div className="options-header">
                <div className={"options-tabs"}>
                    <div className={cx("options-tab", {active: options === 'ALL'})} onClick={() => setOptions('ALL')}>ALL</div>
                    <div className={cx("options-tab", {active: options === 'CALLS'})} onClick={() => setOptions('CALLS')}>CALLS</div>
                    <div className={cx("options-tab", {active: options === 'PUTS'})} onClick={() => setOptions('PUTS')}>PUTS</div>
                </div>
                <div className={"options-tabs"}>
                    <div className={cx("options-tab", {active: selectedDate === -1})} onClick={() => setSelectedDate(-1)}>
                        ALL
                    </div>
                    {dates.map((item, index) => {
                        return (
                            <div className={cx("options-tab", {active: selectedDate === index})} key={"index_" + index} onClick={() => setSelectedDate(index)}>
                                {`${month[item.getMonth()]} ${item.getDate()}`}
                            </div>
                        );
                    })}
                </div>
                <div className="popover-options">
                    <Popover.Group>
                        <Popover className={"options-popover"}>
                            {({ open, close }) => {
                                return (
                                    <>
                                        <Popover.Button as="div">
                                            <div className="options-button">
                                                {options}
                                                <GoTriangleDown />
                                            </div>
                                        </Popover.Button>
                                        <Popover.Panel as="div" className={"options-container"}>
                                            {/* <div className='options-item'>
                                            ALL
                                        </div> */}
                                            <div className={cx("options-item", {active: options === 'ALL'})} onClick={() => {setOptions('ALL'); close()}}>ALL</div>
                                            <div className={cx("options-item", {active: options === 'CALLS'})} onClick={() => {setOptions('CALLS'); close()}}>CALLS</div>
                                            <div className={cx("options-item", {active: options === 'PUTS'})} onClick={() => {setOptions('PUTS'); close()}}>PUTS</div>
                                        </Popover.Panel>
                                    </>
                                );
                            }}
                        </Popover>
                    </Popover.Group>
                </div>
                <div className="popover-options">
                    <Popover.Group>
                        <Popover className={"options-popover"}>
                            {({ open, close }) => {
                                return (
                                    <>
                                        <Popover.Button as="div">
                                            <div className="options-button">
                                                {selectedDate !== -1 && `${month[dates[selectedDate].getMonth()]} ${dates[selectedDate].getDate()}`}
                                                {selectedDate === -1 && `ALL`}
                                                <GoTriangleDown />
                                            </div>
                                        </Popover.Button>
                                        <Popover.Panel as="div" className={"options-container"}>
                                            {/* <div className='options-item'>
                                            ALL
                                        </div> */}
                                            <div className={cx("options-item", {active: selectedDate === -1})} onClick={() => {setSelectedDate(-1); close()}}>
                                                {`ALL`}
                                            </div>
                                            {dates
                                                // .filter((item, index) => index != 0 && item)
                                                .map((item, index) => {
                                                    return (
                                                        <div className={cx("options-item", {active: selectedDate === index})} key={"item_options_" + index} onClick={() => {setSelectedDate(index); close()}}>
                                                            {`${month[item.getMonth()]} ${item.getDate()}`}
                                                        </div>
                                                    );
                                                })}
                                        </Popover.Panel>
                                    </>
                                );
                            }}
                        </Popover>
                    </Popover.Group>
                </div>
            </div>
            <div className="options-panel-container">
                <div className="options-panel-container-header">
                    <div className="options-panel-container-header-type">
                        {options !== 'PUTS' && <div className={options === "CALLS" ? "options-panel-container-header-type-select" : ""}>CALLS</div>}
                        {options === 'ALL' && <div>7D/4PM</div>}
                        {options !== 'CALLS' && <div className={options === "PUTS" ? "options-panel-container-header-type-select" : ""}>PUTS</div>}
                    </div>
                    <div className="options-panel-container-header-second">
                        {options !== 'PUTS' && <div className={cx('options-panel-container-calls', {active: options === 'CALLS'})}>
                            <div>Delta</div>
                            <div>IV</div>
                            <div>Volumn</div>
                            <div>Bid Size</div>
                            <div>Bid Price</div>
                            <div>Ask Price</div>
                            <div>Ask Size</div>
                        </div>}
                        {options === 'ALL' && <div className="options-panel-container-strike">
                            Strike
                        </div>}
                        {options !== 'CALLS' && <div className={cx('options-panel-container-puts', {active: options === 'PUTS'})}>
                            <div>Bid Size</div>
                            <div>Bid Price</div>
                            <div>Ask Price</div>
                            <div>Ask Size</div>
                            <div>Volumn</div>
                            <div>IV</div>
                            <div>Delta</div>
                        </div>}
                    </div>
                </div>
                <div className="options-panel-container-content">
                    {
                        data.slice(0, data.length / 2).map((item, index) => {
                            return <div className="options-panel-container-header-second" key={'item_record_'+index}>
                                {options !== 'PUTS' && <div className={cx('options-panel-container-calls-item', {active: options === 'CALLS'})}>
                                    <div>{item.calls.delta}</div>
                                    <div>{item.calls.iv}</div>
                                    <div>{item.calls.volumn}</div>
                                    <div>{item.calls.bidsize}</div>
                                    <div onClick={() => setCpType('short')}>{item.calls.bidprice} &nbsp;<BsPlusSquare /></div>
                                    <div onClick={() => setCpType('long')}>{item.calls.askprice} &nbsp;<BsPlusSquare /></div>
                                    <div>{item.calls.asksize}</div>
                                </div>}
                                {options === 'ALL' && <div className="options-panel-container-strike-item">
                                    {item.strike}
                                </div>}
                                {options !== 'CALLS' && <div className={cx("options-panel-container-puts-item", {active: options === 'PUTS'})}>
                                    <div>{item.puts.bidsize}</div>
                                    <div onClick={() => setCpType('short')}>{item.puts.bidprice}&nbsp;<BsPlusSquare /></div>
                                    <div onClick={() => setCpType('long')}>{item.puts.askprice}&nbsp;<BsPlusSquare /></div>
                                    <div>{item.puts.asksize}</div>
                                    <div>{item.puts.volumn}</div>
                                    <div>{item.puts.iv}</div>
                                    <div>{item.puts.delta}</div>
                                </div>}
                            </div>    
                        })
                    }
                    <div className="options-panel-container-center">
                        <div className={cx("options-panel-container-divider-line", {active: options !== 'ALL'})}></div>
                        <div className={cx("options-panel-container-strike-center", {active: options !== 'ALL'})}>
                            BTC $72,100&nbsp;
                            <AiFillCaretUp />
                            <span style={{color: "#3FC11E"}}>0.5%</span>
                        </div>
                    </div>
                    {
                        data.slice(data.length / 2, data.length).map((item, index) => {
                            return <div className="options-panel-container-header-second" key={'item_record_'+index}>
                                {options !== 'PUTS' && <div className={cx('options-panel-container-calls-item', {active: options === 'CALLS'})}>
                                    <div>{item.calls.delta}</div>
                                    <div>{item.calls.iv}</div>
                                    <div>{item.calls.volumn}</div>
                                    <div>{item.calls.bidsize}</div>
                                    <div onClick={() => setCpType('short')}>{item.calls.bidprice}&nbsp;<BsPlusSquare /></div>
                                    <div onClick={() => setCpType('long')}>{item.calls.askprice}&nbsp;<BsPlusSquare /></div>
                                    <div>{item.calls.asksize}</div>
                                </div>}
                                {options === 'ALL' && <div className="options-panel-container-strike-item">
                                    {item.strike}
                                </div>}
                                {options !== 'CALLS' && <div className={cx("options-panel-container-puts-item", {active: options === 'PUTS'})}>
                                    <div>{item.puts.bidsize}</div>
                                    <div onClick={() => setCpType('short')}>{item.puts.bidprice}&nbsp;<BsPlusSquare /></div>
                                    <div onClick={() => setCpType('long')}>{item.puts.askprice}&nbsp;<BsPlusSquare /></div>
                                    <div>{item.puts.asksize}</div>
                                    <div>{item.puts.volumn}</div>
                                    <div>{item.puts.iv}</div>
                                    <div>{item.puts.delta}</div>
                                </div>}
                            </div>    
                        })
                    }

                </div>
            </div>
        </div>
    );
}
