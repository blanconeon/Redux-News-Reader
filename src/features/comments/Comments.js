import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadCommentsForArticleId,
  selectComments,
  isLoadingComments,
} from '../comments/commentsSlice';
import { selectCurrentArticle } from '../currentArticle/currentArticleSlice';
import CommentList from '../../components/CommentList';
import CommentForm from '../../components/CommentForm';

const Comments = () => {
  const dispatch = useDispatch();
  const article = useSelector(selectCurrentArticle);
  // Declare additional selected data here.
  const comments = useSelector(selectComments);
  const commentsById = article ? comments[article.id] : [];
  const commentsAreLoading = useSelector(isLoadingComments);

  // Dispatch loadCommentsForArticleId with useEffect here.
  useEffect (() => {
  if (article) {
    dispatch(loadCommentsForArticleId(article.id))}  
  }, [article])


 const commentsForArticleId = article ? comments[article.id] || [] : [];
/* If `article` is true (exists), then:
- Use `comments[article.id]` if it has a value (like an array of comments).
- If `comments[article.id]` is missing or `undefined`, use an empty array `[]` instead.
If `article` is not true (does not exist), use an empty array `[]`.
This way, `commentsForArticleId` is always an array, so `.map()` will always work.*/

  if (commentsAreLoading) return <div>Loading Comments</div>;
  if (!article) return null;
  console.log(commentsForArticleId);
  return (
    <div className='comments-container'>
      <h3 className='comments-title'>Comments</h3>
      <CommentList comments={commentsForArticleId} />
      <CommentForm articleId={article.id} />
    </div>
  );
};

export default Comments;


/* Great observation. Both fetching an article and fetching comments are side effects because they involve asynchronous operations outside the component.

However, **not all side effects require `useEffect`**. The difference is in **how** and **when** the side effect is triggered:

- **Fetching an article:**  
  This side effect is triggered by a user action (clicking an article preview). The thunk is dispatched directly in the click handler, so there’s no need for `useEffect`—the user’s click is the trigger.

- **Fetching comments:**  
  This side effect depends on the current article in state. Whenever the article changes, you want to fetch new comments. Here, `useEffect` is needed to “watch” for changes in the article and trigger the fetch automatically.

So, both are side effects, but only the comments fetch needs `useEffect` because it depends on state changes, not direct user actions.*/
