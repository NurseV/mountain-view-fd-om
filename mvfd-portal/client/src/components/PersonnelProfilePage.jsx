// client/src/components/PersonnelProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PersonnelProfilePage = () => {
  const { id } = useParams(); // Gets the 'id' from the URL (e.g., /personnel/1)
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/personnel/${id}`);
        setProfile(res.data);
      } catch (err) {
        setError('Failed to fetch profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <p>Loading Profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div>
      <h2>{profile.first_name} {profile.last_name}'s Profile</h2>
      <p><strong>Rank:</strong> {profile.rank}</p>
      <p><strong>Employee ID:</strong> {profile.employee_id}</p>
      <p><strong>Badge #:</strong> {profile.badge_number || 'N/A'}</p>
      <p><strong>Status:</strong> {profile.status}</p>
      
      <hr />
      <h3>Certifications</h3>
      {profile.certifications.length > 0 ? (
        <ul>
          {profile.certifications.map(cert => <li key={cert.certification_id}>{cert.name}</li>)}
        </ul>
      ) : <p>No certifications on file.</p>}
      
      <hr />
      <h3>Emergency Contacts</h3>
      {profile.emergency_contacts.length > 0 ? (
        <ul>
          {profile.emergency_contacts.map(contact => <li key={contact.contact_id}>{contact.contact_name} ({contact.relationship})</li>)}
        </ul>
      ) : <p>No emergency contacts on file.</p>}
    </div>
  );
};

export default PersonnelProfilePage;