"use client";

import { AnimatePresence, motion } from "framer-motion";
import {User} from "lucide-react";

interface IProps {
  currentPhoto?: string;
}

export default function ProfilePhoto({ currentPhoto }: IProps) {

  return (
    <div className="relative">
      <motion.div
        className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl"
        whileHover={{
          scale: 1.05,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
        }}
      >
        <AnimatePresence mode="wait">
          {currentPhoto ? (
            <motion.img
              key={currentPhoto}
              src={currentPhoto}
              alt="Profile"
              className="w-full h-full object-cover"
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              transition={{
                duration: 0.3,
              }}
            />
          ) : (
            <motion.div
              className="w-full h-full bg-linear-to-br from-[#DC3173] to-[#FF6B9D] flex items-center justify-center"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <User className="w-12 h-12 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload overlay */}
        {/* <AnimatePresence>
          {isUploading && (
            <motion.div
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <LoaderIcon className="w-8 h-8 text-white animate-spin" />
            </motion.div>
          )}
        </AnimatePresence> */}

        {/* Success overlay */}
        {/* <AnimatePresence>
          {uploadSuccess && (
            <motion.div
              className="absolute inset-0 bg-[#DC3173]/90 flex items-center justify-center"
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
            >
              <CheckCircleIcon className="w-12 h-12 text-white" />
            </motion.div>
          )}
        </AnimatePresence> */}
      </motion.div>
    </div>
  );
}
