// client/src/components/ApplicantTrackingPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddApplicantModal from './AddApplicantModal';

const ApplicantTrackingPage = () => {
    const [applicants, setApplicants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchApplicants = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/applicants');
            setApplicants(res.data);
        } catch (err) {
            console.error("Failed to fetch applicants", err);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    const handleAddApplicant = async (formData) => {
        try {
            await axios.post('http://localhost:5000/api/applicants', formData);
            fetchApplicants(); 
        } catch (err) {
            console.error("Failed to add applicant", err);
        }
    };

    // --- NEW: Function to handle promoting an applicant ---
    const handlePromote = async (applicantId) => {
        if (!window.confirm("Are you sure you want to promote this applicant to an employee? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await axios.post(`http://localhost:5000/api/applicants/${applicantId}/promote`);
            
            // Show the temporary credentials to the admin
            alert(
                `Promotion Successful!\n\n` +
                `New Employee: ${res.data.newPersonnel.first_name} ${res.data.newPersonnel.last_name}\n` +
                `Username: ${res.data.finalUsername}\n` +
                `Temporary Password: ${res.data.tempPassword}\n\n` +
                `Please instruct the new user to log in and change their password immediately.`
            );

            fetchApplicants(); // Refresh the list to show the "Hired" status
        } catch (err) {
            alert('Promotion failed. Please check the server logs.');
            console.error("Failed to promote applicant", err);
        }
    };

    return (
        <div>
            <h2>Applicant Tracking</h2>
            <button onClick={() => setIsModalOpen(true)}>Add New Applicant</button>
            <AddApplicantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddApplicant}
            />
            <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid black', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>Name</th>
                        <th style={{ padding: '8px' }}>Application Date</th>
                        <th style={{ padding: '8px' }}>Status</th>
                        <th style={{ padding: '8px' }}>Actions</th> {/* <-- NEW: Actions column */}
                    </tr>
                </thead>
                <tbody>
                    {applicants.map(applicant => (
                        <tr key={applicant.applicant_id} style={{ borderBottom: '1px solid #ccc' }}>
                            <td style={{ padding: '8px' }}>{applicant.last_name}, {applicant.first_name}</td>
                            <td style={{ padding: '8px' }}>{new Date(applicant.application_date).toLocaleDateString()}</td>
                            <td style={{ padding: '8px' }}>{applicant.status}</td>
                            <td style={{ padding: '8px' }}>
                                {/* -- NEW: Conditionally render the Promote button -- */}
                                {applicant.status !== 'Hired' && (
                                    <button onClick={() => handlePromote(applicant.applicant_id)}>
                                        Promote
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicantTrackingPage;