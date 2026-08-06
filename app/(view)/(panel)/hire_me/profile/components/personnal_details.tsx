"use client";

import React, { useState } from 'react';

export default function PersonalDetails(){
    return(
        
        <div>
            <div className="flex justify-between py-6 px-3">
                <h1 className="font-bold text-2xl">Personal Details</h1>
                <button>Hello</button>
            </div>
            <div className='bg-white w-full p-10 rounded-lg'>
                <div className='grid grid-cols-1 lg:grid-cols-4'>
                    <div className='flex flex-col lg:flex-col gap-2'>
                        <p className="text-sm">Last Name:</p>
                        <h1 className="font-semibold text-xl">Belaro</h1>
                    </div>

                    <div className='flex flex-col lg:flex-col gap-2'>
                        <p className="text-sm">First Name:</p>
                        <h1 className="font-semibold text-xl">John Ivan</h1>
                    </div>
                    <div className='flex flex-col lg:flex-col gap-2'>
                        <p className="text-sm">Middle Name:</p>
                        <h1 className="font-semibold text-xl">Balaoro</h1>
                    </div>

                    <div className='flex flex-col lg:flex-col gap-2'>
                        <p className="text-sm">Suffix:</p>
                        <h1 className="font-semibold text-xl">JR</h1>
                    </div>
                </div>
            </div>
        </div>   
    );

}