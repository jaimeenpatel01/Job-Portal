import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4'>
            <div className='max-w-6xl mx-auto text-center'>
                <div className='flex flex-col gap-6'>
                    <div className='inline-flex items-center gap-2 mx-auto px-6 py-3 rounded-full bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200'>
                        <div className='w-2 h-2 bg-orange-500 rounded-full animate-pulse'></div>
                        <span className='text-orange-700 font-semibold text-sm'>No. 1 Job Hunt Website</span>
                    </div>
                    
                    <div className='space-y-4'>
                        <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold leading-tight'>
                            Search, Apply & <br /> 
                            Get Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600'>Dream Jobs</span>
                        </h1>
                        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                            Unlock your career potential with jobs that match your skills and dreams. 
                            Join thousands of professionals who found their perfect match.
                        </p>
                    </div>
                    
                    <div className='flex w-full max-w-2xl shadow-xl border border-gray-200 pl-6 rounded-full items-center gap-4 mx-auto bg-white'>
                        <input
                            type="text"
                            placeholder='Find your dream jobs...'
                            onChange={(e) => setQuery(e.target.value)}
                            className='outline-none border-none w-full py-4 text-lg placeholder-gray-400'
                            onKeyPress={(e) => e.key === 'Enter' && searchJobHandler()}
                        />
                        <Button 
                            onClick={searchJobHandler} 
                            className="rounded-r-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 px-8 transition-all duration-300 transform hover:scale-105"
                        >
                            <Search className='h-6 w-6 mr-2' />
                            Search
                        </Button>
                    </div>
                    
                    <div className='flex items-center justify-center gap-6 text-sm text-gray-500 mt-6'>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                            <span>10,000+ Jobs Available</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                            <span>5,000+ Companies</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                            <span>98% Success Rate</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection