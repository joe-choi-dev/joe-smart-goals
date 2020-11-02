#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { start } = require('repl');
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile); 

//Markdown Utils
const generateMarkdown = (currReadMeData, currInputData, currOutputData) => {

    let draft = `${currReadMeData}`;
    let inputTable, outputTable;
    if (currInputData) {
        draft += "\n" + generateTerraformInputsTable(parseVariables(currInputData));
    }
    if (currOutputData) {
        draft += "\n" + generateTerraformOutputsTable(parseOutputs(currOutputData));
    }

    return draft;
}

const generateTerraformInputsTable = (data) => {
    let table = 
`## Inputs
 
| Variable | Type | Required | Description |
| --- | --- | --- | --- |
${generateTableRows(data)}`  

    return table;
}

const generateTerraformOutputsTable = (data) => {
    let table = 
`## Outputs
 
| Output | Description |
| --- | --- |
${generateTableRows(data)}` 

    return table;
}

const generateTableRows = (dataRows) => {
    let rows = ``;
    dataRows.forEach(dataRow => {
        const newRow = dataRow.join(" | ")
        rows += `| ${newRow} |\n`
    })
    return rows;
}

//Parse variables.tf: [<variables>, <type>, <isRequired>, <description>,]
const parseVariables = (data) => {
    
    //parse all variables strings
    const items = [];
    data.split("variable").slice(1).forEach(item => {
        items.push(item);
    });

    const variables = [];
    items.forEach(function(item) {
        const currRow = [];

        currRow.push(item.substring(0, item.indexOf("{")).match(/"([^']+)"/)[1]);
        const type = item.substring( item.indexOf("type"), item.indexOf("}") );
        currRow.push( type.substring(type.indexOf("=")+2, type.indexOf("\n")) );
        item.includes("default") ? currRow.push( "YES" ) : currRow.push("NO");
        currRow.push(item.substring(item.indexOf("description"), item.indexOf("type")).match(/"([^']+)"/)[1]);

        variables.push(currRow);
    });

    return variables;
};

//Parse outputs.tf: [<output>, <description>]
const parseOutputs = (data) => {
    const items = [];
    data.split("output").slice(1).forEach(item => {
        items.push(item);
    });

    const outputs = [];
    items.forEach(function(item) {
        const currRow = [];
        currRow.push(item.substring(0, item.indexOf("{")).match(/"([^']+)"/)[1]);
        currRow.push(item.substring(item.indexOf("description"), item.indexOf("}")).match(/"([^']+)"/)[1]);
        outputs.push(currRow);
    });

    return outputs;
};

const removeTable = (data, startLine) => {
    let lines = data.split('\n');

    let beg, end;
    let count = 0;
    lines.forEach((line, i) => {
        if (line === startLine) {
            beg = i;
        } 
        if (beg != null && line === "" || line === " ") {
            count++;
        }
        if (beg != null && count === 2 && end == null) {
            end = i;
        }
    })

    beg && end && lines.splice(beg, end-beg+1);

    return lines.join('\n');
}

const generateReadMe = async(readMeFile, variablesFile, outputsFile) =>{
    let readMeData;
    try {
        readMeData = await readFileAsync(readMeFile, 'utf8'); 
    } catch (err) {
        readMeData = ""
    }
    try {
        let variablesFileData, outputsFileData;
        if (variablesFile) {
            variablesFileData = await readFileAsync(variablesFile, 'utf8');
        }
        if (outputsFile) {
            outputsFileData = await readFileAsync(outputsFile, 'utf8');
        }

        readMeData = removeTable(readMeData, "## Inputs");
        readMeData = removeTable(readMeData, "## Outputs");

        console.log("Generating your README next...")
        console.log("")
        const markdown = generateMarkdown(readMeData, variablesFileData, outputsFileData);
        console.log(markdown);

        await writeFileAsync(readMeFile, markdown);
    } catch (err) {
        console.log(err);
    }
}

async function* walk(dir) {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) { 
            if (d.name === "outputs.tf") {
                yield {[dir]: {"outputs": entry}};
            } else if (d.name === "variables.tf") {
                yield {[dir]: {"variables": entry}};
            } else if (d.name === "readme.tf") {
                yield {[dir]: {"readme": entry}};
            }
        }
    }
}

const generateReadMes = async(directory) => {
    const dir = {};
    for await (const p of walk(directory)) {
        if (dir[Object.keys(p)[0]]) {
            dir[Object.keys(p)[0]] = {...Object.values(p)[0], ...dir[Object.keys(p)[0]] };
        } else {
            dir[Object.keys(p)[0]] = {...Object.values(p)[0]};
        }
    }
    for (const k of Object.keys(dir)) {
        let readme = dir.readme;
        if (!readme) {
            readme = k + "/readme.md"
        } 
        await generateReadMe(readme, dir[k].variables, dir[k].outputs);

    }
}

generateReadMes('.');
