Blockly.Blocks['mutation_test'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("on")
        .appendField(new Blockly.FieldDropdown([["abort","abort"],["after print","afterprint"],["before print","beforeprint"],["before unload","beforeunload"],["can play","canplay"],["can play through","canplaythrough"],["change","change"],["error","error"],["fullscreen change","fullscreenchange"],["fullscreen error","fullscreenerror"],["input","input"],["invalid","invalid"],["load","load"],["loaded data","loadeddata"],["loaded metadata","loadedmetadata"],["message","message"],["offline","offline"],["online","online"],["open","open"],["pause","pause"],["play","play"],["playing","playing"],["progress","progress"],["rate change","ratechange"],["resize","resize"],["reset","reset"],["scroll","scroll"],["search","search"],["seeked","seeked"],["seeking","seeking"],["select","select"],["show","show"],["stalled","stalled"],["submit","submit"],["suspend","suspend"],["time update","timeupdate"],["toggle","toggle"],["unload","unload"],["waiting","waiting"]]), "EVENT");
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setMutator("mute");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['mutation_test'] = function(block) {
  var dropdown_event = block.getFieldValue('EVENT');
  // TODO: Assemble JavaScript into code variable.
  var code = 'alert(' + dropdown_event + ');';
  return code;
};
Blockly.Extensions.registerMutator('mute',
    test1,
    test2);

var test1 = {
  /**
   * Create XML to represent whether the 'divisorInput' should be present.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var divisorInput = (this.getFieldValue('PROPERTY') == 'DIVISIBLE_BY');
    container.setAttribute('divisor_input', divisorInput);
    return container;
  },
  /**
   * Parse XML to restore the 'divisorInput'.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var divisorInput = (xmlElement.getAttribute('divisor_input') == 'true');
    this.updateShape_(divisorInput);
  },
  /**
   * Modify this block to have (or not have) an input for 'is divisible by'.
   * @param {boolean} divisorInput True if this block has a divisor input.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function(divisorInput) {
    // Add or remove a Value Input.
    var inputExists = this.getInput('DIVISOR');
    if (divisorInput) {
      if (!inputExists) {
        this.appendValueInput('DIVISOR')
            .setCheck('Number');
      }
    } else if (inputExists) {
      this.removeInput('DIVISOR');
    }
  }
};
var test2 = function() {
  this.getField('PROPERTY').setValidator(function(option) {
    var divisorInput = (option == 'DIVISIBLE_BY');
    this.sourceBlock_.updateShape_(divisorInput);
  });
};
