"use client";

import React, { useState } from 'react';

export default function PersonalDetails() {
    // State to manage the input values
    const [details, setDetails] = useState({
        lastName: '',
        firstName: 'John Ivan',
        middleName: 'Balaoro',
        suffix: 'JR',
        address: 'Irosin, Sorsogon',
        mobileNo: '09672474019',
        email: 'belaroivan17@gmail.com',
        portfolio: 'https://ybunnn-my-portfolio.vercel.app/'
    });

   
    // Reusable class variables for cleaner code
    const labelClasses = "text-sm font-medium text-slate-500 dark:text-slate-400";
    const inputClasses = "w-full mt-1 px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors";

    return (
        <div>
            <div className="flex items-center justify-between py-6 px-3">
                <h1 className="font-bold text-2xl text-slate-900 dark:text-slate-100">Personal Details</h1>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Export Resume
                </button>
            </div>

            <div className="bg-white flex flex-col gap-6 dark:bg-slate-900 w-full p-6 lg:p-10 rounded-xl border border-transparent dark:border-slate-700/50 shadow-sm transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4">
                    
                    <div className="flex flex-col">
                        <label className={labelClasses}>Last Name</label>
                        <input 
                            type="text" 
                            name="lastName"
                            value={details.lastName}
                            
                            className={inputClasses} 
                            placeholder="Enter last name"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClasses}>First Name</label>
                        <input 
                            type="text" 
                            name="firstName"
                            value={details.firstName}
                            
                            className={inputClasses} 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClasses}>Middle Name</label>
                        <input 
                            type="text" 
                            name="middleName"
                            value={details.middleName}
                            
                            className={inputClasses} 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClasses}>Suffix</label>
                        <input 
                            type="text" 
                            name="suffix"
                            value={details.suffix}
                          
                            className={inputClasses} 
                        />
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4">
                    
                    <div className="flex flex-col">
                        <label className={labelClasses}>Mobile Number</label>
                        <input 
                            type="text" 
                            name="mobileNo"
                            value={details.mobileNo}
                            
                            className={inputClasses} 
                            placeholder="Enter last name"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClasses}>Email</label>
                        <input 
                            type="text" 
                            name="email"
                            value={details.email}
                            
                            className={inputClasses} 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClasses}>Address</label>
                        <input 
                            type="text" 
                            name="address"
                            value={details.address}
                            
                            className={inputClasses} 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClasses}>Portfolio Link</label>
                        <input 
                            type="text" 
                            name="portfolio_link"
                            value={details.portfolio}
                          
                            className={inputClasses} 
                        />
                    </div>

                    <div className=''>

                    </div>

                </div>
            </div>
        </div>   
    );
}