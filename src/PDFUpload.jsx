import React, { useState } from 'react';
import './PDFUpload.css';

function PDFUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [apiKey, setApiKey] = useState('');

  // Function to handle API key submission
  const handleApiKeySubmit = async (e) => {
    e.preventDefault();
    if (apiKey) {
      try {
        const response = await fetch('http://localhost:3000/get-api-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey }),
        });

        if (response.ok) {
          console.log('API key sent successfully');
          // Optionally, you can show a success message here
        } else {
          console.log('Failed to send API key');
          // Optionally, you can show an error message here
        }
      } catch (error) {
        console.error('Error sending API key:', error);
      }

      // Clear the API key input field after sending (optional)
      setApiKey('');
    } else {
      alert('Please enter the API key.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('pdfFile', selectedFile);

        const response = await fetch('http://localhost:3000/read-pdf', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('File uploaded and read successfully');
          setShowSuccessNotification(true); // Show success notification
        } else {
          console.log('Failed to upload file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }

      // Clear the file input after upload (optional)
      setSelectedFile(null);
    } else {
      alert('Please select a PDF file to upload.');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Replace 'your-admin-password' with the actual admin password
    if (password === 'AdminOnly1234') {
      setIsPasswordModalOpen(false);
      setIsAdmin(true);
    } else {
      alert('Invalid password. Please try again.');
      setPassword('');
    }
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  return (
    <div className="pdf-upload-container">
      <h2>Upload PDF File</h2>
      {isAdmin && ( // Render the upload button only if the user is an admin
        <form onSubmit={handleFileUpload}>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      )}

      {isAdmin && (
        <div className="api-key-popup">
          <h2>Enter OpenAI API Key</h2>
          <form onSubmit={handleApiKeySubmit}>
            <input
              type="text"
              placeholder="Enter API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button type="submit">Send Key</button>
          </form>
        </div>
      )}

      {/* Password PopUp */}
      {isPasswordModalOpen && (
        <div className="password-popup">
          <h2>Enter Admin Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {/* Success notification */}
      {showSuccessNotification && (
        <div className="success-notification">
          <p>PDF file uploaded and read successfully!</p>
          <button onClick={() => setShowSuccessNotification(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default PDFUpload;
