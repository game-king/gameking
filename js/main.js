// namespace
window.semantic = {
  handler: {}
};

// Allow for console.log to not break IE
if (typeof window.console == "undefined" || typeof window.console.log == "undefined") {
  window.console = {
    log  : function() {},
    info : function(){},
    warn : function(){}
  };
}
if(typeof window.console.group == 'undefined' || typeof window.console.groupEnd == 'undefined' || typeof window.console.groupCollapsed == 'undefined') {
  window.console.group = function(){};
  window.console.groupEnd = function(){};
  window.console.groupCollapsed = function(){};
}
if(typeof window.console.markTimeline == 'undefined') {
  window.console.markTimeline = function(){};
}
window.console.clear = function(){};

// ready event
semantic.ready = function() {

  // selector cache
  var

    $peek             = $('.peek'),
    $peekItem         = $peek.children('.menu').children('a.item'),
    $peekSubItem      = $peek.find('.item .menu .item'),
    $sortableTables   = $('.sortable.table'),

    $ui               = $('.ui').not('.hover, .down'),
    $swap             = $('.theme.menu .item'),
    $menu             = $('#menu'),
    $hideMenu         = $('#menu .hide.item'),
    $sortTable        = $('.sortable.table'),
    $demo             = $('.demo'),
    $waypoints        = $peek.closest('.tab, .container').find('h2').first().siblings('h2').addBack(),

    $menuPopup        = $('.ui.main.menu .popup.item'),
    $menuDropdown     = $('.ui.main.menu .dropdown'),
    $pageTabMenu      = $('body > .tab.segment .tabular.menu'),
    $pageTabs         = $('body > .tab.segment .menu .item'),

    $downloadDropdown = $('.download.buttons .dropdown'),

    $helpPopup        = $('.header .help.icon'),

    $maike          = $('.maike'),
    $shownmaike     = $maike.filter('.shown'),

    $developer        = $('.developer.item'),
    $overview         = $('.overview.item, .overview.button'),
    $designer         = $('.designer.item'),

    $sidebarButton    = $('.attached.launch.button'),

    $increaseFont     = $('.font .increase'),
    $decreaseFont     = $('.font .decrease'),

    $code             = $('div.code').not('.existing'),
    $existingCode     = $('.existing.code'),

    // alias
    handler
  ;


  // event handlers
  handler = {

    createIcon: function() {
      $maike
        .each(function(){
          $('<i/>')
            .addClass('icon code')
            .prependTo( $(this) )
          ;
        })
      ;
    },

    getSpecification: function(callback) {
      var
        url = $(this).data('url') || false
      ;
      callback = callback || function(){};
      if(url) {
        $.ajax({
          method: 'get',
          url: url,
          type: 'json',
          complete: callback
        });
      }
    },

    create: {
      tick: function() {

      },
      maikes: function(json) {
        var
          types      = json['Types'],
          text       = json['Text'],
          states     = json['States'],
          variations = json['Variations'],

          $element,
          html
        ;
        $.each(types, function(name, type){
          html += '<h2 class="ui dividing header">' + name + '</h2';
          if($.isPlainObject(type)) {
            $.each(type, function(name, subType) {
              $element = $.zc(subType);
              $element = handler.create.text($element, text);
              html += '<h3 class="ui header">' + name + '</h3';
              html += handler.create.variations($element, variations);
            });
          }
          else {
            $element = $.zc(type);
            $element = handler.create.text($element);
            html += handler.create.variations($element, variations);
          }
        });
        // Each TYPE
        //   show type name
        //   html = koan (html)
        //   each text
        //     find label
        //     if(obj)
        //       replace random text
        //     else
        //       replace text
        //   end
        //   Each variation
        //     (if obj)
        //       each
        //         add class
        //     (else)
        //       add class
        //     label = property
        //     class = class
        //     show html
        //   end
        // end
      },
      element: function(koan, type, text, variation) {

      },
      variations: function($element, variations) {
        $.each(variations, function(name, variation){

        });
      },
      text: function($element, text) {
        $.each(text, function(selector, text) {
          $element.find(selector).text(text);
        });
        return $element;
      }
    },

    font: {

      increase: function() {
        var
          $container = $(this).parent().prev('.ui.segment'),
          fontSize   = parseInt( $container.css('font-size'), 10)
        ;
        $container
          .css('font-size', fontSize + 1)
        ;
      },
      decrease: function() {
        var
          $container = $(this).parent().prev('.ui.segment'),
          fontSize   = parseInt( $container.css('font-size'), 10)
        ;
        $container
          .css('font-size', fontSize - 1)
        ;
      }
    },
    overviewMode: function() {
      var
        $button  = $(this),
        $body    = $('body'),
        $maike = $('.maike')
      ;
      $body.toggleClass('overview');
      $button.toggleClass('active');
      if($body.hasClass('overview')) {
        $developer.addClass('disabled').popup('destroy');
        $designer.addClass('disabled').popup('destroy');
        $maike.each(function() {
          $(this).children().not('.ui.header:eq(0), .maike p:eq(0)').hide();
        });
        $maike.filter('.another').hide();
      }
      else {
        $developer.removeClass('disabled').popup();
        $designer.removeClass('disabled').popup();
        $maike.each(function() {
          $(this).children().not('.ui.header:eq(0), .maike p:eq(0), .annotation').show();
        });
        $maike.filter('.another').show();
      }
    },

    getIndent: function(text) {
      var
        lines           = text.split("\n"),
        firstLine       = (lines[0] === '')
          ? lines[1]
          : lines[0],
        spacesPerIndent = 2,
        leadingSpaces   = firstLine.length - firstLine.replace(/^\s*/g, '').length,
        indent
      ;
      if(leadingSpaces !== 0) {
        indent = leadingSpaces;
      }
      else {
        // string has already been trimmed, get first indented line and subtract 2
        $.each(lines, function(index, line) {
          leadingSpaces = line.length - line.replace(/^\s*/g, '').length;
          if(leadingSpaces !== 0) {
            indent = leadingSpaces - spacesPerIndent;
            return false;
          }
        });
      }
      return indent || 4;
    },

    generateCode: function() {
      var
        $maike    = $(this).closest('.maike'),
        $annotation = $maike.find('.annotation'),
        $code       = $annotation.find('.code'),
        $header     = $maike.children('.ui.header:first-of-type').eq(0).add('p:first-of-type'),
        $demo       = $maike.children().not($header).not('i.code:first-child, .code, .instructive, .language.label, .annotation, br, .ignore, .ignored'),
        code        = ''
      ;
      if( $code.size() === 0) {
        $demo
          .each(function(){
            var $this = $(this).clone(false);
            if($this.not('br')) {
              code += $this.removeAttr('style').get(0).outerHTML + "\n";
            }
          })
        ;
      }
      $maike.data('code', code);
      return code;
    },
    createCode: function(type) {
      var
        $maike    = $(this).closest('.maike'),
        $header     = $maike.children('.ui.header:first-of-type').eq(0).add('p:first-of-type'),
        $annotation = $maike.find('.annotation'),
        $code       = $annotation.find('.code'),
        $demo       = $maike.children().not($header).not('i.code:first-child, .code, .instructive, .language.label, .annotation, br, .ignore, .ignored'),
        code        = $maike.data('code') || $.proxy(handler.generateCode, this)()
      ;

      if( $code.hasClass('existing') ) {
        $annotation.show();
        $code.removeClass('existing');
        $.proxy(handler.initializeCode, $code)();
      }

      if($annotation.size() === 0) {
        $annotation = $('<div/>')
          .addClass('annotation')
          .appendTo($maike)
        ;
      }

      if( $annotation.find('.ace_editor').size() === 0) {
        $code = $('<div/>')
          .data('type', 'html')
          .addClass('code')
          .html(code)
          .hide()
            .appendTo($annotation)
        ;
        $.proxy(handler.initializeCode, $code)();
      }

      if( ($demo.first().is(':visible') || type == 'developer') && type != 'designer' ) {
        $demo.hide();
        $header.show();
        $annotation.fadeIn(500);
      }
      else {
        $annotation.hide();
        if($demo.size() > 1) {
          $demo.show();
        }
        else {
          $demo.fadeIn(500);
        }
      }
    },


    makeCode: function() {
      if(window.ace !== undefined) {
        $code
          .filter(':visible')
          .each(handler.initializeCode)
        ;
        $existingCode
          .each(handler.createAnnotation)
        ;
      }
    },

    makeStickyColumns: function() {
      var
        $visibleStuck = $(this).find('.fixed.column .image, .fixed.column .content'),
        isInitialized = ($visibleStuck.parent('.sticky-wrapper').size() !== 0)
      ;
      if(!isInitialized) {
        $visibleStuck
          .waypoint('sticky', {
            offset     : 65,
            stuckClass : 'fixed'
          })
        ;
      }
      // apparently this doesnt refresh on first hit
      $.waypoints('refresh');
      $.waypoints('refresh');
    },


    movePeek: function() {
      if( $('.stuck .peek').size() > 0 ) {
        $('.peek')
          .toggleClass('pushed')
        ;
      }
      else {
        $('.peek')
          .removeClass('pushed')
        ;
      }
    },

    menu: {
      mouseenter: function() {
        $(this)
          .stop()
          .animate({
            width: '155px'
          }, 300, function() {
            $(this).find('.text').show();
          })
        ;
      },
      mouseleave: function(event) {
        $(this).find('.text').hide();
        $(this)
          .stop()
          .animate({
            width: '70px'
          }, 300)
        ;
    }

    },

    peek: function() {
      var
        $body     = $('html, body'),
        $header   = $(this),
        $menu     = $header.parent(),
        $group    = $menu.children(),
        $headers  = $group.add( $group.find('.menu .item') ),
        $waypoint = $waypoints.eq( $group.index( $header ) ),
        offset
      ;
      offset    = $waypoint.offset().top - 70;
      if(!$header.hasClass('active') ) {
        $menu
          .addClass('animating')
        ;
        $headers
          .removeClass('active')
        ;
        $body
          .stop()
          .one('scroll', function() {
            $body.stop();
          })
          .animate({
            scrollTop: offset
          }, 500)
          .promise()
            .done(function() {
              $menu
                .removeClass('animating')
              ;
              $headers
                .removeClass('active')
              ;
              $header
                .addClass('active')
              ;
              $waypoint
                .css('color', $header.css('border-right-color'))
              ;
              $waypoints
                .removeAttr('style')
              ;
            })
        ;
      }
    },

    peekSub: function() {
      var
        $body           = $('html, body'),
        $subHeader      = $(this),
        $header         = $subHeader.parents('.item'),
        $menu           = $header.parent(),
        $subHeaderGroup = $header.find('.item'),
        $headerGroup    = $menu.children(),
        $waypoint       = $('h2').eq( $headerGroup.index( $header ) ),
        $subWaypoint    = $waypoint.nextAll('h3').eq( $subHeaderGroup.index($subHeader) ),
        offset          = $subWaypoint.offset().top - 80
      ;
      $menu
        .addClass('animating')
      ;
      $headerGroup
        .removeClass('active')
      ;
      $subHeaderGroup
        .removeClass('active')
      ;
      $body
        .stop()
        .animate({
          scrollTop: offset
        }, 500, function() {
          $menu
            .removeClass('animating')
          ;
          $subHeader
            .addClass('active')
          ;
        })
        .one('scroll', function() {
          $body.stop();
        })
      ;
    },

    swapStyle: function() {
      var
        theme = $(this).data('theme')
      ;
      $(this)
        .addClass('active')
        .siblings()
          .removeClass('active')
      ;
      $('head link.ui')
        .each(function() {
          var
            href         = $(this).attr('href'),
            subDirectory = href.split('/')[3],
            newLink      = href.replace(subDirectory, theme)
          ;
          $(this)
            .attr('href', newLink)
          ;
        })
      ;
    }
  };

  $(window)
    .on('resize', function() {
      clearTimeout(handler.timer);
      handler.timer = setTimeout(handler.resizeCode, 100);
    })
  ;

  $downloadDropdown
    .dropdown({
      on         : 'click',
      transition : 'scale'
    })
  ;

  // attach events
  if($.fn.tablesort !== undefined) {
    $sortTable
      .tablesort()
    ;
  }

  if( $pageTabs.size() > 0 ) {
    $pageTabs
      .tab({
        onTabInit : handler.makeCode,
        onTabLoad : function() {
          $.proxy(handler.makeStickyColumns, this)();
          //$peekItem.removeClass('active').first().addClass('active');
        }
      })
    ;
  }
  else {
    handler.makeCode();
  }


  handler.createIcon();

  $maike
    .one('mousemove', handler.generateCode)
    .find('i.code')
      .on('click', handler.createCode)
  ;

  $shownmaike
    .each(handler.createCode)
  ;

  $helpPopup
    .popup()
  ;

  $swap
    .on('click', handler.swapStyle)
  ;

  $increaseFont
    .on('click', handler.font.increase)
  ;
  $decreaseFont
    .on('click', handler.font.decrease)
  ;

  $developer
    .on('click', handler.developerMode)
  ;
  $designer
    .on('click', handler.designerMode)
  ;
  $overview
    .on('click', handler.overviewMode)
  ;

  $menuPopup
    .popup({
      position   : 'bottom center',
      className: {
        popup: 'ui popup'
      }
    })
  ;
  $sortableTables
    .tablesort()
  ;

  $menuDropdown
    .dropdown({
      on         : 'hover',
      action     : 'nothing'
    })
  ;

  $sidebarButton
    .on('mouseenter', handler.menu.mouseenter)
    .on('mouseleave', handler.menu.mouseleave)
  ;
  $menu
    .sidebar({overlay: true})
    .sidebar('attach events', '.launch.button, .launch.item')
    .sidebar('attach events', $hideMenu, 'hide')
  ;

  $waypoints
    .waypoint({
      continuous : false,
      offset     : 100,
      handler    : function(direction) {
        var
          index = (direction == 'down')
            ? $waypoints.index(this)
            : ($waypoints.index(this) - 1 >= 0)
              ? ($waypoints.index(this) - 1)
              : 0
        ;
        //$peekItem
        //  .removeClass('active')
        //  .eq( index )
        //    .addClass('active')
        //;
      }
    })
  ;
  $('body')
    .waypoint({
      handler: function(direction) {
        if(direction == 'down') {
          if( !$('body').is(':animated') ) {
            //$peekItem
            //  .removeClass('active')
            //  .eq( $peekItem.size() - 1 )
            //    .addClass('active')
            //;
          }
        }
      },
      offset: 'bottom-in-view'
     })
  ;
  $peek
    .waypoint('sticky', {
      offset     : 85,
      stuckClass : 'stuck'
    })
  ;

  $peekItem
    .on('click', handler.peek)
  ;
  $peekSubItem
    .on('click', handler.peekSub)
  ;

};


// attach ready event
$(document)
  .ready(semantic.ready)
;
