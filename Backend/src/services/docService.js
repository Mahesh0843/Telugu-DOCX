const { Document, Packer, Paragraph, TextRun } = require("docx");
const fs = require("fs");

async function createDoc(text, outputPath) {
  const lines = text.split("\n");

  const doc = new Document({
    sections: [{
      children: lines.map(line =>
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              font: "Nirmala UI", // Best compatibility for Telugu Unicode
              size: 24
            })
          ]
        })
      )
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
}

module.exports = createDoc;