import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [token, setToken] = useState("")

    useEffect(() => {
        const resetToken = searchParams.get('token')
        if (!resetToken) {
            toast.error("Invalid reset link")
            navigate('/login')
            return
        }
        setToken(resetToken)
    }, [searchParams, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!password || !confirmPassword) {
            toast.error("Please fill in all fields")
            return
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/reset-password`, { 
                token, 
                password 
            })
            
            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div>
                <Navbar />
                <div className='flex items-center justify-center max-w-7xl mx-auto'>
                    <div className='w-1/2 border border-gray-200 rounded-md p-8 my-10 text-center'>
                        <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4' />
                        <p>Loading...</p>
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
                    <h1 className='font-bold text-xl mb-5'>Reset Password</h1>
                    <p className='text-gray-600 mb-6'>
                        Enter your new password below.
                    </p>
                    
                    <div className='my-2'>
                        <Label>New Password</Label>
                        <div className='relative'>
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2'
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className='my-2'>
                        <Label>Confirm New Password</Label>
                        <div className='relative'>
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2'
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <Button className="w-full my-4" disabled>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Resetting...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Reset Password
                        </Button>
                    )}
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
