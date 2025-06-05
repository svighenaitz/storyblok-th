import React, { useState, useEffect, useCallback } from 'react';
import './SubmissionsTable.css';
import { useSubmission } from '@/contexts/SubmissionContext';

interface Submission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

const SubmissionsTable: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useSubmission();

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/.netlify/functions/get-contact-submissions');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error: ${response.status} ${response.statusText}`
        );
      }
      
      const data = await response.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to load submissions. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions, refreshTrigger]);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid date';
    }
  };



  if (loading) {
    return (
      <div className="submissions-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="submissions-container">
        <div className="error-state">
          <h3>Error Loading Submissions</h3>
          <p>{error}</p>
          <button 
            onClick={fetchSubmissions} 
            className="retry-button"
          >
            Retry
          </button>
          <button 
            className="back-button"
          >
            Back to Form
          </button>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="submissions-container">
        <div className="empty-state">
          <h3>No Submissions Yet</h3>
          <p>There are no contact form submissions to display.</p>
          <button 
            className="back-button"
          >
            Back to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="submissions-container">
      <div className="submissions-header">
        <h2>Contact Form Submissions</h2>
      </div>
      
      <div className="table-responsive">
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr 
                key={submission.id} 
                className={!submission.read ? 'unread' : ''}
              >
                <td data-label="Date">
                  <div className="cell-content">
                    {formatDate(submission.createdAt)}
                  </div>
                </td>
                <td data-label="Name">
                  <div className="cell-content">
                    {`${submission.firstName} ${submission.lastName}`}
                  </div>
                </td>
                <td data-label="Email">
                  <div className="cell-content">
                    <a 
                      href={`mailto:${submission.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="email-link"
                    >
                      {submission.email}
                    </a>
                  </div>
                </td>
                <td data-label="Message" className="message-cell">
                  <div className="cell-content">
                    {submission.message}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="submissions-footer">
        <p>Total submissions: {submissions.length}</p>
      </div>
    </div>
  );
};

export default SubmissionsTable;
