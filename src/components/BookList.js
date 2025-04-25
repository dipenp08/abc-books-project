import React from 'react';

const BookList = ({ books, onDelete, onEdit }) => {
  // Fallback to empty array if books is undefined or not an array
  const validBooks = Array.isArray(books) ? books : [];

  if (validBooks.length === 0) {
    return (
      <div style={{ margin: '20px', textAlign: 'center' }}>
        <p>No books available. Try adding one!</p>
      </div>
    );
  }

  return (
    <div style={{ margin: '20px' }}>
      {validBooks.map((book) => (
        <div
          key={book.bookId}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          {book.imageUrl && (
            <img
              src={book.imageUrl}
              alt={book.Title}
              style={{
                width: '80px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <h3>{book.Title}</h3>
            <p>Authors: {book.Authors}</p>
            <p>Publisher: {book.Publisher}</p>
            <p>Year: {book.Year}</p>
            <div>
              <button
                onClick={() => onEdit(book)}
                style={{
                  marginRight: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(book.bookId)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
