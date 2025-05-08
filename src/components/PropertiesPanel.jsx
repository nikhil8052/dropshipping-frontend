import { useState } from 'react';
import { ChevronLeft, Eye, Plus, HelpCircle } from 'lucide-react';

export default function PropertiesPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const properties = [
    { icon: 'Aa', name: 'Name', type: 'text' },
    { icon: '🔗', name: 'Video', type: 'link' },
    { icon: '🔗', name: 'Done Video Recording', type: 'link' },
    { icon: '≡', name: 'Section', type: 'select' },
    { icon: '≡', name: 'Notes', type: 'text' },
    { icon: '≡', name: 'Text', type: 'text' },
    { icon: '⌛', name: 'Status', type: 'select' },
    { icon: '◎', name: 'Prio', type: 'select' },
  ];

  return (
    <div className="w-80 bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <ChevronLeft className="w-5 h-5 text-gray-500" />
        <h2 className="font-medium ml-2">Properties</h2>
        <button className="ml-auto">
          <span className="text-gray-400 text-xl">&times;</span>
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a property..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Shown in table header */}
      <div className="px-3 py-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">Shown in table</span>
        <button className="text-sm text-blue-500">Hide all</button>
      </div>
      
      {/* Properties List */}
      <div className="px-2">
        {properties.map((property, index) => (
          <div key={index} className="flex items-center px-1 py-1 hover:bg-gray-100 rounded">
            <span className="text-gray-500 mr-2">⋮</span>
            <span className="text-sm w-6 text-center">{property.icon}</span>
            <span className="ml-1">{property.name}</span>
            <div className="ml-auto flex">
              <Eye className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-gray-400 mr-1">&gt;</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* New Property Button */}
      <div className="mt-2 px-3 py-2">
        <button className="flex items-center text-gray-500 hover:text-gray-700">
          <Plus className="w-4 h-4 mr-1" />
          <span>New property</span>
        </button>
      </div>
      
      {/* Learn About Properties */}
      <div className="px-3 py-2 border-t border-gray-200">
        <button className="flex items-center text-gray-500 hover:text-gray-700">
          <HelpCircle className="w-4 h-4 mr-1" />
          <span>Learn about properties</span>
        </button>
      </div>
    </div>
  );
}