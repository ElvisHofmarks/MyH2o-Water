import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  onBoarding: boolean;
  
}

const initialState: UserState = {
  onBoarding: false,
  
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateOnBoarding: (state:any) => {
      state.onBoarding = true;
    },
  },
});

export const { updateOnBoarding } = userSlice.actions;
export default userSlice.reducer;
