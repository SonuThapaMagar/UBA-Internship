const posts = [
  {
    id: 1,
    title: "Post One",
  },
  {
    id: 2,
    title: "Post Two",
  },
];
const getPosts=()=>posts;
// export const getPosts=()=>posts;

// export { getPosts };

// To export only one as default
export const getPostsLength=()=>posts.length;

//To export as default
export default getPosts