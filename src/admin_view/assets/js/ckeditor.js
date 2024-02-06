// import ImageRemoveEvent from "./ImageRemoveEvent";
// import ImageRemoveEventCallbackPlugin from "./ImageRemoveEventCallbackPlugin";
let imageSources = [];
class MyUploadAdapter {
  constructor(loader) {
    // CKEditor 5's FileLoader instance.
    this.loader = loader;

    // URL where to send files.
    this.url = "http://216.250.12.159:3000/admin/upload/image";
  }

  // Starts the upload process.
  upload() {
    return new Promise((resolve, reject) => {
      this._initRequest();
      this._initListeners(resolve, reject);
      this._sendRequest();
    });
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Example implementation using XMLHttpRequest.
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open("POST", this.url, true);
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = "Couldn't upload file:" + ` ${loader.file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.response);
      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      imageSources.push(response.url);
      resolve({
        default: response.url,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  _sendRequest() {
    const data = new FormData();
    this.loader.file
      .then((res) => {
        data.append("upload", res);
        this.xhr.send(data);
      })
      .catch((err) => {
        consoel.log(err);
      });
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}
let theEditor;

async function editor() {
  try {
    theEditor = await ClassicEditor.create(document.querySelector("#text"), {
      extraPlugins: [MyCustomUploadAdapterPlugin],
    });
  } catch (err) {
    alert(err);
  }
}
editor();
document.getElementById("submit").onclick = () => {
  document.querySelector("#text").value = theEditor.getData();
};

