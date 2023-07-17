import React, { useState } from "react";
import Search from "../components/search";
import Sidebar from "../components/sidebar/sidebar";
import { TypeAnimation } from "react-type-animation";
import Lottie from "react-lottie-player";
import lottieJson from "../../public/robot.json";

export default function HomePage(props: any) {
  const [renderBoolAnimation, setRenderBoolAnimation] = useState(false);
  const renderAnimation: (boolRender: boolean) => void = (boolRender) => {
    console.log(boolRender);
    setRenderBoolAnimation(boolRender);
  };
  return (
    <>
      {/* </div> */}
      <main className="overflow-x-hidden">
        <div className="flex h-screen bg-back object-cover">
          {/* <Sidebar navBar="isNavBar" left="isLeft" /> */}
          <div className="flex-grow flex flex-col">
            <Search handleChange={renderAnimation} />
            <div className="mt-8 flex justify-center">
              {renderBoolAnimation && (
                <Lottie
                  loop
                  animationData={lottieJson}
                  play
                  style={{ width: 300, height: 300 }}
                />
              )}
            </div>
            <div className="flex items-center justify-center text-4xl font-serif mt-8">
              {renderBoolAnimation && (
                <TypeAnimation
                  sequence={[
                    "wiki AI",
                    1000,
                    "use the power of AI to summarize",
                    1000,
                    "use the power of AI to make bullet points",
                    1000,
                    "use the power of AI to turn wikipedia information to poems",
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  // className="text-4xl font-bold"
                  repeat={Infinity}
                />
              )}
            </div>
          </div>
          {/* <Sidebar taskBar="isTaskBar" right="isRight" /> */}
        </div>
      </main>
    </>
  );
}
