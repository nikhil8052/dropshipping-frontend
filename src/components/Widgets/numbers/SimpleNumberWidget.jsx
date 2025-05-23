import React from 'react';

const SimpleNumberWidget = ({ title, data, bgColor = 'bg-white', textColor = 'text-black' }) => {
    return (
        <div className={`h-full flex flex-col rounded-xl ${bgColor}`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-2`}>{title}</h3>
            <div className="flex-1 flex flex-col justify-center">
                <div className="text-3xl font-bold text-center mb-2">
                    {data?.count ?? 0}
                </div>
                <div className="text-sm text-center opacity-75">
                    {data?.label ?? 'Total Items'}
                </div>
            </div>
        </div>
    );
};

export default SimpleNumberWidget;
