// EntriesPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

import EntryCard from './Entrycard';

const EntriesPage = ({ entries, onEdit, onDelete }) => {
  const [searchDate, setSearchDate] = useState('');
  const [searchWarning, setSearchWarning] = useState('');
  const [filteredEntries, setFilteredEntries] = useState(entries);

  const handleSearch = async () => {
    if (searchDate) {
      setSearchWarning('');

      const updatedEntries = entries.filter((entry) =>
        entry.date.includes(searchDate)
      );

      return updatedEntries;
    } else {
      setSearchWarning('Please enter a date for search.');
      return entries;
    }
  };

  const handleClearSearch = () => {
    setSearchDate('');
    setSearchWarning('');
    setFilteredEntries(entries); // Reset to the original entries when clearing search
  };

  const handleSearchAndUpdate = async () => {
    const updatedEntries = await handleSearch();
    setFilteredEntries(updatedEntries);
  };

  useEffect(() => {
    // Initialize filteredEntries with the original entries
    setFilteredEntries(entries);
  }, [entries]);

  return (
    <VStack p={4} align="start" spacing={4}>
      <HStack w="100%" mb={4}>
        <Input
          type="date"
          placeholder="Search by date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <Button ml={2} colorScheme="teal" onClick={handleSearchAndUpdate}>
          Search
        </Button>
        <Button ml={2} colorScheme="red" onClick={handleClearSearch}>
          Clear Search
        </Button>
      </HStack>

      {searchWarning && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          {searchWarning}
        </Alert>
      )}

      {filteredEntries.length > 0 ? (
        filteredEntries.map((entry, index) => (
          <EntryCard key={index} entry={entry} onEdit={onEdit} onDelete={onDelete} />
        ))
      ) : (
        <Text fontSize="lg" fontWeight="bold">
          No entries found for the selected date.
        </Text>
      )}
    </VStack>
  );
};

export default EntriesPage;
