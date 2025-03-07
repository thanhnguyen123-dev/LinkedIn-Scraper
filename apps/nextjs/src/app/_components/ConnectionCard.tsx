import React from 'react';
import Image from 'next/image';

interface Connection {
  entityUrn: string;
  firstName: string;
  lastName: string;
  headline: string;
  profileUrl: string;
}

const ConnectionCard = ({
  entityUrn, 
  firstName, 
  lastName, 
  headline, 
  profileUrl}: Connection) => {

  return (
    <div key={entityUrn} className="flex flex-col gap-2 p-2 border border-gray-200 rounded-md">
      <div className="flex gap-2"><span className="font-bold">{firstName} {lastName}</span> | <span className="font-normal text-gray-500">{headline}</span></div>
      <button 
        onClick={() =>  window.open(profileUrl, "_blank")}
        className="flex w-[200px] justify-center items-center gap-1 text-black border-2 border-slate-200 hover:bg-slate-200 px-2 py-1 rounded-md"
      > 
        <Image 
          src="/linkedin-logo.svg" 
          alt="LinkedIn Logo" 
          width={20} 
          height={20} />
        <span>View LinkedIn Profile</span>
      </button>
    </div>
  );
}

export default ConnectionCard