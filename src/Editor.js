
//import { SimpleUploadAdapter } from "@ckeditor/ckeditor5-upload";
//import { CKFinder } from "@ckeditor/ckeditor5-ckfinder";
//import ImageResize from '@ckeditor/ckeditor5-build-classic/src/imageresize';
//import ImageRemoveEventCallbackPlugin from 'ckeditor5-image-remove-event-callback-plugin';
import React, { useEffect, useRef } from "react";

function Editor({ onChange, editorLoaded, name, value }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic")
    };
  }, []);

  const custom_config = {
    extraPlugins: [ MyCustomUploadAdapterPlugin ],
    
    //plugins: [ Image ]
    // ckfinder: {
    //   uploadUrl:'http://26.229.139.48:3000/capacitaciones/upload/1'
    // }
  }

  return (
    
    <div>
      {/* <base href="http://26.229.139.48:3000/secciones/1/"></base> */}
      
      <base href="http://localhost:3001/"></base>
      {editorLoaded ? (
        <CKEditor
          type=""
          name={name}
          editor={ClassicEditor}
          config={custom_config}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData();
            //console.log({data })
            onChange(data);
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </div>
  );
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  }
}

const keys = [];

function get(keys, valorBlob) {
  return keys.find(val => val.blob === valorBlob);
}

class MyUploadAdapter {
  constructor(props) {
    this.loader = props;
    this.url = 'http://26.229.139.48:3000/secciones/upload/1';
  }

  upload() {
    return new Promise((resolve, reject) => {
      // this._initRequest();
      // this._initListeners(resolve, reject);
      // this._sendRequest();
      
      this.loader.file.then(result => {
          var url = URL.createObjectURL(result)
          keys.push({blob: url, nom: result.name, file: result})
          console.log(keys)
          console.log(get(keys, url).file)
          resolve({
            default: url
          });
        }
      )
      
      
    })
  }

  abort() {
      if ( this.xhr ) {
          this.xhr.abort();
      }
  }

  _initRequest() {
      const xhr = this.xhr = new XMLHttpRequest();

      xhr.open('POST', this.url, true);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
      xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImlhdCI6MTY2NjI4NDI3NH0.bWcUZMmzfFiJMpYaxqKNQQIULMNMz8f9jSjgg7rBBms')
  }

  _initListeners( resolve, reject ) {
      const genericErrorText = 'Error al subir la imagen';

      this.xhr.addEventListener( 'error', () => reject( genericErrorText ) );
      this.xhr.addEventListener( 'abort', () => reject() );
      this.xhr.addEventListener( 'load', () => {
          const response = this.xhr.response;
          if ( !response || response.error ) {
              return reject( response && response.error ? response.error.message : genericErrorText );
          }

          resolve({
              default: response.url
          });
          
      } );

      if ( this.xhr.upload ) {
        this.xhr.upload.addEventListener( 'progress', evt => {
              if ( evt.lengthComputable ) {
                  this.loader.uploadTotal = evt.total;
                  this.loader.uploaded = evt.loaded;
              }
          } );
      }
  }

  _sendRequest() {
      const data = new FormData();

      this.loader.file.then(result => {
        data.append('file', result);
        this.xhr.send(data);
        }
      )
  }

}

export default Editor;
