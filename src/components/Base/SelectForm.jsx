"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import axios from "axios";

export function SelectForm(props) {
  const ref = useRef(null);
  const [labCourses, setLabCourses] = useState([]);
  const [theoryCourses, setTheoryCourses] = useState([]);
  const [active, setActive] = useState(null);
  const id = useId();
  const semester = props.semester;

  const getCourses = async (classification, semester, setCourses) => {
    try {
      const response = await axios.post("/api/courses/labCourse", {
        courseClassification: classification,
        forSemester: semester,
      });
      console.log("Response data:", response.data);
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error("Error getting", classification, "data:", error.message);
      console.error("Error stack:", error.stack);
    }
  };
  useEffect(() => {
    getCourses("LAB", semester, setLabCourses);
    getCourses("THEORY", semester, setTheoryCourses);
  }, [semester]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-[92vw] max-sm:rounded-2xl sm:w-full max-w-[500px]  sm:h-full md:h-fit md:max-h-[90%]  flex sm:flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}></motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    Select
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex sm:flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="sm:flex justify-between">
        <div className="sm:p-8 bg-slate-400 max-sm:mb-4 sm:m-4 rounded-xl ssm:w-[50%]">
          <h1 className="text-4xl font-bold border-b pb-4 drop-shadow-lg max-sm:p-4">
            Theory
          </h1>
          <ul className="max-w-2xl mx-auto w-full gap-4">
            {theoryCourses.map((card, index) => (
              <motion.div
                layoutId={`card-${card.title}-${id}`}
                key={`card-${card.title}-${id}`}
                onClick={() => setActive(card)}
                className="p-4 flex sm:flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
              >
                <div className="flex gap-4 sm:flex-col md:flex-row ">
                  <motion.div
                    layoutId={`image-${card.title}-${id}`}
                  ></motion.div>
                  <div className="">
                    <motion.h3
                      layoutId={`title-${card.title}-${id}`}
                      className="font-medium text-neutral-800 dark:text-neutral-200 sm:text-center text-left"
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${card.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 sm:text-center text-left max-sm:w-[90%]"
                    >
                      {card.description}aa
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  layoutId={`button-${card.title}-${id}`}
                  className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
                >
                  View
                </motion.button>
              </motion.div>
            ))}
          </ul>
        </div>
        <div className="sm:p-8 bg-slate-400 sm:m-4 rounded-xl ssm:w-[50%]">
          <h1 className="text-4xl font-bold border-b pb-4 max-sm:p-4">Practical</h1>
          <ul className="max-w-2xl mx-auto w-full gap-4">
            {labCourses.map((card, index) => (
              <motion.div
                layoutId={`card-${card}-${id}`}
                key={`card-${index}`}
                onClick={() => setActive(card)}
                className="p-4 flex sm:flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
              >
                <div className="flex gap-4 sm:flex-col md:flex-row ">
                  <motion.div
                    layoutId={`image-${card?.title}-${id}`}
                  ></motion.div>
                  <div className="">
                    <motion.h3
                      layoutId={`title-${card}-${id}`}
                      className="font-medium text-neutral-800 dark:text-neutral-200 sm:text-center max-sm:text-left"
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${card.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 sm:text-center max-sm:text-left max-sm:w-[90%]"
                    >
                      {card.description}
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  layoutId={`button-${card.title}-${id}`}
                  className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
                >
                  View
                </motion.button>
              </motion.div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
