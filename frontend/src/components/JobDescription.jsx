import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { 
    ArrowLeft, 
    Briefcase, 
    MapPin, 
    DollarSign, 
    Clock, 
    Users, 
    Calendar, 
    Building2, 
    FileText, 
    CheckCircle,
    Loader2
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { getExperienceLevelLabel } from '@/utils/constants';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const navigate = useNavigate();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to apply for job");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    const getCompanyInitials = (companyName) => {
        if (!companyName) return "CO";
        return companyName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }

    if (!singleJob) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading job details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button 
                            variant="outline" 
                            onClick={() => navigate(-1)}
                            className="h-10 w-10 p-0 border-gray-200 hover:border-purple-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Job Details</h1>
                                <p className="text-gray-600">View and apply for this position</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job Details Card */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Header Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{singleJob?.title}</h1>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Building2 className="w-4 h-4" />
                                            <span className="font-medium">{singleJob?.company?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{singleJob?.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                                            <Users className="w-3 h-3 mr-1" />
                                            {singleJob?.position} Positions
                                        </Badge>
                                        <Badge className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {singleJob?.jobType}
                                        </Badge>
                                        <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
                                            <DollarSign className="w-3 h-3 mr-1" />
                                            {singleJob?.salary} LPA
                                        </Badge>
                                        {singleJob?.experienceLevel !== undefined && (
                                            <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                                                <Users className="w-3 h-3 mr-1" />
                                                {getExperienceLevelLabel(singleJob.experienceLevel)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <Avatar className="w-16 h-16 ring-2 ring-purple-100">
                                        <AvatarImage src={singleJob?.company?.logo} />
                                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold">
                                            {getCompanyInitials(singleJob?.company?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        onClick={isApplied ? null : applyJobHandler}
                                        disabled={isApplied || loading}
                                        className={`h-12 px-6 rounded-xl font-semibold transition-all duration-300 ${
                                            isApplied 
                                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Applying...
                                            </>
                                        ) : isApplied ? (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Already Applied
                                            </>
                                        ) : (
                                            'Apply Now'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Job Description Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <FileText className="w-5 h-5 text-purple-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
                            </div>
                            <div className="space-y-4 text-gray-700">
                                <p className="leading-relaxed">{singleJob?.description}</p>
                            </div>
                        </div>

                        {/* Requirements Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <FileText className="w-5 h-5 text-purple-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
                            </div>
                            <div className="space-y-3">
                                {singleJob?.requirements?.map((requirement, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-gray-700">{requirement}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Company Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar className="w-12 h-12 ring-2 ring-purple-100">
                                    <AvatarImage src={singleJob?.company?.logo} />
                                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold">
                                        {getCompanyInitials(singleJob?.company?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{singleJob?.company?.name}</h3>
                                    <p className="text-sm text-gray-500">{singleJob?.company?.location}</p>
                                </div>
                            </div>
                            {singleJob?.company?.description && (
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {singleJob.company.description}
                                </p>
                            )}
                        </div>

                        {/* Job Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Job Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Posted</span>
                                    <span className="font-medium">{formatDate(singleJob?.createdAt)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Job Type</span>
                                    <span className="font-medium">{singleJob?.jobType}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Location</span>
                                    <span className="font-medium">{singleJob?.location}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Salary</span>
                                    <span className="font-medium">{singleJob?.salary} LPA</span>
                                </div>
                                {singleJob?.experienceLevel !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Experience</span>
                                        <span className="font-medium">{getExperienceLevelLabel(singleJob.experienceLevel)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Positions</span>
                                    <span className="font-medium">{singleJob?.position}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription