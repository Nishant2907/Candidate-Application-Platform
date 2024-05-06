import React, { useEffect, useState } from 'react';

export default function Fetch() {
    const [jobDescriptions, setJobDescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const limit = 15;

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            const body = JSON.stringify({
                limit: limit,
                offset: offset,
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body,
            };

            const response = await fetch(
                "https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data);
            setJobDescriptions(data.jdList);
        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        fetchData();
    }, []);


    return (
        <div>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {isLoading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {!isLoading && jobDescriptions.length === 0 && <p>No job descriptions found.</p>}
                {!isLoading && jobDescriptions.map((job) => (
                    <div key={job.jdUid} className="border-solid border-2 p-2">
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
