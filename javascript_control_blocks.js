Blockly.Blocks['mutation_test'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("on")
        .appendField(new Blockly.FieldDropdown([["abort","abort"],["after print","afterprint"],["before print","beforeprint"],["before unload","beforeunload"],["can play","canplay"],["can play through","canplaythrough"],["change","change"],["error","error"],["fullscreen change","fullscreenchange"],["fullscreen error","fullscreenerror"],["input","input"],["invalid","invalid"],["load","load"],["loaded data","loadeddata"],["loaded metadata","loadedmetadata"],["message","message"],["offline","offline"],["online","online"],["open","open"],["pause","pause"],["play","play"],["playing","playing"],["progress","progress"],["rate change","ratechange"],["resize","resize"],["reset","reset"],["scroll","scroll"],["search","search"],["seeked","seeked"],["seeking","seeking"],["select","select"],["show","show"],["stalled","stalled"],["submit","submit"],["suspend","suspend"],["time update","timeupdate"],["toggle","toggle"],["unload","unload"],["waiting","waiting"]]), "EVENT");
    this.setNextStatement(true, null);
    this.setColour(230);
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
