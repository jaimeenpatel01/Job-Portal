import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!email) {
            toast.error("Please enter your email address")
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email })
            
            if (res.data.success) {
                setEmailSent(true)
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (emailSent) {
        return (
            <div>
                <Navbar />
                <div className='flex items-center justify-center max-w-7xl mx-auto'>
                    <div className='w-1/2 border border-gray-200 rounded-md p-8 my-10 text-center'>
                        <div className='mb-6'>
                            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Check Your Email</h2>
                            <p className='text-gray-600'>
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                        </div>
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>
                                Didn't receive the email? Check your spam folder or
                            </p>
                            <Button 
                                onClick={() => setEmailSent(false)} 
                                variant="outline" 
                                className="w-full"
                            >
                                Try another email
                            </Button>
                            <Link to="/login">
                                <Button variant="ghost" className="w-full">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={handleSubmit} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Forgot Password</h1>
                    <p className='text-gray-600 mb-6'>
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    
                    <div className='my-2'>
                        <Label>Email Address</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {loading ? (
                        <Button className="w-full my-4" disabled>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Sending...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Send Reset Link
                        </Button>
                    )}

                    <div className='text-center'>
                        <Link to="/login" className='text-blue-600 hover:underline'>
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
