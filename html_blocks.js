Blockly.Blocks['html_comment'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("comment")
        .appendField(new Blockly.FieldTextInput("..."), "COMMENT");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['html_comment'] = function(block) {
  var text_comment = block.getFieldValue('COMMENT');
  var code = '<!--' + text_comment + ‘-->’;
  return code;
};

