'use client'
import Image from "next/image";
import { Qwa } from "@/components/component/Qwa";
import { useParams } from "next/navigation";


export default function Home() {

  const {channelId} = useParams()

  return <Qwa />;
}
