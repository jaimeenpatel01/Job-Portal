import React from 'react';

const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
};

export const JobCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-start gap-4 mb-4">
      <Skeleton className="w-16 h-16 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-24 rounded-lg" />
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="p-2">
    <Skeleton className="w-full h-16 rounded-xl" />
  </div>
);

export const HeroSkeleton = () => (
  <div className="py-12 px-4">
    <div className="max-w-6xl mx-auto text-center">
      <Skeleton className="h-8 w-64 mx-auto mb-8" />
      <Skeleton className="h-16 w-4/5 mx-auto mb-6" />
      <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
      <Skeleton className="h-14 w-2/3 mx-auto mb-6" />
      <div className="flex justify-center gap-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  </div>
);

export default Skeleton;
