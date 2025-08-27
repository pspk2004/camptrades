import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_COIN_HISTORY } from '../constants';
import { useTheme } from '../hooks/useTheme';

const CoinChart: React.FC = () => {
    const { theme } = useTheme();
    const currentCoinValue = MOCK_COIN_HISTORY[MOCK_COIN_HISTORY.length - 1].value;
    const initialCoinValue = MOCK_COIN_HISTORY[0].value;
    const percentageChange = ((currentCoinValue - initialCoinValue) / initialCoinValue) * 100;

    const strokeColor = 'hsl(222.2 47.4% 11.2%)'; // primary
    const gridColor = theme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)';
    const textColor = theme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)';
    
    return (
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">CampusCoin (CCT) Value</h3>
                    <p className="text-3xl font-bold text-foreground">₹{currentCoinValue.toFixed(2)}</p>
                </div>
                <div className={`text-sm font-semibold flex items-center mt-2 sm:mt-0 px-2 py-1 rounded-full ${percentageChange >= 0 ? 'text-green-600 bg-green-500/10' : 'text-red-600 bg-red-500/10'}`}>
                    {percentageChange >= 0 ? '▲' : '▼'} {Math.abs(percentageChange).toFixed(2)}%
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer>
                    <AreaChart
                        data={MOCK_COIN_HISTORY}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="date" stroke={textColor} tick={{ fontSize: 12, fontFamily: 'Inter' }} />
                        <YAxis stroke={textColor} tick={{ fontSize: 12, fontFamily: 'Inter' }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                        <Tooltip
                             contentStyle={{
                                backgroundColor: theme === 'dark' ? 'hsl(222.2 84% 4.9%)' : '#ffffff',
                                borderColor: gridColor,
                                fontFamily: 'Inter'
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