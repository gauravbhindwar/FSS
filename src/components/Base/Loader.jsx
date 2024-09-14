"use client";

import SkeletonCard from "./Default/Skeleton";
import HomePage from "./HomePage/HomePage";
import { useState } from "react";

const Loader = (props) => {
  const [loading, setIsLoading] = useState(false);
  return <>{loading ? <SkeletonCard /> : <HomePage />}</>;
};

export default Loader;
