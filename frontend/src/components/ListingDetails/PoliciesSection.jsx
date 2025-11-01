// src/components/ListingDetails/PoliciesSection.jsx
import { useState } from 'react';

export default function PoliciesSection({ listing = {} }) {
    // Retaining state for potential future 'Show More' functionality, though not used in static parts.
    const [showPolicies, setShowPolicies] = useState({ rules: false, safety: false });

    return (
        <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-6">Things to know</h2>

            {/* --- 1. House Rules Section --- */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">House Rules</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
                    
                    {/* Column 1: Rules List */}
                    <div className="flex flex-col gap-2">
                        <p className="flex items-center gap-2">
                            <span className="text-sm font-medium">Credit cards accepted</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="text-sm font-medium">Pets {listing.petsAllowed ? 'welcome' : 'not allowed'}</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="text-sm font-medium">Smoking {listing.smokingAllowed ? 'permitted' : 'not permitted'}</span>
                        </p>
                    </div>

                    {/* Column 2: Check-in/out Times */}
                    <div className="flex flex-col gap-3">
                        <p className="flex items-center gap-2">
                            <span className="text-xl">🚪</span>
                            <span>Check in: **{listing.checkIn || '01:00 PM'}**</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="text-xl">⏱️</span>
                            <span>Check out: **{listing.checkOut || '11:00 AM'}**</span>
                        </p>
                    </div>
                </div>
            </div>

            <hr className="my-6" />

            {/* --- 2. Policy and Notes Section --- */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Policy and notes</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    
                    {/* Column 1: Payment Schedule & Security Deposit */}
                    <div>
                        <h4 className="font-semibold mb-2">Payment Schedule</h4>
                        <p className="text-gray-700 text-sm">
                            {listing.paymentSchedule || '50% of the total amount is due at time of reservation.'}
                            <br />
                            The remaining amount is to be paid **{listing.paymentDueDays || '0'} day(s)** before arrival.
                        </p>

                        <h4 className="font-semibold mt-4 mb-2">Security deposit</h4>
                        <p className="text-gray-700 text-sm">
                            {listing.securityDeposit ? `₹${listing.securityDeposit} due.` : 'No security deposit is due.'}
                        </p>
                    </div>

                    {/* Column 2: Cancellation Policy */}
                    <div>
                        <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                        <p className="text-gray-700 text-sm">
                            {listing.cancellation || 'All prepaid reservations are non-refundable.'}
                        </p>
                    </div>
                </div>
            </div>

            <hr className="my-6" />

            {/* --- 3. Safety & Property Section --- */}
            <div className="mb-3">
                <h3 className="text-xl font-semibold mb-3">Safety & property</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
                    
                    {/* Item 1: Smoke Alarm */}
                    <p className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-lg">🔥</span> 
                        Smoke alarm: {listing.smokeAlarm ? 'Installed' : 'Not specified'}
                    </p>
                    
                    {/* Item 2: CO Alarm */}
                    <p className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-lg">CO</span> 
                        Carbon monoxide alarm: {listing.coAlarm ? 'Installed' : 'Not specified'}
                    </p>

                    {/* Example of more safety features */}
                    <p className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-lg">🚨</span> 
                        Fire extinguisher: {listing.fireExtinguisher ? 'Provided' : 'Not provided'}
                    </p>

                    {/* Button to show full safety details */}
                    <div className="md:col-span-2">
                        <button
                            className="mt-2 text-blue-600 font-medium"
                            onClick={() => setShowPolicies((p) => ({ ...p, safety: !p.safety }))}
                        >
                            {showPolicies.safety ? 'Show less safety details' : 'Show full safety details'}
                        </button>
                        {showPolicies.safety && (
                            <p className="mt-2 text-gray-700 max-w-2xl text-sm">
                                {listing.safetyFull || 'Includes full details on emergency contacts, pathways, and locking mechanisms.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

        </section>
    );
}