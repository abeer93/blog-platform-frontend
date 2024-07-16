import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Box, TextField, IconButton, Chip, FormControl, InputLabel, Select, MenuItem  } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getPosts, createComment, deletePost, deleteComment } from '../services/api';
import { Post, Comment } from '../interfaces/interfaces';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PostList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  const [searchType, setSearchType] = useState<'title' | 'tags'>('title');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const loggedUserId = localStorage.getItem('userId');
  const isLoggedUserAdmin = localStorage.getItem('isAdmin');

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts({});
      setPosts(response.data.data);
    };

    fetchPosts();
  }, []);

  const handleAddComment = async (postId: string) => {
    if (commentContent[postId]?.trim() === '') return;
  
    try {
      const response = await createComment(postId, { content: commentContent[postId] });

      const newComment = response.data.data;

      // Update the posts state to reflect the new comment
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, newComment],
              }
            : post
        )
      );

      setCommentContent({ ...commentContent, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentChange = (postId: string, value: string) => {
    setCommentContent({ ...commentContent, [postId]: value });
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error: any) {
      console.error('Error deleting post:', error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await getPosts({ [searchType]: searchKeyword });
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await deleteComment(postId, commentId);
      setPosts(prevPosts =>
        prevPosts.map(post => ({
          ...post,
          comments: post.comments.filter(comment => comment.id !== commentId),
        }))
      );
    } catch (error: any) {
      console.error('Error deleting comment:', error.message);
    }
  };
  
  return (
    <StyledContainer>
      <Header>
        <Typography variant="h4" component="h1">
          Posts
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/posts/create">
          Create Post
        </Button>
      </Header>
      <SearchContainer>
        <FormControl variant="outlined" sx={{ flex: 1 }}>
          <InputLabel id="filter-type-label">Filter Type</InputLabel>
          <Select
            labelId="filter-type-label"
            id="filter-type"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'title' | 'tags')}
            label="Filter Type"
            fullWidth
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="tags">Tags</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="search-keyword"
          label="Search Keyword"
          variant="outlined"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
          sx={{ flex: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ flex: 0.5 }}>
          Search
        </Button>
      </SearchContainer>
      <PostsContainer>
        {posts.map((post: Post) => (
          <PostCard key={post.id}>
            <CardContent>
            <PostHeader>
              <Box display="flex" alignItems="center" flex="1">
                <PostTitle variant="h6">{post.title}</PostTitle>
                <PostAuthor variant="body2">{post.author.name}</PostAuthor>
              </Box>
              {
                (isLoggedUserAdmin === 'true' || loggedUserId == post.author.authorId) &&
                <PostActions>
                <IconButton
                  color="primary"
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <DeleteIcon />
                </IconButton>
                </PostActions>
              }
            </PostHeader>
            <Typography variant="body1" paragraph>
              {post.content}
            </Typography>
            <TagsContainer>
              {post.tags.map((tag, index) => (
                <Chip key={index} label={tag} color="primary" size="small" />
              ))}
            </TagsContainer>
            {post.comments.map((comment: Comment) => (
              <CommentBox key={comment.id}>
                <CommentContent>{comment.content}</CommentContent>
                <CommentDetails>
                  <CommentAuthor>{comment.author.name}</CommentAuthor>
                  <CommentDate>{new Date(comment.createdAt).toLocaleString()}</CommentDate>
                </CommentDetails>
                {
                    (isLoggedUserAdmin === 'true' || loggedUserId == comment.author.authorId) &&
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteComment(post.id, comment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
              </CommentBox>
            ))}
            <Box mt={2}>
              <TextField
                label="Add Comment"
                variant="outlined"
                fullWidth
                value={commentContent[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddComment(post.id)}
                sx={{ mt: 1 }}
              >
                Add Comment
              </Button>
            </Box>
            </CardContent>
          </PostCard>
        ))}
      </PostsContainer>
    </StyledContainer>
  );
};


const StyledContainer = styled(Box)`
  padding: 20px;
`;

const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PostsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PostTitle = styled(Typography)`
  flex: 1;
`;

const PostAuthor = styled(Typography)`
  margin-left: 16px;
  color: #888;
`;

const PostCard = styled(Card)`
  margin: 16px 0;
  border: 2px solid #1976d2;
`;

const PostHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CommentBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  border-left: 5px solid #4caf50;
`;

const CommentContent = styled(Typography)`
  flex: 1;
`;

const CommentDetails = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 16px;
`;

const CommentAuthor = styled(Typography)`
  font-weight: bold;
`;

const CommentDate = styled(Typography)`
  font-size: 0.8em;
  color: #888;
`;

const PostActions = styled(Box)`
  display: flex;
  align-items: center;
`;

const TagsContainer = styled(Box)`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const SearchContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  width: 100%; 
`;

export default PostList;
