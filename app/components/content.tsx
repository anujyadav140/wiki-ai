import { Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Sidebar from "./sidebar/sidebar";
import toast, { Toaster } from "react-hot-toast";
import parse from "html-react-parser";

interface Section {
  heading: string;
  subSections: { heading: string; selected: boolean }[];
  selected: boolean; 
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
          {
            heading: "Introduction",
            subSections: [{ heading: introduction, selected: false }],
            selected: false,
          },
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
              selected: false,
            };
          } else {
            if (currentSection !== null) {
              currentSection.subSections.push({ heading, selected: false });
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
  const [headingExtracts, setHeadingExtracts] = useState<Section[]>([]);
  const [isOpenIntro, setIsOpenIntro] = useState(false);
  const [openHeadingIndexes, setOpenHeadingIndexes] = useState<number[]>([]);
  const [selectedHeadings, setSelectedHeadings] = useState<string[]>([]);

  useEffect(() => {
    getContentIntro(props.link, props.name, setIntroExtracts);
  }, [props.link, props.name]);

  useEffect(() => {
    getContentHeadings(props.link, props.name, setHeadingExtracts);
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

  const getSelectedSection = async (name: string, headings: string[]) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${name}&format=json&origin=*`
      );

      if (response.ok) {
        const extractResponses = await fetch(
          `https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&prop=sections&page=${name}`
        ).then((response) => response.json());

        const sections = extractResponses["parse"]["sections"];
        let target_section_id = null;

        for (const target_heading of headings) {
          for (const section of sections) {
            if (section["line"] === target_heading) {
              target_section_id = section["index"];
              console.log(target_section_id);
              break;
            }
          }
          if (target_section_id) {
            try {
              const extractData = await fetch(
                `https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&prop=text&page=${name}&section=${target_section_id}`
              ).then((response) => response.json());
              const sectionHtml = extractData["parse"]["text"]["*"];

              const parsedHtml = parse(sectionHtml);

              const sectionText = extractTextFromHtml(parsedHtml);

              console.log(sectionText);
            } catch (error) {
              console.error("Error fetching section HTML:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching section content:", error);
    }
  };

  const extractTextFromHtml = (node: any): string => {
    if (typeof node === "string") {
      return node;
    }
    if (node && node.props && node.props.children) {
      if (Array.isArray(node.props.children)) {
        return node.props.children.map(extractTextFromHtml).join("");
      }
      return extractTextFromHtml(node.props.children);
    }
    return "";
  };

  const handleMainSectionClick = (index: number) => {
    setHeadingExtracts((prevExtracts) => {
      const updatedExtracts = [...prevExtracts];
      const section = updatedExtracts[index];

      updatedExtracts.forEach((item, i) => {
        if (i !== index) {
          item.selected = false;
          item.subSections.forEach((subSection) => {
            subSection.selected = false;
          });
        }
      });

      if (section && section.subSections.length > 0) {
        const selected = !section.subSections.every(
          (subSection) => subSection.selected
        );
        section.subSections = section.subSections.map((subSection) => ({
          heading: subSection.heading,
          selected,
        }));
        section.selected = selected;
      } else if (section) {
        section.selected = !section.selected;
      }
      const selectedHeadings = updatedExtracts.flatMap((section) => {
        if (section.selected) {
          return [
            section.heading,
            ...section.subSections.map((sub) => sub.heading),
          ];
        } else {
          return [];
        }
      });
      setSelectedHeadings(selectedHeadings);
      getSelectedSection(props.name, selectedHeadings);
      return updatedExtracts;
    });
  };

  const handleSubSectionClick = (mainIndex: number, subIndex: number) => {
    setHeadingExtracts((prevExtracts) => {
      const updatedExtracts = [...prevExtracts];
      const section = updatedExtracts[mainIndex];
      if (section) {
        const subSection = section.subSections[subIndex];
        if (subSection) {
          subSection.selected = !subSection.selected;
  
          const selectedHeadings = updatedExtracts.flatMap((section) => {
            if (section.subSections.some((sub) => sub.selected)) {
              section.selected = true;
              return section.subSections
                .filter((sub) => sub.selected)
                .map((sub) => sub.heading);
            } else if (section.subSections.every((sub) => !sub.selected)) {
              section.selected = false;
              return [];
            } else {
              section.selected = false;
              return section.subSections
                .filter((sub) => sub.selected)
                .map((sub) => sub.heading);
            }
          });
          setSelectedHeadings(selectedHeadings);
          getSelectedSection(props.name, selectedHeadings);
        }
      }
      return updatedExtracts;
    });
  };
  

  const notify = () => {
    if (selectedHeadings.length === 0) {
      toast("You have to select one section for the AI generation to work");
    }
  };

  useEffect(() => {
    console.log(selectedHeadings);
  }, [selectedHeadings]);

  return (
    <>
      <div
        className="
      scrollbar-track shadow-indigo
      ml-auto mr-auto max-h-screen 
        w-2/3 overflow-y-auto overflow-x-hidden rounded-xl bg-white bg-opacity-30   p-4 text-sm  font-medium
          text-gray-600 shadow-xl
       scrollbar-thin scrollbar-thumb-indigo-600"
      >
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
                (
                  subSection: { heading: string; selected: boolean },
                  subIndex: number
                ) => (
                  <motion.p
                    key={subIndex}
                    className="my-6 rounded-md bg-gray-300 px-8 py-5"
                  >
                    {subSection.heading.replace(/<[^>]+>/g, "")}
                  </motion.p>
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
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={
                    section.subSections.length > 0
                      ? section.subSections.every(
                          (subSection) => subSection.selected
                        )
                      : section.selected
                  }
                  onChange={() => handleMainSectionClick(index)}
                />
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
                (
                  subSection: { heading: string; selected: boolean },
                  subIndex: number
                ) => (
                  <motion.p
                    key={subIndex}
                    className="my-6 rounded-md bg-gray-300 px-8 py-5"
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={subSection.selected}
                      onChange={() => handleSubSectionClick(index, subIndex)}
                    />
                    {subSection.heading.replace(/<[^>]+>/g, "")}
                  </motion.p>
                )
              )}
          </motion.div>
        ))}
      </div>
      <div className="right-0 top-0 h-screen">
        <button onClick={notify}>
          <Sidebar taskBar="isTaskBar" right="isRight" />
        </button>
        <Toaster />
      </div>
    </>
  );
}
