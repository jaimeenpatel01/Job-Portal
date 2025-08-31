import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
    const navigate = useNavigate();
   
    return (
        <div className='max-w-7xl mx-auto py-16 px-4'>
            <div className='text-center mb-12'>
                <h2 className='text-4xl md:text-5xl font-bold mb-4'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600'>Latest & Top </span> 
                    Job Openings
                </h2>
                <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                    Discover the most recent opportunities from top companies and startups
                </p>
            </div>
            
            {allJobs.length <= 0 ? (
                <div className='text-center py-16'>
                    <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className='text-xl font-semibold text-gray-700 mb-2'>No Jobs Available</h3>
                    <p className='text-gray-500'>Check back later for new opportunities</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {allJobs?.slice(0, 6).map((job) => (
                        <LatestJobCards key={job._id} job={job} />
                    ))}
                </div>
            )}
            
                            <div className='text-center mt-10'>
                <button 
                    onClick={() => navigate('/browse')}
                    className='inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
                >
                    View All Jobs
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default LatestJobs