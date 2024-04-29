import { useEffect, useState } from 'react';
import Post from '../post/Post';
import './posts.scss'
import { PostType } from '../../types/PostType';
import apiService, { ApiResponse } from '../../api/api.service';

interface PostsProps {
    authorId?: number | undefined;
    allPosts?: PostType[];
}

const Posts: React.FC<PostsProps> = ({ authorId }) => {
    const [posts, setPosts] = useState<PostType[]>([]);

    
    useEffect(() => {
        fatchAllPost()
    }, [posts]);

    const fatchAllPost = async () => {
        apiService('api/post', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                setPosts([])
                return;
            }

            if (res.status === 'ok') {
                const sortedPosts = res.data.sort((a: PostType, b: PostType) => {
                    if (a.createdAt && b.createdAt) {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    } else {
                        return 0;
                    }
                })
                console.log('posts; ', setPosts)
                setPosts(sortedPosts);
            }
        })
        .catch(error => {
            console.error(error)
            setPosts([]);
        })
    }


    const filteredPosts = authorId ? posts.filter(post => post.userId === authorId) : posts;
    console.log('posts: ', posts)
    
  return (
    <div className='posts'>
        {filteredPosts.map(post => (
            <Post post={post} key={post.postId} userOthId={post.userId} />
        ))}
    </div>
  )
}

export default Posts;