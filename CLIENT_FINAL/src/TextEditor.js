import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom';

const SAVE_TIMER = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];

function TextEditor() {
    const [socket,setSocket] = useState();
    const [quill,setquill] = useState();
    const editorWrapper = useRef(null);
    const {id:documentId} = useParams();
    console.log(documentId);
    useEffect(()=>{
        const s = io("https://syncwrite-backend.onrender.com")
       setSocket(s);
       return ()=>{
        s.disconnect();
       }
    },[])

    useEffect(() => {
      if (socket == null || quill == null) return
  
      socket.once("load-document", document => {
        quill.setContents(document)
        quill.enable()
      })
  
      socket.emit("get-document", documentId)
    }, [socket, quill, documentId])
  
    useEffect(() => {
      if (socket == null || quill == null) return
  
      const interval = setInterval(() => {
        socket.emit("save-document", quill.getContents())
      }, SAVE_TIMER)
  
      return () => {
        clearInterval(interval)
      }
    }, [socket, quill])
  
    useEffect(() => {
      if (socket == null || quill == null) return
  
      const handler = delta => {
        quill.updateContents(delta)
      }
      socket.on("receive-changes", handler)
  
      return () => {
        socket.off("receive-changes", handler)
      }
    }, [socket, quill])
  
    useEffect(() => {
      if (socket == null || quill == null) return
  
      const handler = (delta, oldDelta, source) => {
        if (source !== "user") return
        socket.emit("send-changes", delta)
      }
      quill.on("text-change", handler)
  
      return () => {
        quill.off("text-change", handler)
      }
    }, [socket, quill])

  useEffect(() => {
    if (!editorWrapper.current) return;

    const editorElement = document.createElement('div');
    editorWrapper.current.append(editorElement);

    const q = new Quill(editorElement, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });
    q.disable();
    q.setText("Loading....")
    setquill(q);
    
    return () => {
      editorWrapper.current.innerHTML = '';
    };
  }, []);

  return <div className='container' ref={editorWrapper}></div>;
}

export default TextEditor;