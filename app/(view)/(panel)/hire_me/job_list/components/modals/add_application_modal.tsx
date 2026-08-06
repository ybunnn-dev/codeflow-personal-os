import React, { useState } from 'react';
import { Application } from '../table'; // Adjust path if you put the interface elsewhere

interface AddApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (app: Application) => void;
}

export default function AddApplicationModal({ isOpen, onClose, onAdd }: AddApplicationModalProps) {
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        address: '',
        type: 'Full-time',
        source: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Simulating a server response that returns a newly generated server_id
        const newApplication = {
            ...formData,
            server_id: `srv_${Math.random().toString(36).substring(2, 11)}`,
        };
        
        onAdd(newApplication);
        onClose();
    };

    return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-backdrop p-4">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl overflow-hidden animate-modal flex flex-col max-h-[90vh]">
                    <div className="px-6 py-4 border-b border-gray-100 shrink-0">
                        <h2 className="text-lg font-semibold text-gray-800 text-center">Add New Application</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Left Side: Short Inputs */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Company/Agency</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Position</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                            onChange={(e) => setFormData({...formData, position: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Address/Location</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Type</label>
                                        <select 
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        >
                                            <option>Full-time</option>
                                            <option>Part-time</option>
                                            <option>Contract</option>
                                            <option>Internship</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Status</label>
                                        <select 
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        >
                                            <option>Pending</option>
                                            <option>Interviewing</option>
                                            <option>Offer</option>
                                            <option>Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Source</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g., LinkedIn, Direct"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                            onChange={(e) => setFormData({...formData, source: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Application Date</label>
                                        <input 
                                            type="date" 
                                            defaultValue={formData.date}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Description */}
                            <div className="flex flex-col space-y-1 min-h-[200px]">
                                <label className="text-sm font-medium text-gray-700">Description / Notes</label>
                                <textarea 
                                    className="w-full flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
                                    placeholder="Add any specific requirements, job description, or personal notes..."
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>

                        </div>

                        {/* Buttons (Responsive: Submit on top on mobile) */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 shrink-0 mt-auto">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Save Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    );
}