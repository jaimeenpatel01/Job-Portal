import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Loader2, Phone, Building2, GraduationCap, UserCheck } from 'lucide-react';
import { USER_API_END_POINT } from '@/utils/constant';
import { setLoading, setUser } from '@/redux/authSlice';
import Navbar from '../shared/Navbar';

const CompleteProfile = () => {
    const [input, setInput] = useState({
        phoneNumber: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log('[CompleteProfile] Form submitted with input:', input);
        try {
            dispatch(setLoading(true));
            console.log('[CompleteProfile] Sending request to:', `${USER_API_END_POINT}/complete-profile`);
            const res = await axios.post(`${USER_API_END_POINT}/complete-profile`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            console.log('[CompleteProfile] Response received:', res.data);
            if (res.data.success) {
                console.log('[CompleteProfile] Profile completed successfully');
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log('[CompleteProfile] Error submitting form:', {
                status: error.response?.status,
                message: error.response?.data?.message,
                error: error.message
            });
            toast.error(error.response?.data?.message || "Failed to complete profile");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        console.log('[CompleteProfile] useEffect triggered with user:', user);
        // If user is already complete or not logged in, redirect
        if (!user) {
            console.log('[CompleteProfile] No user found, redirecting to login in 500ms');
            // Add a small delay to ensure user data is fetched
            const timer = setTimeout(() => {
                console.log('[CompleteProfile] Redirecting to login');
                navigate("/login");
            }, 500);
            return () => clearTimeout(timer);
        } else if (user.phoneNumber && user.role) {
            console.log('[CompleteProfile] User already has phone and role, redirecting to home');
            navigate("/");
        } else {
            console.log('[CompleteProfile] User needs to complete profile', {
                hasPhoneNumber: !!user.phoneNumber,
                hasRole: !!user.role,
                phoneNumber: user.phoneNumber,
                role: user.role
            });
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
            <Navbar />
            
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <UserCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                        <p className="text-gray-600">Just a few more details to get started</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <form onSubmit={submitHandler} className="space-y-6">
                            {/* Phone Number Field */}
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        value={input.phoneNumber}
                                        name="phoneNumber"
                                        onChange={changeEventHandler}
                                        placeholder="Enter your phone number"
                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700">I am a</Label>
                                <RadioGroup 
                                    value={input.role} 
                                    onValueChange={(value) => setInput({...input, role: value})}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    <div className="relative">
                                        <RadioGroupItem
                                            value="student"
                                            id="student"
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor="student"
                                            className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-50 cursor-pointer transition-all"
                                        >
                                            <GraduationCap className="w-6 h-6 text-gray-600 peer-data-[state=checked]:text-purple-600 mb-2" />
                                            <span className="text-sm font-medium text-gray-700 peer-data-[state=checked]:text-purple-700">Student</span>
                                        </Label>
                                    </div>
                                    <div className="relative">
                                        <RadioGroupItem
                                            value="recruiter"
                                            id="recruiter"
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor="recruiter"
                                            className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-50 cursor-pointer transition-all"
                                        >
                                            <Building2 className="w-6 h-6 text-gray-600 peer-data-[state=checked]:text-purple-600 mb-2" />
                                            <span className="text-sm font-medium text-gray-700 peer-data-[state=checked]:text-purple-700">Recruiter</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                disabled={loading || !input.phoneNumber || !input.role}
                                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Completing profile...
                                    </>
                                ) : (
                                    'Complete Profile'
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;
