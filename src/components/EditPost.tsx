import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Chip } from '@mui/material';
import { styled } from '@mui/system';
import { getPost, updatePost } from '../services/api';

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  padding-top: 25px;
  box-sizing: border-box;
`;

const StyledForm = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
`;

const TagInputContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

const TagInput = styled(TextField)`
  flex: 1;
  margin-right: 10px;
`;

const TagButton = styled(Button)`
  width: 40px;
  min-width: 40px;
  padding: 8px;
  margin-left: 8px;
`;

const EditPost = () => {
  const { postId } = useParams() as { postId: string };
  
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(postId);
        if (response && response.status === 200) {
          const post = response.data.data;
          setTitle(post.title);
          setContent(post.content);
          setTags(post.tags);
        } else {
          console.error('Error fetching post:', response);
        }
      } catch (error: any) {
        console.error('Error fetching post:', error.message);
      }
    };

    fetchPost();
  }, [postId]);

  const handleAddTag = () => {
    if (tag.trim() !== '') {
      setTags([...tags, tag]);
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await updatePost(postId, { title, content, tags });
      if (response && response.status === 200) {
        navigate('/');
      } else {
        console.error('Error updating post:', response.data.error);
        setError(response.data.error);
      }
    } catch (error: any) {
      console.error('Error updating post:', error.message);
      setError(error.message);
    }
  };

  return (
    <StyledContainer>
      <StyledForm component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Post
        </Typography>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TagInputContainer>
          <TagInput
            label="Add Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            fullWidth
          />
          <TagButton
            variant="contained"
            color="primary"
            onClick={handleAddTag}
          >
            +
          </TagButton>
        </TagInputContainer>
        <Box mt={2}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              color="primary"
              size="small"
              sx={{ margin: '0 8px 8px 0' }}
            />
          ))}
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary">
          Update Post
        </Button>
      </StyledForm>
    </StyledContainer>
  );
};

export default EditPost;
