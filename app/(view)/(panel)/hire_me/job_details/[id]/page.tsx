"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ArrowLeft, Building2, MapPin, Briefcase, 
    Link as LinkIcon, Calendar, FileText, Edit, Trash2 
} from "lucide-react";

// In a real app, this would be fetched from your database using the server_id
const dummyDatabase = [
    { server_id: 'srv_a1b2c3d4', company: 'DOST Bicol', position: 'IT Intern', address: 'Legazpi City', type: 'Internship', source: 'Direct', date: '2026-06-15', status: 'Accepted', description: 'Requires completion of 486 hours. Need to submit daily DTR.' },
    { server_id: 'srv_x9y8z7w6', company: 'TechNova Solutions', position: 'Full Stack Developer', address: 'Remote', type: 'Full-time', source: 'LinkedIn', date: '2026-07-02', status: 'Interviewing', description: 'Technical interview scheduled for next week. Focus on Next.js and Tailwind.' },
    { server_id: 'srv_p5q6r7s8', company: 'CloudSync Inc.', position: 'Frontend Engineer', address: 'Manila (Hybrid)', type: 'Full-time', source: 'JobStreet', date: '2026-07-05', status: 'Pending', description: 'Submitted portfolio link and resume.' },
];

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [application, setApplication] = useState<any>(null);
    const [noteInput, setNoteInput] = useState('');

    useEffect(() => {
        // Find the specific application prioritizing the server_id
        const foundApp = dummyDatabase.find(app => app.server_id === params.id);
        if (foundApp) {
            setApplication(foundApp);
        }
    }, [params.id]);

    const getStatusStyle = (status: string) => {
        switch(status.toLowerCase()) {
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'interviewing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (!application) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                Loading application details...
            </div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Applications
                </button>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Edit size={16} />
                        Edit
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>

            {/* Main Title Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{application.position}</h1>
                        <div className="flex items-center gap-2 mt-2 text-lg text-gray-600 font-medium">
                            <Building2 size={20} className="text-blue-600" />
                            {application.company}
                        </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusStyle(application.status)}`}>
                        {application.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={16} />
                            Location
                        </div>
                        <p className="font-medium text-gray-800">{application.address}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Briefcase size={16} />
                            Job Type
                        </div>
                        <p className="font-medium text-gray-800">{application.type}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <LinkIcon size={16} />
                            Source
                        </div>
                        <p className="font-medium text-gray-800">{application.source}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={16} />
                            Applied On
                        </div>
                        <p className="font-medium text-gray-800">{application.date}</p>
                    </div>
                </div>
            </div>

            {/* Details & Notes Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Description */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
                        <FileText size={20} className="text-blue-600" />
                        Application Details & Requirements
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                        {application.description || "No specific details or requirements provided for this application."}
                    </div>
                </div>

                {/* Right Column: Activity / Add Note */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Add a Note</h3>
                    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setNoteInput(''); }}>
                        <textarea
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="Record interview thoughts, tasks, or follow-ups..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none h-32 bg-gray-50"
                        />
                        <button 
                            type="submit"
                            className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            Save Note
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}