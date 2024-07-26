import React, { useState } from 'react'
import './cppanel.css';
import Dropdown from 'components/Exchange/Dropdown';
import { LEVERAGE_ORDER_OPTIONS, LIMIT, MARKET, STOP } from 'lib/legacy';
import { t } from '@lingui/macro';
import { IoIosClose } from "react-icons/io";
import { useLocalStorageSerializeKey } from 'lib/localStorage';
import { useChainId } from "lib/chains";
import eth from '../../img/eth.svg';
import { FiPlus } from "react-icons/fi";
import cx from 'classnames'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { data } from '../../utils';
import { useCpType } from 'lib/useCpType';

const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i['Eth Price'] - 3650));
    const dataMin = Math.min(...data.map((i) => i['Eth Price'] - 3650));
  
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
  
    return dataMax / (dataMax - dataMin);
};
  
const off = gradientOffset();

export default function CPpanel() {
    const [options, setOptions] = useState('payoff');
    const [cptype, setCpType] = useCpType();
    // const {
    //     orderOption,
    //     setOrderOption
    // } = props;
    const { chainId } = useChainId();
    const orderOptions = LEVERAGE_ORDER_OPTIONS;
    const onOrderOptionChange = (option) => {
        setOrderOption(option);
    };
    let [orderOption, setOrderOption] = useLocalStorageSerializeKey([chainId, "Order-option"], MARKET);

    const ORDER_OPTION_LABELS = { [STOP]: t`Trigger`, [MARKET]: t`Market`, [LIMIT]: t`Limit` };

    return (
        <div className="Exchange-swap-box" style={{display: 'flex'}}>
            <div className='cppanel-container'>
                <div className='cppanel-logo'>
                    <div className='cppanel-logo-txt'>
                        {cptype === 'long' && 'Long Call'}
                        {cptype === 'short' && 'Short Put'}
                    </div>
                    <div className='cppanel-logo-close'>
                        <Dropdown
                            options={orderOptions}
                            optionLabels={ORDER_OPTION_LABELS}
                            option={orderOption}
                            onChange={onOrderOptionChange}
                        />
                        <div className='cppanel-logo-close-icon' onClick={() => setCpType('none')}>
                            <IoIosClose fontSize={'lg'} />
                        </div>
                    </div>
                </div>
                <div className='cppanel-logo'>
                    <div className='flex'>
                        <img className={cptype === 'long' ? 'crypto-logo' : 'crypto-logo-short'} src={eth} alt="" />    
                        <div className='pl-1rem'>
                            <div>
                                ETH $3750 Call
                            </div>
                            <div>
                                {cptype === 'long' && <span className='long-text'>Long</span>}
                                {cptype === 'short' && <span className='short-text'>Short</span>}
                                &nbsp; Jun 7 Exp
                            </div>
                        </div>
                    </div>
                    <div className='cppanel-logo'>
                        <div>
                            $496
                        </div>
                        <IoIosClose className='cppanel-logo-close-icon-1' />
                    </div>
                </div>
                <div className='cppanel-logo-icon'>
                    <div className='flex'>
                        <FiPlus className='crypto-logo-icon' />
                        <div className='pl-1rem'>
                            <div>
                                Select Option
                            </div>
                            <div className='cppanel-text-gray'>
                                Select from board
                            </div>
                        </div>
                    </div>
                    <div className='cppanel-logo'>
                        <IoIosClose className='cppanel-logo-close-icon-1' />
                    </div>
                </div>
                <div className='cppanel-divider'></div>
                <div className='cppanel-logo-icon'>
                    <div>
                        <div>
                            Size
                        </div>
                        <div className='cppanel-text-gray'>
                            Contracts
                        </div>
                    </div>
                    <div className='cppanel-input'>
                        <input placeholder='1.00'/>
                    </div>
                </div>
                <div className='cppanel-logo-icon'>
                    <div>
                        <div>
                            Limit Price
                        </div>
                        <div className='cppanel-text-gray'>
                            Bid $496 - Ask $512
                        </div>
                    </div>
                    <div className='cppanel-input'>
                        <input placeholder='$512'/>
                    </div>
                </div>
                <div className='cppanel-logo-icon-1'>
                    <div className='cppanel-text-gray-1'>
                        Time in Force
                    </div>
                    <div className='cppanel-logo'>
                        <Dropdown
                            options={['GOOD']}
                            optionLabels={['GOOD']}
                            option={'GOOD'}
                            // onChange={onOrderOptionChange}
                        />
                        <IoIosClose className='cppanel-logo-close-icon' />
                    </div>
                </div>
                <div className='cppanel-logo-icon'>
                    <div className='cppanel-text-gray'>
                        Expires
                    </div>
                    <div className='cppanel-input'>
                        <input placeholder='28 days'/>
                    </div>
                </div>
                <div className='cppanel-divider'></div>
                <div className='cppanel-logo-icon'>
                    <div className='cppanel-text-gray'>
                        Expires
                    </div>
                    <div>$493</div>
                </div>
                <div className='cppanel-logo-icon'>
                    <div className='cppanel-text-gray'>
                        Fees
                    </div>
                    <div>$42,83</div>
                </div>
                <div className='cppanel-logo-icon'>
                    <div className='cppanel-text-gray'>
                        Mark Price
                    </div>
                    <div>$512</div>
                </div>
                <div className='cppanel-logo-icon'>
                    <div className='cppanel-text-gray'>
                        Margin Requrired
                    </div>
                    <div>-</div>
                </div>
                <div className='cppanel-logo-icon'>
                    <div className='cppanel-text-gray'>
                        Points [?]
                    </div>
                    <div className='cppanel-text-green'>
                        ~ 15,200
                    </div>
                </div>
                <div className='cppanel-logo-icon'>
                    <div className='cppanel-logo-btn'>
                        {cptype === 'long' && 'Long Call'}
                        {cptype === 'short' && 'Short Put'}
                    </div>
                </div>
                <div className='cppanel-divider'></div>
                <div className='cppanel-logo-icon-2'>
                    <div className='cppanel-text-gray'>
                        Buying Power
                    </div>
                    <div>$0.00</div>
                </div>
                <div className='cppanel-divider'></div>
                <div className={"cppanel-tabs"}>
                    <div className={cx("cppanel-tab", {active: options === 'payoff'})} onClick={() => setOptions('payoff')}>Payoff</div>
                    <div className={cx("cppanel-tab", {active: options === 'book'})} onClick={() => setOptions('book')}>Book</div>
                    <div className={cx("cppanel-tab", {active: options === 'trades'})} onClick={() => setOptions('trades')}>Trades</div>
                </div>
                {options === 'payoff' && <div className='cppanel-logo-icon'>
                    <div className='cppanel-text-gray'>
                        Expected Profit/Loss
                    </div>
                    <div className='cppanel-text-green'>
                        + $62.14
                    </div>
                </div>}
                {options === 'payoff' && <ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                        data={data.map(item => {return {...item, "Eth Price": item['Eth Price'] - 3650}})}
                        
                    >
                        <Tooltip />
                        <defs>
                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset={off} stopColor="#3FC11E" stopOpacity={1} />
                                <stop offset={off} stopColor="#EB2C2C" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="Eth Price" stroke="#000" fill="url(#splitColor)" />
                    </AreaChart>
                </ResponsiveContainer>}
                {options === 'payoff' && <div className='cppanel-logo-icon'>
                    <div className='cppanel-text-gray'>
                        Max Profit
                    </div>
                    <div>Infinite</div>
                </div>}
                {options === 'payoff' && <div className='cppanel-logo-icon'>
                    <div className='cppanel-text-gray'>
                        Breakeven
                    </div>
                    <div>$3750</div>
                </div>}
                {options === 'payoff' && <div className='cppanel-logo-icon'>
                    <div className='cppanel-text-gray'>
                        Max Loss
                    </div>
                    <div>$452</div>
                </div>}
                {options !== 'payoff' && <div className='pt-2rem'>
                    <div className='book-table'>
                        <div className='cppanel-text-gray'>
                            Price
                        </div>
                        <div className='cppanel-text-gray'>
                            Size(ETH)
                        </div>
                        <div className='cppanel-text-gray'>
                            Cumulative(ETH)
                        </div>
                    </div>
                </div>}
                {options !== 'payoff' && <div>
                    <div className='book-table row'>
                        <div>
                            $489
                        </div>
                        <div>
                            30
                        </div>
                        <div>
                            30
                        </div>
                    </div>
                    <div className='book-table row'>
                        <div>
                            $489
                        </div>
                        <div>
                            30
                        </div>
                        <div>
                            30
                        </div>
                    </div>
                    <div className='book-table row'>
                        <div>
                            $489
                        </div>
                        <div>
                            30
                        </div>
                        <div>
                            30
                        </div>
                    </div>
                    <div className='book-table-divider'>
                        <div></div>
                        <div className='book-table-divider-price'>
                            $487.82
                        </div>
                    </div>
                    <div className='book-table row'>
                        <div>
                            $489
                        </div>
                        <div>
                            30
                        </div>
                        <div>
                            30
                        </div>
                    </div>
                    <div className='book-table row'>
                        <div>
                            $489
                        </div>
                        <div>
                            30
                        </div>
                        <div>
                            30
                        </div>
                    </div>
                    <div className='book-table row'>
                        <div>
                            $489
                        </div>
                        <div>
                            30
                        </div>
                        <div>
                            30
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}
