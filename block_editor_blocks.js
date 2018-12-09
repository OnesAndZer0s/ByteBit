goog.require('Blockly.FieldDate');
var mixin = {
  blankCount_: 0,
  valueCount_: 0,
  statementCount_: 0,

  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.blankCount_ && !this.valueCount_) {
      return null; 
    }
    var container = document.createElement('mutation');
    if (this.blankCount_) {
      container.setAttribute('elseif', this.blankCount_);
    }
    if (this.valueCount_) {
      container.setAttribute('else', 1);
    }
    if (this.statementCount_) {
      container.setAttribute('statement', this.statementCount_);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.blankCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
    this.valueCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('creator_mutation_input');
    containerBlock.initSvg();
    var connection = containerBlock.nextConnection;
    for (var i = 1; i <= this.blankCount_; i++) {
      var elseifBlock = workspace.newBlock('controls_if_elseif');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.valueCount_) {
      var elseBlock = workspace.newBlock('controls_if_else');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.blankCount_ = 0;
    this.valueCount_ = 0;
    var valueConnections = [null];
    var statementConnections = [null];
    var elseStatementConnection = null;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          this.blankCount_++;
          valueConnections.push(clauseBlock.valueConnection_);
          statementConnections.push(clauseBlock.statementConnection_);
          break;
        case 'controls_if_else':
          this.valueCount_++;
          elseStatementConnection = clauseBlock.statementConnection_;
          break;
        default:
          throw TypeError('Unknown block type: ' + clauseBlock.type);
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 1; i <= this.blankCount_; i++) {
      Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
      Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
    }
    Blockly.Mutator.reconnect(elseStatementConnection, this, 'ELSE');
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          var inputIf = this.getInput('IF' + i);
          var inputDo = this.getInput('DO' + i);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case 'controls_if_else':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw TypeError('Unknown block type: ' + clauseBlock.type);
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('ELSE')) {
      this.removeInput('ELSE');
    }
    var i = 1;
    while (this.getInput('IF' + i)) {
      this.removeInput('IF' + i);
      this.removeInput('DO' + i);
      i++;
    }
    // Rebuild block.
    for (var i = 1; i <= this.blankCount_; i++) {
      this.appendValueInput('IF' + i)
          .setCheck('Boolean')
          .appendField(Blockly.Msg['CONTROLS_IF_MSG_ELSEIF']);
      this.appendStatementInput('DO' + i)
          .appendField(Blockly.Msg['CONTROLS_IF_MSG_THEN']);
    }
    if (this.valueCount_) {
      this.appendStatementInput('ELSE')
          .appendField(Blockly.Msg['CONTROLS_IF_MSG_ELSE']);
    }
  }
};
;
Blockly.Extensions.registerMutator('creator_inputs', mixin, null, ['controls_if_elseif','controls_if_else','creator_blank_line','creator_value_line','creator_statement_line']);
Blockly.defineBlocksWithJsonArray([
  {
  "type": "block_creator",
  "message0": "name %1 %2 %3 inputs %4 %5 DROPDOWNMUTATION %6 tooltip %7 help url %8 color %9 mutator %10 inputs MENUMUTATOR",
  "args0": [
    {
      "type": "field_input",
      "name": "BLOCKNAME",
      "text": "block_type"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_dropdown",
      "name": "INPUTLINE",
      "options": [
        [
          "automatic",
          "null"
        ],
        [
          "external",
          "false"
        ],
        [
          "inline",
          "true"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_dropdown",
      "name": "CONNECTIONS",
      "options": [
        [
          "no connections",
          "none"
        ],
        [
          "left output",
          "left"
        ],
        [
          "top & bottom connections",
          "topbottom"
        ],
        [
          "top connection",
          "top"
        ],
        [
          "bottom connection",
          "bottom"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "TOOLTIP",
      "check": "String"
    },
    {
      "type": "input_value",
      "name": "HELPURL",
      "check": "String"
    },
    {
      "type": "input_value",
      "name": "COLOR",
      "check": "color"
    },
    {
      "type": "input_value",
      "name": "MUTATOR"
    }
  ],
  "colour": 135,
  "mutator": "creator_inputs",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "creator_mutation_input",
  "message0": "inputs %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "INPUTS"
    }
  ],
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "text_field",
  "message0": "text %1 , %2",
  "args0": [
    {
      "type": "field_input",
      "name": "TEXT",
      "text": "text"
    },
    {
      "type": "field_input",
      "name": "CLASS",
      "text": "CLASS"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": "https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#label"
},
{
  "type": "text_input_field",
  "message0": "text input %1 , %2 , spellcheck %3",
  "args0": [
    {
      "type": "field_input",
      "name": "default",
      "text": "default"
    },
    {
      "type": "field_input",
      "name": "name",
      "text": "NAME"
    },
    {
      "type": "field_checkbox",
      "name": "SPELLCHECK",
      "checked": true
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "number_input_field",
  "message0": "numeric input %1 , %2 %3 min %4 max %5 precision %6",
  "args0": [
    {
      "type": "field_number",
      "name": "NUMBER",
      "value": 0,
      "precision": 1
    },
    {
      "type": "field_input",
      "name": "NAME",
      "text": "NAME"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_number",
      "name": "MIN",
      "value": 0,
      "precision": 1
    },
    {
      "type": "field_number",
      "name": "MAX",
      "value": 0,
      "precision": 1
    },
    {
      "type": "field_number",
      "name": "PRECISION",
      "value": 0,
      "precision": 1
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "angle_input_field",
  "message0": "angle input %1 , %2",
  "args0": [
    {
      "type": "field_angle",
      "name": "ANGLE",
      "angle": 90
    },
    {
      "type": "field_input",
      "name": "NAME",
      "text": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "color_picker_field",
  "message0": "color %1 , %2",
  "args0": [
    {
      "type": "field_colour",
      "name": "COLOR",
      "colour": "#ff0000"
    },
    {
      "type": "field_input",
      "name": "NAME",
      "text": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "dropdown_list_field",
  "message0": "dropdown %1 MUTATORHERE",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "date_input_field",
  "message0": "date %1 , %2",
  "args0": [
    {
      "type": "field_date",
      "name": "DATE",
      "date": "2020-02-20"
    }, 
    {
      "type": "field_input",
      "name": "NAME",
      "text": "NAME"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "goog.require('Blockly.FieldDate')",
  "helpUrl": "https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#date_field"
},
{
  "type": "checkbox_field",
  "message0": "checkbox %1 , %2",
  "args0": [
    {
      "type": "field_checkbox",
      "name": "CHECKBOX",
      "checked": true
    },
    {
      "type": "field_input",
      "name": "NAME",
      "text": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "variable_field",
  "message0": "variable %1 , %2",
  "args0": [
    {
      "type": "field_input",
      "name": "ITEM",
      "text": "item"
    },
    {
      "type": "field_input",
      "name": "NAME",
      "text": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "image_field",
  "message0": "image %1 %2 width %3 height %4 alt text %5",
  "args0": [
    {
      "type": "field_input",
      "name": "IMAGEURL",
      "text": "url"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_number",
      "name": "WIDTH",
      "value": 0,
      "min": 0
    },
    {
      "type": "field_number",
      "name": "HEIGHT",
      "value": 0,
      "min": 0
    },
    {
      "type": "field_input",
      "name": "ALTTEXT",
      "text": ""
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "creator_blank_line",
  "message0": "blank",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "creator_value_line",
  "message0": "value",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "creator_statement_line",
  "message0": "statement",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "dropdown_text_option",
  "message0": "text option",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "dropdown_image_option",
  "message0": "image option",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "type_any_of",
  "message0": "MENUMUTATOR",
  "inputsInline": false,
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "type_select",
  "message0": "%1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "TYPE",
      "options": [
        [
          "any",
          "any"
        ],
        [
          "boolean",
          "boolean"
        ],
        [
          "number",
          "number"
        ],
        [
          "string",
          "string"
        ],
        [
          "array",
          "array"
        ],
        [
          "other",
          "other"
        ]
      ]
    }
  ],
  "inputsInline": false,
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "color_rgb",
  "message0": "RGB %1 %2 %3",
  "args0": [
    {
      "type": "field_number",
      "name": "R",
      "value": 0,
      "min": 0,
      "max": 255
    },
    {
      "type": "field_number",
      "name": "G",
      "value": 0,
      "min": 0,
      "max": 255
    },
    {
      "type": "field_number",
      "name": "B",
      "value": 0,
      "min": 0,
      "max": 255
    }
  ],
  "output": "color",
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "color_hex",
  "message0": "hex %1",
  "args0": [
    {
      "type": "field_input",
      "name": "HEX",
      "text": ""
    }
  ],
  "output": "color",
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "color_hsl",
  "message0": "HSL %1 %2 %3",
  "args0": [
    {
      "type": "field_number",
      "name": "H",
      "value": 0,
      "min": 0,
      "max": 360
    },
    {
      "type": "field_number",
      "name": "S",
      "value": 0,
      "min": 0,
      "max": 100
    },
    {
      "type": "field_number",
      "name": "L",
      "value": 0,
      "min": 0,
      "max": 100
    }
  ],
  "output": "color",
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}])

Blockly.JavaScript['block_creator'] = function(block) {
  var text_blockname = block.getFieldValue('BLOCKNAME');
  var dropdown_inputline = block.getFieldValue('INPUTLINE');
  var dropdown_connections = block.getFieldValue('CONNECTIONS');
  var value_tooltip = Blockly.JavaScript.valueToCode(block, 'TOOLTIP', Blockly.JavaScript.ORDER_ATOMIC);
  var value_helpurl = Blockly.JavaScript.valueToCode(block, 'HELPURL', Blockly.JavaScript.ORDER_ATOMIC);
  var value_color = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_ATOMIC);
  var value_mutator = Blockly.JavaScript.valueToCode(block, 'MUTATOR', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['text_field'] = function(block) {
  var text_text = block.getFieldValue('TEXT');
  var text_class = block.getFieldValue('CLASS');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['text_input_field'] = function(block) {
  var text_default = block.getFieldValue('default');
  var text_name = block.getFieldValue('name');
  var checkbox_spellcheck = block.getFieldValue('SPELLCHECK') == 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['number_input_field'] = function(block) {
  var number_number = block.getFieldValue('NUMBER');
  var text_name = block.getFieldValue('NAME');
  var number_min = block.getFieldValue('MIN');
  var number_max = block.getFieldValue('MAX');
  var number_precision = block.getFieldValue('PRECISION');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['angle_input_field'] = function(block) {
  var angle_angle = block.getFieldValue('ANGLE');
  var text_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['color_picker_field'] = function(block) {
  var colour_color = block.getFieldValue('COLOR');
  var text_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['dropdown_list_field'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['checkbox_field'] = function(block) {
  var checkbox_checkbox = block.getFieldValue('CHECKBOX') == 'TRUE';
  var text_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['variable_field'] = function(block) {
  var text_item = block.getFieldValue('ITEM');
  var text_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['date_input_field'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['image_field'] = function(block) {
  var text_imageurl = block.getFieldValue('IMAGEURL');
  var number_width = block.getFieldValue('WIDTH');
  var number_height = block.getFieldValue('HEIGHT');
  var text_alttext = block.getFieldValue('ALTTEXT');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['creator_blank_line'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['creator_value_line'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['creator_statement_line'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['dropdown_text_option'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['dropdown_image_option'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['type_any_of'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['type_select'] = function(block) {
  var dropdown_type = block.getFieldValue('TYPE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['color_rgb'] = function(block) {
  var number_r = block.getFieldValue('R');
  var number_g = block.getFieldValue('G');
  var number_b = block.getFieldValue('B');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['color_hex'] = function(block) {
  var text_hex = block.getFieldValue('HEX');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['color_hsl'] = function(block) {
  var number_h = block.getFieldValue('H');
  var number_s = block.getFieldValue('S');
  var number_l = block.getFieldValue('L');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};
