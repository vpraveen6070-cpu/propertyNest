import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EnquiryModal({ property, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    sender_name: user ? user.name : '',
    sender_email: user ? user.email : '',
    sender_phone: user ? user.phone || '' : '',
    message: `Hi, I am interested in property ${property.ref_number} (${property.title}). Please contact me with more information.`
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: property.id,
        ...formData
      })
    })
    .then(res => res.json())
    .then(data => {
      setSubmitting(false);
      if (data.enquiry) {
        setSuccess(true);
      } else {
        alert(data.error || 'Failed to send enquiry.');
      }
    })
    .catch(() => {
      setSubmitting(false);
      alert('Error submitting enquiry.');
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={56} style={{ color: 'var(--success)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Enquiry Dispatched!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Your message regarding <strong>{property.title}</strong> has been sent directly to {property.owner?.name || 'the seller'}.
            </p>
            <button className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>Contact Seller</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Listing Ref: <strong>{property.ref_number}</strong> | Owner: <strong>{property.owner?.name}</strong>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Full Name</label>
                <input 
                  type="text" 
                  value={formData.sender_name} 
                  onChange={e => setFormData({ ...formData, sender_name: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.sender_email} 
                    onChange={e => setFormData({ ...formData, sender_email: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.sender_phone} 
                    onChange={e => setFormData({ ...formData, sender_phone: e.target.value })} 
                    placeholder="+91 98765 43210" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea 
                  rows={4} 
                  value={formData.message} 
                  onChange={e => setFormData({ ...formData, message: e.target.value })} 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={submitting}>
                <Send size={16} />
                <span>{submitting ? 'Sending Enquiry...' : 'Submit Enquiry'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
