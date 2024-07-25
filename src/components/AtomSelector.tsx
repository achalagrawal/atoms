"use client";

import { useState } from 'react';
import { Atom } from '@/types';

const atoms: Atom[] = [
  { symbol: 'H', name: 'Hydrogen', protons: 1, neutrons: 0, electrons: 1, electronConfiguration: [1] },
  { symbol: 'He', name: 'Helium', protons: 2, neutrons: 2, electrons: 2, electronConfiguration: [2] },
  { symbol: 'Li', name: 'Lithium', protons: 3, neutrons: 4, electrons: 3, electronConfiguration: [2, 1] },
  { symbol: 'J', name: 'Jeevan', protons: 1, neutrons: 0, electrons: 60, electronConfiguration: [2, 8, 18, 32] },
  // Add more atoms as needed
];

export default function AtomSelector({ onSelectAtom }: { onSelectAtom: (atom: Atom) => void }) {
  const [search, setSearch] = useState('');

  const filteredAtoms = atoms.filter(atom =>
    atom.name.toLowerCase().includes(search.toLowerCase()) ||
    atom.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex mb-2">
        <input
          type="text"
          placeholder="Search for an atom..."
          className="flex-grow p-2 border rounded-l"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          onClick={() => onSelectAtom(filteredAtoms[0])}
          disabled={filteredAtoms.length === 0}
        >
          View
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredAtoms.map(atom => (
          <button
            key={atom.symbol}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            onClick={() => onSelectAtom(atom)}
          >
            {atom.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}