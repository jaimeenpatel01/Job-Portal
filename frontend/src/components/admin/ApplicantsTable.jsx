import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, User, Mail, Phone, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { updateApplicationStatus } from '@/redux/applicationSlice';
import axios from 'axios';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import ResumeViewer from './ResumeViewer';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();
    const [resumeViewerOpen, setResumeViewerOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                // Update the status in Redux store for real-time update
                dispatch(updateApplicationStatus({ applicationId: id, status }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    }

    const getApplicantInitials = (fullName) => {
        if (!fullName) return "U";
        return fullName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'Rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    }

    const handleViewResume = (resumeUrl, resumeName, applicantName) => {
        setSelectedResume({
            url: resumeUrl,
            name: resumeName,
            applicantName: applicantName
        });
        setResumeViewerOpen(true);
    }

    return (
        <div className="overflow-hidden">
            <Table>
                <TableCaption className="py-4 text-gray-600">
                    {!applicants || applicants?.applications?.length === 0 ? (
                        <div className="text-center py-8">
                            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No applicants found for this position</p>
                        </div>
                    ) : (
                        `Showing ${applicants?.applications?.length || 0} applicants`
                    )}
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Applicant</TableHead>
                        <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                        <TableHead className="font-semibold text-gray-700">Resume</TableHead>
                        <TableHead className="font-semibold text-gray-700">Applied</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants && applicants?.applications?.map((item) => (
                        <TableRow key={item._id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 ring-2 ring-purple-100">
                                        <AvatarImage src={item?.applicant?.profile?.profilePhoto} />
                                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold">
                                            {getApplicantInitials(item?.applicant?.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-gray-900">{item?.applicant?.fullname}</div>
                                        <div className="text-sm text-gray-500">ID: {item?.applicant?._id?.slice(-6)}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-3 h-3" />
                                        {item?.applicant?.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-3 h-3" />
                                        {item?.applicant?.phoneNumber || "N/A"}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {item.applicant?.profile?.resume ? (
                                    <button
                                        onClick={() => handleViewResume(
                                            item?.applicant?.profile?.resume,
                                            item?.applicant?.profile?.resumeOriginalName,
                                            item?.applicant?.fullname
                                        )}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors"
                                    >
                                        <FileText className="w-4 h-4" />
                                        {item?.applicant?.profile?.resumeOriginalName}
                                    </button>
                                ) : (
                                    <span className="text-gray-400 text-sm">No resume</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(item?.createdAt)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge className={getStatusColor(item?.status)}>
                                    {item?.status.toUpperCase() || "Pending"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <MoreHorizontal className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-2" align="end">
                                        <div className="space-y-1">
                                            {shortlistingStatus.map((status, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => statusHandler(status, item?._id)}
                                                    className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                                                        status === 'Accepted' 
                                                            ? 'text-green-700 hover:bg-green-50' 
                                                            : 'text-red-700 hover:bg-red-50'
                                                    }`}
                                                >
                                                    {status === 'Accepted' ? (
                                                        <CheckCircle className="w-4 h-4" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4" />
                                                    )}
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {/* Resume Viewer Modal */}
            {selectedResume && (
                <ResumeViewer
                    resumeUrl={selectedResume.url}
                    resumeName={selectedResume.name}
                    applicantName={selectedResume.applicantName}
                    open={resumeViewerOpen}
                    setOpen={setResumeViewerOpen}
                />
            )}
        </div>
    )
}

export default ApplicantsTable