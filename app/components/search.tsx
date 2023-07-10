"use client";
import Image from "next/image";
import React, { useState, ChangeEvent, useEffect } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [extracts, setExtracts] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isMobileScreen, setisMobileScreen] = useState(false);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 5) {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&format=json&origin=*`
        );

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data[1]);
          setLinks(data[3]);

          const extractResponses = await Promise.all(
            data[3].map((link: string) =>
              fetch(
                `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&explaintext&exsentences=3&titles=${encodeURIComponent(
                  link.replace("https://en.wikipedia.org/wiki/", "")
                )}`
              ).then((response) => response.json())
            )
          );

          const extracts = extractResponses.map((extractResponse: any) => {
            const pages = extractResponse.query.pages;
            const pageId = Object.keys(pages)[0];
            return pages[pageId].extract;
          });

          setExtracts(extracts);

          const imageResponses = await Promise.all(
            data[3].map((link: string) =>
              fetch(
                `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=original&titles=${encodeURIComponent(
                  link.replace("https://en.wikipedia.org/wiki/", "")
                )}`
              ).then((response) => response.json())
            )
          );

          const imageUrls = imageResponses.map((imageResponse: any) => {
            const pages = imageResponse.query.pages;
            const pageId = Object.keys(pages)[0];
            return pages[pageId]?.original?.source || "";
          });
          console.log(imageUrls);
          setImages(imageUrls);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
      setLinks([]);
      setExtracts([]);
      setImages([]);
    }
  };

  const handleItemClick = (item: string) => {
    console.log("Clicked Item:", item);
  };

  useEffect(() => {
    if (window.innerWidth < 740) {
      setisMobileScreen(true);
    }
  });

  return (
    <div
      className={!isMobileScreen ? "mt-40 ml-40 mr-40" : "mt-10 ml-10 mr-10"}
    >
      {!isMobileScreen ? (
        // Render mobile UI
        <div className="relative w-300">
          <form>
            <div className="relative group">
              <div className="absolute inset-1 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative flex justify-between overflow-hidden rounded-md bg-white shadow shadow-black/20">
                <input
                  type="text"
                  className="block w-full flex-1 py-3 px-4 focus:outline-none"
                  placeholder="Search Wikipedia Articles ..."
                  value={searchQuery}
                  onChange={handleChange}
                />
                <motion.div
                  whileHover={{ scale: 1.0 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <span className="m-1 inline-flex cursor-pointer items-center rounded-md bg-indigo-600 px-4 py-3 hover:bg-indigo-700">
                    <svg
                      className="text-white"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M21.07 16.83L19 14.71a3.08 3.08 0 0 0-3.4-.57l-.9-.9a7 7 0 1 0-1.41 1.41l.89.89a3 3 0 0 0 .53 3.46l2.12 2.12a3 3 0 0 0 4.24 0a3 3 0 0 0 0-4.29Zm-8.48-4.24a5 5 0 1 1 0-7.08a5 5 0 0 1 0 7.08Zm7.07 7.07a1 1 0 0 1-1.42 0l-2.12-2.12a1 1 0 0 1 0-1.42a1 1 0 0 1 1.42 0l2.12 2.12a1 1 0 0 1 0 1.42Z"
                      />
                    </svg>
                  </span>
                </motion.div>
              </div>
            </div>
          </form>
          <div className=" mt-2 mb-10 w-full">
            {suggestions.length > 0 && (
              <ul className="mt-4 w-full grid gap-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                    key={index}
                  >
                    <li
                      className="flex items-start text-sm font-medium text-gray-600 rounded-md bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg p-4 hover:bg-opacity-40 hover:bg-white hover:backdrop-blur-lg shadow-lg shadow-indigo"
                      onClick={() => handleItemClick(suggestion)}
                    >
                      {/* {window.innerWidth >= 799 && images[index] && (      )} */}
                      {!(images[index] == "") ? (
                      <img
                      src={images[index]}
                      alt={suggestion}
                      className="w-40 h-40 object-cover rounded-md mr-4"
                    />
                      ) : null}
                      <div>
                        {suggestion}
                        <br />
                        <a
                          href={links[index]}
                          className="text-xs text-indigo-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {links[index]}
                        </a>
                        <p className="text-xs text-gray-500 mt-1">
                          {extracts[index]}
                        </p>
                      </div>
                    </li>
                  </motion.div>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div>
          <form>
            <div className="relative group">
              <div className="absolute inset-1 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative flex justify-between overflow-hidden rounded-md bg-white shadow shadow-black/20">
                <input
                  type="text"
                  className="block w-full flex-1 py-3 px-4 focus:outline-none"
                  placeholder="Search Wikipedia Articles ..."
                  value={searchQuery}
                  onChange={handleChange}
                />
                <motion.div
                  whileHover={{ scale: 1.0 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <span className="m-1 inline-flex cursor-pointer items-center rounded-md bg-indigo-600 px-4 py-3 hover:bg-indigo-700">
                    <svg
                      className="text-white"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M21.07 16.83L19 14.71a3.08 3.08 0 0 0-3.4-.57l-.9-.9a7 7 0 1 0-1.41 1.41l.89.89a3 3 0 0 0 .53 3.46l2.12 2.12a3 3 0 0 0 4.24 0a3 3 0 0 0 0-4.29Zm-8.48-4.24a5 5 0 1 1 0-7.08a5 5 0 0 1 0 7.08Zm7.07 7.07a1 1 0 0 1-1.42 0l-2.12-2.12a1 1 0 0 1 0-1.42a1 1 0 0 1 1.42 0l2.12 2.12a1 1 0 0 1 0 1.42Z"
                      />
                    </svg>
                  </span>
                </motion.div>
              </div>
            </div>
          </form>
          <div className="mt-2 mb-10 w-100">
            {suggestions.length > 0 && (
              <ul className="mt-4 w-full grid gap-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                    key={index}
                  >
                    <li
                      className="flex items-start text-sm font-medium text-gray-600 rounded-md bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg p-4 hover:bg-opacity-40 hover:bg-white hover:backdrop-blur-lg shadow-lg shadow-indigo"
                      onClick={() => handleItemClick(suggestion)}
                    >
                      <img
                        src={images[index]}
                        alt={suggestion}
                        className="w-20 h-20 object-cover rounded-md mr-4"
                      />
                      <div>
                        {suggestion}
                        <br />
                        <p className="text-xs text-gray-500 mt-1">
                          {extracts[index]}
                        </p>
                      </div>
                    </li>
                  </motion.div>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
