function Tab (options) {
  this.settings = {
    items: [
      {title: '开始', content: 'content1'}, 
      {title: '配置', content: 'content2'}, 
      {title: '方法', content: 'content3'}, 
      {title: '事件', content: 'content4'}
    ],
    selectEvent: 'click',
    selectDelay: 0,
    originalIndex: 0
  };
  $.extend(this.settings, options || {});
  this._init();
};

Tab.prototype._init = function () {
  this.$tabHead = $('<ul class="tab-head"></ul>');
  this.$tabBody = $('<div class="tab-body"></div>');
  this.$oLi = null;
  this.$oItems = null
};

Tab.prototype.render = function (tabContainer) {
  tabContainer = $(tabContainer);
  var str1 = '',
      str2 = '',
      s = this.settings
      ;
  for (var i=0, len=s.items.length; i<len; i++) {
    var o = s.items[i];
      str1 += '<li>' + o.title + '</li>';
      str2 += '<div class="item">' + o.content + '</div>';
  }
  this.$tabHead.html(str1);
  this.$tabBody.html(str2);
  tabContainer.append(this.$tabHead).append(this.$tabBody);
  this._load();
};

Tab.prototype._load = function () {
  this._bindEvent();
  this.select(this.settings.originalIndex);
};

Tab.prototype._bindEvent = function () {
  var self = this,
      timer = null,
      s = this.settings
      ;
      this.$oLi = this.$tabHead.find('li');
      this.$oItems = this.$tabBody.find('.item');

  this.$oLi.on(s.selectEvent, function () {
    var This = this;
    if ( s.selectEvent !== 'click' && s.selectDelay ) {
      timer = setTimeout(function () { 
        show(This);
      }, s.selectDelay);
    } else {
      show(This);
    }
  }).mouseout(function () {
    clearTimeout(timer);
  });

  function show (obj) {
    self.settings.originalIndex = $(obj).index();
    self.change();
  };
  
};

Tab.prototype.change = function () {
  var s = this.settings;
  $(this).trigger('beforeselect');
  this.$oLi.eq(s.originalIndex).addClass('active').siblings('li').removeClass('active');
  this.$oItems.eq(s.originalIndex).slideDown().siblings().hide();
  $(this).trigger('afterselect');
};

Tab.prototype.select = function (index) {
  this.settings.originalIndex = index;
  this.change();
};

Tab.prototype.getCurTitle = function () {
  return this.settings.items[this.settings.originalIndex].title;
};

Tab.prototype.getCurContent = function () {
  return this.settings.items[this.settings.originalIndex].content;
};
