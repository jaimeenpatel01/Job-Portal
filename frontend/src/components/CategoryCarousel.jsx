import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer",
    "Mobile App Developer",
    "DevOps Engineer",
    "AI/ML Engineer",
    "Cybersecurity Specialist",
    "Cloud Architect",
    "UI/UX Designer",
    "Database Administrator",
    "Project Manager",
    "Software Tester (QA)",
    "Business Analyst"
];


const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="py-12 px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Job Categories</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Discover opportunities in various tech domains and find your perfect career path
                </p>
            </div>
            
            <Carousel className="w-full max-w-4xl mx-auto relative">
                <CarouselContent className="-ml-2 md:-ml-4">
                    {
                        category.map((cat, index) => (
                            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <div className="p-2">
                                    <Button 
                                        onClick={() => searchJobHandler(cat)} 
                                        variant="outline" 
                                        className="w-full h-16 text-base font-medium rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                        {cat}
                                    </Button>
                                </div>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious className="absolute -left-9 top-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300" />
                <CarouselNext className="absolute -right-9 top-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300" />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel