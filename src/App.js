import React, { useState, useCallback } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { API } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import './aws-config';
import Dashboard from './components/Dashboard';
import ViewBooks from './components/ViewBooks';
import AddBook from './components/AddBook';
import Profile from './components/Profile';

function App() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAddBook = useCallback(async (newBook) => {
    try {
      setError(null);
      const response = await API.post('books', '/books', { 
        body: newBook 
      });
      console.log('Book added successfully:', response);
      navigate('/dashboard'); // Redirect to dashboard after successful addition
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Failed to add book. Please try again.');
    }
  }, [navigate]);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '20px'
        }}>
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#000',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '10px' }}>📚</span>
              <h1 style={{ margin: 0 }}>ABCBooks</h1>
            </div>
            <button 
              onClick={signOut}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid white',
                cursor: 'pointer'
              }}
            >
              Sign out
            </button>
          </header>
          <main>
            {error && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#ffebee', 
                color: '#c62828', 
                marginBottom: '20px',
                borderRadius: '4px' 
              }}>
                {error}
              </div>
            )}
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/view-books" element={<ViewBooks />} />
              <Route 
                path="/add-book" 
                element={
                  <AddBook 
                    onAdd={handleAddBook}
                    onCancel={() => navigate('/dashboard')}
                  />
                } 
              />
              <Route path="/profile" element={<Profile user={user} />} />
            </Routes>
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
