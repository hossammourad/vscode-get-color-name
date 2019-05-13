const vscode = require('vscode');
const axios = require('axios').default;
const ncp = require('copy-paste');
const kebabCase = require('lodash/kebabCase');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'extension.getColorName',
    function() {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage('editor does not exist');
        return;
      }

      const selectedText = editor.document.getText(editor.selection); // EXAMPLE: #112233
      if (selectedText[0] === '#') {
        axios
          .get(`https://www.thecolorapi.com/id?hex=${selectedText.substr(1)}`)
          .then(({ data }) => {
            if (data.name.value) {
              const colorName = kebabCase(data.name.value);
              ncp.copy(colorName, () => {
                vscode.window.showInformationMessage(
                  `Color Name has been copied to your clipboard 🎉`
                );
              });
            }
          })
          .catch(error => {
            console.log(error);
            vscode.window.showInformationMessage(
              `An error occured while getting the name of the color, make sure that you're selecting a color HEX value and try again.`
            );
          });
      } else {
        vscode.window.showInformationMessage(
          `Select the HEX color with the # symbol`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

exports.activate = activate;

module.exports = {
  activate
};
