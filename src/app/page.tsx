"use client";

import { useState } from 'react';
import AtomSelector from '../components/AtomSelector';
import AtomViewer from '../components/AtomViewer';
import { Atom } from '@/types';

export default function Home() {
  const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);

  return (
    <main className="flex min-h-screen flex-col">
      <div className="w-full p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-2">Atomic Structure Viewer</h1>
        <AtomSelector onSelectAtom={(atom: Atom) => setSelectedAtom(atom)} />
      </div>
      <div className="flex-grow">
        {selectedAtom ? (
          <AtomViewer atom={selectedAtom} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">Select an atom to view its structure</p>
          </div>
        )}
      </div>
    </main>
  );
}