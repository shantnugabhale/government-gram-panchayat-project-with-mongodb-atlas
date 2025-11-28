import React, { useState, useEffect, useRef } from "react";
import { Button } from '@mui/material';
import { db } from '@/services/dataStore'; // Backend data service import
import { doc, getDoc } from '@/services/dataStore'; // Document helpers

// Mock Link component
const Link = ({ to, children, ...props }) => (
  <a href={to} {...props} style={{ textDecoration: 'none', ...props.style }}>
    {children}
  </a>
);

// Mock useLocation hook
const useLocation = () => ({ pathname: "/" });

// Normalize paths
const isPathMatch = (locationPath, parentName, itemName) => {
  // Special case for "कार्यक्रम" which should map to "सण-उत्सव"
  if (parentName === "ग्रामपंचायत" && itemName === "कार्यक्रम") {
    return locationPath === "/ग्रामपंचायत-सण-उत्सव";
  }
  
  // Replace spaces and slashes with dashes to match App.jsx route format
  const normalizeDash = str => str.replace(/[\s\/]+/g, "-");
  const normalizeConcat = str => str.replace(/\s+/g, "");
  const normalizeSpace = str => str;
  const dashed = `/${normalizeDash(parentName)}-${normalizeDash(itemName)}`;
  const concat = `/${normalizeConcat(parentName)}${normalizeConcat(itemName)}`;
  const space = `/${normalizeSpace(parentName)} ${normalizeSpace(itemName)}`;
  return locationPath === dashed || locationPath === concat || locationPath === space;
};

// Generate link path (use dashes for both parent and item; convert slashes)
const getLinkPath = (parentName, itemName) => {
  // Special case for "कार्यक्रम" which should map to "सण-उत्सव"
  if (parentName === "ग्रामपंचायत" && itemName === "कार्यक्रम") {
    return "/ग्रामपंचायत-सण-उत्सव";
  }
  return `/${parentName.replace(/[\s\/]+/g, "-")}-${itemName.replace(/[\s\/]+/g, "-")}`;
};

// Dropdown Button
const DropdownButton = ({ title, anchor, handleOpen, handleClose, items, parentName, location }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => {
        setIsHovered(true);
        handleOpen({ currentTarget: document.activeElement });
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        handleClose();
      }}
    >
      <button
        onClick={handleOpen}
        style={{
          background: 'none',
          border: 'none',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: items.some(item => isPathMatch(location.pathname, parentName, item)) ? "#2196f3" : "black",
          borderBottom: items.some(item => isPathMatch(location.pathname, parentName, item)) ? "2px solid #f32121ff" : "none",
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '16px',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
        }}
      >
        {title}
        <span style={{
          fontSize: "20px",
          transition: "transform 0.3s",
          transform: anchor ? "rotate(180deg)" : "rotate(0deg)",
        }}>▼</span>
      </button>

      {anchor && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            padding: '8px 0',
            minWidth: '200px',
            zIndex: 1000,
            animation: 'slideDown 0.3s ease-out',
            border: '1px solid #e0e0e0'
          }}
        >
          {items.map((item, index) => (
            <Link
              key={index}
              to={getLinkPath(parentName, item)}
              style={{
                display: 'block',
                padding: '12px 20px',
                color: isPathMatch(location.pathname, parentName, item) ? '#2196f3' : '#333',
                background: isPathMatch(location.pathname, parentName, item) ? '#f0f8ff' : 'transparent',
                transition: 'all 0.2s ease',
                borderLeft: isPathMatch(location.pathname, parentName, item) ? '4px solid #2196f3' : '4px solid transparent'
              }}
              onClick={handleClose}
              onMouseEnter={(e) => {
                if (!isPathMatch(location.pathname, parentName, item)) {
                  e.target.style.background = '#f5f5f5';
                  e.target.style.color = '#2196f3';
                  e.target.style.transform = 'translateX(8px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isPathMatch(location.pathname, parentName, item)) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#333';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              {item}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

// Mobile Menu
const MobileMenu = ({ isOpen, onClose, navLinks, location }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '280px',
      height: '100vh',
      background: '#f8f9fa',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
      zIndex: 2000,
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease',
      overflowY: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #ddd',
        background: 'white'
      }}>
        <h3 style={{ margin: 0, color: 'black' }}>मेनू</h3>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'black' }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '20px 0' }}>
        {navLinks.map((link, i) => (
          <div key={i}>
            {link.dropdown ? (
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'black'
                  }}
                >
                  {link.name}
                  <span style={{
                    transition: 'transform 0.3s',
                    transform: openDropdown === link.name ? 'rotate(180deg)' : 'rotate(0)'
                  }}>▼</span>
                </button>
                {openDropdown === link.name && (
                  <div style={{ background: '#f0f0f0' }}>
                    {link.dropdown.map((item, j) => (
                      <Link
                        key={j}
                        to={getLinkPath(link.name, item)}
                        onClick={onClose}
                        style={{
                          display: 'block',
                          padding: '10px 40px',
                          color: isPathMatch(location.pathname, link.name, item) ? '#2196f3' : '#666',
                          fontWeight: isPathMatch(location.pathname, link.name, item) ? 'bold' : 'normal'
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={link.to}
                onClick={onClose}
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: location.pathname === link.to ? 'bold' : 'normal',
                  color: location.pathname === link.to ? '#2196f3' : 'black'
                }}
              >
                {link.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const [grampanchayatName, setGrampanchayatName] = useState("ग्रामपंचायत नाव");
  const [language, setLanguage] = useState("mr");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [grampanchayatAnchor, setGrampanchayatAnchor] = useState(null);
  const [directoryAnchor, setDirectoryAnchor] = useState(null);
  const [upkramAnchor, setUpkramAnchor] = useState(null);
  const [yojnaAnchor, setYojnaAnchor] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchInputRef = useRef(null);
  const location = useLocation();

  // Fetch Gram Panchayat name from data service
  useEffect(() => {
    const fetchGpName = async () => {
      const docRef = doc(db, 'grampanchayat', 'profile');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // 'title' field मधून नाव घ्या
          setGrampanchayatName(docSnap.data().title || "ग्रामपंचायत नाव");
        }
      } catch (error) {
        console.error("Error fetching Gram Panchayat name:", error);
      }
    };
    fetchGpName();
  }, []);

  const navLinks = [
    { name: "मुख्य पृष्ठ", to: "/" },
    // Keep display names as-is; path builder will convert to App routes
    { name: "ग्रामपंचायत", dropdown: ["माहिती", "नकाशा", "सदस्य", "ग्रामसभेचे निर्णय", "पुरस्कार", "कार्यक्रम", "सुविधा", "ई-सेवा", "पर्यटन सथळे"] },
    { name: "निर्देशिका", dropdown: ["जनगणना", "दूरध्वनी क्रमांक", "हेल्पलाईन", "रुग्णालय"] },
    { name: "उपक्रम", dropdown: ["स्वच्छ गाव", "विकेल-ते-पिकेल", "माझे-कुटुंब माझी-जबाबदारी", "तंटामुक्त गाव", "जलयुक्त शिवार", "तुषारगावड", "रोती पूरक व्यवसाय", "गादोली", "मतदार नोंदणी", "सर्व शिक्षा अभियान", "क्रीडा स्पर्धा", "आरोग्य शिबिर", "कचऱ्याचे नियोजन", "बायोगॅस निर्मिती", "सेंद्रिय खत निर्मिती"] },
    { name: "योजना", dropdown: ["राज्य सरकार योजना", "केंद्र सरकार योजना"] },
    { name: "प्रगत शेतकरी", to: "/pragat-shetkari" },
    { name: "ई-शिक्षण", to: "/e-shikshan" },
    { name: "बातम्या", to: "/batmya" },
    { name: "संपर्क", to: "/sampark" },
    { name: "तक्रार नोंदणी", to: "/तक्रार-नोंदणी" },
  ];

  // Create searchable items array
  const searchableItems = navLinks.flatMap((link) =>
    link.dropdown
      ? link.dropdown.map((item) => ({
          title: item,
          category: link.name,
          path: getLinkPath(link.name, item),
          fullText: `${link.name} - ${item}`
        }))
      : [{ title: link.name, category: "मुख्य", path: link.to, fullText: link.name }]
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseAllDropdowns = () => {
    setGrampanchayatAnchor(null);
    setDirectoryAnchor(null);
    setUpkramAnchor(null);
    setYojnaAnchor(null);
  };

  const toggleLanguage = () => setLanguage(prev => (prev === "mr" ? "en" : "mr"));

  const handleOpen = setter => event => { 
    handleCloseAllDropdowns(); 
    setter(event.currentTarget); 
  };
  
  const handleClose = setter => () => setter(null);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => { 
        if (searchInputRef.current) searchInputRef.current.focus(); 
      }, 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedIndex(-1);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter search results
    const filtered = searchableItems.filter((item) =>
      item.fullText.toLowerCase().includes(query.toLowerCase()) ||
      item.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8); // Limit to 8 results like Google

    setSearchResults(filtered);
  };

  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        window.location.href = searchResults[selectedIndex].path;
      } else if (searchResults.length > 0) {
        window.location.href = searchResults[0].path;
      }
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  };

  const handleResultClick = (path) => {
    window.location.href = path;
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? `<strong>${part}</strong>` 
        : part
    ).join('');
  };

  return (
    <div>
      {mobileOpen && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1500 }} onClick={() => setMobileOpen(false)} />}

      <nav style={{
        background: isScrolled ? 'rgba(248, 249, 250, 0.95)' : '#f8f9fa',
        borderBottom: '2px solid #ccc',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 20px',
          flexWrap: isMobile ? 'nowrap' : 'wrap'
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{
              width: '50px', height: '50px', background: 'linear-gradient(45deg, #3498db, #2196f3)',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 'bold', fontSize: '18px', animation: 'pulse 2s infinite'
            }}>🏛️</div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'black', margin: 0 }}>{grampanchayatName}</h1>
              <p style={{ fontSize: '12px', color: '#666', margin: 0, fontWeight: '500' }}>Grampanchayat Name</p>
            </div>
          </Link>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
            <Link to="/admin/login" style={{ textDecoration: 'none' }}>
               <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                 Admin Login
              </Button>
             </Link>
            {!isMobile && (
              <div style={{
                position: 'relative', 
                display: 'flex', 
                alignItems: 'center',
                background: searchOpen ? '#fff' : 'transparent', 
                borderRadius: '25px',
                padding: searchOpen ? '8px 16px' : '6px', 
                transition: 'all 0.3s ease',
                width: searchOpen ? '350px' : '40px', 
                cursor: searchOpen ? 'text' : 'pointer', 
                border: searchOpen ? '2px solid #2196f3' : '2px solid transparent',
                boxShadow: searchOpen ? '0 2px 8px rgba(33, 150, 243, 0.2)' : 'none'
              }}>
                <span 
                  onClick={handleSearchToggle} 
                  style={{ 
                    fontSize: '20px', 
                    color: searchOpen ? '#2196f3' : 'black', 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  🔍
                </span>
                {searchOpen && (
                  <>
                    <input 
                      ref={searchInputRef} 
                      type="text" 
                      value={searchQuery} 
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      placeholder={language === "mr" ? "शोधा..." : "Search..."} 
                      style={{ 
                        marginLeft: '12px', 
                        flex: 1, 
                        fontSize: '14px', 
                        color: '#333', 
                        background: 'transparent', 
                        border: 'none', 
                        outline: 'none', 
                        width: '100%',
                        fontFamily: 'inherit'
                      }} 
                    />
                    {searchQuery && (
                      <span
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                          setSelectedIndex(-1);
                          searchInputRef.current?.focus();
                        }}
                        style={{
                          fontSize: '18px',
                          color: '#999',
                          cursor: 'pointer',
                          padding: '0 4px',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#666'}
                        onMouseLeave={(e) => e.target.style.color = '#999'}
                      >
                        ✕
                      </span>
                    )}
                  </>
                )}

                {/* Google-like Search Suggestions */}
                {searchOpen && searchResults.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    zIndex: 2000,
                    border: '1px solid #e0e0e0'
                  }}>
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => handleResultClick(result.path)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          background: selectedIndex === index ? '#f0f8ff' : 'white',
                          borderLeft: selectedIndex === index ? '3px solid #2196f3' : '3px solid transparent',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none'
                        }}
                      >
                        <span style={{ 
                          fontSize: '16px',
                          opacity: 0.6,
                          flexShrink: 0
                        }}>
                          🔍
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div 
                            style={{ 
                              fontSize: '14px', 
                              color: '#333',
                              fontWeight: selectedIndex === index ? '500' : 'normal',
                              marginBottom: '2px'
                            }}
                            dangerouslySetInnerHTML={{ 
                              __html: highlightMatch(result.title, searchQuery) 
                            }}
                          />
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#666',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {result.category}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '18px',
                          color: '#ccc',
                          transform: selectedIndex === index ? 'translateX(4px)' : 'translateX(0)',
                          transition: 'transform 0.2s'
                        }}>
                          →
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results Message */}
                {searchOpen && searchQuery && searchResults.length === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    padding: '20px',
                    textAlign: 'center',
                    zIndex: 2000,
                    border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {language === "mr" ? "कोणतेही परिणाम सापडले नाहीत" : "No results found"}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button onClick={toggleLanguage} style={{ fontWeight: 'bold', color: 'white', background: 'linear-gradient(45deg, #2196f3, #21cbf3)', border: '2px solid transparent', fontSize: isMobile ? '12px' : '14px', padding: isMobile ? '6px 12px' : '8px 16px', borderRadius: '25px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)' }}>
              {language === "mr" ? "मराठी → English" : "English → मराठी"}
            </button>

            {isMobile && <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu" style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'black' }}>☰</button>}
          </div>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '10px 20px', flexWrap: 'wrap', background: 'rgba(255, 255, 255, 0.7)', borderTop: '1px solid #e0e0e0' }}>
            {navLinks.map((link, i) =>
              link.dropdown ? (
                <DropdownButton
                  key={i}
                  title={link.name}
                  anchor={link.name === "ग्रामपंचायत" ? grampanchayatAnchor : link.name === "निर्देशिका" ? directoryAnchor : link.name === "उपक्रम" ? upkramAnchor : yojnaAnchor}
                  handleOpen={link.name === "ग्रामपंचायत" ? handleOpen(setGrampanchayatAnchor) : link.name === "निर्देशिका" ? handleOpen(setDirectoryAnchor) : link.name === "उपक्रम" ? handleOpen(setUpkramAnchor) : handleOpen(setYojnaAnchor)}
                  handleClose={link.name === "ग्रामपंचायत" ? handleClose(setGrampanchayatAnchor) : link.name === "निर्देशिका" ? handleClose(setDirectoryAnchor) : link.name === "उपक्रम" ? handleClose(setUpkramAnchor) : handleClose(setYojnaAnchor)}
                  items={link.dropdown}
                  parentName={link.name}
                  location={location}
                />
              ) : (
                <Link key={i} to={link.to} style={{
                  textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', padding: '8px 16px', borderRadius: '25px',
                  transition: 'all 0.3s ease', cursor: 'pointer',
                  color: location.pathname === link.to ? 'white' : 'black',
                  background: location.pathname === link.to ? 'linear-gradient(45deg, #2196f3, #21cbf3)' : 'transparent',
                  boxShadow: location.pathname === link.to ? '0 4px 15px rgba(33, 150, 243, 0.3)' : 'none'
                }}>{link.name}</Link>
              )
            )}
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} navLinks={navLinks} location={location} />
    </div>
  );
};

export default Navbar;