import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_COIN_HISTORY } from '../constants';
import { useTheme } from '../hooks/useTheme';

const CoinChart: React.FC = () => {
    const { theme } = useTheme();
    const currentCoinValue = MOCK_COIN_HISTORY[MOCK_COIN_HISTORY.length - 1].value;
    const initialCoinValue = MOCK_COIN_HISTORY[0].value;
    const percentageChange = ((currentCoinValue - initialCoinValue) / initialCoinValue) * 100;

    const strokeColor = theme === 'dark' ? '#60a5fa' : '#3b82f6';
    const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';
    const textColor = theme === 'dark' ? '#d1d5db' : '#4b5563';
    
    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">CampusCoin (CCT) Value</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{currentCoinValue.toFixed(2)}</p>
                </div>
                <div className={`text-sm font-semibold flex items-center mt-2 sm:mt-0 px-2 py-1 rounded-full ${percentageChange >= 0 ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50' : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50'}`}>
                    {percentageChange >= 0 ? '▲' : '▼'} {Math.abs(percentageChange).toFixed(2)}%
                </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart
                        data={MOCK_COIN_HISTORY}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="date" stroke={textColor} tick={{ fontSize: 12 }} />
                        <YAxis stroke={textColor} tick={{ fontSize: 12 }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                        <Tooltip
                             contentStyle={{
                                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb'
                             }}
                        />
                        <Area type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CoinChart;
