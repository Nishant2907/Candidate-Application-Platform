import React, { useEffect, useState, useRef, useCallback } from 'react';

const LIMIT = 5;

export default function Searchfilter() {
    const [jobDescriptions, setJobDescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const count = useRef(0);
    const observer = useRef(null);
    const [filters, setFilters] = useState({
        companyName: '',
        role: '',
        location: ''
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
                job.companyName.toLowerCase().includes(filters.companyName.toLowerCase()) &&
                job.jobRole.toLowerCase().includes(filters.role.toLowerCase()) &&
                job.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        });

        return filteredJobs;
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };


    return (
        <div>
            <div>
                <label htmlFor="companyName">Company Name:</label>
                <input type="text" id="companyName" name="companyName" value={filters.companyName} onChange={handleFilterChange} />
            </div>
            <div>
                <label htmlFor="role">Role:</label>
                <input type="text" id="role" name="role" value={filters.role} onChange={handleFilterChange} />
            </div>
            <div>
                <label htmlFor="location">Location:</label>
                <input type="text" id="location" name="location" value={filters.location} onChange={handleFilterChange} />
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {filterJobs().map((job, index) => (
                    <div ref={index === filterJobs().length - 1 ? lastJobRef : null} key={job.jdUid} className="border-solid border-2 p-2">
                        <p>{job.jdUid}</p>
                        <h2>Company Name: {job.companyName}</h2>
                        <p>Role: {job.jobRole}</p>
                        <p>Location: {job.location}</p>
                    </div>
                ))}
                {isLoading && <p>Loading...</p>}
            </div>
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
