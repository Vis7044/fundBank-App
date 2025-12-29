import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MutualFunds from "../pages/MutualFunds";

import Calculators from "../pages/Calculators";
import FundGraph from "../pages/FundGraph";
import LearnPage from "../pages/LearnPage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mutual-funds" element={<MutualFunds />} />
      <Route path="/calculators" element={<Calculators />} />
      <Route path="/mutual-funds/:schemeId" element={<FundGraph />} />
      <Route path="/learn" element={<LearnPage />} />
      
    </Routes>
  );
}
