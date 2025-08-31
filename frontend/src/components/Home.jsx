import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import FeaturesSection from './FeaturesSection'
import LatestJobs from './LatestJobs'
import StatsSection from './StatsSection'
import Footer from './shared/Footer'
import ScrollToTop from './ui/ScrollToTop'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50'>
      <Navbar />
      <HeroSection />
              <div className='relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-purple-50/50 to-blue-50/50'></div>
          <div className='relative z-10'>
            <CategoryCarousel />
          </div>
        </div>
                <FeaturesSection />
        <LatestJobs />
                <StatsSection />
        <Footer />
        <ScrollToTop />
      </div>
  )
}

export default Home