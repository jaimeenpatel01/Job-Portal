import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Clock, Users, DollarSign, Calendar, BookmarkCheck } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addSavedJob, removeSavedJob } from '@/redux/authSlice'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { getExperienceLevelLabel } from '@/utils/constants'

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, savedJobs = [] } = useSelector(store => store.auth);
  const [saving, setSaving] = useState(false);

  const isJobSaved = savedJobs?.some(savedJob => savedJob._id === job._id) || false;

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const getCompanyInitials = (companyName) => {
    if (!companyName) return "CO";
    return companyName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to save jobs");
      return;
    }

    try {
      setSaving(true);
      
      if (isJobSaved) {
        // Unsave job
        const res = await axios.post(`${USER_API_END_POINT}/unsave-job`, 
          { jobId: job._id }, 
          { withCredentials: true }
        );
        
        if (res.data.success) {
          dispatch(removeSavedJob(job._id));
          toast.success("Job removed from saved jobs");
        }
      } else {
        // Save job
        const res = await axios.post(`${USER_API_END_POINT}/save-job`, 
          { jobId: job._id }, 
          { withCredentials: true }
        );
        
        if (res.data.success) {
          dispatch(addSavedJob(job));
          toast.success("Job saved successfully");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 
                 overflow-hidden transition-all duration-300 transform 
                 hover:-translate-y-1 hover:shadow-xl hover:border-purple-200"
    >
      {/* Top section with time and bookmark */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{daysAgoFunction(job?.createdAt)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSaveJob}
          disabled={saving}
          className={`w-8 h-8 rounded-full transition-colors ${
            isJobSaved 
              ? 'hover:bg-green-100 text-green-600' 
              : 'hover:bg-gray-100 text-gray-400 group-hover:text-purple-600'
          }`}
        >
          {isJobSaved ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Company section */}
      <div className="px-6 pb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-14 h-14 ring-2 ring-purple-50 shadow-sm">
              <AvatarImage src={job?.company?.logo} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold text-base">
                {getCompanyInitials(job?.company?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base text-gray-900 mb-1 truncate">
              {job?.company?.name}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 truncate">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{job?.location || "India"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job details */}
      <div className="px-6 pb-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight line-clamp-2">
          {job?.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {job?.description}
        </p>
      </div>

      {/* Tags */}
      <div className="px-6 pb-5">
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 px-3 py-1 text-xs flex items-center gap-1">
            <Users className="w-3 h-3" />
            {job?.position} Positions
          </Badge>
          <Badge className="rounded-full bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100 px-3 py-1 text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {job?.jobType}
          </Badge>
          <Badge className="rounded-full bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100 px-3 py-1 text-xs flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {job?.salary} LPA
          </Badge>
          {job?.experienceLevel !== undefined && (
            <Badge className="rounded-full bg-green-50 text-green-700 border-green-100 hover:bg-green-100 px-3 py-1 text-xs flex items-center gap-1">
              <Users className="w-3 h-3" />
              {getExperienceLevelLabel(job.experienceLevel)}
            </Badge>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-6">
        <div className="flex gap-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/description/${job?._id}`);
            }}
            variant="outline"
            className="flex-1 h-10 border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-colors text-sm font-medium"
          >
            View Details
          </Button>
          <Button
            onClick={handleSaveJob}
            disabled={saving}
            className={`flex-1 h-10 transition-all duration-300 text-sm font-medium ${
              isJobSaved
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {saving ? (
              'Saving...'
            ) : isJobSaved ? (
              'Saved'
            ) : (
              'Save Job'
            )}
          </Button>
        </div>
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default LatestJobCards;