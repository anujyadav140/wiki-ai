import { Divider } from "@mui/material";
import { LoremIpsum } from "./lorem";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

interface Section {
  heading: string;
  subSections: string[];
}

const getContentIntro = async (
  link: string,
  name: string,
  setIntroExtracts: (sections: Section[]) => void
) => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${name}&format=json&origin=*`
    );

    if (response.ok) {
      const extractResponses = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(
          link.replace("https://en.wikipedia.org/wiki/", "")
        )}`
      ).then((response) => response.json());

      if (extractResponses && !extractResponses.error) {
        const pages = extractResponses.query.pages;
        const pageId = Object.keys(pages)[0];
        const pageData = pages[pageId];

        const introduction = pageData.extract;

        setIntroExtracts([
          { heading: "Introduction", subSections: [introduction] },
        ]);
      }
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
};

const getContentHeadings = async (
  link: string,
  name: string,
  setExtracts: (sections: Section[]) => void
) => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${name}&format=json&origin=*`
    );

    if (response.ok) {
      const extractResponses = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&titles=${encodeURIComponent(
          link.replace("https://en.wikipedia.org/wiki/", "")
        )}`
      ).then((response) => response.json());

      if (extractResponses && !extractResponses.error) {
        const pages = extractResponses.query.pages;
        const pageId = Object.keys(pages)[0];
        const pageData = pages[pageId];

        // Extract main sections and sub-sections
        const sections: Section[] = [];
        const content = pageData.extract;
        const regex = /<h[2-6]>(?:<span[^>]+>)?(.+?)(?:<\/span>)?<\/h[2-6]>/g;
        let match;
        let currentSection: Section | null = null;
        while ((match = regex.exec(content)) !== null) {
          const heading = match[1];

          // Exclude sections with specific span ids
          const spanIdRegex = /<span id="([^"]+)"/;
          const spanIdMatch = spanIdRegex.exec(match[0]);
          if (spanIdMatch && shouldExcludeSection(spanIdMatch[1])) {
            continue;
          }

          if (match[0].startsWith("<h2>")) {
            if (currentSection !== null) {
              sections.push(currentSection);
            }
            currentSection = {
              heading,
              subSections: [],
            };
          } else {
            if (currentSection !== null) {
              currentSection.subSections.push(heading);
            }
          }
        }
        if (currentSection !== null) {
          sections.push(currentSection);
        }

        setExtracts(sections);
      }
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
};

const shouldExcludeSection = (spanId: string) => {
  const excludedIds = [
    "See_also",
    "References",
    "Notes",
    "Citations",
    "Sources",
    "Further_reading",
    "External_links",
  ];
  return excludedIds.includes(spanId);
};

export default function MainContent(props: any) {
  const [introExtracts, setIntroExtracts] = useState<Section[]>([]);
  const [headingExtracts, setheadingExtracts] = useState<Section[]>([]);
  const [isOpenIntro, setIsOpenIntro] = useState(false);
  const [openHeadingIndexes, setOpenHeadingIndexes] = useState<number[]>([]);

  useEffect(() => {
    getContentIntro(props.link, props.name, setIntroExtracts);
  }, [props.link, props.name]);

  useEffect(() => {
    getContentHeadings(props.link, props.name, setheadingExtracts);
  }, [props.link, props.name]);

  const handleIntroClick = () => {
    setIsOpenIntro(!isOpenIntro);
  };

  const handleHeadingClick = (index: number) => {
    setOpenHeadingIndexes((prevIndexes) => {
      if (prevIndexes.includes(index)) {
        return prevIndexes.filter((idx) => idx !== index);
      } else {
        return [...prevIndexes, index];
      }
    });
  };

  return (
    <>
      <div>
        <h1>{props.name}</h1>
        <Divider />
        <h1>{props.link}</h1>
        {introExtracts.map((section: Section, index: number) => (
          <motion.div
            key={index}
            layout
            className="my-6 rounded-md bg-white px-8 py-5"
          >
            <div className="flex items-center justify-between">
              <motion.h2 layout>
                {section.heading.replace(/<[^>]+>/g, "")}
              </motion.h2>
              <div
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleIntroClick();
                }}
              >
                {isOpenIntro ? (
                  <FaAngleUp onClick={handleIntroClick} />
                ) : (
                  <FaAngleDown onClick={handleIntroClick} />
                )}
              </div>
            </div>
            {isOpenIntro &&
              section.subSections.map(
                (subSection: string, subIndex: number) => (
                  <p
                    className="my-6 rounded-md bg-gray-300 px-8 py-5"
                    key={subIndex}
                  >
                    {subSection.replace(/<[^>]+>/g, "")}
                  </p>
                )
              )}
          </motion.div>
        ))}

        {headingExtracts.map((section: Section, index: number) => (
          <motion.div
            key={index}
            layout
            className={`my-6 rounded-md bg-white px-8 py-5 ${
              openHeadingIndexes.includes(index) ? "bg-blue-100" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <motion.h2 layout>
                {section.heading.replace(/<[^>]+>/g, "")}
              </motion.h2>
              {section.subSections.length > 0 && (
                <div
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHeadingClick(index);
                  }}
                >
                  {openHeadingIndexes.includes(index) ? (
                    <FaAngleUp />
                  ) : (
                    <FaAngleDown />
                  )}
                </div>
              )}
            </div>
            {openHeadingIndexes.includes(index) &&
              section.subSections.map(
                (subSection: string, subIndex: number) => (
                  <p
                    className="my-6 rounded-md bg-gray-300 px-8 py-5"
                    key={subIndex}
                  >
                    {subSection.replace(/<[^>]+>/g, "")}
                  </p>
                )
              )}
          </motion.div>
        ))}
        {/* <LoremIpsum /> */}
      </div>
    </>
  );
}
