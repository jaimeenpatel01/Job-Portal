import React from 'react'
import Navbar from './shared/Navbar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowLeft, Briefcase, MapPin, Calendar, Building2, FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

const MyApplications = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return <CheckCircle className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            case 'pending':
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getCompanyInitials = (companyName) => {
        if (!companyName) return "CO";
        return companyName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Navbar />
            
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 opacity-10"></div>
                <div className="relative max-w-6xl mx-auto px-4 py-12">
                    <div className="flex items-center gap-4 mb-8">
                        <Button 
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
                            <p className="text-lg text-gray-600">Track your job application status and history</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 pb-12">
                {allAppliedJobs && allAppliedJobs.length > 0 ? (
                    <div className="space-y-6">
                        {allAppliedJobs.map((application) => (
                            <div key={application._id} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Company Avatar */}
                                        <Avatar className="h-16 w-16 border-2 border-gray-200">
                                            <AvatarImage 
                                                src={application.job?.company?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(application.job?.company?.name || 'Company')}&background=3B82F6&color=ffffff&size=200`} 
                                                alt={`${application.job?.company?.name} logo`} 
                                            />
                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">
                                                {getCompanyInitials(application.job?.company?.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Job Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                        {application.job?.title || 'Job Title'}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-gray-600 mb-2">
                                                        <div className="flex items-center gap-1">
                                                            <Building2 className="h-4 w-4" />
                                                            <span className="text-sm">{application.job?.company?.name || 'Company Name'}</span>
                                                        </div>
                                                        {application.job?.location && (
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-4 w-4" />
                                                                <span className="text-sm">{application.job.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Status Badge */}
                                                <Badge className={`px-3 py-1 text-sm font-medium border ${getStatusColor(application.status)}`}>
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(application.status)}
                                                        {application.status || 'Pending'}
                                                    </div>
                                                </Badge>
                                            </div>

                                            {/* Job Description */}
                                            {application.job?.description && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {application.job.description}
                                                </p>
                                            )}

                                            {/* Application Details */}
                                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Applied on {formatDate(application.createdAt)}</span>
                                                </div>
                                                {application.job?.jobType && (
                                                    <div className="flex items-center gap-1">
                                                        <Briefcase className="h-4 w-4" />
                                                        <span>{application.job.jobType}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="ml-4">
                                        <Button 
                                            onClick={() => navigate(`/job/${application.job?._id}`)}
                                            variant="outline"
                                            className="flex items-center gap-2"
                                        >
                                            <FileText className="h-4 w-4" />
                                            View Job
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <Briefcase className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            You haven't applied to any jobs yet. Start exploring opportunities and apply to jobs that match your skills.
                        </p>
                        <Button 
                            onClick={() => navigate('/browse')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                            Browse Jobs
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyApplications
