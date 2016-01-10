function Dialog (options) {
  this.settings = {
    buttons: {
      items: [{text: '确定', disabled: false, callback: function () {}}, 
              {text: '失效', disabled: true, callback: function () {}}, 
              {text: '自定义', disabled: false, callback: function () {}}
             ]
    },
    mask: {
      bgColor: '#000',
      opacity: 0.3
    },
    title: '',
    content: '',
    width: 400,
    height: 300,
    left: 0,
    top: 0,
    draggable: true
  };
  $.extend(this.settings, options || {});
  this._init();
};
Dialog.COUNT = 0;
Dialog.ZINDEX = 999;
Dialog.prototype._init = function () {
  var s = this.settings,
      str = ''
      ;
  this.$mask = $('<div class="mask"></div>');
  this.$mask.css({
    opacity: s.mask.opacity,
    backgroundColor: s.mask.bgColor
  });
  this.$dialogCon = $('<div class="dialog"></div>');
  this.$dialogTitle = $('<div class="dialog-title"><a href="javascript:void(0);" class="close">X</a><span class="draggable title">'+s.title+'</span></div>');
  this.$dialogBody = $('<div class="dialog-body"></div>');
  this.$dialogFooter = $('<div class="dialog-footer"></div>');
  this.$dialogCon.css({
    width: s.width,
    height: s.height,
    left: s.left,
    top: s.top,
    zIndex: ++Dialog.ZINDEX
  });
  this.$dialogBody.html(s.content);
  for (var i=0,len=s.buttons.items.length; i<len; i++) {
    var o = s.buttons.items[i]
        ;
    if ( o.disabled ) {
      str += '<button disabled>'+o.text+'</button>';
    } else {
      str += '<button>'+o.text+'</button>';
    }
  }
  this.$dialogFooter.html(str);
  this.$dialogCon.append(this.$dialogTitle).append(this.$dialogBody).append(this.$dialogFooter);
};

Dialog.prototype._load = function () {
 this._bindEvent();
};
Dialog.prototype._bindEvent = function () {
  var buttons = this.$dialogFooter.find('button'),
      $close = this.$dialogTitle.find('.close'),
      $draggable = this.$dialogTitle.find('.draggable'),
      s = this.settings,
      self = this
      ;
  for (var i=0,len=s.buttons.items.length; i<len; i++) {
    o = s.buttons.items[i]
    $(buttons.get(i)).click(o.callback);
  }
  $close.click(function () {
    self.hide();
  });
  var downX = 0,
      downY = 0,
      disX = 0,
      disY = 0,
      left = 0,
      top = 0
      ;
  $draggable.mousedown(down);
  function down (e) {
    var pos = self.getPosition()
        ;
    downX = e.clientX;
    downY = e.clientY;
    left = pos.left;
    top = pos.top;
    $(document).on('mousemove', move);
    $(document).on('mouseup', up);
    return false;
  }
  function move (e) {
    disX = e.clientX - downX;
    disY = e.clientY - downY;
    self.$dialogCon.css({
      left: disX + left,
      top: disY + top
    });
  }
  function up () {
    $(document).off('mousemove');
    $(document).off('mouseup');
  }

};
Dialog.prototype.render = function (con) {
  con = con ? $(con) : $('body');
  con.append(this.$dialogCon);
  this._load();
  $(this).trigger('hload');
};
Dialog.prototype.show = function () {
  this.$dialogCon.show();
};
Dialog.prototype.hide = function () {
  this.$dialogCon.hide();
};
Dialog.prototype.renderMask = function (con) {
  var $mask = $('.mask')
      ;
  this.$mask = $mask.length > 0 ? $mask : this.$mask;    
  con = con ? $(con) : $('body');
  ;
  con.append(this.$mask);
};
Dialog.prototype.showMask = function () {
  this.$mask.show();
};
Dialog.prototype.hideMask = function () {
  this.$mask.hide();
};
Dialog.prototype.isShowing = function () {
  return this.$mask.is('visiable');
};

Dialog.prototype.setTitle = function (str) {
  this.$dialogTitle.find('.title').html(str);
}
Dialog.prototype.setContent = function (str) {
  this.$dialogBody.html(str);
}
Dialog.prototype.focus = function () {
  this.$dialogCon.find('input[type="text"]').eq(0).focus();
}
Dialog.prototype.setSize = function (obj) {
  this.$dialogCon.css({
    width: obj.width,
    height: obj.height
  });
}
Dialog.prototype.getSize = function () {
  var w = 0,
      h = 0
      ;
  w = this.$dialogCon.width();    
  h = this.$dialogCon.height();    
  return {width: w, height: h}
}
Dialog.prototype.setPosition = function (obj) {
  this.$dialogCon.css({
    left: obj.left,
    top: obj.top
  });
}
Dialog.prototype.getPosition = function () {
  var top = 0,
      left = 0,
      offset = this.$dialogCon.offset()
      ;
  top = offset.top;
  left = offset.left;
  return {top: top, left: left}
}
Dialog.prototype.center = function () {
  var l = 0,
      t = 0,
      size = this.getSize(),
      w = $(document).width(),
      h = $(document).height()
      ;
  l = (w - size.width) / 2;
  t = (h - size.height) / 2;
  this.setPosition({
    top: t,
    left: l
  });
}

Dialog.prototype.getOrder = function () {
  return ++Dialog.COUNT;
}