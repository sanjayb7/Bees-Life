import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 


function AirtableForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      fields: {
        Name: name,
        Email: email,
        Contact: contact,
      },
    };

    try {
      const response = await axios.post(
        'https://api.airtable.com/v0/appycAhQVXdCyPbx9/tblvtxaUIwQIdmqlx',
        data,
        {
          headers: {
            Authorization: `Bearer patBNlVsYnVzRV3aV.7933bc6b05caa11b709acddd85e9c4d5d31108f9d0a30e0caff4ae27323eb0f2`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Record created:', response.data);
      navigate('/list');
      // Add any success handling code here
    } catch (error) {
      console.error('Error creating record:', error);
      // Add error handling code here
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="airtable-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
        <textarea
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
  );
}

export default AirtableForm;
