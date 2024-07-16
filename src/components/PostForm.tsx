import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components';
import { createPost } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding-top: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 900px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TagContainer = styled(Box)`
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 16px;
    margin-bottom: 16px;
`;

const TagInput = styled(TextField)`
    flex-grow: 1;
    margin-right: 8px !important;
`;

const TagButton = styled(Button)`
    min-width: 40px;
    padding: 8px;
    height: 56px; // Ensure it matches the height of the TextField
`;

const TagsDisplay = styled(Box)`
    display: flex;
    flex-wrap: wrap;
    margin-top: 8px;
`;

const PostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleTagChange = () => {
    const tag = tagInput.trim();
    if (tag !== '' && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput('');
    }
};

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
        const response = await createPost({ title, content, tags });
        if (response.status === 201) {
            navigate('/');
        } else {
            console.error('Post creation failed:', response);
            setError('Unknown error occurred');
        }
    } catch (error) {
        console.error('Error creating post:', error);
    }
};


  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        New Post
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          multiline
          rows={5}
          value={content}
          onChange={(e: any) => setContent(e.target.value)}
          margin="normal"
          required
        />
        <TagContainer>
            <TagInput
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                variant="outlined"
                margin="normal"
            />
            <TagButton variant="contained" color="primary" onClick={handleTagChange}>
            <AddIcon />
            </TagButton>
        </TagContainer>
        <TagsDisplay>
            {tags.map((tag, index) => (
                <Chip key={index} label={tag} style={{ marginRight: '4px', marginBottom: '4px' }} />
            ))}
        </TagsDisplay>
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary">
            Create Post
        </Button>
      </StyledForm>
    </StyledContainer>
  );
};

export default PostForm;
