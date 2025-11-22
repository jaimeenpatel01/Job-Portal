import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, User, Building2, GraduationCap, AlertCircle } from 'lucide-react'
import GoogleSignInButton from './GoogleSignInButton'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [searchParams] = useSearchParams();
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
        
        // Handle OAuth errors
        const error = searchParams.get('error');
        if (error === 'authentication_failed') {
            toast.error('Google authentication failed. Please try again.');
        } else if (error === 'server_error') {
            toast.error('Server error during authentication. Please try again.');
        }
    }, [searchParams, user, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
            <Navbar />
            
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <form onSubmit={submitHandler} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={input.email}
                                        name="email"
                                        onChange={changeEventHandler}
                                        placeholder="Enter your email"
                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        placeholder="Enter your password"
                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div className="text-right">
                                    <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                        Forgot Password?
                                    </Link>
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
                                disabled={loading || !input.email || !input.password || !input.role}
                                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign In Button */}
                            <GoogleSignInButton text="Sign in with Google" />

                            {/* Sign Up Link */}
                            <div className="text-center pt-4 border-t border-gray-100">
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login