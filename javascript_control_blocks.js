Blockly.defineBlocksWithJsonArray([
{
    "type": "mutation_test",
    "message0": "%{BKY_CONTROLS_IF_MSG_IF} %1",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "Boolean"
      }
    ],
    "message1": "%{BKY_CONTROLS_IF_MSG_THEN} %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_LOGIC_HUE}",
    "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
    "mutator": "controls_if_mutator",
    "extensions": ["controls_if_tooltip"]
  }]);
Blockly.JavaScript['mutation_test'] = function(block) {
  var dropdown_event = block.getFieldValue('EVENT');
  // TODO: Assemble JavaScript into code variable.
  var code = 'alert(' + dropdown_event + ');';
  return code;
};
