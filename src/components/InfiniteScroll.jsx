import React, { useEffect, useState, useCallback, useRef } from 'react';

const LIMIT = 5;

export default function Searchfilter() {
    const [jobDescriptions, setJobDescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const count = useRef(1);
    const observerTarget = useRef(null);

    useEffect(() => {
        fetchAndSetJobDescriptions();
    }, []);

    const fetchAndSetJobDescriptions = useCallback(
        async () => {
            const data = await fetchData(LIMIT * count.current);
            setIsLoading(false);
            if (data === null) {
                setError(true);
            };
            setJobDescriptions((prevJobs) => [...prevJobs, ...data.jdList]);
            count.current = count + 1;
        },
      [count]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
            if (entries[0].isIntersecting) {
                fetchAndSetJobDescriptions();
            }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
            observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget]);

    if(isLoading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!isLoading && jobDescriptions.length === 0 ) { 
        return <p>No job descriptions found.</p>
    }

    return (
        <div>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {jobDescriptions?.map((job) => (
                    <div ref={observerTarget} key={job.jdUid} className="border-solid border-2 p-2">
                        <p>{job.jdUid}</p>
                        <h2>Company Name: {job.companyName}</h2>
                        <p>Role: {job.jobRole}</p>
                        <p>Location: {job.location}</p>
                    </div>
                ))}
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
