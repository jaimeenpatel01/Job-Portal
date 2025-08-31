// Job-related constants to ensure consistency between frontend and backend

export const JOB_TYPES = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time", 
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance"
};

export const JOB_TYPE_VALUES = Object.values(JOB_TYPES);

export const LOCATIONS = {
    REMOTE: "Remote",
    NEW_YORK: "New York, NY",
    SAN_FRANCISCO: "San Francisco, CA",
    LONDON: "London, UK",
    BANGALORE: "Bangalore, India",
    MUMBAI: "Mumbai, India",
    DELHI: "Delhi, India",
    HYDERABAD: "Hyderabad, India",
    PUNE: "Pune, India",
    CHENNAI: "Chennai, India"
};

export const LOCATION_VALUES = Object.values(LOCATIONS);

export const EXPERIENCE_LEVELS = {
    ENTRY: { value: 0, label: "Entry Level (0-2 years)" },
    MID: { value: 1, label: "Mid Level (3-5 years)" },
    SENIOR: { value: 2, label: "Senior Level (6-10 years)" },
    LEAD: { value: 3, label: "Lead/Manager (10+ years)" }
};

export const EXPERIENCE_LEVEL_VALUES = Object.values(EXPERIENCE_LEVELS);

export const SALARY_RANGES = {
    FIVE_PLUS: { value: 5, label: "5+ LPA" },
    TEN_PLUS: { value: 10, label: "10+ LPA" },
    FIFTEEN_PLUS: { value: 15, label: "15+ LPA" },
    TWENTY_PLUS: { value: 20, label: "20+ LPA" },
    THIRTY_PLUS: { value: 30, label: "30+ LPA" },
    FIFTY_PLUS: { value: 50, label: "50+ LPA" }
};

export const SALARY_RANGE_VALUES = Object.values(SALARY_RANGES);

export const INDUSTRIES = {
    TECHNOLOGY: "Technology",
    HEALTHCARE: "Healthcare",
    FINANCE: "Finance",
    EDUCATION: "Education",
    MARKETING: "Marketing",
    DESIGN: "Design",
    SALES: "Sales",
    ENGINEERING: "Engineering",
    PRODUCT_MANAGEMENT: "Product Management",
    DATA_SCIENCE: "Data Science"
};

export const INDUSTRY_VALUES = Object.values(INDUSTRIES);

// Helper functions for filtering
export const getExperienceLevelLabel = (value) => {
    const level = EXPERIENCE_LEVEL_VALUES.find(l => l.value === value);
    return level ? level.label : "Unknown";
};

export const getSalaryRangeLabel = (value) => {
    const range = SALARY_RANGE_VALUES.find(r => r.value === value);
    return range ? range.label : "Unknown";
};

// Case-insensitive comparison helpers
export const compareStrings = (str1, str2) => {
    return str1?.toLowerCase().trim() === str2?.toLowerCase().trim();
};

export const findJobType = (jobType) => {
    return JOB_TYPE_VALUES.find(type => compareStrings(type, jobType));
};

export const findLocation = (location) => {
    return LOCATION_VALUES.find(loc => compareStrings(loc, location));
};
