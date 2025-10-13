import React from 'react';

const AuthContext = React.createContext({
  user: null,
  signIn: async (u) => { },
  signOut: async () => { },
  setUser: () => { },
});

export default AuthContext;
