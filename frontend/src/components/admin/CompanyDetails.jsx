import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Building2, Globe, MapPin, FileText, Calendar, Edit2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'

const CompanyDetails = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const { singleCompany } = useSelector(store => store.company);
    const navigate = useNavigate();

    const getCompanyInitials = (companyName) => {
        if (!companyName) return "CO";
        return companyName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button 
                                variant="outline" 
                                onClick={() => navigate("/admin/companies")}
                                className="h-10 w-10 p-0 border-gray-200 hover:border-purple-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Company Details</h1>
                                    <p className="text-gray-600">View company information and details</p>
                                </div>
                            </div>
                        </div>
                        <Button 
                            onClick={() => navigate(`/admin/companies/${params.id}`)}
                            className="h-10 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Company
                        </Button>
                    </div>
                </div>

                {/* Company Information Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {/* Company Header */}
                    <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                        <Avatar className="w-20 h-20 ring-4 ring-purple-100">
                            <AvatarImage src={singleCompany.logo} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-2xl font-bold">
                                {getCompanyInitials(singleCompany.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{singleCompany.name || 'Company Name'}</h2>
                            <p className="text-gray-600 mb-1">Company ID: {singleCompany._id?.slice(-6) || 'N/A'}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Created on {formatDate(singleCompany.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Company Name</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-gray-900 font-medium">{singleCompany.name || 'Not provided'}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Location</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <p className="text-gray-900">{singleCompany.location || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Description</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[60px]">
                                        <p className="text-gray-900">{singleCompany.description || 'No description provided'}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Website</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-gray-400" />
                                            {singleCompany.website ? (
                                                <a 
                                                    href={singleCompany.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {singleCompany.website}
                                                </a>
                                            ) : (
                                                <p className="text-gray-500">Not provided</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Statistics */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Company Statistics</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                                    <div className="text-sm text-gray-600">Active Jobs</div>
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-1">0</div>
                                    <div className="text-sm text-gray-600">Total Applications</div>
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600 mb-1">Active</div>
                                    <div className="text-sm text-gray-600">Status</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetails
