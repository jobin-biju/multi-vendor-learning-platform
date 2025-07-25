import React, { useState, useEffect, useRef } from 'react';

const SearchOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Fitness equipment', 'Yoga mats', 'Training courses', 'Sports nutrition'
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  
  // Mock categories and popular searches for demonstration
  const categories = [
    { id: 1, name: 'Fitness', icon: '🏋️' },
    { id: 2, name: 'Sports', icon: '⚽' },
    { id: 3, name: 'Nutrition', icon: '🥗' },
    { id: 4, name: 'Courses', icon: '📚' },
  ];
  
  const popularSearches = [
    'Home workout', 'Weight loss', 'Protein supplements', 'Running shoes'
  ];

  // Mock search results
  const mockSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: 'Premium Yoga Mat', category: 'Fitness', price: '$45.99', image: '/api/placeholder/60/60' },
        { id: 2, title: 'Professional Training Course', category: 'Courses', price: '$129.99', image: '/api/placeholder/60/60' },
        { id: 3, title: 'Sports Nutrition Guide', category: 'Nutrition', price: '$24.99', image: '/api/placeholder/60/60' },
        { id: 4, title: 'Home Gym Equipment Set', category: 'Fitness', price: '$349.99', image: '/api/placeholder/60/60' },
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
    }, 300);
  };
  
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    mockSearch(query);
  };
  
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save to recent searches (avoid duplicates)
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev].slice(0, 4));
      }
      
      // Here you would typically redirect to search results page
      console.log('Searching for:', searchQuery);
      
      // For demo, we'll just close the overlay
      // setIsOpen(false);
    }
  };
  
  const handleClickSearch = (term) => {
    setSearchQuery(term);
    mockSearch(term);
  };
  
  const toggleSearchOverlay = () => {
    setIsOpen(prev => !prev);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Search Trigger Button */}
      <button 
        onClick={toggleSearchOverlay}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          background: '#2fbfa7',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '500',
          boxShadow: '0 2px 8px rgba(47, 191, 167, 0.25)',
          transition: 'all 0.2s ease'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Search
      </button>
      
      {/* Search Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'auto'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '800px',
            marginTop: '80px',
            marginBottom: '40px',
            height: 'fit-content',
            maxHeight: 'calc(100vh - 120px)',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Search Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #eaeaea',
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#9ca3af', marginRight: '12px' }}>
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <form onSubmit={handleSubmitSearch} style={{ flex: 1 }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search for products, courses, and more..."
                  style={{
                    width: '100%',
                    border: 'none',
                    fontSize: '16px',
                    padding: '8px 0',
                    outline: 'none'
                  }}
                />
              </form>
              <button 
                onClick={toggleSearchOverlay}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Search Content */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '16px 24px 24px 24px'
            }}>
              {searchQuery && searchResults.length > 0 ? (
                // Search Results
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '16px' }}>
                    Search Results
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {searchResults.map(result => (
                      <div key={result.id} style={{
                        display: 'flex',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        alignItems: 'center'
                      }}>
                        <img 
                          src={result.image} 
                          alt={result.title} 
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            borderRadius: '6px',
                            objectFit: 'cover',
                            marginRight: '16px'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                            {result.title}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                              {result.category}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#2fbfa7' }}>
                              {result.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery && searchResults.length === 0 ? (
                // No Results
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#9ca3af' }}>
                      <path d="M10 21H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12.5 5.5L12.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8.5 7.5L7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M16.5 7.5L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M18 14.5C17.9 15.8 17.3 17 16.4 17.9L16 18.3C15.4 18.9 15 19.7 15 20.6V21H9V20.6C9 19.7 8.6 18.9 8 18.3L7.6 17.9C6.7 17 6.1 15.8 6 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12.5 13.5C14.1569 13.5 15.5 12.1569 15.5 10.5C15.5 8.84315 14.1569 7.5 12.5 7.5C10.8431 7.5 9.5 8.84315 9.5 10.5C9.5 12.1569 10.8431 13.5 12.5 13.5Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    No results found
                  </h3>
                  <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto' }}>
                    We couldn't find anything matching "{searchQuery}". Try using different keywords or browse categories below.
                  </p>
                </div>
              ) : (
                // Default Content
                <>
                  {/* Categories */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '16px' }}>
                      Categories
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                      {categories.map(category => (
                        <div 
                          key={category.id} 
                          onClick={() => handleClickSearch(category.name)}
                          style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: '12px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                            {category.icon}
                          </div>
                          <span style={{ fontWeight: '500' }}>
                            {category.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent Searches */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Recent Searches</span>
                      {recentSearches.length > 0 && (
                        <button 
                          onClick={() => setRecentSearches([])}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#2fbfa7', 
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          Clear all
                        </button>
                      )}
                    </h3>
                    
                    {recentSearches.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {recentSearches.map((search, index) => (
                          <div 
                            key={index}
                            onClick={() => handleClickSearch(search)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '16px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px', color: '#6b7280' }}>
                              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            {search}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        No recent searches
                      </p>
                    )}
                  </div>
                  
                  {/* Popular Searches */}
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '16px' }}>
                      Popular Searches
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {popularSearches.map((search, index) => (
                        <div 
                          key={index}
                          onClick={() => handleClickSearch(search)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#f0f9f8',
                            borderRadius: '16px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            color: '#2fbfa7',
                            fontWeight: '500'
                          }}
                        >
                          {search}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchOverlay;