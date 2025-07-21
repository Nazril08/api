import Head from 'next/head';
import { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SearchBar = ({ onSearch }) => (
  <div style={{ width: '100%', maxWidth: 420, margin: '18px 0 0 0' }}>
    <input
      type="text"
      placeholder="Search endpoints..."
      onChange={(e) => onSearch(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 16px',
        fontSize: '1.05rem',
        border: '1.5px solid #d1d5db',
        borderRadius: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        outline: 'none',
        background: '#f7f8fa',
        transition: 'border 0.2s',
      }}
    />
  </div>
);

const Docs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filterEndpoints = () => {
      if (!document.querySelector('.swagger-ui')) return;
      const operations = document.querySelectorAll('.opblock-tag-section');
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      operations.forEach(section => {
        let sectionVisible = false;
        const opblocks = section.querySelectorAll('.opblock');
        opblocks.forEach(opblock => {
          const path = opblock.querySelector('.opblock-summary-path')?.innerText.toLowerCase() || '';
          const description = opblock.querySelector('.opblock-summary-description')?.innerText.toLowerCase() || '';
          const opblockDescription = opblock.querySelector('.opblock-description-wrapper p')?.innerText.toLowerCase() || '';
          if (path.includes(lowerCaseSearchTerm) || description.includes(lowerCaseSearchTerm) || opblockDescription.includes(lowerCaseSearchTerm)) {
            opblock.style.display = '';
            sectionVisible = true;
          } else {
            opblock.style.display = 'none';
          }
        });
        section.style.display = sectionVisible ? '' : 'none';
      });
    };
    const observer = new MutationObserver(filterEndpoints);
    const swaggerUIContainer = document.querySelector('body'); 
    if (swaggerUIContainer) {
      observer.observe(swaggerUIContainer, {
        childList: true,
        subtree: true,
      });
    }
    filterEndpoints();
    return () => {
      if (swaggerUIContainer) {
        observer.disconnect();
      }
    };
  }, [searchTerm]);

  return (
    <>
      <Head>
        <title>Yeyo Rest API - Documentation</title>
        <link rel="stylesheet" href="/css/swagger-material.css" />
        <style>{`
          .swagger-ui .info { display: none !important; }
          .custom-header-bar { display: flex; align-items: center; gap: 16px; padding: 32px 0 0 0; }
          .custom-header-bar img { height: 48px; width: auto; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
          .custom-header-bar h1 { font-size: 2rem; font-weight: 800; margin: 0; color: #2563eb; letterSpacing: -1px; }
          @media (max-width: 600px) {
            .custom-header-bar { flex-direction: column; gap: 8px; padding: 18px 0 0 0; }
            .custom-header-bar img { height: 38px !important; }
            .custom-header-bar h1 { font-size: 1.2rem !important; }
          }
        `}</style>
      </Head>
      <div className="custom-header-bar">
        <img src="/image.png" alt="Yeyo Logo" />
        <h1>Yeyo Rest API</h1>
      </div>
      <div style={{ width: '100%', maxWidth: 420, margin: '18px 0 32px 0', marginLeft: 32 }}>
        <SearchBar onSearch={setSearchTerm} />
      </div>
      <SwaggerUI url="/api/swagger.json" />
    </>
  );
};

export default Docs; 