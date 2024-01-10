import React, { useState } from 'react';
import { Tag } from '@chakra-ui/react';

import ReactQuill from 'react-quill';
import {
  Box,
  Button,
  Text,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, InfoIcon } from '@chakra-ui/icons';
const mapTo5Scale = (value) => {
  const numericValue = parseFloat(value);
  return Math.min(5, Math.max(1, Math.round((numericValue + 1) * 2.5)));
};

const getEmojiForScore = (score) => {
  const numericScore = parseFloat(score);
  if (numericScore > 0) {
    return ''; 
  } else if (numericScore < 0) {
    return ''; 
  } else {
    return ''; 
  }
};

const getEmojiForSentimentCategory = (category) => {
  switch (category.toLowerCase()) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😞';
    case 'neutral':
    default:
      return '😐';
  }
};

const EntryCard = ({ entry, onEdit, onDelete }) => {
  const { date, text } = entry;
  const [isOpen, setIsOpen] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [sentimentResult, setSentimentResult] = useState(null);

  
  const handleEdit = async () => {
    await onEdit(entry, editedText);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    await onDelete(entry);
    setIsOpen(false);
  };

  const handleAnalyze = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry: text }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log(result);
      setSentimentResult(result);
      // setIsOpen(true);  // <-- Only set isOpen to true when opening the Sentiment Analysis modal
    } catch (error) {
      console.error('Error analyzing entry:', error.message);
    }
  };
  const getScoreColor = (score) => {
    const numericScore = parseFloat(score);
    if (numericScore > 0) {
      return 'green'; 
    } else if (numericScore < 0) {
      return 'red'; 
    } else {
      return 'gray';
    }
  };
  const getSentimentCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'positive':
        return 'green';
      case 'negative':
        return 'red';
      case 'neutral':
      default:
        return 'gray';
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Date: {date}
      </Text>
      <Text dangerouslySetInnerHTML={{ __html: text }} />

      <HStack mt={4}>
        <IconButton
          colorScheme="yellow"
          size="sm"
          aria-label="Analyze Entry"
          icon={<InfoIcon />}
          onClick={handleAnalyze}
        />
        <IconButton
          colorScheme="teal"
          size="sm"
          aria-label="Edit Entry"
          icon={<EditIcon />}
          onClick={() => setIsOpen(true)}
        />
        <IconButton
          colorScheme="red"
          size="sm"
          aria-label="Delete Entry"
          icon={<DeleteIcon />}
          onClick={handleDelete}
        />
      </HStack>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReactQuill
              value={editedText}
              onChange={(value) => setEditedText(value)}
              placeholder="Edit your thoughts here..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleEdit}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {sentimentResult && (
        <Modal isOpen={true} onClose={() => setSentimentResult(null)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Sentiment Analysis</ModalHeader>
            <ModalCloseButton />
            
            <ModalBody>
  <ul style={{ listStyleType: 'none', padding: 0 }}>
    {Object.entries(sentimentResult).map(([key, value]) => (
      <li key={key} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
        <strong style={{ marginRight: '8px' }}>{key}:</strong>
        {key === 'Sentiment Category' ? (
          <Tag size="sm" colorScheme={getSentimentCategoryColor(value)} style={{ marginLeft: '8px' }}>
            {value} {getEmojiForSentimentCategory(value)}
          </Tag>
        ) : (
          <span style={{ color: key.includes('Score') ? getScoreColor(value) : 'inherit' }}>
            {key === 'Positive Score' || key === 'Negative Score' ? (
              value > 0 ? `${mapTo5Scale(value).toFixed(2)} / 5 ${getEmojiForScore(value)}` : 'N/A'
            ) : (
              
              key === 'Named Entities' ? (
                value.length > 0 ? value.map(([entity, label]) => `${entity} (${label})`).join(', ') : 'N/A'
              ) : (
                value
              )
            )}
          </span>
        )}
      </li>
    ))}
  </ul>
</ModalBody>



          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default EntryCard;
