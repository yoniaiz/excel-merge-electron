import React, { useState, Fragment } from "react";
import XLSX from "xlsx";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { saveAs } from "file-saver";
import "./App.css";
import Helmet from "react-helmet";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;
const App = () => {
  const [fullJson, setFullJson] = useState({});
  const [sheetName, setSheetName] = useState('');
  let htmlstr = "";
  const validateJson = json => {
    if (json && typeof json === "string") {
      let jsonParse = {};
      try {
        jsonParse = JSON.parse(json);
        return typeof jsonParse === "object";
      } catch {
        return false;
      }
    }
    return false;
  };

  const createTableForDisplay = json => {
    if (fullJson && fullJson.length > 0) {
      var ws = XLSX.utils.json_to_sheet(JSON.parse(fullJson));

      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'name');
      htmlstr = XLSX.write(wb, {

        type: "binary",
        bookType: "html"
      });
      console.log('htmlstr ',htmlstr)
      document.getElementById('container').innerHTML = htmlstr
      return "123";
    }
    return "1";
  };
  const combineJsons = (json1, json2) => {
    return JSON.stringify([...JSON.parse(json1), [], [], ...JSON.parse(json2)]);
  };
  const ExcelToJSON = e => {
    const file = e.target.files[0];

    var reader = new FileReader();

    reader.onload = function(e) {
      var data = e.target.result;
      debugger
      var workbook = XLSX.read(data, {
        type: "binary",
        cellDates: true
      });
      setSheetName(workbook.SheetNames[0]);
      workbook.SheetNames.forEach(function(sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        );
        var json_object = JSON.stringify(XL_row_object);
        setFullJson(prevJson =>
          validateJson(prevJson)
            ? combineJsons(prevJson, json_object)
            : json_object
        );
        createTableForDisplay();
        console.log("json_object ", json_object);
      });
    };

    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };

  const generateDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return `${mm}-${dd}-${yyyy}`;
  };
  const JsonToXlsx = data => {
    /* make the worksheet */
    var ws = XLSX.utils.json_to_sheet(JSON.parse(data));

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, generateDate());

    /* generate an XLSX file */
    return XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  };

  const s2ab = s => {
    const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    const view = new Uint8Array(buf); //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  };

  const showImage = () => {
    ipcRenderer.send("toggle-settings");
  };
  return (
    <Fragment>
      <Helmet>
        {
          htmlstr
        }
      </Helmet>
      <div className="App">
        <input type="file" id="my_file_input" onChange={e => ExcelToJSON(e)} />
        <div id="my_file_output"></div>
        <button
          onClick={() => {
            saveAs(
              new Blob([s2ab(JsonToXlsx(fullJson))], {
                type: "application/octet-stream"
              }),
              "test.xlsx"
            );
          }}
        >
          Create Excel
        </button>
        <div id='container'>

        </div>
      </div>
    </Fragment>
  );
};

export default App;
