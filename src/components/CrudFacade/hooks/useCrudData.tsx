import React from 'react'
import { useState, useEffect } from "react";

export const useCrudData = (dataGenerator, defaultViewMode = 'cards') => {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState(defaultViewMode);

  useEffect(() => {
    if (typeof dataGenerator === 'function') {
      const generatedData = dataGenerator();
      setData(generatedData);
    } else if (Array.isArray(dataGenerator)) {
      setData(dataGenerator);
    }
  }, [dataGenerator]);

  return {
    data,
    setData,
    viewMode,
    setViewMode
  };
};
