"use client";
import Image from "next/image";
import React, { useState, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [extracts, setExtracts] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

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
      setIsMobileScreen(true);
    }
  }, []);

  return (
    <>
    <div
      className={!isMobileScreen ? "ml-40 mr-40 mt-12" : "ml-10 mr-10 mt-10"}
    >
      {!isMobileScreen ? (
        <div className="w-300 relative">
          <form>
            <div className="group relative">
              <div className="absolute inset-1 animate-tilt rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 opacity-75 blur-lg transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
              <div className="relative flex justify-between overflow-hidden rounded-md bg-white shadow shadow-black/20">
                <input
                  type="text"
                  className="block w-full flex-1 px-4 py-3 focus:outline-none"
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
          <div className="W-100">
            <div className="mb-10 mt-2 max-h-screen flex-grow overflow-y-auto overflow-x-hidden rounded-md scrollbar-thin scrollbar-thumb-indigo-600 hover:overflow-x-visible">
              {suggestions.length > 0 && (
                <ul className="mr-4 mt-4 grid gap-4">
                  {suggestions.map((suggestion, index) => (
                    // <Link href={`/wiki/${suggestion}`}>
                    <Link
                      href={{
                        pathname: `/wiki/${suggestion}`,
                        query: {
                          wikiName: `${suggestion}`,
                          linkUrl: `${links[index]}`,
                        },
                      }}
                      key={index}
                    >
                      <motion.div
                        whileHover={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 10,
                        }}
                        key={index}
                      >
                        <li
                          className="shadow-indigo flex items-start rounded-md bg-white bg-opacity-30 p-4 text-sm   font-medium text-gray-600  shadow-lg hover:bg-white"
                          onClick={() => handleItemClick(suggestion)}
                        >
                          {!(images[index] == "") ? (
                            <Image
                              src={images[index]}
                              alt={suggestion}
                              className="mr-4 h-40 w-40 rounded-md object-cover"
                              width={500}
                              height={500}
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
                            <p className="mt-1 text-sm text-gray-500 hover:text-black">
                              {extracts[index]}
                            </p>
                          </div>
                        </li>
                      </motion.div>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <form>
            <div className="group relative">
              <div className="absolute inset-1 animate-tilt rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 opacity-75 blur-lg transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
              <div className="relative flex justify-between overflow-hidden rounded-md bg-white shadow shadow-black/20">
                <input
                  type="text"
                  className="block w-full flex-1 px-4 py-3 focus:outline-none"
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

          <div className="w-100 mb-10 mt-2 max-h-80">
            <div className="mb-10 mt-2 max-h-screen flex-grow overflow-y-auto overflow-x-hidden rounded-md scrollbar-thin scrollbar-thumb-indigo-600 hover:overflow-x-visible">
              {suggestions.length > 0 && (
                <ul className="mt-4 grid h-full w-full gap-4">
                  {suggestions.map((suggestion, index) => (
                    <Link href={`/wiki/${suggestion}`} key={index}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 10,
                        }}
                        key={index}
                      >
                        <li
                          className="shadow-indigo flex items-start rounded-md bg-white p-4 text-sm font-medium text-black shadow-lg  backdrop-blur-lg backdrop-filter hover:bg-white hover:backdrop-blur-lg"
                          onClick={() => handleItemClick(suggestion)}
                        >
                          {!(images[index] == "") ? (
                            <Image
                              src={images[index]}
                              alt={suggestion}
                              className="mr-4 h-20 w-20 rounded-md object-cover"
                              width={500}
                              height={500}
                            />
                          ) : null}
                          <div>
                            {suggestion}
                            <br />
                            <p className="mt-1 text-xs text-black hover:text-black">
                              {extracts[index]}
                            </p>
                          </div>
                        </li>
                      </motion.div>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
export default Search;
