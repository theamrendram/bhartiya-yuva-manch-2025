import React from 'react'

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col z-10 max-w-7xl mx-auto px-4 md:px-8">
        {children}
    </div>
  );
};

export { Container };