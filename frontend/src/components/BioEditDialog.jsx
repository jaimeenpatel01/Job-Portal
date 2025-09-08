import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Loader2, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const BioEditDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [bio, setBio] = useState(user?.profile?.bio || "");

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, {
                bio: bio
            }, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success('Bio updated successfully');
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update bio');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogContent 
                    className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-2xl rounded-2xl" 
                    onInteractOutside={() => setOpen(false)}
                >
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            Edit Bio
                        </DialogTitle>
                        <p className="text-gray-600 mt-2">Tell us about yourself and your professional background</p>
                    </DialogHeader>
                    
                    <form onSubmit={submitHandler} className="space-y-6 p-6">
                        <div className="space-y-3">
                            <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Bio</Label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 resize-none bg-white transition-all duration-200"
                                placeholder="Write a brief description about yourself, your experience, and what makes you unique..."
                            />
                            <p className="text-xs text-gray-500 font-medium">Maximum 500 characters</p>
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
                                <Button disabled className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl font-semibold">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Updating Bio...
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold"
                                >
                                    Update Bio
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default BioEditDialog
