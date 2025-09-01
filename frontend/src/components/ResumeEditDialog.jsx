import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, FileText, Upload, Trash2, Download } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const ResumeEditDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const [removingResume, setRemovingResume] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [file, setFile] = useState(null);

    const fileChangeHandler = (e) => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

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
                toast.success('Resume updated successfully');
                setOpen(false);
                setFile(null);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update resume');
        } finally {
            setLoading(false);
        }
    }

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

    return (
        <div>
            <Dialog open={open}>
                <DialogContent 
                    className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-2xl rounded-2xl" 
                    onInteractOutside={() => setOpen(false)}
                >
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                            <div className="p-2 bg-green-100 rounded-xl">
                                <FileText className="h-6 w-6 text-green-600" />
                            </div>
                            Manage Resume
                        </DialogTitle>
                        <p className="text-gray-600 mt-2">Upload or manage your resume document</p>
                    </DialogHeader>
                    
                    <form onSubmit={submitHandler} className="space-y-6 p-6">
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
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            asChild
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <a 
                                                href={user.profile.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1"
                                            >
                                                <Download className="h-4 w-4" />
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
                                    className="h-12 border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 bg-white rounded-xl transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>
                            <p className="text-xs text-gray-500 font-medium">Only PDF files are accepted. Max size: 5MB</p>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setOpen(false)}
                                className="w-full sm:w-auto order-2 sm:order-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-200"
                            >
                                Cancel
                            </Button>
                            {loading ? (
                                <Button disabled className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg rounded-xl font-semibold">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Uploading Resume...
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    disabled={!file}
                                    className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Resume
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ResumeEditDialog
