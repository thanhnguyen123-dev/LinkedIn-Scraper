/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { useEffect, useState } from "react";
import ConnectionCard from "./_components/ConnectionCard";
interface Connection {
  entityUrn: string;
  firstName: string;
  lastName: string;
  headline: string;
  profileUrl: string;
  ownerEntityUrn: string;
}

export default function LinkedInConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  useEffect(() => {
    void fetch("/api/connections")
      .then((res) => res.json())
      .then((data) => setConnections(data));
  }, []);

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-4xl font-bold text-center">LinkedIn Connections</h1>
      <div className="flex flex-col gap-2">
        {connections.map((connection) => (
          <ConnectionCard key={connection.entityUrn} {...connection} />
        ))}
      </div>
    </div>
  );
}
