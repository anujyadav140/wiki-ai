"use client"
import React, { useEffect } from 'react';

interface Section {
  line: string;
  index: number;
}

const selectedHeadings = ['People known as Alexander', 'Rulers of antiquity', 'Rulers of the Middle Ages'];

const jsoup = require('jssoup');

const ScrapeData: React.FC = () => {
  useEffect(() => {
    const fetchWikiData = async () => {
      // Define the Wikipedia API endpoint
      const url = 'https://en.wikipedia.org/w/api.php';

      // Set parameters for the API request
      const params = new URLSearchParams({
        action: 'parse',
        format: 'json',
        prop: 'text',
        page: 'Alexander',
      });

      try {
        // Make the API request to get the page content
        const response = await fetch(`${url}?${params}`);
        const data = await response.json();

        // Extract the page content from the API response
        const contentHtml = data.parse.text['*'];

        // Parse the HTML content with JSSoup
        const soup = new jsoup(contentHtml);

        // Iterate through the target headings and extract the corresponding sections
        for (const targetHeading of selectedHeadings) {
          const targetSection = soup.find(`span#${targetHeading.replace(' ', '_')}`);

          // If the target section is found, extract its content
          if (targetSection) {
            let sectionContent = '';
            let elem = targetSection.nextSibling;

            // Extract the section content until the next heading or span element is encountered
            while (elem) {
              if (elem.name === 'h2' || elem.name === 'span') {
                break;
              } else if (elem.name === 'p') {
                sectionContent += elem.text + '\n\n';
              }
              elem = elem.nextSibling;
            }

            console.log(`--- ${targetHeading} ---\n\n${sectionContent}`);
          } else {
            console.log('Target section not found:', targetHeading);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchWikiData();
  }, []);

  return <div>Scraping data...</div>;
};

export default ScrapeData;
