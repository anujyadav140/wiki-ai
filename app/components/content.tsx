import { Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Sidebar from "./sidebar/sidebar";
import toast, { Toaster } from "react-hot-toast";
import parse from "html-react-parser";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import Lottie from "react-lottie-player";
import lottieJson from "../../public/loader.json";
import { TypeAnimation } from "react-type-animation";
import langchanSummary from "../pages/api/summary";

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
  const [toDoSummaryText, setToDoSummaryText] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [newCheckboxChecked, setNewCheckboxChecked] = useState(false);
  const [isGenerateSummaryButtonClicked, setIsGenerateSummaryButtonClicked] =
    useState(false);
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 740) {
      setIsMobileScreen(true);
    }
  }, []);

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

              const cleanedSectionText = sectionText.replace(
                /(\[\s*([^[\]]+?)\s*\])|\^\s*.+|[,.:;""'‘’“”]/g,
                ""
              );

              setToDoSummaryText(cleanedSectionText);
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

  const generateSummary = async (buttonText: string) => {
    setIsGenerateSummaryButtonClicked(true);
    if (isGenerateSummaryButtonClicked) {
      setIsLoadingState(true);
    }
    if (isCheckboxChecked) {
      console.log(buttonText);
      const summaryResponse = await langchanSummary(
        buttonText,
        toDoSummaryText
      );
      setGeneratedSummary(summaryResponse.generations[0][0].text);
      if (summaryResponse.generations[0][0].text === "") {
        setIsLoadingState(true);
      } else {
        setIsLoadingState(false);
      }
      setNewCheckboxChecked(false);
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
    setIsGenerateSummaryButtonClicked(false);
    setIsCheckboxChecked(true);
    setIsLoadingState(true);
    if (isCheckboxChecked) {
      setGeneratedSummary("");
      setNewCheckboxChecked(true);
      console.log("New Checkbox Checked!");
    }
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
          if (section.subSections.every((sub) => sub.selected)) {
            return [section.heading];
          } else {
            return [
              section.heading,
              ...section.subSections.map((sub) => sub.heading),
            ];
          }
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
    setIsGenerateSummaryButtonClicked(false);
    setIsCheckboxChecked(true);
    setIsLoadingState(true);
    if (isCheckboxChecked) {
      setGeneratedSummary("");
      setNewCheckboxChecked(true);
      console.log("New Checkbox Checked!");
    }
    setHeadingExtracts((prevExtracts) => {
      const updatedExtracts = [...prevExtracts];
      const section = updatedExtracts[mainIndex];
      if (section) {
        const subSection = section.subSections[subIndex];
        if (subSection) {
          subSection.selected = !subSection.selected;

          const selectedHeadings = updatedExtracts.flatMap((section, idx) => {
            if (idx !== mainIndex) {
              section.selected = false;
              section.subSections.forEach((sub) => {
                sub.selected = false;
              });
            }
            if (section.subSections.some((sub) => sub.selected)) {
              section.selected = true;
              return section.subSections
                .filter((sub) => sub.selected)
                .map((sub) => sub.heading);
            } else {
              return [];
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
      toast(
        "You have to select atleast one section for the AI generation to work"
      );
    } else if (selectedHeadings.length !== 0) {
      setIsCheckboxChecked(true);
    }
  };

  useEffect(() => {
    console.log(selectedHeadings);
  }, [selectedHeadings]);

  const applySmallFont = (className: string) =>
    isMobileScreen ? `${className} small-font` : className;

  return (
    <>
      <div
        className="scrollbar-track shadow-indigo ml-auto mr-auto max-h-screen w-2/3 
      overflow-y-auto overflow-x-hidden rounded-xl bg-gradient-to-br from-purple-200 to-transparent 
      via-purple-300 p-4 text-sm font-medium text-black shadow-xl scrollbar-thin scrollbar-thumb-indigo-600"
      >
        {/* <p>{summary}</p> */}
        <h1
          className={`font-serif text-2xl font-bold text-black ${
            isMobileScreen ? "text-sm" : ""
          }`}
        >
          {props.name}
        </h1>
        <Divider className="bg-black" />
        <h1>
          <a
            href={props.link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            {props.link}
          </a>
        </h1>
        {introExtracts.map((section: Section, index: number) => (
          <motion.div
            key={index}
            layout
            className={`my-6 rounded-3xl border-glass bg-glass px-8 py-5
          hover:bg-violet-400 ${
            openHeadingIndexes.includes(index) ? "bg-blue-100" : ""
          } 
          ${section.selected ? "border-2 border-indigo-500" : ""} ${
              isMobileScreen ? "text-sm" : ""
            }`}
          >
            <div
              className={`flex items-center justify-between font-serif ${
                isMobileScreen ? "text-sm" : "text-xl"
              } 
           font-semibold text-black`}
            >
              <motion.h2 layout>
                {section.heading.replace(/<[^>]+>/g, "")}
              </motion.h2>
              <div
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full
                 bg-gray-200 hover:bg-purple-300 active:bg-gray-400"
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
                    className={`my-6 rounded-md bg-purple-300 px-8 py-5 ${
                      isMobileScreen ? "text-sm" : "text-base"
                    } ${
                      subSection.selected ? "border-2 border-indigo-500" : ""
                    }`}
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
            className={`my-6 rounded-3xl border-glass bg-glass px-8 py-5 
         hover:bg-violet-400 ${
           openHeadingIndexes.includes(index) ? "bg-blue-100" : ""
         } 
         ${section.selected ? "border-2 border-indigo-500" : ""} ${
              isMobileScreen ? "text-sm" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <motion.h2
                className={`flex items-center justify-between font-serif font-semibold text-black ${
                  isMobileScreen ? "text-sm" : "text-xl"
                }`}
                layout
              >
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-indigo-500 rounded"
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
                  className="flex h-8 w-8 cursor-pointer font-semibold items-center justify-center rounded-full bg-gray-200 hover:bg-purple-300 active:bg-gray-400"
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
                    className={`my-6 rounded-md bg-purple-300 px-8 py-5 ${
                      subSection.selected ? "border-2 border-indigo-500" : ""
                    }`}
                    whileHover={{ scale: 1.03 }}
                    style={{ fontSize: isMobileScreen ? "0.875rem" : "1rem" }}
                  >
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 text-indigo-500 rounded"
                      checked={subSection.selected}
                      onChange={() => handleSubSectionClick(index, subIndex)}
                    />
                    {subSection.heading.replace(/<[^>]+>/g, "")}
                  </motion.p>
                )
              )}
            {section.selected && isGenerateSummaryButtonClicked && (
              <div
                className={`my-6 rounded-md bg-white px-8 py-5 ${
                  isMobileScreen ? "text-sm" : "text-base"
                }`}
                style={{ fontSize: isMobileScreen ? "0.875rem" : "1rem" }}
              >
                <div className="whitespace-pre-wrap flex flex-col items-center justify-center">
                  {isLoadingState && (
                    <Lottie
                      loop
                      animationData={lottieJson}
                      play
                      style={{ width: 200, height: 200 }}
                    />
                  )}
                  {isLoadingState && (
                    <div
                      className={`${isMobileScreen ? "text-sm" : "text-base"}`}
                    >
                      <TypeAnimation
                        sequence={[
                          "Loading ...",
                          1000,
                          "Please be patient ...",
                          1000,
                          "Generating response ...",
                          1000,
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                      />
                    </div>
                  )}

                  {!isLoadingState && (
                    <p
                      className={`my-6 rounded-md bg-white px-8 py-5 ${
                        isMobileScreen ? "text-sm" : "text-base"
                      }`}
                    >
                      {generatedSummary}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <div className="right-0 top-0 h-screen">
        <button onClick={notify}>
          <Sidebar
            taskBar="isTaskBar"
            right="isRight"
            handleClick={generateSummary}
            newCheckboxChecked={newCheckboxChecked}
          />
        </button>
        <Toaster />
      </div>
    </>
  );
}
