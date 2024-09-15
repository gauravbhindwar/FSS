"use client";

import SkeletonCard from "./Default/Skeleton";
import HomePage from "./HomePage/HomePage";
import { useState } from "react";

const Loader = (props) => {
  const cookies = props?.cookies;
  const [loading, setIsLoading] = useState(false);
  return <>{loading ? <SkeletonCard /> : <HomePage cookies={cookies}/>}</>;
};

export default Loader;
