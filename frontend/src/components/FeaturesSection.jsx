import React from 'react';
import { CheckCircle, Users, TrendingUp, Shield } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: <CheckCircle className="w-8 h-8 text-green-600" />,
            title: "Verified Companies",
            description: "All companies are thoroughly verified to ensure legitimate opportunities"
        },
        {
            icon: <Users className="w-8 h-8 text-blue-600" />,
            title: "Active Community",
            description: "Join thousands of professionals and companies in our growing network"
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
            title: "Career Growth",
            description: "Find opportunities that match your skills and career aspirations"
        },
        {
            icon: <Shield className="w-8 h-8 text-orange-600" />,
            title: "Secure Platform",
            description: "Your data and privacy are protected with enterprise-grade security"
        }
    ];

    return (
        <div className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Job Portal</span>?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We're committed to making your job search journey smooth, secure, and successful
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center group">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
