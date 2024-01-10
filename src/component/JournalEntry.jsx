import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { Box, Container, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import 'react-quill/dist/quill.snow.css'; 
// 
const JournalEntry = ({ onAddEntry }) => {
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const toast = useToast();

  const handleAddEntry = async () => {
    if (date.trim() === '' || text.trim() === '') {
      toast({
        title: 'Incomplete Fields',
        description: 'Please fill in both date and text fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } else {
      onAddEntry({ date, text });
      setDate('');
      setText('');
      toast({
        title: 'Entry Added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <Box p={8} borderRadius="lg" boxShadow="md">
        <FormControl>
          <FormLabel fontSize="lg" fontWeight="bold" color="teal.500">
            Date:
          </FormLabel>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            size="lg"
            borderColor="teal.500"
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel fontSize="lg" fontWeight="bold" color="teal.500">
            Journal Entry:
          </FormLabel>
          <ReactQuill
            value={text}
            onChange={(value) => setText(value)}
            placeholder="Write your thoughts here..."
            minHeight="200px"
          />
        </FormControl>
        <Button
          mt={6}
          colorScheme="teal"
          onClick={handleAddEntry}
          _hover={{ bg: 'teal.600' }}
          w="100%"
        >
          Add Entry
        </Button>
      </Box>
    </Container>
  );
};

export default JournalEntry;
