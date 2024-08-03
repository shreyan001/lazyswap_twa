'use client'
import { Qwa } from "@/components/component/Qwa";
import Loader from "@/components/component/loader"; 
import { Suspense } from "react";


export default function Home() {


  return <div className="min-h-screen flex items-center justify-center">    <Suspense fallback={<Loader />}>
<Qwa /></Suspense></div>;
}
