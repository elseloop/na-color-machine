import React from 'react';

// 👩‍💻
// All of the pieces included here should exist
// for every context object required.
// You can usually get away with one context
// passed from some shared parent component,
// but sometimes you need multiple contexts.
// In those cases, each context should follow
// the same pattern outlined here in separate files.


// 🐚
// set null/empty or otherwise sane defaults
// to define your eventual data structure
const initialState = {
  colors: []
};

// 🔈
// set of constants to be dispatched
// from components to signal state updates
const actions = {
  SET_COLORS: "SET_COLORS"
};

// 🌪️
// determines state updates based on dispatched action
const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_COLORS:
      return {
        ...state,
        colors: [...state.colors, action.value]
      };
    default:
      return state;
  }
};

// 🔑
// The actual context as far as React is concerned.
// Importantly, this creates the Provider
// & is consumed by React.useContext().
const ColorsContext = React.createContext();

// 💪
// helper to make using Provider easier by making it an HOC
const ColorsProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // 🚂
  // This entire object—values & setters—is available
  // on all useColors() calls. ie:
  // const { colors, setColors } = useColors();
  // It doesn't need to match the initialState object.
  const value = {
    // this is the context's state snapshot
    colors: state.colors,
    setColors: (value) => {
      dispatch({
        type: actions.SET_COLORS,
        value
      });
    }
  };

  // 🌯
  // This is where the HOC is defined, wrapping the highest
  //  common parent compomnent in <ColorsContext />
  // ie:
  // const App = () => {
  //   return (
  //    <ColorsProvider>
  //      <Header>
  //        <Logo />
  //        <Nav />
  //        <AccountNav />
  //      </Header>
  //      <Hero />
  //      <Main>
  //        <Everything />
  //      </Everything>
  //      <Footer />
  //    </ColorsProvider>
  //   )
  // };
  // All of those children of <ColorsProvider />
  // and any nested children now have access to the state
  // held by this context (& available in 👇  useColors())
  return (
    <ColorsContext.Provider value={value}>
      {children}
    </ColorsContext.Provider>
  );
}

// 🍪
// A helper to make useContext() more useful
// by providing meaningful error handling.
// useColors() can only be called from inside
//  a functional component that is a child
// (nested or direct) of its matching Provider
// (eg: a child of <ColorsProvider />)
const useColors = () => {
  const context = React.useContext(ColorsContext);

  if (!context) {
    throw new Error(`useColors must be used from within <ColorsContext />`);
  }

  return context;
}

export {
  ColorsProvider,
  useColors
};
