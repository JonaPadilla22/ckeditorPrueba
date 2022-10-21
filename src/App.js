import React, { useState, useEffect } from "react";
import "./styles.css";
import Editor from "./Editor";

export default function App() {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  return (
    <div className="App">
      <h1>SECCIÓN</h1>

      <Editor
        className="editor"
        name="editor"
        onChange={(data) => {
          setData(data);
          //console.log(data);
        }}
        editorLoaded={editorLoaded}
      />
   
      {JSON.stringify(data)}
      <br></br>
      <button onclick="subir()">SUBIR</button>     
    </div>
    
  );
  
}

function subir(){
  console.log("a")
}
