"use client";

import dynamic from "next/dynamic";

const BeamsCanvas = dynamic(() => import("./BeamsCanvas"), { ssr: false });

interface BeamsProps {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
}

export default function BeamsWrapper(props: BeamsProps) {
  return <BeamsCanvas {...props} />;
}
