Blockly.Blocks['mutation_test'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("on")
        .appendField(new Blockly.FieldDropdown([["abort","abort"],["after print","afterprint"],["before print","beforeprint"],["before unload","beforeunload"],["can play","canplay"],["can play through","canplaythrough"],["change","change"],["error","error"],["fullscreen change","fullscreenchange"],["fullscreen error","fullscreenerror"],["input","input"],["invalid","invalid"],["load","load"],["loaded data","loadeddata"],["loaded metadata","loadedmetadata"],["message","message"],["offline","offline"],["online","online"],["open","open"],["pause","pause"],["play","play"],["playing","playing"],["progress","progress"],["rate change","ratechange"],["resize","resize"],["reset","reset"],["scroll","scroll"],["search","search"],["seeked","seeked"],["seeking","seeking"],["select","select"],["show","show"],["stalled","stalled"],["submit","submit"],["suspend","suspend"],["time update","timeupdate"],["toggle","toggle"],["unload","unload"],["waiting","waiting"]]), "EVENT");
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  },
    mutationToDom: function() {
        var a = document.createElement("mutation");
        a.setAttribute("items", this.itemCount_);
        return a
    },
    domToMutation: function(a) {
        this.itemCount_ = parseInt(a.getAttribute("items"),
            10);
        this.updateShape_()
    },
    decompose: function(a) {
        var b = a.newBlock("lists_create_with_container");
        b.initSvg();
        for (var c = b.getInput("STACK").connection, d = 0; d < this.itemCount_; d++) {
            var e = a.newBlock("lists_create_with_item");
            e.initSvg();
            c.connect(e.previousConnection);
            c = e.nextConnection
        }
        return b
    },
    compose: function(a) {
        var b = a.getInputTargetBlock("STACK");
        for (a = []; b;) a.push(b.valueConnection_), b = b.nextConnection && b.nextConnection.targetBlock();
        for (b = 0; b < this.itemCount_; b++) {
            var c = this.getInput("ADD" + b).connection.targetConnection;
            c && -1 == a.indexOf(c) && c.disconnect()
        }
        this.itemCount_ = a.length;
        this.updateShape_();
        for (b = 0; b < this.itemCount_; b++) Blockly.Mutator.reconnect(a[b], this, "ADD" + b)
    },
    saveConnections: function(a) {
        a = a.getInputTargetBlock("STACK");
        for (var b = 0; a;) {
            var c = this.getInput("ADD" + b);
            a.valueConnection_ = c && c.connection.targetConnection;
            b++;
            a = a.nextConnection && a.nextConnection.targetBlock()
        }
    },
    updateShape_: function() {
        this.itemCount_ && this.getInput("EMPTY") ? this.removeInput("EMPTY") : this.itemCount_ || this.getInput("EMPTY") ||
            this.appendDummyInput("EMPTY").appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
        for (var a = 0; a < this.itemCount_; a++)
            if (!this.getInput("ADD" + a)) {
                var b = this.appendValueInput("ADD" + a);
                0 == a && b.appendField(Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH)
            } for (; this.getInput("ADD" + a);) this.removeInput("ADD" + a), a++
    }
};
Blockly.JavaScript['mutation_test'] = function(block) {
  var dropdown_event = block.getFieldValue('EVENT');
  // TODO: Assemble JavaScript into code variable.
  var code = 'alert(' + dropdown_event + ');';
  return code;
};
