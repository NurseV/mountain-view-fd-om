// client/src/components/AddApplicantModal.jsx
import React, { useState } from 'react';

const AddApplicantModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    notes: '',
  });

  if (!isOpen) {
    return null;
  }

  const { first_name, last_name, email, phone_number, notes } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose(); // Close modal after submission
  };

  const modalStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
  };
  const modalContentStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '5px',
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h2>Add New Applicant</h2>
        <form onSubmit={handleSubmit}>
          <input name="first_name" value={first_name} onChange={onChange} placeholder="First Name" required />
          <input name="last_name" value={last_name} onChange={onChange} placeholder="Last Name" required />
          <input name="email" value={email} onChange={onChange} placeholder="Email" type="email" />
          <input name="phone_number" value={phone_number} onChange={onChange} placeholder="Phone Number" />
          <textarea name="notes" value={notes} onChange={onChange} placeholder="Notes"></textarea>
          <button type="submit">Add Applicant</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddApplicantModal;