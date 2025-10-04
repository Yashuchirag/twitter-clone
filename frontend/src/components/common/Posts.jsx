import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType, userId, username}) => {

	const getPostEndPoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/post/all";
			case "following":
				return "/api/post/following";
			case "likes":
				return `/api/post/likes/${userId}`;
			case "posts":
				return `/api/post/user/${username}`;
			default:
				return "/api/post/all";
		}
	}

	const POST_ENDPOINT = getPostEndPoint();

	const {data: posts, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["posts",feedType, userId, username],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();
				
				if(!res.ok) {
					throw new Error(data.error || "Failed to fetch posts");
				}
				
				if (data.feedPosts) {
					return {
						posts: data.feedPosts,
					};
				}
				return { posts: data.posts || [] };
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

	console.log(feedType, POST_ENDPOINT, posts)

	useEffect(() => {
		refetch();
	}, [feedType, refetch]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && (posts?.posts || []).length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{(posts?.posts || []).map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;