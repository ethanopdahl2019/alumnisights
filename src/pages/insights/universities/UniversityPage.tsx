
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import UniversityTemplate from "./UniversityTemplate";
import { universities } from "./universities-data";

const UniversityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the university data based on the URL parameter
  const university = universities.find(uni => uni.id === id);
  
  // If no university is found, redirect to the undergraduate admissions page
  if (!university) {
    return <Navigate to="/insights/undergraduate-admissions" replace />;
  }

  return <UniversityTemplate name={university.name} />;
};

export default UniversityPage;
