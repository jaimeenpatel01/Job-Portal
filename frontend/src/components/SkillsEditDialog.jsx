import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, Award } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const SkillsEditDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [skills, setSkills] = useState(user?.profile?.skills?.join(', ') || "");

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, {
                skills: skills
            }, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success('Skills updated successfully');
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update skills');
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
                            <div className="p-2 bg-orange-100 rounded-xl">
                                <Award className="h-6 w-6 text-orange-600" />
                            </div>
                            Edit Skills
                        </DialogTitle>
                        <p className="text-gray-600 mt-2">Add or update your professional skills</p>
                    </DialogHeader>
                    
                    <form onSubmit={submitHandler} className="space-y-6 p-6">
                        <div className="space-y-3">
                            <Label htmlFor="skills" className="text-sm font-semibold text-gray-700">Skills</Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="h-12 border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 bg-white rounded-xl transition-all duration-200"
                                placeholder="e.g., React, Node.js, Python (comma separated)"
                            />
                            <p className="text-xs text-gray-500 font-medium">Separate multiple skills with commas</p>
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
                                <Button disabled className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-lg rounded-xl font-semibold">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Updating Skills...
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold"
                                >
                                    Update Skills
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SkillsEditDialog
