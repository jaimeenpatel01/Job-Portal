import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, Briefcase, Plus, ArrowLeft, Building2, MapPin, DollarSign, Users, Calendar, FileText } from 'lucide-react'
import { 
    JOB_TYPE_VALUES, 
    LOCATION_VALUES, 
    EXPERIENCE_LEVEL_VALUES 
} from '@/utils/constants'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experienceLevel: 0,
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (field, value) => {
        if (field === 'company') {
            const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
            setInput({ ...input, companyId: selectedCompany._id });
        } else {
            setInput({ ...input, [field]: value });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Convert requirements string to array
            const requirementsArray = input.requirements.split(',').map(req => req.trim()).filter(req => req);
            
            const jobData = {
                ...input,
                requirements: requirementsArray,
                salary: parseInt(input.salary),
                experienceLevel: parseInt(input.experienceLevel),
                position: parseInt(input.position)
            };
            
            const res = await axios.post(`${JOB_API_END_POINT}/post`, jobData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button 
                            variant="outline" 
                            onClick={() => navigate("/admin/jobs")}
                            className="h-10 w-10 p-0 border-gray-200 hover:border-purple-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
                                <p className="text-gray-600">Create a new job listing for your company</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={submitHandler} className="space-y-8">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase className="w-5 h-5 text-purple-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                        Job Title *
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={input.title}
                                        onChange={changeEventHandler}
                                        placeholder="e.g., Senior Frontend Developer"
                                        className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                                        Company *
                                    </Label>
                                    {companies.length > 0 ? (
                                        <Select onValueChange={(value) => selectChangeHandler('company', value)}>
                                            <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                                <SelectValue placeholder="Select a company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {companies.map((company) => (
                                                        <SelectItem key={company._id} value={company?.name?.toLowerCase()}>
                                                            {company.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="h-12 border border-red-200 bg-red-50 rounded-xl flex items-center px-3 text-red-600 text-sm">
                                            No companies registered. Please create a company first.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Job Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-purple-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                        Job Description *
                                    </Label>
                                    <Input
                                        id="description"
                                        type="text"
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        placeholder="Brief description of the role"
                                        className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="requirements" className="text-sm font-medium text-gray-700">
                                        Requirements * (comma-separated)
                                    </Label>
                                    <Input
                                        id="requirements"
                                        type="text"
                                        name="requirements"
                                        value={input.requirements}
                                        onChange={changeEventHandler}
                                        placeholder="React, JavaScript, Node.js, MongoDB"
                                        className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Job Specifications */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-purple-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Job Specifications</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                                        Location *
                                    </Label>
                                    <Select onValueChange={(value) => selectChangeHandler('location', value)}>
                                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                            <SelectValue placeholder="Select location" />
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
                                
                                <div className="space-y-2">
                                    <Label htmlFor="jobType" className="text-sm font-medium text-gray-700">
                                        Job Type *
                                    </Label>
                                    <Select onValueChange={(value) => selectChangeHandler('jobType', value)}>
                                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                            <SelectValue placeholder="Select job type" />
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
                                
                                <div className="space-y-2">
                                    <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700">
                                        Experience Level *
                                    </Label>
                                    <Select onValueChange={(value) => selectChangeHandler('experienceLevel', value)}>
                                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                                            <SelectValue placeholder="Select experience level" />
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
                                
                                <div className="space-y-2">
                                    <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
                                        Salary (LPA) *
                                    </Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="salary"
                                            type="number"
                                            name="salary"
                                            value={input.salary}
                                            onChange={changeEventHandler}
                                            placeholder="e.g., 15"
                                            className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                                        Number of Positions *
                                    </Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="position"
                                            type="number"
                                            name="position"
                                            value={input.position}
                                            onChange={changeEventHandler}
                                            placeholder="e.g., 2"
                                            className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-100">
                            <Button 
                                type="submit" 
                                disabled={loading || companies.length === 0}
                                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Posting Job...
                                    </>
                                ) : (
                                    'Post New Job'
                                )}
                            </Button>
                            
                            {companies.length === 0 && (
                                <p className="text-sm text-red-600 text-center mt-3">
                                    * Please register a company first before posting jobs
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostJob