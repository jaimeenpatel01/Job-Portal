import React, { useState } from 'react'
import Navbar from './shared/Navbar'
    import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, MapPin, Calendar, Download, Star, Award, Briefcase, User, Phone, FileText, Edit3, Upload, Trash2, MoreVertical, Camera } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import UpdateProfileDialog from './UpdateProfileDialog'
import SkillsEditDialog from './SkillsEditDialog'
import BioEditDialog from './BioEditDialog'
import ResumeEditDialog from './ResumeEditDialog'
import { useSelector, useDispatch } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'


const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const [skillsOpen, setSkillsOpen] = useState(false);
    const [bioOpen, setBioOpen] = useState(false);
    const [resumeOpen, setResumeOpen] = useState(false);
    const [photoPopoverOpen, setPhotoPopoverOpen] = useState(false);
    const [removingPhoto, setRemovingPhoto] = useState(false);
    const [removingResume, setRemovingResume] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const {user, loading} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Format skills for display
    const formatSkills = (skills) => {
        if (!skills || skills.length === 0) return [];
        if (typeof skills === 'string') {
            return skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        }
        return skills;
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
    };

    const skills = formatSkills(user?.profile?.skills);

    // Upload profile photo
    const uploadProfilePhoto = async (file) => {
        try {
            setUploadingPhoto(true);
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(`${USER_API_END_POINT}/profile/photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            console.log('Photo upload response:', res.data);
            
            if (res.data.success) {
                // Use the full user object from the response
                dispatch(setUser(res.data.user));
                toast.success('Profile photo updated successfully');
                setPhotoPopoverOpen(false);
            }
        } catch (error) {
            console.log('Photo upload error:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                // Don't logout immediately, let the user see the error
            } else {
                toast.error(error.response?.data?.message || 'Failed to update profile photo');
            }
        } finally {
            setUploadingPhoto(false);
        }
    };

    // Remove profile photo
    const removeProfilePhoto = async () => {
        try {
            setRemovingPhoto(true);
            const res = await axios.delete(`${USER_API_END_POINT}/profile/photo`, {
                withCredentials: true
            });
            
            console.log('Photo remove response:', res.data);
            
            if (res.data.success) {
                // Use the full user object from the response
                dispatch(setUser(res.data.user));
                toast.success('Profile photo removed successfully');
                setPhotoPopoverOpen(false);
            }
        } catch (error) {
            console.log('Photo remove error:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to remove profile photo');
            }
        } finally {
            setRemovingPhoto(false);
        }
    };

    // Handle photo file selection
    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }
            uploadProfilePhoto(file);
        }
    };

    // Remove resume
    const removeResume = async () => {
        try {
            setRemovingResume(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, {
                resume: '',
                resumeOriginalName: '',
                resumeUploadedAt: null
            }, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success('Resume removed successfully');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to remove resume');
        } finally {
            setRemovingResume(false);
        }
    };

    // Show loading state while user data is being fetched
    if (loading || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 opacity-10"></div>
                <div className="relative max-w-6xl mx-auto px-4 py-12">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
                        <p className="text-lg text-gray-600">Manage your professional information and preferences</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
                                                                                                <div className="relative inline-block mb-4">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                        <AvatarImage 
                                            src={user?.profile?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || 'User')}&background=3B82F6&color=ffffff&size=200`} 
                                            alt={`${user?.fullname}'s profile`} 
                                        />
                                        <AvatarFallback className="bg-white text-blue-600 text-2xl font-bold">
                                            {getInitials(user?.fullname)}
                                        </AvatarFallback>
                        </Avatar>
                                    
                                    {/* Photo Edit Popover */}
                                    <Popover open={photoPopoverOpen} onOpenChange={setPhotoPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <Button 
                                                size="md"
                                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-lg border border-blue-200 hover:border-blue-300 transition-all duration-200"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-56 p-2" align="end">
                                            <div className="space-y-1">
                                                <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                                                    Profile Photo
                                                </div>
                                                
                                                {/* Upload Photo Option */}
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handlePhotoChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        disabled={uploadingPhoto}
                                                    />
                                                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                                                        <Camera className="h-4 w-4 text-blue-600" />
                                                        <span>
                                                            {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                                                        </span>
                                                        {uploadingPhoto && (
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 ml-auto"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Remove Photo Option */}
                                                {user?.profile?.profilePhoto && (
                                                    <div 
                                                        onClick={removeProfilePhoto}
                                                        className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span>
                                                            {removingPhoto ? 'Removing...' : 'Remove Photo'}
                                                        </span>
                                                        {removingPhoto && (
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 ml-auto"></div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold mb-2">{user?.fullname || 'Your Name'}</h2>
                                    <Button 
                                        onClick={() => setBioOpen(true)} 
                                        size="sm"
                                        className="h-8 px-3 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg"
                                    >
                                        <Edit3 className="h-3 w-3 mr-1" />
                                        Edit Bio
                                    </Button>
                                </div>
                                <p className="text-blue-110 text-sm">{user?.profile?.bio || 'Add your bio to showcase your expertise'}</p>
                            </div>

                            {/* Contact Information */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Mail className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{user?.email || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Phone className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{user?.phoneNumber || 'Not provided'}</p>
                                    </div>
                                </div>

                                {user?.profile?.location && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <MapPin className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-medium">{user.profile.location}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <User className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Member Since</p>
                                        <p className="font-medium">{formatDate(user?.createdAt)}</p>
                                    </div>
                                </div>

                                {user?.profile?.experience && user.profile.experience !== 'fresher' && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <Star className="h-4 w-4 text-indigo-600" />
                                        </div>
                        <div>
                                            <p className="text-sm text-gray-500">Experience</p>
                                            <p className="font-medium">{user.profile.experience} years</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="lg:col-span-2 space-y-6">
                        

                        
                        {/* Skills Section */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Award className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Skills & Expertise</h3>
                                </div>
                                {skills.length > 0 && (
                                    <Button 
                                        onClick={() => setSkillsOpen(true)} 
                                        variant="outline" 
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        Edit
                                    </Button>
                                )}
                            </div>
                            
                            {skills.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {skills.map((skill, index) => (
                                        <Badge key={index} className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <Award className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 mb-3">No skills added yet</p>
                                    <Button onClick={() => setSkillsOpen(true)} variant="outline" size="sm">
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Add Skills
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Education Section */}
                        {user?.profile?.education && (user.profile.education.degree || user.profile.education.institution) && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Calendar className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Education</h3>
                                </div>
                                
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                                    <div className="space-y-2">
                                        {user.profile.education.degree && (
                                            <p className="font-semibold text-gray-900 text-lg">{user.profile.education.degree}</p>
                                        )}
                                        {user.profile.education.institution && (
                                            <p className="text-gray-700">{user.profile.education.institution}</p>
                                        )}
                                        {user.profile.education.graduationYear && (
                                            <p className="text-sm text-gray-500">Graduated in {user.profile.education.graduationYear}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resume Section */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FileText className="h-5 w-5 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Resume & Documents</h3>
                                </div>
                                <Button 
                                    onClick={() => setResumeOpen(true)} 
                                    variant="outline" 
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    Manage
                                </Button>
                            </div>
                            
                            {user?.profile?.resume ? (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <FileText className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user?.profile?.resumeOriginalName || 'Resume.pdf'}</p>
                                                <p className="text-sm text-gray-500">
                                                    PDF Document
                                                    {user?.profile?.resumeUploadedAt && (
                                                        <span> • Uploaded {formatDate(user.profile.resumeUploadedAt)}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button 
                                                asChild
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <a 
                                                    href={user?.profile?.resume} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </a>
                                            </Button>
                                            <Button 
                                                onClick={removeResume}
                                                disabled={removingResume}
                                                size="sm"
                                                className="bg-red-500 hover:bg-red-600 text-white"
                                            >
                                                {removingResume ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <FileText className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 mb-3">No resume uploaded yet</p>
                                    <Button onClick={() => setResumeOpen(true)} variant="outline" size="sm">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Resume
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Social Links Section */}
                        {user?.profile?.socialLinks && (user.profile.socialLinks.linkedin || user.profile.socialLinks.github || user.profile.socialLinks.portfolio) && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <User className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Social Links</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {user.profile.socialLinks.linkedin && (
                                        <a 
                                            href={user.profile.socialLinks.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
                                        >
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <span className="font-medium text-blue-700">LinkedIn</span>
                                        </a>
                                    )}
                                    
                                    {user.profile.socialLinks.github && (
                                        <a 
                                            href={user.profile.socialLinks.github} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                                        >
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <User className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <span className="font-medium text-gray-700">GitHub</span>
                                        </a>
                                    )}
                                    
                                    {user.profile.socialLinks.portfolio && (
                                        <a 
                                            href={user.profile.socialLinks.portfolio} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-colors"
                                        >
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <User className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="font-medium text-green-700">Portfolio</span>
                                        </a>
                                    )}
                </div>
                    </div>
                        )}

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button 
                                    onClick={() => setOpen(true)} 
                                    className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Edit3 className="h-5 w-5 mr-3" />
                                    Edit Profile
                                </Button>
                                <Button 
                                    onClick={() => navigate('/my-applications')}
                                    variant="outline" 
                                    className="w-full h-16 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                                >
                                    <Briefcase className="h-5 w-5 mr-3" />
                                    View Applications
                                </Button>
                    </div>
                </div>
                    </div>
                </div>
            </div>
          
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
            <SkillsEditDialog open={skillsOpen} setOpen={setSkillsOpen}/>
            <BioEditDialog open={bioOpen} setOpen={setBioOpen}/>
            <ResumeEditDialog open={resumeOpen} setOpen={setResumeOpen}/>
        </div>
    )
}

export default Profile