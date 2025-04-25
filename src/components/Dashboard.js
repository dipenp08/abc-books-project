import React, { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import ViewBooks from './ViewBooks';
import EditBooks from './EditBooks';
import "./Dashboard.css";

// Define the API endpoint (replace if it changes)
const API_ENDPOINT = 'https://p9gff0jso3.execute-api.us-east-1.amazonaws.com/dev';

const Dashboard = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast({ open: false, message: '', type: '' }), 2500);
  };

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await API.get('books', '/books');
      const booksData = JSON.parse(response.body);
      setBooks(booksData);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBook = async (updatedBook) => {
    setError(null);
    setIsLoading(true);
    try {
      const url = `${API_ENDPOINT}/books/${updatedBook.bookId}`;
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Title: updatedBook.Title,
          Authors: updatedBook.Authors,
          Publisher: updatedBook.Publisher,
          Year: updatedBook.Year
        })
      };
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const updatedItem = await response.json();
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.bookId === updatedBook.bookId ? updatedItem : book
        )
      );
      setEditingBook(null);
      showToast('Book updated successfully!', 'success');
      setTimeout(fetchBooks, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update book. Please try again.');
      showToast('Failed to update book.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    setError(null);
    setIsLoading(true);
    try {
      const id = String(bookId);
      await API.del('books', `/books/${id}`);
      setBooks(prevBooks => prevBooks.filter(book => book.bookId !== id));
      showToast('Book deleted successfully!', 'success');
      setTimeout(fetchBooks, 1000);
    } catch (err) {
      setError('Failed to delete book. Please try again.');
      showToast('Failed to delete book.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📚 ABC Books Dashboard</h1>
      {toast.open && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          background: toast.type === 'success' ? '#4caf50' : '#f44336',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>{toast.message}</div>
      )}
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
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate("/view-books")}> <h3>Total Books</h3> <p>{books ? books.length : 0}</p> </div>
        <div className="dashboard-card" onClick={() => navigate("/add-book")}> <h3>Add New Book</h3> <p>+</p> </div>
        <div className="dashboard-card" onClick={() => navigate("/profile")}> <h3>My Profile</h3> <p>👤</p> </div>
        <div className="dashboard-card" onClick={() => navigate("/dashboard")}> <h3>Dashboard</h3> <p>🏠</p> </div>
      </div>
      <h2>Book Collection</h2>
      <p>Create, Read, Update, or Delete a book</p>
      <button
        onClick={() => navigate("/add-book")}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#00bcd4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          marginBottom: '20px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1
        }}
        disabled={isLoading}
      >
        Add Book
      </button>
      {editingBook && (
        <EditBooks
          book={editingBook}
          onUpdate={handleEditBook}
          onCancel={() => setEditingBook(null)}
        />
      )}
      <ViewBooks
        books={books}
        onEdit={setEditingBook}
        onDelete={isLoading ? () => {} : handleDeleteBook}
      />
    </div>
  );
};

export default Dashboard;
