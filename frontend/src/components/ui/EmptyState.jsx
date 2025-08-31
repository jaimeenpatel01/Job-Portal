import React from 'react';
import { Button } from './button';

const EmptyState = ({ 
    icon: Icon, 
    title, 
    description, 
    actionText, 
    onAction, 
    className = "" 
}) => {
    return (
        <div className={`text-center py-16 ${className}`}>
            <div className='w-24 h-24 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6'>
                {Icon && <Icon className="w-12 h-12 text-purple-500" />}
            </div>
            <h3 className='text-2xl font-semibold text-gray-900 mb-3'>{title}</h3>
            <p className='text-gray-600 text-lg max-w-md mx-auto mb-8'>{description}</p>
            {actionText && onAction && (
                <Button 
                    onClick={onAction}
                    className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                >
                    {actionText}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
