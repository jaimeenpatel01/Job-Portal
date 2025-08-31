import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    // Helper function to check if a link is active
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-sm">JP</span>
                    </div>
                    <h1 className="text-2xl font-bold group-hover:text-purple-600 transition-colors">
                        Job
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                            Portal
                        </span>
                    </h1>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-8">
                    <ul className="flex font-medium items-center gap-2">
                        {user && user.role === "recruiter" ? (
                            <>
                                <li>
                                    <Link
                                        to="/admin/companies"
                                        className={`px-4 py-2 rounded-full transition-all ${
                                            isActive('/admin/companies') 
                                                ? 'bg-purple-100 text-purple-700 font-semibold' 
                                                : 'hover:bg-purple-50 hover:text-purple-600'
                                        }`}
                                    >
                                        Companies
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/jobs"
                                        className={`px-4 py-2 rounded-full transition-all ${
                                            isActive('/admin/jobs') 
                                                ? 'bg-purple-100 text-purple-700 font-semibold' 
                                                : 'hover:bg-purple-50 hover:text-purple-600'
                                        }`}
                                    >
                                        Jobs
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/"
                                        className={`px-4 py-2 rounded-full transition-all ${
                                            isActive('/') 
                                                ? 'bg-purple-100 text-purple-700 font-semibold' 
                                                : 'hover:bg-purple-50 hover:text-purple-600'
                                        }`}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/browse"
                                        className={`px-4 py-2 rounded-full transition-all ${
                                            isActive('/browse') 
                                                ? 'bg-purple-100 text-purple-700 font-semibold' 
                                                : 'hover:bg-purple-50 hover:text-purple-600'
                                        }`}
                                    >
                                        Browse Jobs
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Auth Section */}
                    {!user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button
                                    variant="outline"
                                    className="px-5 py-2 rounded-full border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all duration-200"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer w-10 h-10 ring-2 ring-gray-100 hover:ring-purple-300 transition-all duration-200 shadow-sm">
                                    <AvatarImage
                                        src={user?.profile?.profilePhoto}
                                        alt={user?.fullname || "User"}
                                    />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-80 p-6 rounded-xl shadow-xl bg-white dark:bg-neutral-900"
                                align="end"
                                side="bottom"
                                sideOffset={10}
                            >
                                <div className="space-y-4">
                                    {/* Profile Header */}
                                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                                        <Avatar className="w-12 h-12 ring-2 ring-purple-100">
                                            <AvatarImage
                                                src={user?.profile?.profilePhoto}
                                                alt={user?.fullname}
                                            />
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                                {user?.fullname}
                                            </h4>
                                            <p className="text-sm text-gray-500 capitalize">
                                                {user?.role}
                                            </p>
                                            {user?.profile?.bio && (
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {user?.profile?.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-2">
                                        {user?.role === "student" && (
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                            >
                                                <User2 className="w-5 h-5 text-gray-500 group-hover:text-purple-600" />
                                                <span className="text-gray-700 group-hover:text-purple-600 font-medium">
                                                    View Profile
                                                </span>
                                            </Link>
                                        )}
                                        <button
                                            onClick={logoutHandler}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group w-full text-left"
                                        >
                                            <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
                                            <span className="text-gray-700 group-hover:text-red-600 font-medium">
                                                Logout
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar
