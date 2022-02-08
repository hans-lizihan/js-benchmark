import * as React from 'react';
import './App.css';
import { FrameworkType, knownIssues } from './Common';
import ResultTable from './ResultTable';
import { SelectionBar } from './selection/SelectionBar';

const App = () => {
  // eslint-disable-next-line no-constant-condition
  const disclaimer = (false) ? (<div>
        <h2>Results for js web frameworks benchmark - official run</h2>
        <p>A description of the benchmark and the source code and can be found in the github <a href="https://github.com/krausest/js-framework-benchmark">repository</a>.</p>
      </div>) :
      (<p>Warning: These results are preliminary - use with caution (they may e.g. be from different browser versions). Official results are published on the <a href="https://krausest.github.io/js-framework-benchmark/index.html">results page</a>.</p>);

    return (
      <div>
        {disclaimer}
        <p>The benchmark was run on a Macbook Pro 2021 (M1 Pro, 16 GB RAM, MacOS 12.2 Chrome 98.0.4758.80 arm64)</p>
         <SelectionBar/>
         <ResultTable type={FrameworkType.KEYED}/>
         <ResultTable type={FrameworkType.NON_KEYED}/>

          <h3>Known issues and notes</h3>
          {knownIssues.map(issue =>
            <dl key={issue.issue.toFixed()} id={issue.issue.toFixed()}>
              <dt><a target="_blank" rel="noopener noreferrer" href={issue.link}>{issue.issue.toFixed()}</a></dt>
              <dd>{issue.text}</dd>
            </dl>
          )}
      </div>)
}

export default App;
