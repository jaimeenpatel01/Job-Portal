import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, User, Mail, Phone, FileText, Award, Upload, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const [removingPhoto, setRemovingPhoto] = useState(false);
    const [removingResume, setRemovingResume] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(', ') || "",
        file: user?.profile?.resume || ""
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    // Remove profile photo
    const removeProfilePhoto = async () => {
        try {
            setRemovingPhoto(true);
            const res = await axios.delete(`${USER_API_END_POINT}/profile/photo`, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success('Profile photo removed successfully');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to remove profile photo');
        } finally {
            setRemovingPhoto(false);
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

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            setLoading(false);
        }
        setOpen(false);
        console.log(input);
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogContent 
                    className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl rounded-3xl" 
                    onInteractOutside={() => setOpen(false)}
                >
                    <DialogHeader className="text-center pb-6">
                        <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Update Your Profile
                        </DialogTitle>
                        <p className="text-gray-500 mt-3 text-lg">Keep your information up to date to improve your job prospects</p>
                    </DialogHeader>
                    
                    <form onSubmit={submitHandler} className="space-y-8 px-2">
                        {/* Personal Information Section */}
                        <div className="space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                Personal Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="fullname" className="text-sm font-semibold text-gray-700">Full Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="fullname"
                                            name="fullname"
                                            type="text"
                                            value={input.fullname}
                                            onChange={changeEventHandler}
                                            className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-white/90 rounded-xl transition-all duration-200"
                                            placeholder="Enter your full name"
                                        />
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={input.email}
                                            onChange={changeEventHandler}
                                            className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-white/90 rounded-xl transition-all duration-200"
                                            placeholder="Enter your email"
                                        />
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                                <div className="relative">
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={input.phoneNumber}
                                        onChange={changeEventHandler}
                                        className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-white/90 rounded-xl transition-all duration-200"
                                        placeholder="Enter your phone number"
                                    />
                                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Professional Information Section */}
                        <div className="space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-xl">
                                    <Award className="h-5 w-5 text-orange-600" />
                                </div>
                                Professional Information
                            </h3>
                            
                            <div className="space-y-3">
                                <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Bio</Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 resize-none bg-white/90 transition-all duration-200"
                                    placeholder="Tell us about yourself and your professional background..."
                                />
                            </div>
                            
                            <div className="space-y-3">
                                <Label htmlFor="skills" className="text-sm font-semibold text-gray-700">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    className="h-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-white/90 rounded-xl transition-all duration-200"
                                    placeholder="e.g., React, Node.js, Python (comma separated)"
                                />
                                <p className="text-xs text-gray-500 font-medium">Separate multiple skills with commas</p>
                            </div>
                        </div>

                        {/* Resume Section */}
                        <div className="space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-xl">
                                    <FileText className="h-5 w-5 text-green-600" />
                                </div>
                                Resume
                            </h3>
                            
                            {/* Current Resume Display */}
                            {user?.profile?.resume && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <FileText className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.profile.resumeOriginalName || 'Resume.pdf'}</p>
                                                <p className="text-sm text-gray-500">Current resume</p>
                                            </div>
                                        </div>
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
                            )}
                            
                            <div className="space-y-3">
                                <Label htmlFor="file" className="text-sm font-semibold text-gray-700">
                                    {user?.profile?.resume ? 'Replace Resume' : 'Upload Resume'}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={fileChangeHandler}
                                        className="h-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-white/90 rounded-xl transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">Only PDF files are accepted. Max size: 5MB</p>
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-4 pt-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setOpen(false)}
                                className="w-full sm:w-auto order-2 sm:order-1 h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-200"
                            >
                                Cancel
                            </Button>
                            {loading ? (
                                <Button disabled className="w-full sm:w-auto order-1 sm:order-2 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl font-semibold">
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                    Updating Profile...
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    className="w-full sm:w-auto order-1 sm:order-2 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold"
                                >
                                    Update Profile
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog