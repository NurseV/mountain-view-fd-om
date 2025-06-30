// client/src/components/RosterPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom'; // <-- Import Link

const RosterPage = () => {
  // ... (useState, useEffect, and loading/error checks are unchanged) ...

  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/personnel');
        setRoster(res.data);
      } catch (err) {
        setError('Failed to fetch roster.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoster();
  }, [token]);

  if (loading) return <p>Loading Roster...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Department Roster</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {/* ... (table header is unchanged) ... */}
        </thead>
        <tbody>
          {roster.map((person) => (
            <tr key={person.personnel_id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px' }}>
                {/* This is the changed part */}
                <Link to={`/personnel/${person.personnel_id}`}>
                  {person.last_name}, {person.first_name}
                </Link>
              </td>
              <td style={{ padding: '8px' }}>{person.rank}</td>
              <td style={{ padding: '8px' }}>{person.badge_number || 'N/A'}</td>
              <td style={{ padding: '8px' }}>{person.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RosterPage;