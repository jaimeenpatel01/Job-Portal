import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search, Filter, MapPin, Building2, DollarSign, ChevronDown, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
    JOB_TYPE_VALUES, 
    LOCATION_VALUES, 
    SALARY_RANGE_VALUES, 
    EXPERIENCE_LEVEL_VALUES,
    compareStrings
} from '@/utils/constants';

const Browse = () => {
    useGetAllJobs();
    const {allJobs, searchedQuery} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({
        jobType: '',
        location: '',
        salary: '',
        experienceLevel: ''
    });

    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])

    useEffect(() => {
        let filtered = allJobs;
        
        // Apply search filter (case-insensitive)
        if (searchTerm) {
            filtered = filtered.filter(job => 
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply other filters with case-insensitive comparison
        if (selectedFilters.jobType) {
            filtered = filtered.filter(job => compareStrings(job.jobType, selectedFilters.jobType));
        }
        if (selectedFilters.location) {
            filtered = filtered.filter(job => compareStrings(job.location, selectedFilters.location));
        }
        if (selectedFilters.salary) {
            filtered = filtered.filter(job => job.salary >= parseInt(selectedFilters.salary));
        }
        if (selectedFilters.experienceLevel !== '') {
            filtered = filtered.filter(job => job.experienceLevel === parseInt(selectedFilters.experienceLevel));
        }

        setFilteredJobs(filtered);
    }, [allJobs, searchTerm, selectedFilters]);

    const clearFilters = () => {
        setSelectedFilters({
            jobType: '',
            location: '',
            salary: '',
            experienceLevel: ''
        });
        setSearchTerm('');
    };

    const hasActiveFilters = selectedFilters.jobType || selectedFilters.location || selectedFilters.salary || selectedFilters.experienceLevel !== '' || searchTerm;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
            <Navbar />

            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-600/10 via-blue-500/10 to-transparent border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Find Your{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                Dream Job
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Browse thousands of opportunities and land the job that fits you best.
                        </p>
                    </div>

                    {/* Search + Filters Card */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6">
                            {/* Search Bar */}
                            <div className="relative mb-6">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Search for jobs, companies, or keywords..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-14 pr-4 py-4 text-lg rounded-full border-gray-200 focus:ring-2 focus:ring-purple-400"
                                />
                            </div>

                            {/* Advanced Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* Job Type Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        Job Type
                                    </label>
                                    <Select 
                                        value={selectedFilters.jobType} 
                                        onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, jobType: value }))}
                                    >
                                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                            <SelectValue placeholder="All job types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {JOB_TYPE_VALUES.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Location Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </label>
                                    <Select 
                                        value={selectedFilters.location} 
                                        onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, location: value }))}
                                    >
                                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                            <SelectValue placeholder="All locations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {LOCATION_VALUES.map((location) => (
                                                    <SelectItem key={location} value={location}>
                                                        {location}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Salary Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Min Salary
                                    </label>
                                    <Select 
                                        value={selectedFilters.salary} 
                                        onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, salary: value }))}
                                    >
                                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                            <SelectValue placeholder="Any salary" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {SALARY_RANGE_VALUES.map((salary) => (
                                                    <SelectItem key={salary.value} value={salary.value}>
                                                        {salary.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Experience Level Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Experience
                                    </label>
                                    <Select 
                                        value={selectedFilters.experienceLevel} 
                                        onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, experienceLevel: value }))}
                                    >
                                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                            <SelectValue placeholder="Any experience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {EXPERIENCE_LEVEL_VALUES.map((level) => (
                                                    <SelectItem key={level.value} value={level.value}>
                                                        {level.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Active Filters Display */}
                            {hasActiveFilters && (
                                <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                                    <h3 className="text-sm font-medium text-purple-900 mb-3">Active Filters:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {searchTerm && (
                                            <Badge className="bg-white px-3 py-1 rounded-full border border-purple-200 text-purple-700">
                                                Search: "{searchTerm}"
                                                <button
                                                    onClick={() => setSearchTerm('')}
                                                    className="ml-2 hover:text-red-600"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {selectedFilters.jobType && (
                                            <Badge className="bg-white px-3 py-1 rounded-full border border-purple-200 text-purple-700">
                                                Job Type: {selectedFilters.jobType}
                                                <button
                                                    onClick={() => setSelectedFilters(prev => ({ ...prev, jobType: '' }))}
                                                    className="ml-2 hover:text-red-600"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {selectedFilters.location && (
                                            <Badge className="bg-white px-3 py-1 rounded-full border border-purple-200 text-purple-700">
                                                Location: {selectedFilters.location}
                                                <button
                                                    onClick={() => setSelectedFilters(prev => ({ ...prev, location: '' }))}
                                                    className="ml-2 hover:text-red-600"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {selectedFilters.salary && (
                                            <Badge className="bg-white px-3 py-1 rounded-full border border-purple-200 text-purple-700">
                                                Min Salary: {SALARY_RANGE_VALUES.find(s => s.value === parseInt(selectedFilters.salary))?.label}
                                                <button
                                                    onClick={() => setSelectedFilters(prev => ({ ...prev, salary: '' }))}
                                                    className="ml-2 hover:text-red-600"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                        {selectedFilters.experienceLevel !== '' && (
                                            <Badge className="bg-white px-3 py-1 rounded-full border border-purple-200 text-purple-700">
                                                Experience: {EXPERIENCE_LEVEL_VALUES.find(l => l.value === parseInt(selectedFilters.experienceLevel))?.label}
                                                <button
                                                    onClick={() => setSelectedFilters(prev => ({ ...prev, experienceLevel: '' }))}
                                                    className="ml-2 hover:text-red-600"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <div className="text-center">
                                    <Button
                                        onClick={clearFilters}
                                        variant="outline"
                                        className="rounded-full px-6 py-2 text-gray-600 hover:text-gray-800 hover:border-purple-400"
                                    >
                                        Clear All Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8 border-b pb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                        <Badge className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                            {filteredJobs.length} jobs found
                        </Badge>
                    </div>
                    {filteredJobs.length > 0 && (
                        <p className="text-sm text-gray-500">
                            Showing {filteredJobs.length} of {allJobs.length} jobs
                        </p>
                    )}
                </div>

                {filteredJobs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-28 h-28 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-12 h-12 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
                        <Button onClick={clearFilters} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse