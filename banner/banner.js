function Banner (options) {
  this.settings = {
    container: '.banner-container',
    autoScroll: true,
    fx: {
      interval: 4000,
      duration: 1000,
    },
    originIndex: 0
  };
  $.extend(this.settings, options);
  this._init();
}

Banner.prototype._init = function () {
  this.prevPage = 0;
  this.curPage = 0;
  this.startTime = new Date();
  this.$banner = $(this.settings.container).find('.banner');
  this.$bannerImg = this.$banner.find('.banner-image');
  this.$imgLi = this.$bannerImg.find('li');
  this.$bannerBtn = this.$banner.find('.banner-button');
  this.$btnLi = this.$bannerBtn.find('li');
  this.$bannerPrev = this.$banner.find('.banner-prev');
  this.$bannerNext = this.$banner.find('.banner-next');
  this.length = this.$imgLi.length;
  this._bindEvent();
  this.start();
};

Banner.prototype._bindEvent = function () {
  var self = this,
      s = this.settings
      ;
  this.$btnLi.click(function () {
    var $this = $(this),
        endTime = new Date()  
        ;
    if ( (endTime - self.startTime) < s.fx.duration ) {
      return false;
    }
    self.startTime = endTime;    
    self.curPage = $this.index();
    self._change();
  });

  this.$bannerPrev.click(function () {
    var endTime = new Date()
        ;  
    if ( (endTime - self.startTime) < s.fx.duration ) {
      return false;
    }
    self.startTime = endTime; 
    nextPrev('prev');
  });
  this.$bannerNext.click(function () {
    var endTime = new Date()
        ;  
    if ( (endTime - self.startTime) < s.fx.duration ) {
      return false;
    }
    self.startTime = endTime; 
    nextPrev('next');
  });

  function nextPrev (dir) {
    if ( dir === 'prev' ) {
      self.curPage -= 1;
    } else if ( dir === 'next' ) {
      self.curPage += 1;
    }
    if ( self.curPage < 0 ) {
      self.curPage =self.length - 1;
    } else if ( self.curPage >= self.length ) {
      self.curPage = 0;
    }
    self._change();
  };

  this.$banner.hover(function () {
    $(this).trigger('hmouseenter');
    self.stop();
  }, function () {
    $(this).trigger('hmouseleave');
    self.start();
  });

};

Banner.prototype._change = function () {
  if ( this.curPage === this.prevPage ) {
    return ;
  }
  this.$btnLi.eq(this.curPage).addClass('cur').siblings().removeClass('cur');
  if ( this.curPage > this.prevPage ) {
    this._move('left');
  } else if ( this.curPage < this.prevPage ) {
    this._move('right')
  }
  this.prevPage = this.curPage;
};

Banner.prototype._move = function (dir) {
  var self = this,
      s = this.settings,
      bannerW = this.$banner.width();
      ;
  if ( dir === 'right' ) {
    bannerW = -bannerW;
  } 
  $(this).trigger('hbeforemove');
  this.$imgLi.eq(this.prevPage)
    .animate({
      left: -bannerW
    }, s.fx.duration);
  this.$imgLi.eq(this.curPage)
    .css({
      left: bannerW
    })
    .animate({
      left: 0
    }, s.fx.duration);
    $(this).trigger('haftermove');
};

Banner.prototype._auto = function () {
  var s = this.settings,
      self = this
      ;
  this.stop();
  this.timer = setInterval(function () {
    self.$bannerNext.trigger('click');
  }, s.fx.interval);
};

Banner.prototype.stop = function () {
  var self = this
      ;
  self.timer && clearInterval(self.timer);
};

Banner.prototype.start = function () {
  this._auto();
};

Banner.prototype.getCurIndex = function () {
  return this.curPage;
};

Banner.prototype.getTotalCount = function () {
  return this.length;
};
// Banner.prototype.render = function (container) {

// };

// Banner.prototype._load = function () {

// };

