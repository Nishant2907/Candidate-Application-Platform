import React, { useEffect, useState, useRef, useCallback } from 'react';
import MultiSelectDropdown from './dropdown/MultiSelectDropdown';
import SingleSelectDropdown from './dropdown/SingleSelectDropdown';

import Tooltip from '@mui/material/Tooltip';
import Popover from './popover/Popover';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const LIMIT = 5;

export default function SearchJobs() {
    const [jobDescriptions, setJobDescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const count = useRef(0);
    const observer = useRef(null);
    const [filters, setFilters] = useState({
        companyName: '',
        role: '',
        location: '',
        experience: '',
        minBasePay: ''
    });

    const fetchAndSetJobDescriptions = useCallback(
        async () => {
            setIsLoading(true);
            const data = await fetchData(LIMIT * count.current);
            setIsLoading(false);
            if (data === null) {
                setError(true);
                return;
            }
            setJobDescriptions(prev => removeDuplicates([...prev, ...data.jdList], 'jdUid'));
            count.current = count.current + 1;
        },
        []
    );

    const lastJobRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchAndSetJobDescriptions();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, fetchAndSetJobDescriptions]);

    const handleSelectionChange = (selectedItems, type) => {
        if (type === 'role') {
            setFilters(prevFilters => ({
                ...prevFilters,
                role: selectedItems
            }));
        } else if (type === 'location') {
            setFilters(prevFilters => ({
                ...prevFilters,
                location: selectedItems
            }));
        } else if (type === 'experience') {
            setFilters(prevFilters => ({
                ...prevFilters,
                experience: selectedItems
            }));
        } else if (type === 'basePay') {
            // Remove 'L' from the selectedItems before setting the filter
            const cleanedSelectedItems = selectedItems.replace('L', '');
            console.log(cleanedSelectedItems);
            setFilters(prevFilters => ({
                ...prevFilters,
                minBasePay: cleanedSelectedItems
            }));
        }
    };

    useEffect(() => {
        fetchAndSetJobDescriptions();
    }, []);

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (jobDescriptions.length === 0) {
        return <p>No job descriptions found.</p>;
    }

    const filterJobs = () => {
        let filteredJobs = jobDescriptions.filter(job => {
            return (
                // Filter by CompanyName
                job.companyName.toLowerCase().includes(filters.companyName.toLowerCase()) &&

                // Filter by Role
                (filters.role.length === 0 || filters.role.some(selectedRole => selectedRole.toLowerCase() === job.jobRole.toLowerCase())) &&

                // Filter by location
                (filters.location.length === 0 || filters.location.some(selectedLocation => selectedLocation.toLowerCase() === job.location.toLowerCase())) &&

                // Filter by experience
                (filters.experience === '' || (parseInt(filters.experience) >= job.minExp && parseInt(filters.experience) <= job.maxExp)) &&

                // Filter by minimum base pay
                (filters.minBasePay === '' ||
                    (parseInt(job.maxJdSalary) >= parseInt(filters.minBasePay)))
            );
        });
        return filteredJobs;
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };


    return (
        <div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div>
                    <MultiSelectDropdown onSelectionChange={(selectedItems) => handleSelectionChange(selectedItems, 'role')} list={roleList} label="Role" />
                </div>

                <div>
                    <SingleSelectDropdown onSelectionChange={(selectedItems) => handleSelectionChange(selectedItems, 'employees')} list={employeesList} label="Employees" />
                </div>

                <div>
                    <SingleSelectDropdown onSelectionChange={(selectedItems) => handleSelectionChange(selectedItems, 'experience')} list={experienceList} label="Experience" />
                </div>

                <div>
                    <MultiSelectDropdown onSelectionChange={(selectedItems) => handleSelectionChange(selectedItems, 'location')} list={locationList} label="Location" />
                </div>

                <div>
                    <SingleSelectDropdown onSelectionChange={(selectedItems) => handleSelectionChange(selectedItems, 'basePay')} list={basePayList} label="MinBasePay" />
                </div>

                <div>
                    <label htmlFor="companyName">Company Name:</label>
                    <input className="border-solid border-2 border-gray-400 p-1" type="text" id="companyName" name="companyName" value={filters.companyName} onChange={handleFilterChange} />
                </div>
            </div>

            {/* <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {filterJobs().map((job, index) => (
                    <div ref={index === filterJobs().length - 1 ? lastJobRef : null} key={job.jdUid} className="border-solid border-2 p-2">
                        <p>{job.jdUid}</p>
                        <h2>Company Name: {job.companyName}</h2>
                        <p>Role: {job.jobRole}</p>
                        <p>Location: {job.location}</p>
                    </div>
                ))}
            </div> */}


            <div className="w-full px-5 lg:px-10 py-10 ">
                <div className="flex flex-wrap gap-10 items-center justify-center text-black">
                    {filterJobs().map((list, index) => (
                        <div key={index}
                            className="bg-white shadow-xl border rounded-xl min-w-[20rem] min-h-[30rem] p-4 flex flex-col items-start gap-2">

                            <div>
                                <p className="px-1 py-1 rounded-lg border text-[9px] font-normal bg-white ">
                                    ⏳ Posted {getRandomNumber(3, 25)} days ago
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div>
                                    <img src={list.logoUrl} width={50} height={100} />
                                </div>
                                <div className="flex flex-col items-start">
                                    <h3 className="text-[13px] font-semibold mb-1 text-[#8b8b8b] tracking-[1px]">
                                        {list.companyName}
                                    </h3>
                                    <h2 className="text-sm leading-normal mb-1">
                                        {capitalizeWords(list.jobRole)}
                                    </h2>
                                    <p className="text-[11px]">{capitalizeWords(list.location)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm leading-normal text-[#4D596A]">
                                    Estimated Salary: ₹{list.minJdSalary !== null ? list.minJdSalary : '0'}
                                    - {list.maxJdSalary} LPA
                                    <span className="pl-1">
                                        <Tooltip title="Offered salary range" placement="top">
                                            <span>✅</span>
                                        </Tooltip>
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold	text-base">About company:</p>
                            </div>

                            <div className="h-64" style={{ overflow: "hidden", maskImage: "linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255), rgba(255, 255, 255, 0))" }}	>
                                <p className="text-sm font-black">About Us</p>
                                <p className="max-w-[300px] text-sm text-justify font-normal	">{list.jobDetailsFromCompany}</p>
                            </div>

                            <div className="w-full text-center">
                                <Popover desc={list.jobDetailsFromCompany} />
                            </div>

                            <div className="flex flex-col items-start justify-center">
                                <p className="text-[13px] font-black text-[#8B8B8B] ">Minimum Experience</p>
                                <p className="text-sm font-normal	">{list.minExp !== null ? `${list.minExp} years` : '0 years'}</p>
                            </div>

                            <ColorButton className="px-6 py-2 text-base text-black font-bold w-full mt-5 rounded-md" variant="contained">⚡️ Easy Apply</ColorButton>
                        </div>
                    ))}
                </div>
            </div>

            {isLoading && <p>Loading...</p>}
        </div>
    );
}



const fetchData = async (offset) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        const body = JSON.stringify({
            limit: LIMIT,
            offset: offset,
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body,
        };

        const response = await fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions);

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};

const removeDuplicates = (array, key) => {
    const uniqueKeys = new Set();
    return array.filter(obj => {
        const keyValue = obj[key];
        if (!uniqueKeys.has(keyValue)) {
            uniqueKeys.add(keyValue);
            return true;
        }
        return false;
    });
};


const roleList = [
    'FrontEnd',
    'BackEnd',
    'IOS',
    'Android'
];

const locationList = [
    'Remote',
    'Mumbai',
    'Bangalore',
    'Delhi NCR'
];

const experienceList = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
];

const employeesList = [
    '1-10',
    '11-20',
    '21-50',
    '51-100',
    '101-200',
    '201-500',
    '500+'
];

const basePayList = [
    '0L', '10L', '20L', '30L', '40L', '50L', '60L', '70L'
];

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText('#55efc4'),
    backgroundColor: '#55efc4',
    '&:hover': {
        backgroundColor: '#55efc4', // Adjust hover color if needed
    },
}));