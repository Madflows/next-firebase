import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// Ui component for main post content
const PostContent = ({ post }) => {
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

    return (
        <div className="card">
            <h1>{post?.title}</h1>
            <span className='text-sm'>
                Written by{' '}
                <Link href={`/${post.username}/`}>
                    <a className="text-info">@{post.username} {
                        post.username?.verified ? (
                            <box-icon name='badge-check' type='solid' color='#2f7fbd' ></box-icon>
                        ) : null
                    }</a>
                </Link>
                on {createdAt.toISOString()}
            </span>
            <ReactMarkdown>
                {post?.content}
            </ReactMarkdown>
        </div>
    )
}

export default PostContent;