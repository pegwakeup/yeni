import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);

  const currentTab = tabs.find(tab => tab.id === selectedTab);

  return (
    <div className="w-full">
      <div className="flex justify-center border-b border-slate-200 dark:border-white/10 mb-12">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`relative px-4 py-3 text-lg font-medium transition-colors ${
              selectedTab === tab.id
                ? 'text-primary'
                : 'text-gray-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
            {selectedTab === tab.id && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentTab?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tabs;
