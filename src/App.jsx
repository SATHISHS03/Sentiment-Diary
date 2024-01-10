// App.js

import React, { useState } from 'react';
import { ChakraProvider, CSSReset, extendTheme, Box, Flex, Spacer } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import JournalEntry from './component/JournalEntry';
import EntriesPage from './component/EntriesPage';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.100',
      },
    },
  },
});

const Navbar = () => {
  return (
    <Flex p={4} bg="teal.500" color="white">
      <Box>
        <Link to="/">Home</Link>
      </Box>
      <Spacer />
      <Box>
        <Link to="/entries">View All Entries</Link>
      </Box>
    </Flex>
  );
};
const App = () => {
  const [entries, setEntries] = useState([]);

  const handleAddEntry = (entry) => {
    setEntries([...entries, entry]);
  };

  const handleEditEntry = (originalEntry, editedText) => {
    const updatedEntries = entries.map((entry) =>
      entry === originalEntry ? { ...entry, text: editedText } : entry
    );
    setEntries(updatedEntries);
  };

  const handleDeleteEntry = (entryToDelete) => {
    const updatedEntries = entries.filter(
      (entry) => entry !== entryToDelete
    );
    setEntries(updatedEntries);
  };

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<JournalEntry onAddEntry={handleAddEntry} />}
          />
          <Route
            path="/entries"
            element={
              <EntriesPage
                entries={entries}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
