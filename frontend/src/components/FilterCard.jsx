import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Filter, MapPin, Building2, DollarSign, Clock, Users, ChevronDown } from 'lucide-react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
    JOB_TYPE_VALUES, 
    LOCATION_VALUES, 
    SALARY_RANGE_VALUES, 
    EXPERIENCE_LEVEL_VALUES,
    INDUSTRY_VALUES,
    compareStrings
} from '@/utils/constants'

const filterData = [
    {
        filterType: "Location",
        array: LOCATION_VALUES,
        icon: MapPin
    },
    {
        filterType: "Job Type",
        array: JOB_TYPE_VALUES,
        icon: Clock
    },
    {
        filterType: "Experience Level",
        array: EXPERIENCE_LEVEL_VALUES,
        icon: Users
    },
    {
        filterType: "Salary Range",
        array: SALARY_RANGE_VALUES,
        icon: DollarSign
    },
    {
        filterType: "Industry",
        array: INDUSTRY_VALUES,
        icon: Building2
    }
]

const FilterCard = () => {
    const [selectedFilters, setSelectedFilters] = useState({});
    const [expandedFilters, setExpandedFilters] = useState({});
    const dispatch = useDispatch();

    const changeHandler = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    }

    const clearFilter = (filterType) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[filterType];
            return newFilters;
        });
    }

    const clearAllFilters = () => {
        setSelectedFilters({});
        setExpandedFilters({});
    }

    const toggleFilterExpansion = (filterType) => {
        setExpandedFilters(prev => ({
            ...prev,
            [filterType]: !prev[filterType]
        }));
    }

    useEffect(() => {
        // Convert selected filters to a search query string
        const filterString = Object.entries(selectedFilters)
            .map(([type, value]) => {
                // Handle different value types
                if (type === "Experience Level") {
                    const level = filterData.find(f => f.filterType === type)?.array.find(item => item.value === value);
                    return `${type}: ${level?.label || value}`;
                }
                if (type === "Salary Range") {
                    const range = filterData.find(f => f.filterType === type)?.array.find(item => item.value === value);
                    return `${type}: ${range?.label || value}`;
                }
                return `${type}: ${value}`;
            })
            .join(', ');
        
        dispatch(setSearchedQuery(filterString));
    }, [selectedFilters, dispatch]);

    const hasActiveFilters = Object.keys(selectedFilters).length > 0;

    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24'>
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
                    <Filter className='w-5 h-5 text-white' />
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-xl text-gray-900'>Filter Jobs</h1>
                    <p className='text-sm text-gray-500'>Find your perfect match</p>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-8 px-3 text-xs border-gray-200 hover:border-red-300 hover:text-red-600"
                    >
                        Clear All
                    </Button>
                )}
            </div>
            
            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className='mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100'>
                    <h3 className='text-sm font-medium text-purple-900 mb-2'>Active Filters:</h3>
                    <div className='flex flex-wrap gap-2'>
                        {Object.entries(selectedFilters).map(([filterType, value]) => {
                            let displayValue = value;
                            if (filterType === "Experience Level") {
                                const level = filterData.find(f => f.filterType === filterType)?.array.find(item => item.value === value);
                                displayValue = level?.label || value;
                            }
                            if (filterType === "Salary Range") {
                                const range = filterData.find(f => f.filterType === filterType)?.array.find(item => item.value === value);
                                displayValue = range?.label || value;
                            }
                            
                            return (
                                <div
                                    key={filterType}
                                    className='flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-purple-200 text-xs text-purple-700'
                                >
                                    <span className='font-medium'>{filterType}:</span>
                                    <span>{displayValue}</span>
                                    <button
                                        onClick={() => clearFilter(filterType)}
                                        className='ml-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors'
                                    >
                                        Clear
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            <div className='space-y-4'>
                {filterData.map((data, index) => {
                    const IconComponent = data.icon;
                    const isActive = selectedFilters[data.filterType];
                    const isExpanded = expandedFilters[data.filterType];
                    
                    return (
                        <div key={data.filterType} className='border border-gray-100 rounded-lg overflow-hidden'>
                            <button
                                onClick={() => toggleFilterExpansion(data.filterType)}
                                className='w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors'
                            >
                                <div className='flex items-center gap-3'>
                                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                                    <div className='text-left'>
                                        <h2 className={`font-semibold ${isActive ? 'text-purple-900' : 'text-gray-900'}`}>
                                            {data.filterType}
                                        </h2>
                                        {isActive && (
                                            <p className='text-sm text-purple-600 font-medium'>
                                                {(() => {
                                                    if (data.filterType === "Experience Level") {
                                                        const level = data.array.find(item => item.value === isActive);
                                                        return level?.label || isActive;
                                                    }
                                                    if (data.filterType === "Salary Range") {
                                                        const range = data.array.find(item => item.value === isActive);
                                                        return range?.label || isActive;
                                                    }
                                                    return isActive;
                                                })()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    {isActive && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                clearFilter(data.filterType);
                                            }}
                                            className='text-xs text-purple-600 hover:text-purple-700 px-2 py-1 rounded hover:bg-purple-100'
                                        >
                                            Clear
                                        </button>
                                    )}
                                    <ChevronDown 
                                        className={`w-4 h-4 text-gray-400 transition-transform ${
                                            isExpanded ? 'rotate-180' : ''
                                        }`} 
                                    />
                                </div>
                            </button>
                            
                            {isExpanded && (
                                <div className='border-t border-gray-100 bg-gray-50 p-4'>
                                    <RadioGroup 
                                        value={selectedFilters[data.filterType] || ''} 
                                        onValueChange={(value) => changeHandler(data.filterType, value)}
                                        className='space-y-3'
                                    >
                                        {data.array.map((item, idx) => {
                                            const itemId = `${data.filterType}-${idx}`;
                                            const itemValue = typeof item === 'object' ? item.value : item;
                                            const itemLabel = typeof item === 'object' ? item.label : item;
                                            
                                            return (
                                                <div key={itemId} className='flex items-center space-x-3'>
                                                    <RadioGroupItem 
                                                        value={itemValue} 
                                                        id={itemId}
                                                    />
                                                    <Label 
                                                        htmlFor={itemId} 
                                                        className='cursor-pointer select-none text-gray-700 hover:text-gray-900 transition-colors text-sm flex-1'
                                                    >
                                                        {itemLabel}
                                                    </Label>
                                                </div>
                                            )
                                        })}
                                    </RadioGroup>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            
            {/* Filter Summary */}
            {hasActiveFilters && (
                <div className='mt-6 pt-4 border-t border-gray-100'>
                    <div className='text-center'>
                        <span className='text-sm text-gray-600'>
                            {Object.keys(selectedFilters).length} filter{Object.keys(selectedFilters).length !== 1 ? 's' : ''} applied
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FilterCard