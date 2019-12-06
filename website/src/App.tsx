import React from 'react';
import Demo from './Demo';
import GithubCorner from 'react-github-corner';

const App: React.FC = () => {
  return (
    <div>
      <Demo />
      <GithubCorner href="https://github.com/bluewings/react-genie-form" />
    </div>
  );
};

export default App;
