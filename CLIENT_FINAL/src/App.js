import { Routes, Route,Navigate } from 'react-router-dom'
import { BrowserRouter  } from 'react-router-dom'
import * as React from 'react'
import TextEditor from './TextEditor';
import { v4 as uuidV4 } from 'uuid';

function App() {
  // const { params } = useParams();
  //   function isUUIDv4(str) {
  //     console.log(str.id);
  //   const uuidv4Regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  //   return uuidv4Regex.test(str.id);
  // }
  
  // console.log(documentId);
  // const status = isUUIDv4(documentId);
  // console.log(status)
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/documents/:id" element={<TextEditor/>} />
    <Route path="/" exact element={<Navigate to={`/documents/${uuidV4()}`} replace />} />
  </Routes>
  </BrowserRouter>
  );
}

export default App;
