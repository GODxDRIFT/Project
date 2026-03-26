import React, { useState } from 'react';

function ListingReviewDetails({ reviews = [], handleDeleteReview }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      handleDeleteReview(reviewId);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      review.author?.toLowerCase().includes(term) ||
      review.comment?.toLowerCase().includes(term) ||
      review.rating?.toString().includes(term)
    );
  });

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '40px auto',
      padding: '0 16px',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
    },
    searchBox: {
      width: '100%',
      padding: '12px 16px',
      marginBottom: '30px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      outline: 'none',
    },
    card: {
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#fff',
      transition: 'box-shadow 0.3s ease',
    },
    cardHover: {
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #eee',
      paddingBottom: '12px',
      marginBottom: '16px',
    },
    author: {
      margin: '0',
      fontSize: '20px',
      fontWeight: '600',
      color: '#333',
    },
    rating: {
      fontSize: '22px',
      letterSpacing: '2px',
    },
    comment: {
      margin: '12px 0',
      fontSize: '16px',
      color: '#555',
      lineHeight: '1.6',
    },
    deleteButton: {
      backgroundColor: '#ff4d4f',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    noReviews: {
      textAlign: 'center',
      color: '#999',
      fontSize: '18px',
      marginTop: '40px',
    },
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="🔍 Search by name, rating or comment..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBox}
      />

      {filteredReviews.length > 0 ? (
        filteredReviews.map((review) => (
          <div
            key={review._id}
            style={styles.card}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = styles.cardHover.boxShadow}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = styles.card.boxShadow}
          >
            <div style={styles.header}>
              <h3 style={styles.author}>{review.author}</h3>
              <div style={styles.rating}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < review.rating ? '#38a641ff' : '#e4e5e9' }}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p style={styles.comment}>{review.comment}</p>
            <button
              onClick={() => handleDelete(review._id)}
              style={styles.deleteButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d9363e'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4f'}
            >
              Delete Review
            </button>
          </div>
        ))
      ) : (
        <p style={styles.noReviews}>No reviews found matching your search.</p>
      )}
    </div>
  );
}

export default ListingReviewDetails;
