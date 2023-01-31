import React from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams() || null;

  return <div>Profile</div>;
}
