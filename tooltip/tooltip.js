function Tooltip (options) {
  this.settings = {
    offsetX: '',
    offsetY: '',
    target: 'body',
    content: '',
    showEvent: 'focus',
    hideEvent: 'blur',
    position: 'left',
    interval: 10
  };
  $.extend(this.settings, options || {});
  this._init();
};

Tooltip.prototype._init = function () {
  var s = this.settings
      ;
  this.$toolTipCon = $('<div class="tooltip-container"></div>');
  this.$arrow = $('<div class="tooltip-arrow"></div>');
  this.$closeBtn = $('<div class="tooltip-close"><a href="javascript:void(0)">X</a></div>');
  this.$content =  $('<div class="Tooltip-content"></div>');
  this.$content.html(s.content);
  this._bindEvent();
};

Tooltip.prototype._bindEvent = function () {
  var s = this.settings,
      $target = $(s.target),
      self = this
      ;
  $target = typeof $target === 'string' ? $($target) : $target;
  $target.on(s.showEvent, function () {
    self.show();
  });
  $target.on(s.hideEvent, hide);
  this.$closeBtn.on('click', hide);
  function hide () {
    self.hide();
  };
};

Tooltip.prototype.render = function () {  
  var s = this.settings,
      $target = $(s.target)
      ;
  this.$toolTipCon.append(this.$arrow).append(this.$closeBtn).append(this.$content);
  $target.after(this.$toolTipCon);
  $(this).trigger('hload');
  this.setPosition();
  this.setArrowPos();
};

Tooltip.prototype.show = function () {
  $(this).trigger('hbeforeshow');
  this.$toolTipCon.css('opacity', 0).show().animate({
  opacity: 1
 }, 800);
 $(this).trigger('hshow');
};

Tooltip.prototype.hide = function () {
  $(this).trigger('hbeforehide');
  this.$toolTipCon.hide();
  $(this).trigger('hhide');
};

Tooltip.prototype.setContent = function (con) {
  this.$content.html(con);
};

Tooltip.prototype.setArrowPos = function (obj) {
  var s = this.settings
      ;
  this.$arrow.addClass(s.position)   
  if ( !obj ) {
    obj = this._getArrowPos(); 
  }
  this.$arrow.css({
    left: obj.x,
    top: obj.y
  });
}

Tooltip.prototype._getArrowPos = function () {
  var toolTipConW = this.$toolTipCon.width(),
      toolTipConH = this.$toolTipCon.height(),
      arrowW = this.$arrow.width(),
      arrowH = this.$arrow.height(),
      arrowX = toolTipConW/8,
      arrowY= toolTipConH/8,
      s = this.settings,
      arrowPos = {
        bottom: {x: arrowX, y: -arrowH},
        top: {x: arrowX, y: toolTipConH},
        right: {x: -arrowW, y: arrowY},
        left: {x: toolTipConW, y: arrowY},
      }
  ;
  switch (s.position) {
    case 'right':
      return arrowPos.right;
    case 'left':
      return arrowPos.left;
    case 'top':
      return arrowPos.top;
    default: 
      return arrowPos.bottom;
  }
}
Tooltip.prototype.setPosition = function (obj) { 
  var s = this.settings
      ;
  if ( !obj ) {
    if ( s.offsetX || s.offsetY ) {
      obj = {x: s.offsetX, y: s.offsetY}
    } else {
      obj = this._getPosition();
    }
  }
  this.$toolTipCon.css({
    marginTop: obj.y,
    marginLeft: obj.x
  })
};
Tooltip.prototype._getPosition = function () {
  var s = this.settings,
      x = 0,
      y = 0,
      s = this.settings,
      interval = s.interval,
      $target = $(s.target),
      target = $target.offset(),
      h = $(document).height(),
      w = $(document).width(),
      $targetH = $target.height(),
      $targetW = $target.width(),
      toolTipConW = this.$toolTipCon.width(),
      toolTipConH = this.$toolTipCon.height(),
      tooltipPos = {
        bottom: {x: 0, y: interval},
        right: {x: $targetW + interval, y: -($targetH)},
        top: {x: 0, y: -($targetH + toolTipConH + interval) },
        left: {x: -(toolTipConW + interval), y: -($targetH)}
      }
      ;
  switch (s.position) {
    case 'right':
      return tooltipPos.right;
    case 'left':
      return tooltipPos.left;
    case 'top':
      return tooltipPos.top;
    default: 
      return tooltipPos.bottom;
  }
};
