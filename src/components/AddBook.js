import React, { useState } from 'react';

const AddBook = ({ onAdd, onCancel }) => {
  const [newBook, setNewBook] = useState({
    Title: '',
    Authors: '',
    Publisher: '',
    Year: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newBook.Title && newBook.Authors && newBook.Publisher && newBook.Year) {
      setUploading(true);
      let imageUrl = '';
      if (imageFile) {
        try {
          const base64String = await toBase64(imageFile);
          const base64ImageString = base64String.split(',')[1];
          
          const response = await fetch('https://p9gff0jso3.execute-api.us-east-1.amazonaws.com/dev/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              image: base64ImageString
            })
          });

          if (response.ok) {
            const data = await response.json();
            imageUrl = data.imageUrl;
          } else {
            const errorData = await response.json();
            console.error('Upload failed:', errorData);
            alert('Image upload failed');
            setUploading(false);
            return;
          }
        } catch (err) {
          console.error('Upload error:', err);
          alert('Image upload failed');
          setUploading(false);
          return;
        }
      }

      const bookData = {
        ...newBook,
        imageUrl
      };

      onAdd(bookData);
      setNewBook({
        Title: '',
        Authors: '',
        Publisher: '',
        Year: ''
      });
      setImageFile(null);
      setUploading(false);
      if (onCancel) {
        onCancel();
      }
    }
  };

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '20px', 
      marginBottom: '20px',
      borderRadius: '4px'
    }}>
      <h3>Add New Book</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="Title" style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
          <input
            type="text"
            id="Title"
            name="Title"
            value={newBook.Title}
            onChange={handleChange}
            required
            placeholder="Enter book title"
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="Authors" style={{ display: 'block', marginBottom: '5px' }}>Authors:</label>
          <input
            type="text"
            id="Authors"
            name="Authors"
            value={newBook.Authors}
            onChange={handleChange}
            required
            placeholder="Enter authors"
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="Publisher" style={{ display: 'block', marginBottom: '5px' }}>Publisher:</label>
          <input
            type="text"
            id="Publisher"
            name="Publisher"
            value={newBook.Publisher}
            onChange={handleChange}
            required
            placeholder="Enter publisher"
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="Year" style={{ display: 'block', marginBottom: '5px' }}>Year:</label>
          <input
            type="text"
            id="Year"
            name="Year"
            value={newBook.Year}
            onChange={handleChange}
            required
            placeholder="Enter publication year"
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="Image" style={{ display: 'block', marginBottom: '5px' }}>Book Cover Image:</label>
          <input
            type="file"
            id="Image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Book'}
          </button>
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              style={{ 
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddBook;
