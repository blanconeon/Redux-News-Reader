// Import createAsyncThunk and createSlice here.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Create loadCommentsForArticleId here.
export const loadCommentsForArticleId = createAsyncThunk('comments/getAllComments', 
async (id) => {
const response = await fetch(`api/articles/${id}/comments`);
const json = await response.json();
return json;
})
// Create postCommentForArticleId here.

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    // Add initial state properties here.
  byArticleId: {},
  isLoadingComments: false,
  failedToLoadComments: false,
  createCommentIsPending: false,
  failedToCreateComment: false  
  },
  // Add extraReducers here.
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(loadCommentsForArticleId.pending, (state)=> {
      state.isLoadingComments = true;
      state.failedToLoadComments = false;
    })
    .addCase(loadCommentsForArticleId.fulfilled, (state, action)=> {
      state.isLoadingComments = false;
      state.byArticleId[action.meta.arg] = action.payload.comments;
    })//action.meta.arg reresents the value passed as id in the thunk so represents the aticle value.
    .addCase(loadCommentsForArticleId.rejected, (state, actionn) => {
      state.failedToLoadComments = true;
      state.isLoadingComments = false;
      state.byArticleId = {};
    })
    .addCase(postCommentForArticleId.pending, (state) => {
      state.createCommentIsPending = true;
      state.failedToCreateComment = false;
    })
   .addCase(postCommentForArticleId.fulfilled, (state, action) => {
  state.createCommentIsPending = false;
  state.byArticleId[action.meta.arg.articleId] = [...(state.byArticleId[action.meta.arg.articleId] || []),
    action.payload]; //This means:If state.byArticleId[action.meta.arg.articleId] exists, spread its contents.If it does not exist, use an empty array.Then add the new comment.
  console.log('State after:', JSON.parse(JSON.stringify(state.byArticleId)));
})

 // spread operator is NOT ENOUGH for empty values, one must place an empty container if undefined. when you are not sure if the array exists, you must provide an empty array as a fallback. This ensures you always have something to spread, and prevents errors.
  }
});

export const selectComments = (state) => state.comments.byArticleId;
export const isLoadingComments = (state) => state.comments.isLoadingComments;
export const createCommentIsPending = (state) => state.comments.createCommentIsPending;

export default commentsSlice.reducer;


export const postCommentForArticleId = createAsyncThunk('comments/postCommentForArticleId', 
async ({articleId, comment}) => {
const requestBody = JSON.stringify({comment});
const response = await fetch(`api/articles/${articleId}/comments`, {
method: 'POST',
body: requestBody  
}) 
const json = await response.json();
return json
})

//IMPORTANT: with Redux Toolkit’s createAsyncThunk, the thunk function only receives one argument when you dispatch it. That’s because Redux actions are always dispatched with a single payload. so more tha one param needs to be in an object as above " ({articleId, comment}) "


/*  extraReducers: (builder) => {
    builder
      .addCase(loadAllPreviews.pending, (state) => {
        state.isLoadingArticlePreviews = true;
        state.hasError = false;
      })
      .addCase(loadAllPreviews.fulfilled, (state, action) => {
        state.isLoadingArticlePreviews = false;
        state.articles = action.payload;
      })
      .addCase(loadAllPreviews.rejected, (state, action) => {
        state.isLoadingArticlePreviews = false;
        state.hasError = true;
        state.articles = [];
      })
      Here’s a summary specific to reducers/slice when consuming an API:

- The slice has state properties for data, loading, and error.
- When an async thunk is dispatched, the `pending` reducer sets loading to `true` and clears errors.
- If the thunk succeeds, the `fulfilled` reducer sets loading to `false` and updates the data.
- If the thunk fails, the `rejected` reducer sets loading to `false` and sets the error state.
- Only the properties that need to change for each case are updated in the reducer.

After a successful API call (in the `fulfilled` reducer):

- The loading property (like `isLoadingArticlePreviews`) is set to `false` because loading is finished.
- The error property (like `hasError`) is set to `false` because there was no error.
- The data property (like `articles`) is updated with the new data from the API.

So, after a successful fetch, both loading and error flags are `false`, and the state holds the new data. This means the API was successfully consumed and the UI can show the updated data.


 .addCase(postCommentForArticleId.fulfilled, (state, action)=> {
    state.createCommentIsPending = false;
    state.byArticleId[action.meta.arg] ? state.byArticleId[action.meta.arg]= [...state.byArticleId[action.meta.arg], action.payload] : state.byArticleId[action.meta.arg]= [action.payload];
   console.log('State after:', JSON.parse(JSON.stringify(state.byArticleId)));

    })

  */
