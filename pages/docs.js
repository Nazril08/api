import Head from 'next/head';
import { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SearchBar = ({ onSearch }) => {
  return (
    <div style={{ padding: '10px', backgroundColor: '#f7f7f7', borderBottom: '1px solid #ddd' }}>
      <input
        type="text"
        placeholder="Search endpoints..."
        onChange={(e) => onSearch(e.target.value)}
        style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
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
      </Head>
      <SearchBar onSearch={setSearchTerm} />
      <SwaggerUI url="/api/swagger.json" />
    </>
  );
};

export default Docs; 