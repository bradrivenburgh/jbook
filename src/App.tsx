import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const serviceRef = useRef<any>(null);

  const startService = async () => {
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!serviceRef.current) {
      return;
    }

    const result = await serviceRef.current.build({
      entryPoints: ['index.js'], // first file to be bundled in application
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });
    console.log(result);
    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea onChange={(e) => setInput(e.target.value)} value={input} />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre data-testid='code'>{code}</pre>
    </div>
  );
};

export default App;
