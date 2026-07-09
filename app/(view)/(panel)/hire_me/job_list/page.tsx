import React from 'react';
import ApplicationTable from './components/table';

export default function JobList(){
    return(
        <div className='p-6 flex flex-col gap-3'>
            <h1 className="font-bold text-xl">Job Listings</h1>
            <ApplicationTable />
        </div>
    );
}