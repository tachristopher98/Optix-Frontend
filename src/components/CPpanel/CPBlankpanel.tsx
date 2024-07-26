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

export default function CPBlankpanel() {
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
        <div className="Exchange-swap-box">
            <div className='cppanel-container'>
                <div className='cppanel-blank'>
                    <div className='cppanel-blank-logo'>
                        Select an option
                    </div>
                    <div className='cppanel-blank-icon'>
                        <FiPlus strokeWidth={0.5}/>
                    </div>
                </div>
                <div className='cppanel-divider'></div>
                <div className='cppanel-logo-icon-2'>
                    <div className='cppanel-text-gray'>
                        Buying Power
                    </div>
                    <div>$0.00</div>
                </div>
            </div>
        </div>
    )
}
