import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditCategory = () => {
  const styles = {
    container: {
      background: '#f0f4f8',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '20px',
    },
    card: {
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      padding: '30px',
      width: '100%',
      maxWidth: '500px',
    },
    title: {
      fontWeight: '600',
      marginBottom: '20px',
      fontSize: '24px',
      color: '#333',
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '500',
      color: '#555',
    },
    input: {
      backgroundColor: '#f9f9f9',
      color: '#333',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      width: '100%',
      marginBottom: '20px',
      outline: 'none',
    },
    textarea: {
      backgroundColor: '#f9f9f9',
      color: '#333',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      width: '100%',
      marginBottom: '20px',
      outline: 'none',
      resize: 'none',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
    },
    btnPrimary: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      cursor: 'pointer',
    },
    btnSecondary: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      cursor: 'pointer',
    },
  };

  const location = useLocation();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let edits = {
      id: location.state.id,
    };
    fetch('http://localhost:4000/multivendor/editcategory', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(edits),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCategory(data.category);
        setDescription(data.description);
      })
      .catch((err) => {
        console.log("error", err);
      });
  }, []); // ✅ added dependency array to avoid re-renders

  const handleUpdate = (e) => {
    e.preventDefault(); // ✅ prevent default form submission
    let param = {
      id: location.state.id,
      category: category,
      description: description
    };
    fetch('http://localhost:4000/multivendor/updatecategory', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(param),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate('/'); // ✅ navigate to view category after update
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Category</h2>
        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor="categoryName" style={styles.label}>Category Name</label>
            <input
              type="text"
              placeholder="Enter category name"
              style={styles.input}
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />
          </div>
          <div>
            <label htmlFor="categoryDescription" style={styles.label}>Description</label>
            <textarea
              placeholder="Enter description"
              style={styles.textarea}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows={4}
            ></textarea>
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.btnPrimary}>Update</button>
            <button
              type="button"
              style={styles.btnSecondary}
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
