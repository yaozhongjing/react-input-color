var cx = require('react/lib/cx');
var React = require('react');
var objectAssign = require('object-assign');
var colorParser = require('color-parser');

var ColorPicker = require('./color-picker.jsx');
var rgbaColor = require('./rgba-color');
var rgb2hsv = require('./rgb2hsv');
var rgb2hex = require('./rgb2hex');

var KEY_ENTER = 13;

function getColor(cssColor) {
  var rgba = colorParser(cssColor);
  var r = rgba.r, g = rgba.g, b = rgba.b, a = rgba.a*100;
  var hsv = rgb2hsv(r, g, b);

  return objectAssign(hsv, {
    r: r,
    g: g,
    b: b,
    a: a,
    hex: rgb2hex(r, g, b)
  });
}

module.exports = React.createClass({
  displayName: 'InputColor',

  getInitialState: function() {
    var cssColor = this.props.color;

    return {
      cssColor: cssColor,
      color: getColor(this.props.color),
      colorPicker: true
    };
  },

  render: function() {
    var color = this.state.color;
    var r = color.r, g = color.g, b = color.b, a = color.a;
    var rgbaBackground = rgbaColor(r, g, b, a);

    return (
      <div className="m-input-color">
        <div className="css-input-box">
          <div className="css-color"
            style={{background:rgbaBackground}}
            onClick={this._onClick}></div>
          <input className="css-input" type="text" value={this.state.cssColor}
            onChange={this._onInputChange} onKeyUp={this._onInputKeyUp}/>
        </div>
        {this.state.colorPicker ? <ColorPicker color={this.state.color} onChange={this._onChange}/> : null}
      </div>
    );
  },

  componentWillReceiveProps: function(nextProps) {
    var cssColor = nextProps.color;

    // anti-pattern, maybe
    if(!this._updated) {
      this.setState({
        cssColor: cssColor,
        color: getColor(cssColor)
      });
    } else {
      this._updated = false;
    }
  },

  change: function(cssColor) {
    if(this.props.onChange) {
      this.props.onChange(cssColor);
    }
  },

  _onInputChange: function(e) {
    this.setState({
      cssColor: e.target.value
    });
  },

  _onInputKeyUp: function(e) {
    if(e.keyCode === KEY_ENTER) {
      this.change(this.state.cssColor);
    }
  },

  _onChange: function(color) {
    this.setState({
      cssColor: '#'+color.hex,
      color: color
    });
    this._updated = true;
    this.change('#'+color.hex);
  },

  _onClick: function() {
    this.setState({colorPicker: !this.state.colorPicker});
  }
});