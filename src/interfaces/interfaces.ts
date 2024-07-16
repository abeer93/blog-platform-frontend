export interface Comment {
    id: string;
    content: string;
    author: {
        authorId: string;
        name: string
    };
    createdAt: string;
  }
  
  export interface Post {
    id: string;
    title: string;
    content: string;
    author: {
        authorId: string;
        name: string
    };
    tags: string[];
    comments: Comment[];
  }
  