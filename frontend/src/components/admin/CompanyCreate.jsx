import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { ArrowLeft, Building2, Plus, Loader2 } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            toast.error("Please enter a company name");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to create company");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
            <Navbar />
            
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button 
                            variant="outline" 
                            onClick={() => navigate("/admin/companies")}
                            className="h-10 w-10 p-0 border-gray-200 hover:border-purple-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Create Company</h1>
                                <p className="text-gray-600">Set up your company profile</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <div className="space-y-6">
                        {/* Company Name Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-purple-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                                    Company Name *
                                </Label>
                                <Input
                                    id="companyName"
                                    type="text"
                                    placeholder="e.g., TechCorp, Innovation Labs"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    You can change this later in your company settings.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                            <Button 
                                variant="outline" 
                                onClick={() => navigate("/admin/companies")}
                                className="flex-1 h-12 border-gray-200 hover:border-purple-300 hover:text-purple-600"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={registerNewCompany}
                                disabled={loading || !companyName.trim()}
                                className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Company'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate