import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const loadAllPreviews = createAsyncThunk(
  'articlePreviews/loadAllPreviews',
  async () => {
    const data = await fetch('api/articles');
    const json = await data.json();
    return json;
  }
);

export const articlePreviewsSlice = createSlice({
  name: 'articlePreviews',
  initialState: {
    articles: [],
    isLoadingArticlePreviews: false,
    hasError: false
  },
  extraReducers: (builder) => {
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
        
      })
  },
});

export const selectAllPreviews = (state) => state.articlePreviews.articles;

export const isLoading = (state) => state.articlePreviews.isLoadingArticlePreviews; 

export default articlePreviewsSlice.reducer;


/* That’s a good observation. The builder callback and object notation look different, but both are supported by Redux Toolkit. Here’s how it works:

- **Object notation:**  
  You provide an object to `extraReducers`. Redux Toolkit reads the keys (action types) and values (reducer functions).

- **Builder callback notation:**  
  You provide a function to `extraReducers`. Redux Toolkit calls this function and passes in a special object (the builder). This builder object has methods like `.addCase()` for you to register reducers for specific actions.

You don’t create or import the builder object yourself. Redux Toolkit creates it internally and passes it to your function. You just write the function and use the parameter (usually called `builder`). 

So, the builder object is not visible in your code except as the parameter in the function you provide to `extraReducers`. Redux Toolkit handles the rest behind the scenes. 




The two ways—object notation and builder callback—look different, but they do not affect how you write the thunk. The thunk is created the same way with `createAsyncThunk` in both cases.

The only difference is how you connect the thunk’s actions to your reducers:
- With object notation, you use action types as keys.
- With builder callback, you use `.addCase()` for each action.

Both methods work with the same thunk, and both respond to the same action types. You can choose whichever style you prefer or that fits your project. The thunk code itself stays the same.

That’s correct. With thunks and `extraReducers`, you usually do **not** export the action creators for `pending`, `fulfilled`, or `rejected` actions. Redux Toolkit handles dispatching those actions automatically when you use the thunk.

You only export the thunk itself (created by `createAsyncThunk`). When you dispatch the thunk, Redux Toolkit takes care of:
- Making the async call,
- Dispatching the `pending`, `fulfilled`, and `rejected` actions,
- Passing the results to your reducers in `extraReducers`.

So, you don’t need to export or manually use those action creators. You just set up how your state should respond to them.

*/