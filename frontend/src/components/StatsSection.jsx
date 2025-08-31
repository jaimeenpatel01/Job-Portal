import React from 'react';
import { Briefcase, Building2, Users, Award } from 'lucide-react';

const StatsSection = () => {
    const stats = [
        {
            icon: <Briefcase className="w-8 h-8 text-blue-600" />,
            number: "10,000+",
            label: "Active Jobs",
            description: "Fresh opportunities daily"
        },
        {
            icon: <Building2 className="w-8 h-8 text-purple-600" />,
            number: "5,000+",
            label: "Companies",
            description: "From startups to Fortune 500"
        },
        {
            icon: <Users className="w-8 h-8 text-green-600" />,
            number: "50,000+",
            label: "Job Seekers",
            description: "Active professionals"
        },
        {
            icon: <Award className="w-8 h-8 text-orange-600" />,
            number: "98%",
            label: "Success Rate",
            description: "Jobs filled successfully"
        }
    ];

    return (
        <div className="py-16 px-4 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Thousands</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Our platform has helped countless professionals find their dream careers
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                            <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                            <div className="text-sm text-gray-500">{stat.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsSection;
