import React from "react";
// next
import type { NextPage } from "next";
import dynamic from "next/dynamic";

const Todo = dynamic(() => import("../components/Todos"), { ssr: false });

const Home: NextPage = () => {
  return (
    <div className="h-screen w-full p-4 md:p-20">
      <Todo />
    </div>
  );
};

export default Home;
