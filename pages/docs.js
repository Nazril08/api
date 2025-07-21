import Head from 'next/head';
import { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SearchBar = ({ onSearch }) => {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 18 }}>
      <input
        type="text"
        placeholder="Search endpoints..."
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '10px 16px',
          fontSize: '1.1rem',
          border: '1.5px solid #d1d5db',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          outline: 'none',
          background: '#f7f8fa',
          transition: 'border 0.2s',
        }}
      />
    </div>
  );
};

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
          @media (max-width: 600px) {
            .custom-header { padding: 18px 0 0 0 !important; }
            .custom-header img { height: 48px !important; }
            .custom-header h1 { font-size: 1.5rem !important; }
          }
        `}</style>
      </Head>
      <div className="custom-header" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        padding: '32px 0 18px 0',
        margin: '32px auto 18px auto',
        maxWidth: 700,
        width: '95%'
      }}>
        <img src="/image.png" alt="Yeyo Logo" style={{ height: 64, width: 'auto', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 10 }} />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#2563eb', letterSpacing: '-1px', textAlign: 'center' }}>Yeyo Rest API</h1>
        <SearchBar onSearch={setSearchTerm} />
      </div>
      <SwaggerUI url="/api/swagger.json" />
    </>
  );
};

export default Docs; 