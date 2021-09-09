import {LitElement,html,css,} from "https://unpkg.com/lit-element/lit-element.js?module";
class CaasComponent extends LitElement {
  static get properties() {
    return {
      serverURL: { type: String },
      id: { type: String },
      link: { type: Object },
    };
  }
  constructor() {
    super();
    this.link = new Object();
    this.serverURL = "https://localhost:8453/caas/getEntity/";
  }
  render() {
    return html` <div id="placeholder" class="show-content"></div> `;
  }
  firstUpdated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });

    this.getResource();
  }

  async getResource() {
    if((this.id==='undefined')&&(this.id===null)){
      console.log("the id has not been set!");
      alert("the id has not been set!");
      return;
    }
    var getElement = this.serverURL + this.id;
    console.log(getElement);
    fetch(getElement, {
      method: "GET",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      credentials: "include",
    }).then(result => { 
      if (result.status ===401||result.status ===402&&result.status ===403){
        this.shadowRoot.getElementById("placeholder").innerHTML = "the microservice can not handle the request!";
      alert("the microservice can not handle the request!");
      console.log(result.body.message);
      return;
    } 
    else if (result.status===200){
      console.log("the content was sent successfully");
     return result;
    }
    })
      .then((response) => response.json())
      .then((responseText) => {
        var typeOfElement = responseText["type"];
        if (typeOfElement === undefined) {
          typeOfElement = responseText["metadata"]["type"];
        }
        console.log(" type of element " + typeOfElement);
        if (typeOfElement === "image") {
          this.renderImage(responseText["response"]);
        } else if (typeOfElement === "html") {
          this.renderHtml(responseText["response"]);
        } else if (typeOfElement === "pdf") {
          //console.log("we are in the getPDF")
          this.getPDF(responseText["response"]);
        } else {
          alert("the type of the object is not supported");
        }
      })
      .catch((error) => {  
        this.shadowRoot.getElementById("placeholder").innerHTML = "the microservice is not reachable!";
        alert("the microservice is not reachable!");
      });;
  }

  getPDF(res) {
    const binaryString = window.atob(res);
    const bytes = new Uint8Array(binaryString.length);
    const mappedData = bytes.map((byte, i) => binaryString.charCodeAt(i));
    const blob = new Blob([mappedData], { type: "application/pdf" });
    console.log("here is the response");
    console.log(res);
    console.log(blob);
    const filename = "check";
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.setAttribute("download", filename);
    a.text = "Download Me ";
    this.shadowRoot.getElementById("placeholder").innerHTML = "";
    this.shadowRoot.getElementById("placeholder").append(a);
  }

  renderImage(image) {
    console.log("we are in the renderImage function");
    console.log(this.shadowRoot);
    this.shadowRoot.getElementById("placeholder").innerHTML =
      '<img width= 50% height= auto src="data:image/jpg;base64,' +
      image +
      '"></img>';
  }

  openPDF() {
    var file = new Blob([data], { type: "application/pdf" });
    var fileURL = URL.createObjectURL(file);
    window.open(this.link);
    this.shadowRoot.getElementById("placeholder").innerHTML = "";
  }
  renderHtml(html) {
    this.shadowRoot.getElementById("placeholder").innerHTML = html;
  }

  static get styles() {
    return css`
      input {
        width: 50%;
        height: 40px;
        border: 2pxf solid #aaa;
        border-radius: 4px;
        margin: 8px 0;
        outline: none;
        padding: 8px;
        box-sizing: border-box;
        transition: 0.3s;
      }
      input[type="text"]:focus {
        border-color: dodgerBlue;
        box-shadow: 0 0 8px 0 dodgerBlue;
      }
      button {
        width: 6%;
        height: 40px;
        border: 2pxf solid #aaa;
        border-radius: 4px;
        margin: 8px 0;
        outline: none;
        padding: 8px;
        box-sizing: border-box;
        transition: 0.3s;
      }
      button:focus {
        border-color: dodgerBlue;
        box-shadow: 0 0 8px 0 dodgerBlue;
      }
      .show-content {
        padding: 8px;
        width: fit-content;
        /* To adjust the height as well */
        height: fit-content;
      }
    `;
  }
}
customElements.define("caas-component", CaasComponent);
