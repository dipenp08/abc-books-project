import React from 'react';
import BookList from './BookList';
// import EditBooks from './EditBooks'; // Removed unused import

const ViewBooks = ({ books, onEdit, onDelete }) => {
  return (
    <div style={{ padding: '20px' }}>
      <BookList 
        books={books} 
        onDelete={onDelete} 
        onEdit={onEdit} 
      />
    </div>
  );
};

export default ViewBooks;
