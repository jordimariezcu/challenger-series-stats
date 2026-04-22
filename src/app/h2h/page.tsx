import type { Metadata } from "next";
import H2HClient from "@/components/H2HClient";

export const metadata: Metadata = {
  title: "Head to Head",
  description:
    "Compare any two Challenger Series players head-to-head. Full match record, set scores and win percentage.",
};

export default function H2HPage() {
  return <H2HClient />;
}
