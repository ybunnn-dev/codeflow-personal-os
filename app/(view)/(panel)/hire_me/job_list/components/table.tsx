"use client";

import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, Plus, Calendar } from "lucide-react";
import AddApplicationModal from './modals/add_application_modal';
import { useRouter } from 'next/navigation';

export interface Application {
    server_id: string;
    company: string;
    position: string;
    address: string;
    type: string;
    source: string;
    date: string;
    status: string;
    description?: string;
}

// Dummy data utilizing server_id for reliable identification
const initialDummyData = [
    { server_id: 'srv_a1b2c3d4', company: 'DOST Bicol', position: 'IT Intern', address: 'Legazpi City', type: 'Internship', source: 'Direct', date: '2026-06-15', status: 'Accepted' },
    { server_id: 'srv_x9y8z7w6', company: 'TechNova Solutions', position: 'Full Stack Developer', address: 'Remote', type: 'Full-time', source: 'LinkedIn', date: '2026-07-02', status: 'Interviewing' },
    { server_id: 'srv_p5q6r7s8', company: 'CloudSync Inc.', position: 'Frontend Engineer', address: 'Manila (Hybrid)', type: 'Full-time', source: 'JobStreet', date: '2026-07-05', status: 'Pending' },
];

export default function ApplicationTable() {
    const router = useRouter();
    const [applications, setApplications] = useState(initialDummyData);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddApplication = (newApp: Application) => {
        setApplications([newApp, ...applications]);
    };

    // Filter logic combining text search and exact date matching
    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              app.position.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDate = dateFilter ? app.date === dateFilter : true;
        
        return matchesSearch && matchesDate;
    });

    const getStatusStyle = (status: string) => {
        switch(status.toLowerCase()) {
            case 'accepted': return 'bg-green-100 text-green-700';
            case 'interviewing': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
                        
                        {/* Search Input */}
                        <div className="relative flex-grow sm:flex-grow-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search application..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="relative flex-grow sm:flex-grow-0">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => setDateFilter('')}
                                className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" 
                                title="Clear Filters"
                            >
                                <Filter size={16} />
                                <span className="hidden xl:inline">Clear</span>
                            </button>
                            <button 
                                className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
                            >
                                <ArrowUpDown size={16} />
                                <span className="hidden xl:inline">Sort</span>
                            </button>
                        </div>
                    </div>

                    {/* Add Application Button */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full lg:w-auto shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Add Application</span>
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className='w-full text-left text-sm'>
                        <thead className="bg-gray-100 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Company/Agency</th>
                                <th className="px-6 py-4">Position</th>
                                <th className="px-6 py-4">Address</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Application Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((app) => (
                                    <tr 
                                        key={app.server_id} 
                                        onClick={() => router.push(`/hire_me/job_details/${app.server_id}`)}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer" // <-- Added cursor-pointer
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-800">{app.company}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.position}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.address}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.type}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.source}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        {searchQuery ? "No applications found matching your search." : "No applications found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddApplicationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAdd={handleAddApplication} 
            />
        </>
    );
}