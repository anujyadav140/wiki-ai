import React from 'react';
import Search from '../components/search';
import Sidebar from '../components/sidebar/sidebar';
import { TypeAnimation } from 'react-type-animation';

export default function HomePage() {
  return (
    <>
      <div className="flex items-center justify-center text-4xl font-serif mt-8">
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            'wiki AI',
            1000, // wait 1s before replacing "Mice" with "Hamsters"
            'use the power of AI to summarize',
            1000,
            'use the power of AI to make bullet points',
            1000,
            'use the power of AI to turn wikipedia information to poems',
            1000
          ]}
          wrapper="span"
          speed={50}
          // className="text-4xl font-bold"
          repeat={Infinity}
        />
      </div>
      <main className="overflow-x-hidden">
        <div className="flex h-screen bg-back object-cover">
          {/* <Sidebar navBar="isNavBar" left="isLeft" /> */}
          <div className="flex-grow flex flex-col">
            <Search />
          </div>
          {/* <Sidebar taskBar="isTaskBar" right="isRight" /> */}
        </div>
      </main>
    </>
  );
}
